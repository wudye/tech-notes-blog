package com.mwu.backend.controller;


import com.mwu.backend.service.CommentService;
import com.mwu.backend.model.enums.vo.comment.CommentVO;
import com.mwu.backend.model.requests.comment.CommentQueryParams;
import com.mwu.backend.model.requests.comment.CreateCommentRequest;
import com.mwu.backend.model.requests.comment.UpdateCommentRequest;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 评论控制器
 */
@Slf4j
@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    /**
     * 获取评论列表
     *
     * @param params 查询参数
     * @return 评论列表
     */
    @GetMapping("/comments")
    public ApiResponse<List<CommentVO>> getComments(
            @Valid CommentQueryParams params) {
        return commentService.getComments(params);
    }

    /**
     * 创建评论
     *
     * @param request 创建评论请求
     * @return 创建的评论ID
     */
    @PostMapping("/comments")
    public ApiResponse<Integer> createComment(
            @Valid
            @RequestBody
            CreateCommentRequest request) {
        return commentService.createComment(request);
    }

    /**
     * 更新评论
     *
     * @param commentId 评论ID
     * @param request   更新评论请求
     * @return 空响应
     */
    @PatchMapping("/comments/{commentId}")
    public ApiResponse<EmptyVO> updateComment(
            @PathVariable("commentId") Integer commentId,
            @Valid
            @RequestBody
            UpdateCommentRequest request) {
        return commentService.updateComment(commentId, request);
    }

    /**
     * 删除评论
     *
     * @param commentId 评论ID
     * @return 空响应
     */
    @DeleteMapping("/comments/{commentId}")
    public ApiResponse<EmptyVO> deleteComment(
            @PathVariable("commentId") Integer commentId) {
        return commentService.deleteComment(commentId);
    }

    /**
     * 点赞评论
     *
     * @param commentId 评论ID
     * @return 空响应
     */
    @PostMapping("/comments/{commentId}/like")
    public ApiResponse<EmptyVO> likeComment(
            @PathVariable("commentId") Integer commentId) {
        return commentService.likeComment(commentId);
    }

    /**
     * 取消点赞评论
     *
     * @param commentId 评论ID
     * @return 空响应
     */
    @DeleteMapping("/comments/{commentId}/like")
    public ApiResponse<EmptyVO> unlikeComment(
            @PathVariable("commentId") Integer commentId) {
        return commentService.unlikeComment(commentId);
    }
}