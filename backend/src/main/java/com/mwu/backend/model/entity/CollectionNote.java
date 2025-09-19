package com.mwu.backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name="collection_notes")
public class CollectionNote {

//    /*
//     * 收藏夹ID（联合主键）
//     */
//    private Integer collectionId;
//
//    /*
//     * 笔记ID（联合主键）
//     */
//    private Integer noteId;

    @EmbeddedId
    private CollectionNoteId id;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
