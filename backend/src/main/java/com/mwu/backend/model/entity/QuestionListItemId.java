package com.mwu.backend.model.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class QuestionListItemId {

    private Integer questionListId;

    /*
     * 题目ID（联合主键）
     */
    private Integer questionId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof QuestionListItemId that)) return false;
        return questionListId.equals(that.questionListId) && questionId.equals(that.questionId);
    }
    @Override
    public int hashCode() {
        return java.util.Objects.hash(questionListId, questionId);
    }
}
