package com.mwu.backend.controller;

import com.mwu.backend.model.entity.Note;
import com.mwu.backend.model.entity.User;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.service.SearchService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/notes")
    public ApiResponse<List<Note>> searchNotes(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") @Min(1) Integer page,
            @RequestParam(defaultValue = "20") @Min(1) Integer pageSize) {
        return searchService.searchNotes(keyword, page, pageSize);
    }

    @GetMapping("/users")
    public ApiResponse<List<User>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") @Min(1) Integer page,
            @RequestParam(defaultValue = "20") @Min(1) Integer pageSize) {
        return searchService.searchUsers(keyword, page, pageSize);
    }

    @GetMapping("/notes/tag")
    public ApiResponse<List<Note>> searchNotesByTag(
            @RequestParam String keyword,
            @RequestParam String tag,
            @RequestParam(defaultValue = "1") @Min(1) Integer page,
            @RequestParam(defaultValue = "20") @Min(1) Integer pageSize) {
        return searchService.searchNotesByTag(keyword, tag, page, pageSize);
    }
}
