package com.mwu.backend.model.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class CollectionNoteId implements Serializable {
    private Integer collectionId;
    private Integer noteId;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CollectionNoteId that = (CollectionNoteId) o;
        return collectionId.equals(that.collectionId) && noteId.equals(that.noteId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(collectionId, noteId);
    }

}
