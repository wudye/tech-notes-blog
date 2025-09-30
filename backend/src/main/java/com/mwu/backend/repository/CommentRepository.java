package com.mwu.backend.repository;

import com.mwu.backend.model.entity.Comment;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByParentId(Integer parentId);

    @Query("update Comment c set c.replyCount = :replyCount where c.commentId = :commentId")
    void updateByReplyCount(Integer commentId, Integer replyCount);

    Comment findByCommentId(Integer commentId);

    void deleteByCommentId(Integer commentId);

    List<Comment> findByNoteId(@NotNull(message = "笔记ID不能为空") Integer noteId);

}
