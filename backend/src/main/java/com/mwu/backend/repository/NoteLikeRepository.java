package com.mwu.backend.repository;

import com.mwu.backend.model.entity.NoteLike;
import com.mwu.backend.model.entity.NoteLikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteLikeRepository extends JpaRepository<NoteLike, Integer> {

    NoteLike findById(NoteLikeId noteLikeId);
}
