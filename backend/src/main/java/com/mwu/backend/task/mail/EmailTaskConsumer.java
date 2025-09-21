package com.mwu.backend.task.mail;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mwu.backend.model.enums.redisKey.RedisKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class EmailTaskConsumer {
    @Autowired
    private JavaMailSender mailSender;

 //   特点：Google 提供的轻量级 JSON 库，API 简单易用。
//    @Autowired
//    private Gson gson; // 需要配置 Gson 的 Bean

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;


    @Value("${spring.mail.username}")
    private String from;


    // 每 3 秒轮询一次 redis，查看是否有待发的邮件任务
    @Scheduled(fixedDelay = 3000)
    public  void  resume() throws JsonProcessingException {
        String emailQueryKey = RedisKey.emailTaskQueue();

        while (true) {
            String emailTaskJson = redisTemplate.opsForList().rightPop(emailQueryKey);
            if (emailTaskJson == null) {
                break;
            }
            // 将 redis 中的 JSON 字符串转成 emailTask 对象

            EmailTask emailTask = objectMapper.readValue(emailTaskJson, EmailTask.class);
            String email = emailTask.getEmail();
            String verificationCode = emailTask.getCode();
            // 根据 emailTask 对象中的信息
            // 填充 SimpleMailMessage 对象，然后使用 JavaMailSender 发送邮件
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(from);
            mailMessage.setTo(email);
            mailMessage.setSubject("tech notes blog- verification code");
            mailMessage.setText("your code is：" + verificationCode + "，expire" + 5 + "minutes，do not tell others.");

            mailSender.send(mailMessage);
            // 保存验证码到 Redis
            // 有效时间为 5 分钟
            redisTemplate.opsForValue().set(RedisKey.registerVerificationCode(email), verificationCode, 5, TimeUnit.MINUTES);
        }
    }


//
//    如果不使用 ObjectMapper 或其他 JSON 处理库（如 Gson、Fastjson 等），可以通过手动解析 JSON 字符串来实现相同的功能。以下是重写 resume() 方法的代码逻辑，使用原生字符串操作和正则表达式来解析 JSON：
//
//    重写逻辑
//    手动解析 JSON：
//
//    假设 EmailTask 的 JSON 格式为 {"email":"xxx","code":"xxx"} 。
//    使用字符串操作或正则表达式提取 email 和 code 字段。
//    移除 ObjectMapper 依赖：
//
//    删除 @Autowired private ObjectMapper objectMapper; 。
//    直接解析 emailTaskJson 字符串。
//    示例代码
//
//
//    @Scheduled(fixedDelay = 3000)
//    public void resume() {
//        String emailQueueKey = RedisKey.emailTaskQueue();
//
//        while (true) {
//            String emailTaskJson = redisTemplate.opsForList().rightPop(emailQueueKey);
//            if (emailTaskJson == null) {
//                break;
//            }
//
//            // 手动解析 JSON 字符串
//            String email = extractField(emailTaskJson, "email");
//            String verificationCode = extractField(emailTaskJson, "code");
//
//            if (email == null || verificationCode == null) {
//                continue; // 解析失败，跳过
//            }
//
//            // 发送邮件
//            SimpleMailMessage mailMessage = new SimpleMailMessage();
//            mailMessage.setFrom(from);
//            mailMessage.setTo(email);
//            mailMessage.setSubject("卡码笔记- 验证码");
//            mailMessage.setText("您的验证码是：" + verificationCode + "，有效期" + 5 + "分钟，请勿泄露给他人。");
//            mailSender.send(mailMessage);
//
//            // 保存验证码到 Redis
//            redisTemplate.opsForValue().set(
//                    RedisKey.registerVerificationCode(email),
//                    verificationCode,
//                    5,
//                    TimeUnit.MINUTES
//            );
//        }
//    }
//
//    // 辅助方法：从 JSON 字符串中提取字段值
//    private String extractField(String json, String fieldName) {
//        try {
//            // 简单解析逻辑，假设 JSON 格式为 {"field":"value"}
//            String pattern = "\"" + fieldName + "\":\"([^\"]+)\"";
//            java.util.regex.Pattern r = java.util.regex.Pattern.compile(pattern);
//            java.util.regex.Matcher m = r.matcher(json);
//            if (m.find()) {
//                return m.group(1);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return null;
//    }
}
