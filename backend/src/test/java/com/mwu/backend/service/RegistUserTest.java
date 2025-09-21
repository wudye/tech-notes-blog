package com.mwu.backend.service;

import cn.hutool.core.bean.BeanUtil;
import com.mwu.backend.model.entity.User;
import com.mwu.backend.model.enums.vo.user.RegisterVO;
import com.mwu.backend.model.requests.user.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public class RegistUserTest {

    @Autowired
    private UserService userService;

    @Test
    public void registUser() {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        for (int i = 0; i < 10; i++) {

            User user = new User();
            user.setPassword(passwordEncoder.encode("password" + String.format("%02d", i)));
            user.setAccount("user" + String.format("%02d", i));
            user.setEmail("user" + String.format("%02d", i) + "@example.com");
            user.setUsername("user" + String.format("%02d", i));
            RegisterRequest request = new RegisterRequest();
            BeanUtil.copyProperties(user, request);
            userService.register(request);

        }
        System.out.println("RegistUserTest.registUser" + "finished");

    }

}
