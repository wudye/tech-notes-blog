package com.mwu.backend.controller;


import com.mwu.backend.model.enums.vo.questionListItem.CreateQuestionListItemVO;
import com.mwu.backend.model.enums.vo.questionListItem.QuestionListItemUserVO;
import com.mwu.backend.model.enums.vo.questionListItem.QuestionListItemVO;
import com.mwu.backend.model.requests.questionListItem.CreateQuestionListItemBody;
import com.mwu.backend.model.requests.questionListItem.QuestionListItemQueryParams;
import com.mwu.backend.model.requests.questionListItem.SortQuestionListItemBody;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.service.QuestionListItemService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class QuestionListItemController {

    @Autowired
    private QuestionListItemService questionListItemService;

    /**
     * 获取指定题单中的题单项列表（用户端）。
     *
     * @param queryParams 查询参数
     * @return 包含题单项列表的响应。
     */
    @GetMapping("/questionlist-items")
    public ApiResponse<List<QuestionListItemUserVO>> userGetQuestionListItems(
            @Valid QuestionListItemQueryParams queryParams) {
        return questionListItemService.userGetQuestionListItems(queryParams);
    }

    /**
     * 获取指定题单中的题单项列表（管理端）。
     *
     * @param questionListId 题单ID，可选参数，若提供则获取指定题单的题单项。
     * @return 包含题单项列表的响应。
     */
    @GetMapping("/admin/questionlist-items/{questionListId}")
    public ApiResponse<List<QuestionListItemVO>> getQuestionListItems(
            @Min(value = 1, message = "questionListId 必须为正整数")
            @PathVariable Integer questionListId) {
        return questionListItemService.getQuestionListItems(questionListId);
    }

    /**
     * 创建新的题单项。
     *
     * @param body 包含题单项创建信息的请求体。
     * @return 包含创建成功的题单项信息的响应。
     */
    @PostMapping("/admin/questionlist-items")
    public ApiResponse<CreateQuestionListItemVO> createQuestionListItem(
            @Valid
            @RequestBody
            CreateQuestionListItemBody body) {
        return questionListItemService.createQuestionListItem(body);
    }

    /**
     * 删除指定的题单项。
     *
     * @param questionListId 题单ID，必须为正整数。
     * @param questionId     题目ID，必须为正整数。
     * @return 包含删除操作结果的响应。
     */
    @DeleteMapping("/admin/questionlist-items/{questionListId}/{questionId}")
    public ApiResponse<EmptyVO> deleteQuestionListItem(
            @Min(value = 1, message = "questionListId 必须为正整数")
            @PathVariable Integer questionListId,
            @Min(value = 1, message = "questionId 必须为正整数")
            @PathVariable Integer questionId) {
        return questionListItemService.deleteQuestionListItem(questionListId, questionId);
    }

    /**
     * 更新题单项的排序。
     *
     * @param body 包含题单项排序信息的请求体。
     * @return 包含更新操作结果的响应。
     */
    @PatchMapping("/admin/questionlist-items/sort")
    public ApiResponse<EmptyVO> sortQuestionListItem(
            @Valid
            @RequestBody
            SortQuestionListItemBody body) {
        return questionListItemService.sortQuestionListItem(body);
    }
}
