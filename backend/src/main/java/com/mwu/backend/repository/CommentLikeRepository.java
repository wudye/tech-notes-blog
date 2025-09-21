package com.mwu.backend.repository;

import com.mwu.backend.model.entity.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentLikeRepository  extends JpaRepository<CommentLike, Integer> {
    @Query("SELECT DISTINCT c.commentId FROM CommentLike c WHERE c.userId = :userId AND c.commentId IN :commentIds")
    List<Integer> findUserLikedCommentIds(@Param("userId") Long userId, @Param("commentIds") List<Integer> commentIds);

    void deleteByCommentIdAndUserId(Integer commentId, Long userId);
}
