package com.mwu.backend.model.enums.vo.note;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Top3Count {
    private Integer lastMonthTop3Count;
    private Integer thisMonthTop3Count;
}
