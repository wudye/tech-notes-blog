package com.mwu.backend.utils;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.StringReader;

public class SearchUtils {

//    private static final JiebaSegmenter segmenter = new JiebaSegmenter();
    private static final Analyzer analyzer = new StandardAnalyzer();

    /**
     * 预处理搜索关键词
     * 1. 去除特殊字符
     * 2. 分词
     * 3. 组合搜索词
     *
     * @param keyword 原始关键词
     * @return 处理后的关键词
     */
    public static String preprocessKeyword(String keyword) {
//        if (!StringUtils.hasText(keyword)) {
//            return "";
//        }
//
//        // 1. 去除特殊字符
//        keyword = keyword.replaceAll("[\\p{P}\\p{S}]", " ");
//
//        // 2. 分词
//        List<String> words = segmenter.sentenceProcess(keyword);
//
//        // 3. 组合搜索词
//        return String.join(" ", words);



            if (keyword == null || keyword.trim().isEmpty()) {
                return "";
            }
            keyword = keyword.replaceAll("[\\p{P}\\p{S}]", " ");
            StringBuilder result = new StringBuilder();
            try (TokenStream tokenStream = analyzer.tokenStream(null, new StringReader(keyword))) {
                CharTermAttribute attr = tokenStream.addAttribute(CharTermAttribute.class);
                tokenStream.reset();
                while (tokenStream.incrementToken()) {
                    if (result.length() > 0) {
                        result.append(" ");
                    }
                    result.append(attr.toString());
                }
                tokenStream.end();
            } catch (IOException e) {
                // 处理异常
                return "";
            }
            return result.toString();
        }

    /**
     * 计算分页的偏移量
     *
     * @param page 页码（从1开始）
     * @param pageSize 每页大小
     * @return 偏移量
     */
    public static int calculateOffset(int page, int pageSize) {
        return Math.max(0, (page - 1) * pageSize);
    }
}
