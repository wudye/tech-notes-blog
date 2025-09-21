package com.mwu.backend.repository;

import com.mwu.backend.model.entity.Message;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByReceiverId(Long receiverId);

    @Modifying
    @Query(value = "UPDATE messages SET is_read = true, updated_at = NOW() WHERE message_id = :messageId AND receiver_id = :userId", nativeQuery = true)
    int markAsRead(@Param("messageId") Integer messageId, @Param("userId") Long userId);

    @Modifying
    @Query(value = "UPDATE messages SET is_read = true, updated_at = NOW() WHERE message_id IN (:messageIds) AND receiver_id = :userId", nativeQuery = true)
    int markAsReadBatch(@Param("messageIds") List<Integer> messageIds, @Param("userId") Long userId);

    @Modifying
    @Query(value = "UPDATE messages SET is_read = true, updated_at = NOW() WHERE receiver_id = :userId AND is_read = false", nativeQuery = true)
    int markAllAsRead(@Param("userId") Long userId);

    void deleteMessageByMessageIdAndReceiverId(Integer messageId, Long receiverId);

    @Query(value = "SELECT COUNT(*) FROM messages WHERE receiver_id = :userId AND is_read = false", nativeQuery = true)
    Integer countUnread(@Param("userId") Long userId);}
