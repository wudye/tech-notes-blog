package com.mwu.backend;

import com.mwu.backend.service.RedisService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = BackendApplication.class)
class BackendApplicationTests {

    @Autowired
    RedisService redisService;

    @Test
    public void Test() {
        redisService.set("testKey", "testValue");
    }

    @Test
    public void Test2() {
        Object o = redisService.get("testKey");
    }

    @Test
    public void Test3() {
        Object o = redisService.get("random");
        System.out.println(o);
    }

}
