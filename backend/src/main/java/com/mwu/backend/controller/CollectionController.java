package com.mwu.backend.controller;


import com.mwu.backend.model.enums.vo.collection.CollectionVO;
import com.mwu.backend.model.enums.vo.collection.CreateCollectionVO;
import com.mwu.backend.model.requests.collection.CollectionQueryParams;
import com.mwu.backend.model.requests.collection.CreateCollectionBody;
import com.mwu.backend.model.requests.collection.UpdateCollectionBody;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.service.CollectionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CollectionController {

    @Autowired
    private CollectionService collectionService;

    /**
     * 获取收藏夹列表接口
     *
     * @param queryParams 查询参数
     * @return 收藏夹列表
     */
    @GetMapping("/collections")
    public ApiResponse<List<CollectionVO>> getCollections(
            @Valid
            CollectionQueryParams queryParams) {
        return collectionService.getCollections(queryParams);
    }

    /**
     * 创建收藏夹接口
     *
     * @param requestBody 创建收藏夹请求体
     * @return 创建结果，如果成功则包含收藏夹 ID
     */
    @PostMapping("/collections")
    public ApiResponse<CreateCollectionVO> createCollection(
            @Valid
            @RequestBody
            CreateCollectionBody requestBody) {
        return collectionService.createCollection(requestBody);
    }

    /**
     * 删除收藏夹接口
     *
     * @param collectionId 收藏夹 ID
     * @return 返回删除结果
     */
    @DeleteMapping("/collections/{collectionId}")
    public ApiResponse<EmptyVO> deleteCollection(
            @PathVariable
            @Min(value = 1, message = "collectionId 必须为正整数")
            Integer collectionId) {
        return collectionService.deleteCollection(collectionId);
    }

    /**
     * 批量修改收藏夹接口
     *
     * @param collectionBody 收藏夹 ID
     * @return 返回修改结果
     */
    @PostMapping("/collections/batch")
    public ApiResponse<EmptyVO> batchModifyCollection(
            @Valid
            @RequestBody
            UpdateCollectionBody collectionBody) {
        return collectionService.batchModifyCollection(collectionBody);
    }
}
