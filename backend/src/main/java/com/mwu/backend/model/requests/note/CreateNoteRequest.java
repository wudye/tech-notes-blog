package com.mwu.backend.model.requests.note;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateNoteRequest {
    /*
     * 问题ID
     */
    @NotNull(message = "问题 ID 不能为空")
    @Min(value = 1, message = "问题 ID 必须为正整数")
    private Integer questionId;

    /*
     * 笔记内容
     */
    @NotBlank(message = "笔记内容不能为空")
    @NotNull(message = "笔记内容不能为空")
    private String content;
}