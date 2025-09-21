package com.mwu.backend.service.impl;


import com.mwu.backend.model.DTO.MessageDTO;
import com.mwu.backend.model.entity.Message;
import com.mwu.backend.model.entity.User;
import com.mwu.backend.model.enums.message.MessageType;
import com.mwu.backend.model.enums.vo.message.MessageVO;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.model.scope.RequestScopeDate;
import com.mwu.backend.repository.MessageRepository;
import com.mwu.backend.service.MessageService;
import com.mwu.backend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * 消息服务实现类
 */
@Service
@Slf4j
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private RequestScopeDate requestScopeData;

    @Override
    public Integer createMessage(MessageDTO messageDTO) {
        try {
            Message message = new Message();
            BeanUtils.copyProperties(messageDTO, message);

            if (messageDTO.getContent() == null) {
                message.setContent("");
            }

             messageRepository.save(message);
            return message.getMessageId();
        } catch (Exception e) {
            throw new RuntimeException("创建消息通知失败: " + e.getMessage());
        }
    }

    @Override
    public ApiResponse<List<MessageVO>> getMessages() {

        Long currentUserId = requestScopeData.getUserId();

        // 获取用户所有的消息对象
        List<Message> messages = messageRepository.findByReceiverId(currentUserId);

        List<Long> senderIds = messages.stream().map(Message::getSenderId).toList();

        // 将 message 专成 messageVO
        Map<Long, User> userMap = userService.getUserMapByIds(senderIds);

        List<MessageVO> messageVOS = messages.stream().map(message -> {
            MessageVO messageVO = new MessageVO();
            BeanUtils.copyProperties(message, messageVO);

            // 设置发送者信息
            MessageVO.Sender sender = new MessageVO.Sender();
            sender.setUserId(message.getSenderId());
            sender.setUsername(userMap.get(message.getSenderId()).getUsername());
            sender.setAvatarUrl(userMap.get(message.getSenderId()).getAvatarUrl());
            messageVO.setSender(sender);

            // 设置 target 信息
            if (!Objects.equals(message.getType(), MessageType.SYSTEM)) {
                MessageVO.Target target = new MessageVO.Target();
                target.setTargetId(message.getTargetId());
                target.setTargetType(message.getTargetType());
                // TODO: 获取评论/点赞 对应的 note 的 question 信息

            }

            return messageVO;
        }).toList();

        return ApiResponse.success("successes", messageVOS);
    }

    @Override
    public ApiResponse<EmptyVO> markAsRead(Integer messageId) {
        Long currentUserId = requestScopeData.getUserId();
        messageRepository.markAsRead(messageId, currentUserId);
        return ApiResponse.success("successes");
    }

    @Override
    public ApiResponse<EmptyVO> markAsReadBatch(List<Integer> messageIds) {
        Long currentUserId = requestScopeData.getUserId();
        messageRepository.markAsReadBatch(messageIds, currentUserId);
        return ApiResponse.success("successes");
    }

    @Override
    public ApiResponse<EmptyVO> markAllAsRead() {
        Long currentUserId = requestScopeData.getUserId();
        messageRepository.markAllAsRead(currentUserId);
        return ApiResponse.success("successes");
    }

    @Override
    public ApiResponse<EmptyVO> deleteMessage(Integer messageId) {
        Long currentUserId = requestScopeData.getUserId();
        messageRepository.deleteMessageByMessageIdAndReceiverId(messageId, currentUserId);
        return ApiResponse.success("successes");
    }

    @Override
    public ApiResponse<Integer> getUnreadCount() {
        Long currentUserId = requestScopeData.getUserId();
        Integer count = messageRepository.countUnread(currentUserId);
        return ApiResponse.success( "success", count);
    }
}
