package com.mwu.backend.service.impl;


import com.mwu.backend.annotation.NeedLogin;
import com.mwu.backend.model.DTO.MessageDTO;
import com.mwu.backend.model.entity.Note;
import com.mwu.backend.model.entity.NoteLike;
import com.mwu.backend.model.entity.NoteLikeId;
import com.mwu.backend.model.enums.message.MessageTargetType;
import com.mwu.backend.model.enums.message.MessageType;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.model.scope.RequestScopeDate;
import com.mwu.backend.repository.NoteLikeRepository;
import com.mwu.backend.repository.NoteRepository;
import com.mwu.backend.service.MessageService;
import com.mwu.backend.service.NoteLikeService;
import com.mwu.backend.utils.ApiResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class NoteLikeServiceImpl implements NoteLikeService {

    private final NoteLikeRepository noteLikeRepository;
    private final NoteRepository noteRepository;
    private final RequestScopeDate requestScopeData;
    private final MessageService messageService;

    @Override
    @NeedLogin
    @Transactional
    public ApiResponse<EmptyVO> likeNote(Integer noteId) {
        Long userId = requestScopeData.getUserId();

        // 查询笔记
        Note note = noteRepository.findByNoteId(noteId);
        if (note == null) {
            return ApiResponseUtil.error("笔记不存在");
        }

        try {
            // 创建点赞记录
            NoteLike noteLike = new NoteLike();
            NoteLikeId noteLikeId = new NoteLikeId();
            noteLikeId.setNoteId(noteId);
            noteLikeId.setUserId(userId);

            noteLike.setId(noteLikeId);
            noteLike.setCreatedAt(new Date());
            noteLikeRepository.save(noteLike);

            // 增加笔记点赞数
            note.setLikeCount(note.getLikeCount() + 1);
            noteRepository.save(note);

            MessageDTO messageDTO = new MessageDTO();
            messageDTO.setType(MessageType.LIKE);
            messageDTO.setReceiverId(note.getAuthorId());
            messageDTO.setSenderId(userId);

            messageDTO.setTargetType(MessageTargetType.NOTE);
            messageDTO.setTargetId(noteId);
            messageDTO.setIsRead(false);

            System.out.println(messageDTO);

            messageService.createMessage(messageDTO);

            return ApiResponseUtil.success("点赞成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("点赞失败");
        }
    }

    @Override
    @NeedLogin
    @Transactional
    public ApiResponse<EmptyVO> unlikeNote(Integer noteId) {
        Long userId = requestScopeData.getUserId();

        // 查询笔记
        Note note = noteRepository.findByNoteId(noteId);
        if (note == null) {
            return ApiResponseUtil.error("笔记不存在");
        }

        try {
            // 删除点赞记录
            NoteLikeId noteLikeId = new NoteLikeId();
            noteLikeId.setNoteId(noteId);
            noteLikeId.setUserId(userId);

            NoteLike noteLike = noteLikeRepository.findById(noteLikeId);
            if (noteLike != null) {
                noteLikeRepository.delete(noteLike);
                // 减少笔记点赞数
                note.setLikeCount(Math.max(0, note.getLikeCount() - 1));
                noteRepository.save(note);
            }
            return ApiResponseUtil.success("取消点赞成功");
        } catch (Exception e) {
            return ApiResponseUtil.error("取消点赞失败");
        }
    }

    @Override
    public Set<Integer> findUserLikedNoteIds(Long userId, List<Integer> noteIds) {




        List<Integer> likedIds = noteIds.stream().map(
            noteId -> {
                NoteLikeId noteLikeId = new NoteLikeId();
                noteLikeId.setNoteId(noteId);
                noteLikeId.setUserId(userId);
                return noteLikeRepository.existsById(noteLikeId.getNoteId()) ? noteId : null;
            }
        ).toList();

        return new HashSet<>(likedIds);
    }
}
