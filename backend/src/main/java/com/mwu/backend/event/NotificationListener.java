package com.mwu.backend.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
// for tech demo
@Component
public class NotificationListener {
    @Autowired
    private NotificationService notificationService;

    @EventListener
    public void notifyAuthor(MessageEvent event) {
        System.out.println("通知作者: 文章 " + event.getMessage() + event.getReceiverId() + " 有新评论");
    }
}
