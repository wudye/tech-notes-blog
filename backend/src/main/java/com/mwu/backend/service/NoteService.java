package com.mwu.backend.service;

import com.mwu.backend.model.enums.vo.note.*;
import com.mwu.backend.model.requests.note.CreateNoteRequest;
import com.mwu.backend.model.requests.note.NoteQueryParams;
import com.mwu.backend.model.requests.note.UpdateNoteRequest;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.EmptyVO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface NoteService {
    /**
     * 查询笔记列表
     *
     * @param params 查询参数对象，用于指定过滤条件（如关键词、时间范围等）
     * @return 包含符合查询条件的笔记视图对象列表的响应
     */
    ApiResponse<List<NoteVO>> getNotes(NoteQueryParams params);

    /**
     * 发布笔记
     *
     * @param request 发布笔记的请求对象，包含笔记内容、标题等信息
     * @return 包含新创建的笔记视图对象的响应
     */
    ApiResponse<CreateNoteVO> createNote(CreateNoteRequest request);

    /**
     * 更新笔记
     *
     * @param noteId  笔记ID，用于标识需要更新的笔记
     * @param request 更新笔记的请求对象，包含要更新的内容和属性
     * @return 空视图对象的响应，表示更新操作成功
     */
    ApiResponse<EmptyVO> updateNote(Integer noteId, UpdateNoteRequest request);

    /**
     * 删除笔记
     *
     * @param noteId 笔记ID，用于标识需要删除的笔记
     * @return 空视图对象的响应，表示删除操作成功
     */
    ApiResponse<EmptyVO> deleteNote(Integer noteId);

    /**
     * 下载笔记
     * @return 包含下载笔记
     */
    ApiResponse<DownloadNoteVO> downloadNote();

    /**
     * 笔记排行榜
     * @return 包含笔记排行榜视图对象的响应
     */
    ApiResponse<List<NoteRankListItem>> submitNoteRank();

    /**
     * 用户提交热力图
     * @return 用户提交热力图
     */
    ApiResponse<List<NoteHeatMapItem>> submitNoteHeatMap();

    /**
     * 用户提交top3Count
     * @return 用户提交top3Count
     */
    ApiResponse<Top3Count> submitNoteTop3Count();
}
