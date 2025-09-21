package com.mwu.backend.service.impl;

import com.mwu.backend.model.entity.Category;
import com.mwu.backend.model.entity.Note;
import com.mwu.backend.model.entity.Question;
import com.mwu.backend.model.enums.vo.question.CreateQuestionVO;
import com.mwu.backend.model.enums.vo.question.QuestionNoteVO;
import com.mwu.backend.model.enums.vo.question.QuestionUserVO;
import com.mwu.backend.model.enums.vo.question.QuestionVO;
import com.mwu.backend.model.requests.question.*;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.model.responses.Pagination;
import com.mwu.backend.model.scope.RequestScopeDate;
import com.mwu.backend.repository.CategoryRepository;
import com.mwu.backend.repository.NoteRepository;
import com.mwu.backend.repository.QuestionListRepository;
import com.mwu.backend.repository.QuestionRepository;
import com.mwu.backend.service.CategoryService;
import com.mwu.backend.service.QuestionService;
import com.mwu.backend.utils.ApiResponseUtil;
import com.mwu.backend.utils.MarkdownAST;
import com.mwu.backend.utils.PaginationUtils;
import com.vladsch.flexmark.ast.BulletList;
import com.vladsch.flexmark.ast.Heading;
import com.vladsch.flexmark.ast.ListItem;
import com.vladsch.flexmark.ast.OrderedList;
import com.vladsch.flexmark.util.ast.Document;
import com.vladsch.flexmark.util.ast.Node;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RequestScopeDate requestScopeData;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private CategoryService categoryService;

    // -------------------------------
    // 正则：匹配形如：
    //   (考点: XXX) 或 （考点：XXX）
    private static final Pattern POINT_PATTERN =
            Pattern.compile("[（(]考点\\s*[：:]\\s*(.*?)[)）]");
    // 正则：匹配形如：
    //   【简单】、【中等】、【困难】
    private static final Pattern LEVEL_PATTERN =
            Pattern.compile("【(.*?)】");
    // -------------------------------

    @Override
    public Question findById(Integer questionId) {
        return questionRepository.findByQuestionId(questionId);
    }

    @Override
    public Map<Integer, Question> getQuestionMapByIds(List<Integer> questionIds) {

        // 处理空数组的情况
        if (questionIds.isEmpty()) return Map.of();

        List<Question> questions = questionIds.stream().map(
                questionRepository::findByQuestionId
        ) .filter(Objects::nonNull).toList();
        return questions.stream().collect(Collectors.toMap(Question::getQuestionId, question -> question));
    }

    @Override
    public ApiResponse<List<QuestionVO>> getQuestions(QuestionQueryParam queryParams) {

        int offset = PaginationUtils.calculateOffset(queryParams.getPage(), queryParams.getPageSize());

        int total = questionRepository.countByQueryParam(queryParams.getCategoryId());

        Pagination pagination = new Pagination(queryParams.getPage(), queryParams.getPageSize(), total);



        List<Question> questions = getQuestionsRepo(queryParams, offset, queryParams.getPageSize());

        List<QuestionVO> questionVOs = questions.stream().map(question -> {
            QuestionVO questionVO = new QuestionVO();
            BeanUtils.copyProperties(question, questionVO);
            return questionVO;
        }).toList();

        return ApiResponseUtil.success("获取问题列表成功", questionVOs, pagination);
    }

    private List<Question> getQuestionsRepo(QuestionQueryParam queryParams, int offset, @NotNull(message = "pageSize 不能为空") @Min(value = 1, message = "pageSize 必须为正整数") @Max(value = 200, message = "pageSize 不能超过 200") Integer pageSize) {
        Specification<Question> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (queryParams.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("categoryId"), queryParams.getCategoryId()));
            }
            // Add more predicates for other fields if needed
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // Determine sort field
        String sortField = switch (queryParams.getSort()) {
            case "view" -> "viewCount";
            case "difficulty" -> "difficulty";
            default -> "createdAt";
        };

        // Determine sort direction
        Sort.Direction direction = "desc".equalsIgnoreCase(queryParams.getOrder()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(queryParams.getPage() - 1, offset, Sort.by(direction, sortField));

        Page<Question> page = questionRepository.findAll(spec, pageable);
        return page.getContent();

    }

    @Override
    public ApiResponse<CreateQuestionVO> createQuestion(CreateQuestionBody createQuestionBody) {

        // 校验分类 Id 是否合法
        Category category = categoryRepository.findByCategoryId(createQuestionBody.getCategoryId());
        if (category == null) {
            return ApiResponseUtil.error("分类 Id 非法");
        }

        Question question = new Question();
        BeanUtils.copyProperties(createQuestionBody, question);

        try {
            questionRepository.save(question);
            CreateQuestionVO createQuestionVO = new CreateQuestionVO();
            createQuestionVO.setQuestionId(question.getQuestionId());
            return ApiResponseUtil.success("创建问题成功", createQuestionVO);
        } catch (Exception e) {
            return ApiResponseUtil.error("创建问题失败");
        }
    }

    /**
     * 批量创建问题
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<EmptyVO> createQuestionBatch(CreateQuestionBatchBody createQuestionBatchBody) {
        // 获取 markdown 文本
        String markdown = createQuestionBatchBody.getMarkdown();

        MarkdownAST markdownAST = new MarkdownAST(markdown);
        Document document = markdownAST.getMarkdownAST();

        // 遍历节点
        for (Node child = document.getFirstChild(); child != null; child = child.getNext()) {
            if (child instanceof Heading parentHeading) {  // 查询到 heading 节点
                if (parentHeading.getLevel() == 1) {  // 如果是一级标题
                    // 查看是否存在对应的一级标题分类
                    String parentCategoryName = markdownAST.getHeadingText(parentHeading);
                    Category parentCategory = categoryService.findOrCreateCategory(parentCategoryName);

                    Node childCategory = parentHeading.getNext();

                    for (; childCategory != null; childCategory = childCategory.getNext()) {
                        // 碰到下一个父分类 (Heading level=1)，跳出当前循环
                        if (childCategory instanceof Heading nextParent) {
                            if (nextParent.getLevel() == 1) {
                                break;
                            }
                        }

                        // 如果是二级标题（子分类 Heading level = 2）
                        if (childCategory instanceof Heading subHeading) {
                            if (subHeading.getLevel() == 2) {
                                String subCategoryName = markdownAST.getHeadingText(subHeading);

                                Category subCategory = categoryService.findOrCreateCategory(
                                        subCategoryName,
                                        parentCategory.getCategoryId()
                                );

                                Node listBlockNode = subHeading.getNext();
                                if (!(listBlockNode instanceof BulletList) &&
                                        !(listBlockNode instanceof OrderedList)) {
                                    // 没有找到列表，则抛错也好，或者直接跳过
                                    continue;
                                }

                                for (Node listItem = listBlockNode.getFirstChild();
                                     listItem != null;
                                     listItem = listItem.getNext()) {

                                    if (listItem instanceof ListItem listItem2) {
                                        String listItemText = markdownAST.getListItemText(listItem2);

                                        // 解析考点
                                        String examPoint = "";
                                        Matcher matchPoint = POINT_PATTERN.matcher(listItemText);
                                        if (!matchPoint.find()) {
                                            throw new RuntimeException("解析考点失败");
                                        }
                                        examPoint = matchPoint.group(1);

                                        // 解析难度
                                        String difficultyStr = "";
                                        Matcher matchLevel = LEVEL_PATTERN.matcher(listItemText);
                                        if (!matchLevel.find()) {
                                            throw new RuntimeException("解析难度失败");
                                        }
                                        difficultyStr = matchLevel.group(1);

                                        // 解析题目
                                        String title = listItemText
                                                .replaceAll(POINT_PATTERN.pattern(), "")
                                                .replaceAll(LEVEL_PATTERN.pattern(), "")
                                                .trim();

                                        // 查看题目是否存在
                                        Question question = questionRepository.findByTitle(title);

                                        if (question != null) {
                                            throw new RuntimeException("题目已存在");
                                        }

                                        // 难度映射表
                                        Map<String, Integer> difficultyMap = new HashMap<>();
                                        difficultyMap.put("easy", 1);
                                        difficultyMap.put("medium", 2);
                                        difficultyMap.put("difficult", 3);

                                        Integer difficultyVal = difficultyMap.get(difficultyStr);
                                        if (difficultyVal == null) {
                                            throw new RuntimeException("难度解析失败");
                                        }

                                        // 创建问题
                                        Question addQuestion = new Question();

                                        addQuestion.setTitle(title);
                                        addQuestion.setCategoryId(subCategory.getCategoryId());
                                        addQuestion.setExamPoint(examPoint);
                                        addQuestion.setDifficulty(difficultyVal);

                                        try {
                                            questionRepository.save(addQuestion);
                                        } catch (Exception e) {
                                            throw new RuntimeException("创建问题失败: " + e.getMessage());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return ApiResponseUtil.success("创建问题成功");
    }

    @Override
    public ApiResponse<EmptyVO> updateQuestion(Integer questionId, UpdateQuestionBody updateQuestionBody) {
        Question question = new Question();
        BeanUtils.copyProperties(updateQuestionBody, question);
        question.setQuestionId(questionId);
        // 更新问题
        try {
            questionRepository.save(question);
            return ApiResponseUtil.success("更新问题成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("更新问题失败");
        }
    }

    @Override
    public ApiResponse<EmptyVO> deleteQuestion(Integer questionId) {
        if (questionRepository.deleteByQuestionId(questionId) > 0) {
            return ApiResponseUtil.success("删除问题成功");
        } else {
            return ApiResponseUtil.error("删除问题失败");
        }
    }

    // 同样是获取笔记列表，userGetQuestions 会携带用户是否完成该道题目的信息
    @Override
    public ApiResponse<List<QuestionUserVO>> userGetQuestions(QuestionQueryParam queryParams) {

        // 分页相关信息
        int offset = PaginationUtils.calculateOffset(queryParams.getPage(), queryParams.getPageSize());

        int total = questionRepository.countByQueryParam(queryParams.getCategoryId());

        Pagination pagination = new Pagination(queryParams.getPage(), queryParams.getPageSize(), total);



        List<Question> questions = getQuestionsRepo(queryParams, offset, queryParams.getPageSize());
        // 提取出 questionId
        List<Integer> questionIds = questions.stream().map(Question::getQuestionId).toList();

        // 存放用户完成的题目 Id 集合
        Set<Integer> userFinishedQuestionIds;

        // 如果是登录状态，则查询出当前用户完成的题目 Id 集合
        if (requestScopeData.isLogin() && requestScopeData.getUserId() != null) {
            userFinishedQuestionIds = noteRepository.findDistinctByUserIdAndQuestionIdIn(requestScopeData.getUserId(), questionIds);
        } else {
            userFinishedQuestionIds = Collections.emptySet();
        }

        List<QuestionUserVO> questionUserVOs = questions.stream().map(question -> {
            QuestionUserVO questionUserVO = new QuestionUserVO();
            QuestionUserVO.UserQuestionStatus userQuestionStatus = new QuestionUserVO.UserQuestionStatus();

            // 判断用户是否完成该道题目
            if (userFinishedQuestionIds != null && userFinishedQuestionIds.contains(question.getQuestionId())) {
                userQuestionStatus.setFinished(true);  // 用户完成了该道题目
            }

            BeanUtils.copyProperties(question, questionUserVO);

            // 设置用户完成状态
            questionUserVO.setUserQuestionStatus(userQuestionStatus);
            return questionUserVO;
        }).toList();

        return ApiResponseUtil.success("获取用户问题列表成功", questionUserVOs, pagination);
    }

    @Override
    public ApiResponse<QuestionNoteVO> userGetQuestion(Integer questionId) {

        // 验证 question 是否存在
        Question question = questionRepository.findByQuestionId(questionId);
        if (question == null) {
            return ApiResponseUtil.error("questionId 非法");
        }

        QuestionNoteVO questionNoteVO = new QuestionNoteVO();
        QuestionNoteVO.UserNote userNote = new QuestionNoteVO.UserNote();

        // 如果是登录状态，则查询出当前用户笔记
        if (requestScopeData.isLogin() && requestScopeData.getUserId() != null) {
            Note note = noteRepository.findByAuthorIdAndQuestionId(requestScopeData.getUserId(), questionId);
            if (note != null) {
                userNote.setFinished(true);
                BeanUtils.copyProperties(note, userNote);
            }
        }

        BeanUtils.copyProperties(question, questionNoteVO);
        questionNoteVO.setUserNote(userNote);

        // 增加问题的点击量
        // TODO: 有待优化
        question.setViewCount(question.getViewCount() + 1);
        questionRepository.save(question);

        return ApiResponseUtil.success("获取问题成功", questionNoteVO);
    }

    @Override
    public ApiResponse<List<QuestionVO>> searchQuestions(SearchQuestionBody body) {
        String keyword = body.getKeyword();

        // TODO: 简单实现搜索问题功能，后续需要优化
        List<Question> questionList = questionRepository.findByKeyword(keyword);

        List<QuestionVO> questionVOList = questionList.stream().map(question -> {
            QuestionVO questionVO = new QuestionVO();
            BeanUtils.copyProperties(question, questionVO);
            return questionVO;
        }).toList();

        return ApiResponseUtil.success("搜索问题成功", questionVOList);
    }
}
