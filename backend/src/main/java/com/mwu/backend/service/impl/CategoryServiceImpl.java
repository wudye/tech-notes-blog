package com.mwu.backend.service.impl;

import com.mwu.backend.model.entity.Category;
import com.mwu.backend.model.enums.vo.category.CategoryVO;
import com.mwu.backend.model.enums.vo.category.CreateCategoryVO;
import com.mwu.backend.model.requests.category.CreateCategoryBody;
import com.mwu.backend.model.requests.category.UpdateCategoryBody;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.repository.CategoryRepository;
import com.mwu.backend.repository.QuestionRepository;
import com.mwu.backend.service.CategoryService;
import com.mwu.backend.utils.ApiResponseUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public List<CategoryVO> buildCategoryTree() {
        // 获取所有分类
        List<Category> categories = categoryRepository.findAll();

        // 构建父分类的 Map，用于快速查找
        Map<Integer, CategoryVO> categoryMap = new HashMap<>();

        // 初始化父分类和子分类
        categories.forEach(category -> {
            if (category.getParentCategoryId() == 0) {
                // 父分类
                CategoryVO categoryVO = new CategoryVO();
                BeanUtils.copyProperties(category, categoryVO);
                categoryVO.setChildren(new ArrayList<>());
                categoryMap.put(category.getCategoryId(), categoryVO);
            } else {
                // 子分类
                CategoryVO.ChildrenCategoryVO childrenCategoryVO = new CategoryVO.ChildrenCategoryVO();
                BeanUtils.copyProperties(category, childrenCategoryVO);

                // 将子分类加入对应父分类的 children 列表
                CategoryVO parentCategory = categoryMap.get(category.getParentCategoryId());
                if (parentCategory != null) {
                    parentCategory.getChildren().add(childrenCategoryVO);
                }
            }
        });
        // 构建根分类列表
        return new ArrayList<>(categoryMap.values());
    }

    @Override
    public ApiResponse<List<CategoryVO>> categoryList() {
        return ApiResponseUtil.success("获取分类列表成功", buildCategoryTree());
    }

    @Override
    @Transactional
    public ApiResponse<EmptyVO> deleteCategory(Integer categoryId) throws RuntimeException {
        // 找出分类 Id = categoryId
        // 或者 parentCategoryId 是 categoryId 的分类
        List<Category> categories = categoryRepository.findByCategoryIdOrParentCategoryId(categoryId, categoryId);

        if (categories.isEmpty()) {
            return ApiResponseUtil.error("分类 Id 非法");
        }

        // 获取这些分类的 Ids
        List<Integer> categoryIds = categories.stream()
                .map(Category::getCategoryId)
                .toList();

        // 批量删除所有分类
        try {

            int deleteCount = categoryRepository.deleteByIdBatch(categoryIds);
            if (deleteCount != categoryIds.size()) {
                throw new RuntimeException("删除分类失败");
            }
            // 删除这些分类下的所有题目
            // TODO: 如果用户做了笔记，笔记和问题是对应的，删除了问题，笔记对应的问题就不存在了
            //   需要额外考虑讨论在删除分类的时候是否需要删除对应的笔记信息
            questionRepository.deleteByCategoryIdBatch(categoryIds);
            return ApiResponseUtil.success("删除分类成功");
        } catch (Exception e) {
            // 这里不能处理异常，需要抛出异常，让事务自动回滚
            throw new RuntimeException("删除分类失败");
        }
    }

    @Override
    public ApiResponse<CreateCategoryVO> createCategory(CreateCategoryBody categoryBody) {

        if (categoryBody.getParentCategoryId() != 0) {
            Category parent = categoryRepository.findByCategoryId(categoryBody.getParentCategoryId());
            if (parent == null) {
                return ApiResponseUtil.error("父分类 Id 不存在");
            }
        }

        Category category = new Category();
        BeanUtils.copyProperties(categoryBody, category);

        // 插入分类
        try {
            categoryRepository.save(category);
            CreateCategoryVO createCategoryVO = new CreateCategoryVO();
            createCategoryVO.setCategoryId(category.getCategoryId());
            return ApiResponseUtil.success("创建分类成功", createCategoryVO);
        } catch (Exception e) {
            return ApiResponseUtil.error("创建分类失败");
        }
    }

    @Override
    public ApiResponse<EmptyVO> updateCategory(Integer categoryId, UpdateCategoryBody categoryBody) {

        Category category = categoryRepository.findByCategoryId(categoryId);

        if (category == null) {
            return ApiResponseUtil.error("分类 Id 不存在");
        }

        category.setName(categoryBody.getName());

        try {
            categoryRepository.save(category);
            return ApiResponseUtil.success("更新分类成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("更新分类失败");
        }
    }

    /**
     * 根据分类名称查找分类，如果分类不存在则创建一个父分类
     *
     * @param categoryName 分类名称
     * @return 返回一个Category对象，如果分类不存在则创建一个新分类
     */
    @Override
    public Category findOrCreateCategory(String categoryName) {
        Category category = categoryRepository.findByName(categoryName.trim());
        if (category != null) return category;

        try {
            Category category2 = new Category();
            category2.setName(categoryName.trim());
            category2.setParentCategoryId(0);
            categoryRepository.save(category2);
            return category2;
        } catch (Exception e) {
            throw new RuntimeException("创建分类失败");
        }
    }

    @Override
    public Category findOrCreateCategory(String categoryName, Integer parentCategoryId) {
        Category category = categoryRepository.findByName(categoryName.trim());
        if (category != null) return category;
        try {
            Category category2 = new Category();
            category2.setName(categoryName.trim());
            category2.setParentCategoryId(parentCategoryId);
            categoryRepository.save(category2);
            return category2;
        } catch (Exception e) {
            throw new RuntimeException("创建分类失败");
        }
    }
}
