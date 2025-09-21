package com.mwu.backend.controller;

import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import com.mwu.backend.service.NoteLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class NoteLikeController {
    @Autowired
    private NoteLikeService noteLikeService;

    @PostMapping("/like/note/{noteId}")
    public ApiResponse<EmptyVO> likeNote(@PathVariable Integer noteId) {
        return noteLikeService.likeNote(noteId);
    }

    @DeleteMapping("/like/note/{noteId}")
    public ApiResponse<EmptyVO> unlikeNote(@PathVariable Integer noteId) {
        return noteLikeService.unlikeNote(noteId);
    }
}
