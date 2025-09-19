package com.mwu.backend.model.requests.question;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;


@Data
public class UpdateQuestionBody {
    /*
     * 问题标题
     */
    @NotNull(message = "title 不能为空")
    @NotBlank(message = "title 不能为空")
    @Length(max = 255, message = "title 长度不能超过 255")
    private String title;

    /*
     * 问题难度
     * 1=简单，2=中等，3=困难
     */
    @NotNull(message = "difficulty 不能为空")
    @Range(min = 1, max = 3, message = "difficulty 必须为 1, 2, 3")
    private Integer difficulty;

    /*
     * 题目考点
     */
    @Length(max = 255, message = "examPoint 长度不能超过 255")
    private String examPoint;
}