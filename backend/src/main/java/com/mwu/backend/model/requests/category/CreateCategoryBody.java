package com.mwu.backend.model.requests.category;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCategoryBody {
    @NotBlank(message = "name can not be blank")
    @Size(max = 32, min = 1, message = "name 长度在 1 - 32 之间")
    private String name;

    @NotNull(message = "parentCategoryId 不能为空")
    @Min(value = 0, message = "parentCategoryId 必须为正整数")
    private Integer parentCategoryId;
}
