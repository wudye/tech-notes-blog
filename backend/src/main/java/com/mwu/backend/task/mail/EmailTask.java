package com.mwu.backend.task.mail;

import lombok.Data;

@Data
public class EmailTask {
    private String email;
    private String code;
    private long timestamp;
}
