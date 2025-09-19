package com.mwu.backend.model.requests.collection;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateCollectionBody {

    @Min(value = 1, message = "noteId 必须为正整数")
    private Integer noteId;

    private UpdateItem[] collections;

    @Data
    public static class UpdateItem {
        @Min(value = 1, message = "collectionId 必须为正整数")
        private Integer collectionId;
        // 必须为 create 或者 delete
        @NotNull(message = "action 不能为空")
        @NotEmpty(message = "action 不能为空")
        @Pattern(regexp = "create|delete", message = "action 必须为 create 或者 delete")
        private String action;
    }
}
