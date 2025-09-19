package com.mwu.backend.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="comment_likes")
public class CommentLike {
    /**
     * 评论点赞ID
     */
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer commentLikeId;

    /**
     * 评论ID
     */
    private Integer commentId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 创建时间
     */
    @CreationTimestamp
    private LocalDateTime createdAt;
}