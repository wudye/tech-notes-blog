package com.mwu.backend.service;


import com.mwu.backend.model.entity.Statistic;
import com.mwu.backend.model.requests.statistic.StatisticQueryParam;
import com.mwu.backend.model.responses.ApiResponse;
import jakarta.validation.Valid;

import java.util.List;

public interface StatisticService {



    ApiResponse<List<Statistic>> getStatistic(@Valid StatisticQueryParam queryParam);

    void saveStatistic(Statistic statistic);
}
