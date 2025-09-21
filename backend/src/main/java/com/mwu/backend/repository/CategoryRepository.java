package com.mwu.backend.repository;

import com.mwu.backend.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Category findByCategoryId(Integer categoryId);

    List<Category> findByCategoryIdOrParentCategoryId(Integer categoryId, Integer parentCategoryId);

    @Query("DELETE FROM Category c WHERE c.categoryId IN (:categoryIds)")
    int deleteByIdBatch(List<Integer> categoryIds);


    Category findByName(String name);
}
