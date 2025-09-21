package com.mwu.backend.repository;

import com.mwu.backend.model.entity.QuestionListItem;
import com.mwu.backend.model.enums.vo.questionListItem.QuestionListItemVO;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionListItemRepository extends JpaRepository<QuestionListItem, Integer> {
    @Query("SELECT COUNT(q) FROM QuestionListItem q WHERE q.id.questionListId = :questionListId")
    int countByQuestionListId(@NotNull(message = "questionListId 不能为空") @Min(value = 1, message = "questionListId 必须为正整数") Integer questionListId);

    @Query("SELECT q FROM QuestionListItem q WHERE q.id.questionListId = :questionListId ORDER BY q.rank ASC")
    List<QuestionListItem> findByQuestionListId(Integer questionListId);

    @Query("SELECT COALESCE(MAX(q.rank), 0) + 1 FROM QuestionListItem q WHERE q.id.questionListId = :questionListId")
    int nextRank(@NotNull(message = "questionListId 不能为空") @Min(value = 1, message = "questionListId 必须为正整数") Integer questionListId);

    @Modifying
    @Query("DELETE from  QuestionListItem q WHERE q.id.questionListId = :questionListId AND q.id.questionId = :questionId")
    void deleteByQuestionListIdAndQuestionId(Integer questionListId, Integer questionId);

    @Modifying
    @Query("DELETE from  QuestionListItem q WHERE q.id.questionListId = :questionListId")
    void deleteByQuestionListId(Integer questionListId);
}
