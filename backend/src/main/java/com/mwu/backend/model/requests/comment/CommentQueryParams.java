package com.mwu.backend.model.requests.comment;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentQueryParams {

    /**
     * 笔记ID
     */
    @NotNull(message = "笔记ID不能为空")
    private Integer noteId;

    /**
     * 页码
     */
    @NotNull(message = "页码不能为空")
//    @Min(value = 1, message = "页码必须大于0")
    private Integer page;

    /**
     * 每页大小
     */
    @NotNull(message = "每页大小不能为空")
//    @Min(value = 1, message = "每页大小必须大于0")
    private Integer pageSize;
}
