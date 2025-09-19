package com.mwu.backend.model.enums.vo.note;
import lombok.Data;

import java.time.LocalDate;

@Data
public class NoteHeatMapItem {
    private LocalDate date;
    private Integer count;
    private Integer rank;
}
