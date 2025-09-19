package com.mwu.backend.model.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="note_likes")
public class NoteLike {

    @EmbeddedId
    private NoteLikeId id;


    /*
     * 创建时间
     */
    @CreationTimestamp
    private Date createdAt;

    /*
     * 更新时间
     */
    @UpdateTimestamp
    private Date updatedAt;

}
