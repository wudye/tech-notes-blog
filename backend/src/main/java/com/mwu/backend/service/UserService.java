package com.mwu.backend.service;

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
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Transactional
public interface UserService {
    ApiResponse<RegisterVO> register(@Valid RegisterRequest request);

    ApiResponse<LoginUserVO> login(@Valid LoginRequest request);

    ApiResponse<LoginUserVO> whoami();

    ApiResponse<UserVO> getUserInfo(Long userId);

    ApiResponse<LoginUserVO> updateUserInfo(@Valid UpdateUserRequest request);

    ApiResponse<AvatarVO> uploadAvatar(MultipartFile file);

    ApiResponse<List<User>> getUserList(@Valid UserQueryParam queryParam);
    public Map<Long, User> getUserMapByIds(List<Long> authorIds) ;
    }
