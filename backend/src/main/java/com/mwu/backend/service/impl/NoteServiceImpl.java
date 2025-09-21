package com.mwu.backend.service.impl;


import com.mwu.backend.annotation.NeedLogin;
import com.mwu.backend.model.entity.Note;
import com.mwu.backend.model.entity.Question;
import com.mwu.backend.model.entity.User;
import com.mwu.backend.model.enums.vo.category.CategoryVO;
import com.mwu.backend.model.enums.vo.note.*;
import com.mwu.backend.model.requests.note.CreateNoteRequest;
import com.mwu.backend.model.requests.note.NoteQueryParams;
import com.mwu.backend.model.requests.note.UpdateNoteRequest;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.model.responses.Pagination;
import com.mwu.backend.model.scope.RequestScopeDate;
import com.mwu.backend.repository.NoteRepository;
import com.mwu.backend.repository.QuestionRepository;
import com.mwu.backend.service.*;
import com.mwu.backend.utils.ApiResponseUtil;
import com.mwu.backend.utils.MarkdownUtil;
import com.mwu.backend.utils.PaginationUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private NoteLikeService noteLikeService;

    @Autowired
    private CollectionNoteService collectionNoteService;

    @Autowired
    private RequestScopeDate requestScopeData;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private QuestionRepository questionRepository;




    @Override
    public ApiResponse<List<NoteVO>> getNotes(NoteQueryParams params) {

        // 计算分页参数
        int offset = PaginationUtils.calculateOffset(params.getPage(), params.getPageSize());

        // 查询当前查询条件下的笔记总数
        long totalInt = countNotes(params);

        int total = Math.toIntExact(totalInt);
        Pagination pagination = new Pagination(params.getPage(), params.getPageSize(), total);

        Pageable pageable = PageRequest.of(params.getPage() -1 , total);
        Page<Note> pages = noteRepository.findAll(pageable);
        List<Note> notes = pages.getContent();

        // 从 笔记列表 中提取 questionIds 和 authorIds，并去重
        List<Integer> questionIds = notes.stream().map(Note::getQuestionId).distinct().toList();
        List<Long> authorIds = notes.stream().map(Note::getAuthorId).distinct().toList();
        List<Integer> noteIds = notes.stream().map(Note::getNoteId).toList();

        // 笔记的作者信息
        Map<Long, User> userMapByIds = userService.getUserMapByIds(authorIds);
        // 笔记的问题信息
        Map<Integer, Question> questionMapByIds = questionService.getQuestionMapByIds(questionIds);

        // 当前登录用户点赞的笔记列表和收藏的笔记列表
        Set<Integer> userLikedNoteIds;
        Set<Integer> userCollectedNoteIds;

        // 如果是登录状态，则对当前查询的笔记列表进行是否点赞过 / 收藏过的判断
        if (requestScopeData.isLogin() && requestScopeData.getUserId() != null) {
            Long currentUserId = requestScopeData.getUserId();
            userLikedNoteIds = noteLikeService.findUserLikedNoteIds(currentUserId, noteIds);
            userCollectedNoteIds = collectionNoteService.findUserCollectedNoteIds(currentUserId, noteIds);
        } else {  // 未登录状态直接设置为空集合
            userLikedNoteIds = Collections.emptySet();
            userCollectedNoteIds = Collections.emptySet();
        }

        // 用户的点赞信息
        // 用户的收藏信息
        try {
            List<NoteVO> noteVOs = notes.stream().map(note -> {
                NoteVO noteVO = new NoteVO();
                BeanUtils.copyProperties(note, noteVO);

                // 填充作者信息
                User author = userMapByIds.get(note.getAuthorId());
                if (author != null) {
                    NoteVO.SimpleAuthorVO authorVO = new NoteVO.SimpleAuthorVO();
                    BeanUtils.copyProperties(author, authorVO);
                    noteVO.setAuthor(authorVO);
                }

                // 填充问题信息
                Question question = questionMapByIds.get(note.getQuestionId());
                if (question != null) {
                    NoteVO.SimpleQuestionVO questionVO = new NoteVO.SimpleQuestionVO();
                    BeanUtils.copyProperties(question, questionVO);
                    noteVO.setQuestion(questionVO);
                }

                // 填充用户行为信息
                NoteVO.UserActionsVO userActionsVO = new NoteVO.UserActionsVO();
                if (userLikedNoteIds != null && userLikedNoteIds.contains(note.getNoteId())) {
                    userActionsVO.setIsLiked(true);
                }
                if (userCollectedNoteIds != null && userCollectedNoteIds.contains(note.getNoteId())) {
                    userActionsVO.setIsCollected(true);
                }

                // 处理笔记内容折叠内容
                if (MarkdownUtil.needCollapsed(note.getContent())) {
                    noteVO.setNeedCollapsed(true);
                    noteVO.setDisplayContent(MarkdownUtil.extractIntroduction(note.getContent()));
                } else {
                    noteVO.setNeedCollapsed(false);
                }

                noteVO.setUserActions(userActionsVO);
                return noteVO;
            }).toList();

            return ApiResponseUtil.success("获取笔记列表成功", noteVOs, pagination);
        } catch (Exception e) {
            // TODO: 打印日志
            System.out.println(Arrays.toString(e.getStackTrace()));
            return ApiResponseUtil.error("获取笔记列表失败");
        }
    }

    public long countNotes(NoteQueryParams params) {
        Specification<Note> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (params.getQuestionId() != null) {
                predicates.add(cb.equal(root.get("questionId"), params.getQuestionId()));
            }
            if (params.getAuthorId() != null) {
                predicates.add(cb.equal(root.get("authorId"), params.getAuthorId()));
            }
            if (params.getCollectionId() != null) {
                predicates.add(cb.equal(root.get("collectionId"), params.getCollectionId()));
            }
            if (params.getRecentDays() != null) {
                Calendar cal = Calendar.getInstance();
                cal.add(Calendar.DAY_OF_YEAR, -params.getRecentDays());
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), cal.getTime()));
            }
            // Add more predicates as needed
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return  noteRepository.count(spec);
    }
    @Override
    @NeedLogin
    public ApiResponse<CreateNoteVO> createNote(CreateNoteRequest request) {
        Long userId = requestScopeData.getUserId();
        Integer questionId = request.getQuestionId();

        // 判断问题指定的问题是否存在
        Question question = questionService.findById(questionId);

        if (question == null) {  // 对应的问题不存在
            return ApiResponseUtil.error("questionId 对应的问题不存在");
        }

        Note note = new Note();
        BeanUtils.copyProperties(request, note);
        note.setAuthorId(userId);

        try {
            noteRepository.save(note);
            CreateNoteVO createNoteVO = new CreateNoteVO();
            createNoteVO.setNoteId(note.getNoteId());
            return ApiResponseUtil.success("创建笔记成功", createNoteVO);
        } catch (Exception e) {
            return ApiResponseUtil.error("创建笔记失败");
        }
    }

    @Override
    @NeedLogin
    public ApiResponse<EmptyVO> updateNote(Integer noteId, UpdateNoteRequest request) {

        Long userId = requestScopeData.getUserId();

        // 查询笔记
        Note note = noteRepository.findByNoteId(noteId);
        if (note == null) {
            return ApiResponseUtil.error("笔记不存在");
        }

        if (!Objects.equals(userId, note.getAuthorId())) {
            return ApiResponseUtil.error("没有权限修改别人的笔记");
        }

        try {
            note.setContent(request.getContent());
            noteRepository.save(note);
            return ApiResponseUtil.success("更新笔记成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("更新笔记失败");
        }
    }

    @Override
    @NeedLogin
    public ApiResponse<EmptyVO> deleteNote(Integer noteId) {

        Long userId = requestScopeData.getUserId();

        Note note = noteRepository.findByNoteId(noteId);

        if (note == null) {
            return ApiResponseUtil.error("笔记不存在");
        }

        if (!Objects.equals(userId, note.getAuthorId())) {
            // 没有权限删除别人的笔记
            return ApiResponseUtil.error("没有权限删除别人的笔记");
        }

        try {
            noteRepository.deleteByNoteId(noteId);
            return ApiResponseUtil.success("删除笔记成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("删除笔记失败");
        }
    }

    // 下载笔记
    @Override
    @NeedLogin
    public ApiResponse<DownloadNoteVO> downloadNote() {

        Long userId = requestScopeData.getUserId();

        // 获取所有笔记
        List<Note> userNotes = noteRepository.findByAuthorId(userId);

        // 将笔记转为 key = questionId, value = note 的 map 对象
        Map<Integer, Note> questionNoteMap = userNotes.stream()
                .collect(Collectors.toMap(Note::getQuestionId, note -> note));

        if (userNotes.isEmpty()) {
            return ApiResponseUtil.error("不存在任何笔记");
        }

        // 获取分类树
        List<CategoryVO> categoryTree = categoryService.buildCategoryTree();

        // 根据分类树，创建 markdown 文件
        StringBuilder markdownContent = new StringBuilder();

        // 将 note 中的所有 questionId 提取出来
        List<Integer> questionIds = userNotes.stream()
                .map(Note::getQuestionId)
                .toList();

        List<Question> questions = questionRepository.findByIdBatch(questionIds);

        for (CategoryVO categoryVO : categoryTree) {

            boolean hasTopLevelToc = false;

            if (categoryVO.getChildren().isEmpty()) {
                continue;
            }

            for (CategoryVO.ChildrenCategoryVO childrenCategoryVO : categoryVO.getChildren()) {

                boolean hasSubLevelToc = false;
                Integer categoryId = childrenCategoryVO.getCategoryId();

                // 用户在该分类下的笔记对应的所有问题
                List<Question> categoryQuestionList = questions.stream()
                        .filter(question -> question.getCategoryId().equals(categoryId))
                        .toList();

                if (categoryQuestionList.isEmpty()) {
                    continue;
                }

                for (Question question : categoryQuestionList) {

                    if (!hasTopLevelToc) {  // 设置一级标题
                        markdownContent.append("# ").append(categoryVO.getName()).append("\n");
                        hasTopLevelToc = true;
                    }

                    if (!hasSubLevelToc) {  // 设置二级标题
                        markdownContent.append("## ").append(childrenCategoryVO.getName()).append("\n");
                        hasSubLevelToc = true;
                    }

                    markdownContent.append("### [")
                            .append(question.getTitle())
                            .append("]")
                            .append("(https://notes.kamacoder.com/questions/")
                            .append(question.getQuestionId())
                            .append(")\n");

                    Note note = questionNoteMap.get(question.getQuestionId());

                    markdownContent.append(note.getContent()).append("\n");
                }
            }
        }

        // 设置笔记内容
        DownloadNoteVO downloadNoteVO = new DownloadNoteVO();
        downloadNoteVO.setMarkdown(markdownContent.toString());

        return ApiResponseUtil.success("生成笔记成功", downloadNoteVO);
    }

    @Override
    public ApiResponse<List<NoteRankListItem>> submitNoteRank() {
        return ApiResponseUtil.success("获取笔记排行榜成功", noteRepository.submitNoteRank());
    }

    @Override
    @NeedLogin
    public ApiResponse<List<NoteHeatMapItem>> submitNoteHeatMap() {
        Long userId = requestScopeData.getUserId();
        return ApiResponseUtil.success("获取笔记热力图成功", noteRepository.submitNoteHeatMap(userId));
    }

    @Override
    @NeedLogin
    public ApiResponse<Top3Count> submitNoteTop3Count() {

        Long userId = requestScopeData.getUserId();

        Top3Count top3Count = noteRepository.submitNoteTop3Count(userId);

        return ApiResponseUtil.success("获取笔记top3成功", top3Count);
    }
}
