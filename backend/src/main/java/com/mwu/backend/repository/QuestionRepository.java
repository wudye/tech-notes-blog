package com.mwu.backend.repository;

import com.mwu.backend.model.entity.Question;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    @Query("delete FROM Question q WHERE q.categoryId in (:categoryIds)")
    void deleteByCategoryIdBatch(List<Integer> categoryIds) ;

    Question findByQuestionId(Integer questionId);

    List<Question> findByQuestionIdEquals(Integer questionId);

    @Query(value = "SELECT COUNT(*) FROM questions "
            + "WHERE (:categoryId IS NULL OR category_id = :categoryId)", nativeQuery = true)
    int countByQueryParam(@Min(value = 1, message = "categoryId 必须为正整数") Integer categoryId);

    Page<Question> findAll(Specification<Question> spec, Pageable pageable);

    double deleteByQuestionId(Integer questionId);

        // Returns questions whose title contains the keyword, or an empty list if keyword is null/empty
        @Query("SELECT q FROM Question q WHERE (:keyword IS NOT NULL AND q.title LIKE %:keyword%)")
        List<Question> findByKeyword(@Param("keyword") String keyword)  ;
    Question findByTitle(String title);

    @Query("SELECT q FROM Question q WHERE q.questionId IN (:questionIds)")
    List<Question> findByIdBatch(@Param("questionIds") List<Integer> questionIds);
}
