package com.mwu.backend.model.requests.collection;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CollectionQueryParams {

    @NotNull(message = "creatorId 不能为空")
    @Min(value = 1, message = "creatorId 必须为正整数")
    private Long creatorId;

    @Min(value = 1, message = "noteId 必须为正整数")
    private Integer noteId;
}
