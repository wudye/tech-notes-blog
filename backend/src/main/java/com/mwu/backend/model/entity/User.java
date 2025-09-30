package com.mwu.backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true, nullable = false)
    private String account;


    private String username;


    private String password;

    /**
     * 用户性别
     * 1=male，2=female，3=unknown
     */
    private Integer gender;


    private LocalDate birthday;

    private String avatarUrl;

    private String email;


    private String school;


    private String signature;

    /**
     * 0=unbanned，1=banned
     */
    private Integer isBanned;

    /**
     * 0=user，1=admin
     */
    private Integer isAdmin = 0;


    private LocalDateTime lastLoginAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;


//    @OneToMany
//    @JoinColumn(name = "creatorId", referencedColumnName = "userId", insertable = false, updatable = false)
//    private List<Note> notes;
}
