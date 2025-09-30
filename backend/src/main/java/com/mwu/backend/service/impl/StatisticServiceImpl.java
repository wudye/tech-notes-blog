package com.mwu.backend.service.impl;

import com.mwu.backend.model.entity.Statistic;
import com.mwu.backend.model.requests.statistic.StatisticQueryParam;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.Pagination;
import com.mwu.backend.repository.StatisticRepository;
import com.mwu.backend.service.StatisticService;
import com.mwu.backend.utils.ApiResponseUtil;
import com.mwu.backend.utils.PaginationUtils;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {

    private final StatisticRepository statisticRepository;




    @Override
    public ApiResponse<List<Statistic>> getStatistic(StatisticQueryParam queryParam) {


        Integer pageNum = queryParam.getPage();
        Integer pageSize = queryParam.getPageSize();

        int offset = PaginationUtils.calculateOffset(pageNum, pageSize);

        List<Statistic> statistics = statisticRepository.findAll();
        Integer total = statistics.size();


        System.out.println(statistics.size());
        Pagination pagination = new Pagination(pageNum, pageSize, total);
        int pageIndex = pageNum ;
        pageSize = offset;

       Pageable pageable = PageRequest.of(pageNum, pageSize);
        try {
           Page<Statistic> page = statisticRepository.findAll(pageable);
            List<Statistic> statisticList = page.getContent();
            return ApiResponseUtil.success("获取统计列表成功", statisticList);

        } catch (Exception e) {
            return ApiResponseUtil.error(e.getMessage());
        }


    }

    @Override
    public void saveStatistic(Statistic statistic) {
        statisticRepository.save(statistic);
    }
}
