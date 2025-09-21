package com.mwu.backend.repository;

import com.mwu.backend.model.entity.QuestionList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionListRepository extends JpaRepository<QuestionList, Integer> {
    QuestionList findByQuestionListId(Integer questionListId);

    void deleteByQuestionListId(Integer questionListId);
}
