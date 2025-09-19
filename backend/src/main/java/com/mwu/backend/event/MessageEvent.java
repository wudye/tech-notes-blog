package com.mwu.backend.event;

import com.mwu.backend.model.enums.vo.message.MessageVO;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class MessageEvent extends ApplicationEvent {

    private final MessageVO message;
    private final Long receiverId;
    private final String eventType;

    public MessageEvent(Object source, MessageVO message, Long receiverId, String eventType) {
        super(source);
        this.message = message;
        this.receiverId = receiverId;
        this.eventType = eventType;
    }

    public MessageEvent(CommentService source, String msg, Long articleId) {
        super(source);
        this.message = new MessageVO();
        this.message.setContent(msg);
        this.receiverId = articleId;
        this.eventType = "COMMENT";
    }


    public static MessageEvent testcreateCommentEvent(CommentService source, String msg, Long receiverId) {
        MessageVO messageVO = new MessageVO();
        messageVO.setContent(msg);
        return new MessageEvent(source, messageVO, receiverId, "COMMENT");
    }

    public static MessageEvent createCommentEvent(Object source, MessageVO message, Long receiverId) {
        return new MessageEvent(source, message, receiverId, "COMMENT");
    }

    public static MessageEvent createLikeEvent(Object source, MessageVO message, Long receiverId) {
        return new MessageEvent(source, message, receiverId, "LIKE");
    }

    public static MessageEvent createSystemEvent(Object source, MessageVO message, Long receiverId) {
        return new MessageEvent(source, message, receiverId, "SYSTEM");
    }
}
