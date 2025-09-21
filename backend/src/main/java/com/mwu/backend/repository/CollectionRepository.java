package com.mwu.backend.repository;

import com.mwu.backend.model.entity.Collection;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Integer> {

    List<Collection> findByCreatorId(@NotNull(message = "creatorId 不能为空") @Min(value = 1, message = "creatorId 必须为正整数") Long creatorId);

    Collection findByCollectionIdAndCreatorId(Integer collectionId, Long creatorId);

    void deleteByCollectionId(Integer collectionId);

    Collection findByCreatorIdAndCreatorId(Long creatorId, Long creatorId1);

    @Query("SELECT COUNT(n) FROM Note n WHERE n.authorId = :userId AND n.noteId = :noteId")
    int countByCreatorIdAndNoteId(Long userId, Integer noteId);
}
