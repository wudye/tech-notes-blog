package com.mwu.backend.model.requests.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateCommentRequest {
    @NotBlank(message = "评论内容不能为空")
    private String content;
}
