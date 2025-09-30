package com.mwu.backend.model.enums.vo.note;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Top3Count {
    private Integer lastMonthTop3Count;
    private Integer thisMonthTop3Count;
}
