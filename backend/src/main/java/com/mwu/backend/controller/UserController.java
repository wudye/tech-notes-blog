package com.mwu.backend.controller;

import com.mwu.backend.model.entity.User;
import com.mwu.backend.model.enums.vo.user.AvatarVO;
import com.mwu.backend.model.enums.vo.user.LoginUserVO;
import com.mwu.backend.model.enums.vo.user.RegisterVO;
import com.mwu.backend.model.enums.vo.user.UserVO;
import com.mwu.backend.model.requests.user.LoginRequest;
import com.mwu.backend.model.requests.user.RegisterRequest;
import com.mwu.backend.model.requests.user.UpdateUserRequest;
import com.mwu.backend.model.requests.user.UserQueryParam;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping("/users")
    public ApiResponse<RegisterVO> register(
            @Valid
            @RequestBody
            RegisterRequest request) {

        log.info("UserController.register called");
        return userService.register(request);
    }

    @PostMapping("/users/login")
    public ApiResponse<LoginUserVO> login(
            @Valid
            @RequestBody
            LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/users/whoami")
    public ApiResponse<LoginUserVO> whoami() {
        ApiResponse<LoginUserVO> user = userService.whoami();
        System.out.println("UserController.whoami" + "called");
        return user;
    }

    @GetMapping("/users/{userId}")
    public ApiResponse<UserVO> getUserInfo(
            @PathVariable
            Long userId) {
        return userService.getUserInfo(userId);
    }
    @PatchMapping("/users/me")
    public ApiResponse<LoginUserVO> updateUserInfo(
            @Valid
            @RequestBody
            UpdateUserRequest request) {
        return userService.updateUserInfo(request);
    }
    @PostMapping("/users/avatar")
    public ApiResponse<AvatarVO> uploadAvatar(
            @RequestParam("file") MultipartFile file) {
        return userService.uploadAvatar(file);
    }

    @GetMapping("/admin/users")
    public ApiResponse<List<User>> adminGetUser(
            @Valid UserQueryParam queryParam) {

        return userService.getUserList(queryParam);
    }


}
