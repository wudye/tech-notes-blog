package com.mwu.backend.service;

import com.mwu.backend.model.entity.Note;
import com.mwu.backend.model.entity.User;
import com.mwu.backend.model.responses.ApiResponse;

import java.util.List;

public interface SearchService {
    /**
     * 搜索笔记
     *
     * @param keyword 关键词
     * @param page 页码
     * @param pageSize 每页大小
     * @return 笔记列表
     */
    ApiResponse<List<Note>> searchNotes(String keyword, int page, int pageSize);

    /**
     * 搜索用户
     *
     * @param keyword 关键词
     * @param page 页码
     * @param pageSize 每页大小
     * @return 用户列表
     */
    ApiResponse<List<User>> searchUsers(String keyword, int page, int pageSize);

    /**
     * 搜索笔记（带标签）
     *
     * @param keyword 关键词
     * @param tag 标签
     * @param page 页码
     * @param pageSize 每页大小
     * @return 笔记列表
     */
    ApiResponse<List<Note>> searchNotesByTag(String keyword, String tag, int page, int pageSize);
}
