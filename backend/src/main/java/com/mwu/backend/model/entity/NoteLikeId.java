package com.mwu.backend.model.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Setter
@Getter

public class NoteLikeId implements Serializable {

    private Integer noteId;
    private Long userId;

    public NoteLikeId() {}

    public NoteLikeId(Integer noteId, Long userId) {
        this.noteId = noteId;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NoteLikeId that = (NoteLikeId) o;
        return Objects.equals(noteId, that.noteId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(noteId, userId);
    }
}
