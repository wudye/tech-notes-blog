package com.mwu.backend.repository;

import com.mwu.backend.model.entity.Note;

import com.mwu.backend.model.enums.vo.note.NoteHeatMapItem;
import com.mwu.backend.model.enums.vo.note.NoteRankListItem;
import com.mwu.backend.model.enums.vo.note.Top3Count;
import com.mwu.backend.model.requests.note.NoteQueryParams;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.repository.query.Param;
@Repository
public interface NoteRepository extends JpaRepository<Note, Integer>, JpaSpecificationExecutor<Note> {
    @Query("SELECT COUNT(n) FROM Note n WHERE n.createdAt = CURRENT_DATE")
    int getTodayNoteCount();

    @Query("SELECT COUNT(DISTINCT  n.authorId) FROM Note n " +
            "WHERE FUNCTION('DATE', n.createdAt) = CURRENT_DATE " +
            "GROUP BY n.authorId"
    )
    int getTodaySubmitNoteUserCount();
    @Query("SELECT COUNT(*) FROM Note")
    int getTotalNoteCount();

    @Query(
            value = "SELECT n.*, MATCH(n.content) AGAINST(:keyword IN NATURAL LANGUAGE MODE) as relevance " +
                    "FROM notes n " +
                    "WHERE MATCH(n.content) AGAINST(:keyword IN NATURAL LANGUAGE MODE) " +
                    "ORDER BY relevance DESC " +
                    "LIMIT :limit OFFSET :offset",
            nativeQuery = true
    )
    List<Note> searchNote(
            @Param("keyword") String keyword,
            @Param("limit") int limit,
            @Param("offset") int offset
    );


    @Query(
            value = "SELECT DISTINCT n.*, " +
                    "MATCH(n.search_vector) AGAINST(:keyword IN NATURAL LANGUAGE MODE) as relevance " +
                    "FROM notes n " +
                    "LEFT JOIN note_tag nt ON n.id = nt.note_id " +
                    "LEFT JOIN tag t ON nt.tag_id = t.id " +
                    "WHERE MATCH(n.search_vector) AGAINST(:keyword IN NATURAL LANGUAGE MODE) " +
                    "   OR t.name LIKE CONCAT('%', :tag, '%') " +
                    "ORDER BY relevance DESC " +
                    "LIMIT :limit OFFSET :offset",
            nativeQuery = true
    )
    List<Note> searchNotesByTag(
            @Param("keyword") String keyword,
            @Param("tag") String tag,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    @Query("SELECT DISTINCT n.questionId FROM Note n WHERE n.authorId = :userId AND n.questionId IN :questionIds")
    Set<Integer> findDistinctByUserIdAndQuestionIdIn(Long userId, List<Integer> questionIds);

    Note findByAuthorIdAndQuestionId(Long userId, Integer questionId);

    Note findByNoteId(Integer noteId);

    @Query("SELECT COUNT(*) FROM Note ")
    int countNotes(NoteQueryParams params);

    void deleteByNoteId(Integer noteId);

    @Query("SELECT n FROM Note n WHERE n.authorId = :userId")
    List<Note> findByAuthorId(Long userId);
    @Query(
            value = "SELECT n.author_id AS authorId, " +
                    "u.username AS username, " +
                    "u.avatar_url AS avatarUrl, " +
                    "COUNT(n.note_id) AS authorNotesCount, " +
                    "RANK() OVER (ORDER BY COUNT(n.note_id) DESC) AS `rank` " +
                    "FROM notes n " +
                    "INNER JOIN users u ON n.author_id = u.user_id " +
                    "WHERE DATE(n.created_at) = CURDATE() " +
                    "GROUP BY n.author_id, u.username, u.avatar_url " +
                    "ORDER BY authorNotesCount DESC " +
                    "LIMIT 10",
            nativeQuery = true
    )
    List<NoteRankListItem> submitNoteRank();


    @Query(
            value = "WITH DailyNoteCounts AS (" +
                    "    SELECT author_id," +
                    "           DATE(created_at) AS note_date," +
                    "           COUNT(note_id) AS note_count" +
                    "    FROM notes" +
                    "    WHERE DATE(created_at) BETWEEN DATE_SUB(CURRENT_DATE, INTERVAL 94 DAY) AND CURRENT_DATE" +
                    "    GROUP BY author_id, DATE(created_at)" +
                    ")," +
                    "RankedNotes AS (" +
                    "    SELECT author_id, note_date, note_count," +
                    "           RANK() OVER (PARTITION BY note_date ORDER BY note_count DESC) AS note_rank" +
                    "    FROM DailyNoteCounts" +
                    ")" +
                    "SELECT note_count AS count," +
                    "       note_date AS date," +
                    "       note_rank AS `rank`" +
                    "FROM RankedNotes " +
                    "WHERE author_id = :authorId",
            nativeQuery = true
    )
    List<NoteHeatMapItem> submitNoteHeatMap(@Param("authorId") Long authorId);



    @Query(
            value = "WITH DailyNoteCounts AS (" +
                    "SELECT author_id, DATE(created_at) AS note_date, COUNT(note_id) AS note_count " +
                    "FROM notes " +
                    "WHERE DATE(created_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE()) - 1 DAY) - INTERVAL 1 MONTH " +
                    "AND LAST_DAY(CURDATE()) " +
                    "GROUP BY author_id, DATE(created_at)" +
                    "), RankedNotes AS (" +
                    "SELECT author_id, note_date, note_count, RANK() OVER (PARTITION BY note_date ORDER BY note_count DESC) AS note_rank " +
                    "FROM DailyNoteCounts" +
                    ") " +
                    "SELECT SUM(CASE WHEN note_rank <= 3 AND note_date BETWEEN DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE()) - 1 DAY) - INTERVAL 1 MONTH AND LAST_DAY(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) THEN 1 ELSE 0 END) AS lastMonthTop3Count, " +
                    "SUM(CASE WHEN note_rank <= 3 AND note_date BETWEEN DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE()) - 1 DAY) AND LAST_DAY(CURDATE()) THEN 1 ELSE 0 END) AS thisMonthTop3Count " +
                    "FROM RankedNotes " +
                    "WHERE author_id = :authorId",
            nativeQuery = true
    )
    Top3Count submitNoteTop3Count(@Param("authorId") Long authorId);

    @Modifying
    @Query("update Note n set n.commentCount = :count where n.noteId = :noteId")
    void updateByCommentCount(Integer noteId, Integer count);

    @Modifying
    @Query("UPDATE Note n SET n.collectCount = n.collectCount + 1 WHERE n.noteId = :noteId")
    void increateCollectCountByNoteId(Integer noteId);

    @Modifying
    @Query("UPDATE Note n SET n.collectCount = n.collectCount + 1 WHERE n.noteId = :noteId")
    void decreaseCollectNoteByNoteId(Integer noteId);
}
