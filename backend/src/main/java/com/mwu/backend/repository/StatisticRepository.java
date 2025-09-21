package com.mwu.backend.repository;

import com.mwu.backend.model.entity.Statistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatisticRepository  extends JpaRepository<Statistic, Long> {

}
