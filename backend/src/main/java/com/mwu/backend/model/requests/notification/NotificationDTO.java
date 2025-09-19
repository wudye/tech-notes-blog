package com.mwu.backend.model.requests.notification;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationDTO {
    @NotEmpty(message = "content 不能为空")
    @NotNull(message = "content 不能为空")
    private String content;
}