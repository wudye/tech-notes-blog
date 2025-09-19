package com.mwu.backend.model.requests.collection;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCollectionBody {
    @NotNull(message = "name 不能为空")
    @NotBlank(message = "name 不能为空")
    private String name;
    private String description;
}
