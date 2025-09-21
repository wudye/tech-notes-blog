package com.mwu.backend.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.mwu.backend.model.entity.QuestionList;
import com.mwu.backend.model.entity.QuestionListItem;
import com.mwu.backend.model.entity.QuestionListItemId;
import com.mwu.backend.model.enums.vo.questionListItem.CreateQuestionListItemVO;
import com.mwu.backend.model.enums.vo.questionListItem.QuestionListItemUserVO;
import com.mwu.backend.model.enums.vo.questionListItem.QuestionListItemVO;
import com.mwu.backend.model.requests.questionListItem.CreateQuestionListItemBody;
import com.mwu.backend.model.requests.questionListItem.QuestionListItemQueryParams;
import com.mwu.backend.model.requests.questionListItem.SortQuestionListItemBody;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.model.responses.Pagination;
import com.mwu.backend.model.scope.RequestScopeDate;
import com.mwu.backend.repository.NoteRepository;
import com.mwu.backend.repository.QuestionListItemRepository;
import com.mwu.backend.repository.QuestionListRepository;
import com.mwu.backend.repository.UserRepository;
import com.mwu.backend.service.QuestionListItemService;
import com.mwu.backend.utils.ApiResponseUtil;
import com.mwu.backend.utils.PaginationUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QuestionListItemServiceImpl implements QuestionListItemService {

    @Autowired
    private QuestionListItemRepository questionListItemRepository;

    @Autowired
    private QuestionListRepository questionListRepository;

    @Autowired
    private RequestScopeDate requestScopeData;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ApiResponse<List<QuestionListItemUserVO>> userGetQuestionListItems(QuestionListItemQueryParams queryParams) {
        int offset = PaginationUtils.calculateOffset(queryParams.getPage(), queryParams.getPageSize());

        int total = questionListItemRepository.countByQuestionListId(queryParams.getQuestionListId());
        Pagination pagination = new Pagination(queryParams.getPage(), queryParams.getPageSize(), total);


        // 获取题单
        Integer questionListId = queryParams.getQuestionListId();

        QuestionList questionList = questionListRepository.findById(questionListId).orElse(null);
        Pageable pageable = PageRequest.of(queryParams.getQuestionListId(), offset);
        Page page =  questionListItemRepository.findAll(pageable);

        List<QuestionListItem> questionListItems = page.getContent();

        List<Integer> questionIds = questionListItems.stream()
                .map(questionListItem ->  questionListItem.getId().getQuestionId())
                .toList();

        final Set<Integer> userFinishedQuestionIds;
        if (requestScopeData.isLogin()) {
            userFinishedQuestionIds =
                    noteRepository.findDistinctByUserIdAndQuestionIdIn(
                            requestScopeData.getUserId(),
                            questionIds
                    );
        } else  {
            userFinishedQuestionIds = Set.of();
        }

        List<QuestionListItemVO> questionListItemVOs =
                questionListItems.stream().map(questionListItem ->  {
                    QuestionListItemVO questionListItemVO = new QuestionListItemVO();
                    BeanUtils.copyProperties(questionListItem, questionListItemVO);
                    return questionListItemVO;
                }).toList();

        List<QuestionListItemUserVO> list = questionListItemVOs.stream().map(questionListItemVO -> {
            QuestionListItemUserVO questionListItemUserVO = new QuestionListItemUserVO();
            BeanUtils.copyProperties(questionListItemVO, questionListItemUserVO);
            QuestionListItemUserVO.UserQuestionStatus userQuestionStatus =
                    new  QuestionListItemUserVO.UserQuestionStatus();
            if (requestScopeData.isLogin()) {
                userQuestionStatus.setFinished(userFinishedQuestionIds.contains(questionListItemVO.getQuestion().getQuestionId()));
            } else {
                userQuestionStatus.setFinished(false);
            }
            questionListItemUserVO.setUserQuestionStatus(userQuestionStatus);
            return questionListItemUserVO;
        }).toList();




        return ApiResponseUtil.success("success", list, pagination);
    }

    @Override
    public ApiResponse<List<QuestionListItemVO>> getQuestionListItems(Integer questionListId) {
        List<QuestionListItem> byQuestionListId = questionListItemRepository.findByQuestionListId(questionListId);
        List<QuestionListItemVO> list = byQuestionListId.stream().map(questionListItem -> {
            QuestionListItemVO questionListItemVO = new QuestionListItemVO();
            BeanUtil.copyProperties(questionListItem, questionListItemVO);
            return questionListItemVO;
        }).toList();
        return ApiResponseUtil.success("success", list);
    }


    @Override
    public ApiResponse<CreateQuestionListItemVO> createQuestionListItem(CreateQuestionListItemBody body) {
        QuestionListItem questionListItem = new QuestionListItem();
        BeanUtils.copyProperties(body, questionListItem);
        try {
            int rank = questionListItemRepository.nextRank(body.getQuestionListId());
            questionListItem.setRank(rank);
            questionListItemRepository.save(questionListItem);
            CreateQuestionListItemVO createQuestionListItemVO = new CreateQuestionListItemVO();
            BeanUtils.copyProperties(questionListItem, createQuestionListItemVO);
            createQuestionListItemVO.setRank(questionListItem.getRank());

            return ApiResponseUtil.success("create success", createQuestionListItemVO);
        } catch (Exception e) {
            return ApiResponseUtil.error("create fail: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<EmptyVO> deleteQuestionListItem(Integer questionListId, Integer questionId) {
        try {
            questionListItemRepository.deleteByQuestionListIdAndQuestionId(questionListId, questionId);
            return ApiResponseUtil.success("删除题单项成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("删除题单项失败");
        }
    }

    @Override
    public ApiResponse<EmptyVO> sortQuestionListItem(SortQuestionListItemBody body) {
        // TODO: 待优化
        List<Integer> questionIds = body.getQuestionIds();
        Integer questionListId = body.getQuestionListId();

        try {
            for (int i = 0; i < questionIds.size(); i++) {
                QuestionListItem questionListItem = new QuestionListItem();
                QuestionListItemId itemId = new QuestionListItemId();
                itemId.setQuestionListId(questionListId);
                itemId.setQuestionId(questionIds.get(i));
                questionListItem.setId(itemId);
                questionListItem.setRank(i + 1);
                questionListItemRepository.save(questionListItem);
            }
            return ApiResponseUtil.success("题单项排序成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("题单项排序失败");
        }

    }
}
