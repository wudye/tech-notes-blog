package com.mwu.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mwu.backend.model.entity.Statistic;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.model.responses.Pagination;
import com.mwu.backend.service.StatisticService;
import com.mwu.backend.utils.ApiResponseUtil;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {StatisticController.class})

class StatisticControllerTest {

}




//使用 MockMvc 来模拟 HTTP 请求并测试 StatisticController 的 getStatistic 方法。这需要你模拟 StatisticService 的行为，因为在单元测试中我们只关心 Controller 层的逻辑是否正确。
// 首先，建议使用 @WebMvcTest 注解，它更适合用于测试 Spring MVC 控制器，因为它只加载 Web 层的相关组件，比 @SpringBootTest 更轻量。
// 以下是完整的 StatisticControllerTest 测试类代码：
//
//@WebMvcTest(StatisticController.class)
//class StatisticControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private StatisticService statisticService;
//
//    @Autowired
//    private ObjectMapper objectMapper; // Spring Boot 会自动配置这个 Bean 用于序列化/反序列化
//
//    @Test
//    void getStatistic_shouldReturnStatisticList() throws Exception {
//        // 1. 准备模拟数据
//        // 模拟 Service 层将要返回的数据
//        Statistic statistic = new Statistic(); // 假设 Statistic 有一个默认构造函数
//        // 你可以在这里设置 statistic 的属性, e.g., statistic.setId(1L);
//        List<Statistic> statisticList = Collections.singletonList(statistic);
//        Pagination pagination = new Pagination(1, 10, 1);
//        ApiResponse<List<Statistic>> serviceResponse = ApiResponseUtil.success("成功", statisticList, pagination);
//
//        // 2. 定义 Mock 行为
//        // 当调用 statisticService.getStatistic 时，返回我们准备好的模拟数据
//        when(statisticService.getStatistic(any())).thenReturn(serviceResponse);
//
//        // 3. 执行并验证
//        mockMvc.perform(get("/api/statistic")
//                        .param("page", "1")
//                        .param("pageSize", "10")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk()) // 验证 HTTP 状态码为 200
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // 验证内容类型是 JSON
//                .andExpect(jsonPath("$.success").value(true)) // 验证返回 JSON 中的 success 字段
//                .andExpect(jsonPath("$.message").value("成功")) // 验证 message 字段
//                .andExpect(jsonPath("$.data").isArray()) // 验证 data 是一个数组
//                .andExpect(jsonPath("$.data.length()").value(1)) // 验证数组长度
//                .andExpect(jsonPath("$.pagination.page").value(1)); // 验证分页信息
//    }
//}
