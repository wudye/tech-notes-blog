package com.mwu.backend.service.impl;

import com.mwu.backend.model.entity.CollectionNoteId;
import com.mwu.backend.repository.CollectionNoteRepository;
import com.mwu.backend.service.CollectionNoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CollectionNoteServiceImpl implements CollectionNoteService {

    @Autowired
    private CollectionNoteRepository collectionNoteRepository;

    @Override
    public Set<Integer> findUserCollectedNoteIds(Long userId, List<Integer> noteIds) {
        List<Integer> userCollectedNoteIds
                = noteIds.stream().map(
                        noteId -> {
                            CollectionNoteId collectionNoteId = new CollectionNoteId();
                            collectionNoteId.setCollectionId(userId.intValue());
                            collectionNoteId.setNoteId(noteId);
                            return collectionNoteRepository.existsById(collectionNoteId) ? noteId : null;
                        }
        ).toList();
        return new HashSet<>(userCollectedNoteIds);
    }
}
