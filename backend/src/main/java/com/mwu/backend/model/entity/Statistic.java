package com.mwu.backend.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="statistics")
public class Statistic {


    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    /**
     * the number of users logged in on that day
     */
    private Integer loginCount;

    /**
     * the number of users registered on that day
     */
    private Integer registerCount;

    /**
     * the total number of registered users
     */
    private Integer totalRegisterCount;

    /**
     * the number of notes created on that day
     */
    private Integer noteCount;

    /**
     * the number of notes submitted on that day (submitted for review)
     */
    private Integer submitNoteCount;

    /**
     * the total number of notes
     */
    private Integer totalNoteCount;

    /**
     * the date these statistics correspond to
     */
    private LocalDate date;
}
