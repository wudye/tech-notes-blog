package com.mwu.backend.model.requests.note;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateNoteRequest {
    @NotNull(message = "笔记内容不能为空")
    @NotBlank(message = "笔记内容不能为空")
    private String content;
}
