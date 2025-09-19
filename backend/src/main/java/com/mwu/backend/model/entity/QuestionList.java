package com.mwu.backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="question_lists")
public class QuestionList {
    /*
     * 题单ID（主键）
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer questionListId;

    /*
     * 题单名称
     */
    private String name;

    /**
     * 题单类型
     */
    private Integer type;

    /*
     * 题单描述
     */
    private String description;

    /*
     * 创建时间
     */
    @CreationTimestamp
    private Date createdAt;

    /*
     * 更新时间
     */
    @UpdateTimestamp
    private Date updatedAt;
}
