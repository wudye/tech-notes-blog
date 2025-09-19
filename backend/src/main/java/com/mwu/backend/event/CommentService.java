package com.mwu.backend.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
// for tech demo
@Service
public class CommentService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public void testaddComment(Long articleId, String content) {
        // 1. 保存评论到数据库
        System.out.println("保存评论: " + content);
        MessageEvent event = MessageEvent.testcreateCommentEvent(this, content, articleId);
        // 2. 发布事件
        eventPublisher.publishEvent(event);
    }

}
