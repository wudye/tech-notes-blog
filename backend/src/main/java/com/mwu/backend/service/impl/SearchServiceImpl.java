package com.mwu.backend.service.impl;

import com.mwu.backend.model.entity.Note;
import com.mwu.backend.model.entity.User;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.repository.NoteRepository;
import com.mwu.backend.repository.UserRepository;
import com.mwu.backend.service.SearchService;
import com.mwu.backend.utils.ApiResponseUtil;
import com.mwu.backend.utils.SearchUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@SuppressWarnings("unchecked")
public class SearchServiceImpl implements SearchService {
    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    RedisTemplate<String, Object> redisTemplate;

    private static final String NOTE_SEARCH_CACHE_KEY = "search:note:%s:%d:%d";
    private static final String USER_SEARCH_CACHE_KEY = "search:user:%s:%d:%d";
    private static final String NOTE_TAG_SEARCH_CACHE_KEY = "search:note:tag:%s:%s:%d:%d";
    private static final long CACHE_EXPIRE_TIME = 30; // 分钟

    @Override
    public ApiResponse<List<Note>> searchNotes(String keyword, int page, int pageSize) {


        try {
            String cacheKey = String.format(NOTE_SEARCH_CACHE_KEY, keyword, page, pageSize);
            List<Note> cachedResult = (List<Note>) redisTemplate.opsForValue().get(cacheKey);
            if (cachedResult != null) {
                return ApiResponseUtil.success("搜索成功", cachedResult);
            }
            keyword = SearchUtils.preprocessKeyword(keyword);

            int offset = (page - 1) * pageSize;

            List<Note> notes = noteRepository.searchNote(keyword, pageSize, offset);
            redisTemplate.opsForValue().set(cacheKey, notes, CACHE_EXPIRE_TIME, java.util.concurrent.TimeUnit.MINUTES);

            return ApiResponseUtil.success("success search", notes);
        } catch (Exception e) {
            return ApiResponseUtil.error("fail to search notes: " + e.getMessage());
        }



    }

    @Override
    public ApiResponse<List<User>> searchUsers(String keyword, int page, int pageSize) {
        try {
            String cacheKey = String.format(USER_SEARCH_CACHE_KEY, keyword, page, pageSize);

            // 尝试从缓存获取
            List<User> cachedResult = (List<User>) redisTemplate.opsForValue().get(cacheKey);
            if (cachedResult != null) {
                return ApiResponseUtil.success("搜索成功", cachedResult);
            }

            // 计算偏移量
            int offset = (page - 1) * pageSize;

            Specification spec = (root, query, cb) -> {
                String pattern =  keyword + "%";
                var exact = cb.or(
                        cb.equal(root.get("username"), keyword),
                        cb.equal(root.get("account"), keyword),
                        cb.equal(root.get("email"), keyword)
                );
                var like = cb.or(
                        cb.like(root.get("username"), pattern),
                        cb.like(root.get("account"), pattern),
                        cb.like(root.get("email"), pattern)
                );
                query.where(cb.or(exact, like));
                query.orderBy(
                        cb.desc(cb.equal(root.get("username"), keyword)),
                        cb.desc(cb.equal(root.get("account"), keyword)),
                        cb.desc(cb.equal(root.get("email"), keyword)),
                        cb.desc(cb.like(root.get("username"), pattern)),
                        cb.desc(cb.like(root.get("account"), pattern)),
                        cb.desc(cb.like(root.get("email"), pattern))
                );
                return query.getRestriction();
            };

            Pageable pageable = PageRequest.of(page - 1, pageSize);
            // 使用 Specification 和 Pageable 执行查询
            List<User> users = userRepository.findAll(spec, pageable).getContent();

            // 执行搜索

            // 存入缓存
            redisTemplate.opsForValue().set(cacheKey, users, CACHE_EXPIRE_TIME, TimeUnit.MINUTES);

            return ApiResponseUtil.success("搜索成功", users);
        } catch (Exception e) {
            log.error("搜索用户失败", e);
            return ApiResponseUtil.error("搜索失败");
        }
    }

    @Override
    public ApiResponse<List<Note>> searchNotesByTag(String keyword, String tag, int page, int pageSize) {
        try {
            String cacheKey = String.format(NOTE_TAG_SEARCH_CACHE_KEY, keyword, tag, page, pageSize);

            // 尝试从缓存获取
            List<Note> cachedResult = (List<Note>) redisTemplate.opsForValue().get(cacheKey);
            if (cachedResult != null) {
                return ApiResponseUtil.success("搜索成功", cachedResult);
            }

            // 处理关键词
            keyword = SearchUtils.preprocessKeyword(keyword);

            // 计算偏移量
            int offset = (page - 1) * pageSize;

            // 执行搜索
            List<Note> notes = noteRepository.searchNotesByTag(keyword, tag, pageSize, offset);

            // 存入缓存
            redisTemplate.opsForValue().set(cacheKey, notes, CACHE_EXPIRE_TIME, TimeUnit.MINUTES);

            return ApiResponseUtil.success("搜索成功", notes);
        } catch (Exception e) {
            log.error("搜索笔记失败", e);
            return ApiResponseUtil.error("搜索失败");
        }
    }
}
