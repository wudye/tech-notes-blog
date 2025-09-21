package com.mwu.backend.service;

import com.mwu.backend.model.entity.Category;
import com.mwu.backend.model.enums.vo.category.CategoryVO;
import com.mwu.backend.model.enums.vo.category.CreateCategoryVO;
import com.mwu.backend.model.requests.category.CreateCategoryBody;
import com.mwu.backend.model.requests.category.UpdateCategoryBody;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Transactional
public interface CategoryService {
    /**
     * 构建分类树
     *
     * @return 返回一个包含所有分类信息的列表
     */
    List<CategoryVO> buildCategoryTree();

    /**
     * 获取所有分类
     * @return 分类列表
     */
    ApiResponse<List<CategoryVO>> categoryList();

    /**
     * 删除分类及其子分类
     * 该方法旨在删除指定的分类及其所有子分类，并且会将隶属与分类下的所有问题都删除
     *
     * @param categoryId 要删除的分类ID这是要删除分类及其子分类的唯一标识
     * @return 返回删除结果
     */
    ApiResponse<EmptyVO> deleteCategory(Integer categoryId);

    /**
     * 创建新分类
     * 此方法用于接收一个 Category对象并将其保存到数据库中，在保存之前会进行必要的验证
     * 如果保存成功，将返回包含新创建分类信息的 CategoryVO 对象
     *
     * @param createCategoryBody 要创建的分类对象，包含分类的名称、描述等信息
     * @return 返回一个 ApiResponse 对象，包含HTTP状态码和可能的错误信息，以及新创建的CategoryVO对象
     */
    ApiResponse<CreateCategoryVO> createCategory(CreateCategoryBody createCategoryBody);

    /**
     * 更新分类信息
     * 此方法用于更新指定 ID 的分类信息，包括名称字段
     *
     * @param categoryId 要更新的分类的ID
     * @param updateCategoryBody   包含要更新的分类信息的 Category 对象
     * @return 返回一个ApiResponse对象，包含HTTP状态码和可能的错误信息，以及更新后的CategoryVO对象
     */
    ApiResponse<EmptyVO> updateCategory(Integer categoryId, UpdateCategoryBody updateCategoryBody);

    /**
     * 根据分类名称查找分类，如果分类不存在则创建一个父分类
     * @param categoryName 分类名称
     * @return 返回一个Category对象，如果分类不存在则创建一个新分类
     */
    Category findOrCreateCategory(String categoryName);

    /**
     * 根据分类名称查找分类，如果分类不存在则创建一个父分类
     * @param categoryName 分类名称
     * @param parentCategoryId 父分类 ID
     * @return 返回一个Category对象，如果分类不存在则创建一个新分类
     */
    Category findOrCreateCategory(String categoryName, Integer parentCategoryId);
}
