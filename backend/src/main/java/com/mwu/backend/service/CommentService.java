package com.mwu.backend.service;

import com.mwu.backend.event.MessageEvent;
import com.mwu.backend.model.enums.vo.comment.CommentVO;
import com.mwu.backend.model.requests.comment.CommentQueryParams;
import com.mwu.backend.model.requests.comment.CreateCommentRequest;
import com.mwu.backend.model.requests.comment.UpdateCommentRequest;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// for tech demo

import java.util.List;

/**
 * 评论服务接口
 */
@Transactional
public interface CommentService {
    /**
     * 创建评论
     *
     * @param request 创建评论请求
     * @return 创建的评论ID
     */
    ApiResponse<Integer> createComment(CreateCommentRequest request);

    /**
     * 更新评论
     *
     * @param commentId 评论ID
     * @param request 更新评论请求
     * @return 空响应
     */
    ApiResponse<EmptyVO> updateComment(Integer commentId, UpdateCommentRequest request);

    /**
     * 删除评论
     *
     * @param commentId 评论ID
     * @return 空响应
     */
    ApiResponse<EmptyVO> deleteComment(Integer commentId);

    /**
     * 获取评论列表
     *
     * @param params 查询参数
     * @return 评论列表
     */
    ApiResponse<List<CommentVO>> getComments(CommentQueryParams params);

    /**
     * 点赞评论
     *
     * @param commentId 评论ID
     * @return 空响应
     */
    ApiResponse<EmptyVO> likeComment(Integer commentId);

    /**
     * 取消点赞评论
     *
     * @param commentId 评论ID
     * @return 空响应
     */
    ApiResponse<EmptyVO> unlikeComment(Integer commentId);
}