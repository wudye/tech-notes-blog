package com.mwu.backend.model.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
@Table(name="question_list_items")
public class QuestionListItem {

    @EmbeddedId
    private QuestionListItemId id;

    /*
     * 题单内题目的顺序，从1开始
     */
    private Integer rank;

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
