package com.mwu.backend.model.responses;

import lombok.Data;

/**
 * 空响应类，用于表示无数据返回的情况
 */
@Data
public class EmptyVO {
    private boolean empty = true;
}
