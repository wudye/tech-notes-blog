package com.mwu.backend.service.impl;

import com.mwu.backend.model.entity.Collection;
import com.mwu.backend.model.entity.CollectionNote;
import com.mwu.backend.model.entity.CollectionNoteId;
import com.mwu.backend.model.entity.Note;
import com.mwu.backend.annotation.NeedLogin;
import com.mwu.backend.model.enums.vo.collection.CollectionVO;
import com.mwu.backend.model.enums.vo.collection.CreateCollectionVO;
import com.mwu.backend.model.requests.collection.CollectionQueryParams;
import com.mwu.backend.model.requests.collection.CreateCollectionBody;
import com.mwu.backend.model.requests.collection.UpdateCollectionBody;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.model.scope.RequestScopeDate;
import com.mwu.backend.repository.CollectionNoteRepository;
import com.mwu.backend.repository.CollectionRepository;
import com.mwu.backend.repository.NoteRepository;
import com.mwu.backend.service.CollectionService;
import com.mwu.backend.utils.ApiResponseUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
public class CollectionServiceImpl implements CollectionService {
    @Autowired
    private RequestScopeDate requestScopeData;

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private CollectionNoteRepository collectionNoteRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Override
    public ApiResponse<List<CollectionVO>> getCollections(CollectionQueryParams queryParams) {
        // 收藏夹列表
        List<Collection> collections = collectionRepository.findByCreatorId(queryParams.getCreatorId());
        List<Integer> collectionIds = collections.stream().map(Collection::getCollectionId).toList();
        final Set<Integer> collectedNoteIdCollectionIds;

        // 查看是否传入了 noteId
        if (queryParams.getNoteId() != null) {
            // 收藏了 noteId 的收藏夹列表

            collectedNoteIdCollectionIds = collectionNoteRepository.findCollectionNoteIdsByNoteId(queryParams.getNoteId(), collectionIds);
        } else {
            collectedNoteIdCollectionIds = Collections.emptySet();
        }

        // 将 collections 映射为 CollectionVOList
        List<CollectionVO> collectionVOList = collections.stream().map(collection -> {
            CollectionVO collectionVO = new CollectionVO();
            BeanUtils.copyProperties(collection, collectionVO);

            // 检查是否传入了 noteId 参数并且当前收藏夹收藏了该 note
            if (queryParams.getNoteId() == null) return collectionVO;

            // 设置收藏夹收藏笔记状态
            CollectionVO.NoteStatus noteStatus = new CollectionVO.NoteStatus();

            noteStatus.setIsCollected(collectedNoteIdCollectionIds.contains(collection.getCollectionId()));
            noteStatus.setNoteId(queryParams.getNoteId());
            collectionVO.setNoteStatus(noteStatus);

            return collectionVO;
        }).toList();

        return ApiResponseUtil.success("获取收藏夹列表成功", collectionVOList);
    }

    @Override
    @NeedLogin
    public ApiResponse<CreateCollectionVO> createCollection(CreateCollectionBody requestBody) {

        Long creatorId = requestScopeData.getUserId();

        Collection collection = new Collection();
        BeanUtils.copyProperties(requestBody, collection);
        collection.setCreatorId(creatorId);

        try {
            collectionRepository.save(collection);
            CreateCollectionVO createCollectionVO = new CreateCollectionVO();

            createCollectionVO.setCollectionId(collection.getCollectionId());
            return ApiResponseUtil.success("创建成功", createCollectionVO);
        } catch (Exception e) {
            return ApiResponseUtil.error("创建失败");
        }
    }

    @Override
    @NeedLogin
    @Transactional
    public ApiResponse<EmptyVO> deleteCollection(Integer collectionId) {
        // 校验是否是收藏夹创建者
        Long creatorId = requestScopeData.getUserId();

        Collection collection = collectionRepository.findByCollectionIdAndCreatorId(collectionId, creatorId);

        if (collection == null) {
            return ApiResponseUtil.error("收藏夹不存在或者无权限删除");
        }

        try {
            // 删除收藏夹
            collectionRepository.deleteByCollectionId(collectionId);
            // 删除收藏夹中的所有的笔记
          collectionNoteRepository.deleteAllByCollectionId(collectionId);

            return ApiResponseUtil.success("删除成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("删除失败");
        }
    }

    @Override
    @NeedLogin
    @Transactional
    public ApiResponse<EmptyVO> batchModifyCollection(UpdateCollectionBody requestBody) {

        Long userId = requestScopeData.getUserId();
        Integer noteId = requestBody.getNoteId();

        UpdateCollectionBody.UpdateItem[] collections = requestBody.getCollections();

        for (UpdateCollectionBody.UpdateItem collection : collections) {
            Integer collectionId = collection.getCollectionId();
            String action = collection.getAction();

            // 校验是否是收藏夹创建者
            Collection collectionEntity = collectionRepository.findByCreatorIdAndCreatorId(Long.valueOf(collectionId), userId);

            if (collectionEntity == null) {
                return ApiResponseUtil.error("收藏夹不存在或者无权限操作");
            }

            if ("create".equals(action)) {
                try {
                    // 获取用户是否收藏过该笔记
                    if (collectionRepository.countByCreatorIdAndNoteId(userId, noteId) == 0) {
                        // 笔记不存在，给笔记增加收藏量
                        noteRepository.increateCollectCountByNoteId(noteId);
                    }
                    CollectionNote collectionNote = new CollectionNote();
                    CollectionNoteId collectionNoteId = new CollectionNoteId();
                    collectionNoteId.setCollectionId(collectionId);
                    collectionNoteId.setNoteId(noteId);
                    collectionNote.setId(collectionNoteId);
                    collectionNoteRepository.save(collectionNote);
                } catch (Exception e) {
                    return ApiResponseUtil.error("收藏失败");
                }
            }

            if ("delete".equals(action)) {
                try {
                    collectionNoteRepository.deleteByCollectionIdAndNoteId(collectionId, noteId);
                    if (collectionRepository.countByCreatorIdAndNoteId(userId, noteId) == 0) {
                        // 笔记不存在，给笔记减少收藏量
                        noteRepository.decreaseCollectNoteByNoteId(noteId);
                    }
                } catch (Exception e) {
                    return ApiResponseUtil.error("取消收藏失败");
                }
            }
        }
        return ApiResponseUtil.success("操作成功");
    }
}

