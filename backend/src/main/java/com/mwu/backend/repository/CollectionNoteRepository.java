package com.mwu.backend.repository;

import com.mwu.backend.model.entity.CollectionNote;
import com.mwu.backend.model.entity.CollectionNoteId;
import jakarta.validation.constraints.Min;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface CollectionNoteRepository  extends JpaRepository<CollectionNote, Integer> {

    @Query("SELECT CASE WHEN COUNT(cn) > 0 THEN true ELSE false END FROM CollectionNote cn WHERE cn.id = :collectionNoteId")
    boolean existsById(CollectionNoteId collectionNoteId);

    @Query("SELECT cn.id.collectionId FROM CollectionNote cn WHERE cn.id.noteId = :noteId AND cn.id.collectionId IN :collectionIds")
    Set<Integer> findCollectionNoteIdsByNoteId(@Min(value = 1, message = "noteId 必须为正整数") Integer noteId, List<Integer> collectionIds);

    @Modifying
    @Query("DELETE  FROM CollectionNote cn WHERE cn.id.collectionId = :collectionId")
    void deleteAllByCollectionId(Integer collectionId);

    @Modifying
    @Query("DELETE  FROM CollectionNote cn WHERE cn.id.collectionId = :collectionId AND cn.id.noteId = :noteId")
    void deleteByCollectionIdAndNoteId(Integer collectionId, Integer noteId);
}
