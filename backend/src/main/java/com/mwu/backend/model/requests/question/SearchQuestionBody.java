package com.mwu.backend.model.requests.question;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
@Data
public class SearchQuestionBody {
    @NotNull(message = "keyword 不能为空")
    @NotEmpty(message = "keyword 不能为空")
    @Length(min = 1, max = 32, message = "keyword 长度在 1 和 32 范围内")
    private String keyword;
    // TODO: 后续需要完善，添加分页功能
}
