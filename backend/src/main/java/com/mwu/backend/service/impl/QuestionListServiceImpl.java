package com.mwu.backend.service.impl;

import com.mwu.backend.model.entity.QuestionList;
import com.mwu.backend.model.enums.vo.questionList.CreateQuestionListVO;
import com.mwu.backend.model.enums.vo.questionListItem.QuestionListItemUserVO;
import com.mwu.backend.model.requests.questionList.CreateQuestionListBody;
import com.mwu.backend.model.requests.questionList.UpdateQuestionListBody;
import com.mwu.backend.model.requests.questionListItem.QuestionListItemQueryParams;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.repository.QuestionListItemRepository;
import com.mwu.backend.repository.QuestionListRepository;
import com.mwu.backend.service.QuestionListItemService;
import com.mwu.backend.service.QuestionListService;
import com.mwu.backend.utils.ApiResponseUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class QuestionListServiceImpl implements QuestionListService {

    @Autowired
    private QuestionListRepository questionListRepository;

    @Autowired
    private QuestionListItemRepository questionListItemRepository;

    @Override
    public ApiResponse<QuestionList> getQuestionList(Integer questionListId) {
        System.out.println("QuestionListServiceImpl.getQuestionList" + questionListId);
        QuestionList questionList =
                questionListRepository.findById(questionListId)
                        .orElseThrow(() -> new RuntimeException("QuestionList not found with id: " + questionListId));

        return ApiResponseUtil.success("success get", questionList);
    }

    @Override
    public ApiResponse<List<QuestionList>> getQuestionLists() {
        List<QuestionList> questionLists = questionListRepository.findAll();
        return ApiResponseUtil.success("获取题单成功", questionLists);
    }

    @Override
    public ApiResponse<CreateQuestionListVO> createQuestionList(CreateQuestionListBody body) {

        QuestionList questionList = new QuestionList();
        BeanUtils.copyProperties(body, questionList);

        // 创建题单
        try {
            questionListRepository.save(questionList);
            CreateQuestionListVO questionListVO = new CreateQuestionListVO();
            questionListVO.setQuestionListId(questionList.getQuestionListId());
            return ApiResponseUtil.success("创建题单成功", questionListVO);
        } catch (Exception e) {
            return ApiResponseUtil.error("创建题单失败");
        }
    }

    @Override
    public ApiResponse<EmptyVO> deleteQuestionList(Integer questionListId) {
        // 删除题单，还需要删除题单对应的题单项目
        QuestionList questionList = questionListRepository.findByQuestionListId((questionListId));

        if (questionList == null) {
            return ApiResponseUtil.error("题单不存在");
        }

        try {
            questionListRepository.deleteByQuestionListId((questionListId));
            // 删除题单对应的所有题单项
            questionListItemRepository.deleteByQuestionListId(questionListId);
            return ApiResponseUtil.success("删除题单成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("删除题单失败");
        }
    }

    @Override
    public ApiResponse<EmptyVO> updateQuestionList(Integer questionListId, UpdateQuestionListBody body) {

        QuestionList questionList = new QuestionList();
        BeanUtils.copyProperties(body, questionList);
        questionList.setQuestionListId(questionListId);

        System.out.println(questionList);

        try {
            questionListRepository.save(questionList);
            return ApiResponseUtil.success("更新题单成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("更新题单失败");
        }
    }
}
