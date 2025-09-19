package com.mwu.backend.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="questions")
public class Question {

    /*
     * 问题ID（主键）
     */
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer questionId;

    /*
     * 问题所属分类ID
     */
    private Integer categoryId;

    /*
     * 问题标题
     */
    private String title;

    /*
     * 问题难度
     * 1=简单，2=中等，3=困难
     */
    private Integer difficulty;

    /*
     * 题目考点
     */
    private String examPoint;

    /*
     * 浏览量
     */
    private Integer viewCount;

    /*
     * 创建时间
     */
    private LocalDateTime createdAt;

    /*
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
