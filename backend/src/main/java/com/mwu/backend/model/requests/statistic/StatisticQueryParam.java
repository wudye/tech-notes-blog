package com.mwu.backend.model.requests.statistic;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
@Data
public class StatisticQueryParam {
    @NotNull(message = "page 不能为空")
//    @Min(value = 1, message = "page 必须为正整数")
    private Integer page;

    @NotNull(message = "page 不能为空")
//    @Min(value = 1, message = "page 必须为正整数")
    private Integer pageSize;
}
