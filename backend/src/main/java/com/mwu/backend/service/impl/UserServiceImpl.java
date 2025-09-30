package com.mwu.backend.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.mwu.backend.config.JwtUtil;
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
import com.mwu.backend.model.responses.Pagination;
import com.mwu.backend.model.scope.RequestScopeDate;
import com.mwu.backend.repository.UserRepository;
import com.mwu.backend.service.EmailService;
import com.mwu.backend.service.FileService;
import com.mwu.backend.service.UserService;
import com.mwu.backend.utils.ApiResponseUtil;
import com.mwu.backend.utils.PaginationUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private  final  FileService fileService;

    private final RequestScopeDate requestScopeDate;

    private final EmailService emailService;
    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<RegisterVO> register(RegisterRequest request) {
        User existingUser = userRepository.findByAccount(request.getAccount());

        if (existingUser != null) {
            return ApiResponseUtil.error("Account already exists");
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            existingUser = userRepository.findByEmail(request.getEmail());
            if (existingUser != null) {
                return ApiResponseUtil.error("Email already in use");
            }
            if (request.getVerifyCode() == null || request.getVerifyCode().isEmpty()) {
                return ApiResponseUtil.error("Verification code is required");
            }
            // TODO uncomment this line
            // for test temporarily disable email verification
            if (!emailService.checkVerificationCode(request.getEmail(), request.getVerifyCode())) {
                return ApiResponseUtil.error("验证码无效或已过期");
            }
        }

        User user = new User();

        BeanUtil.copyProperties(request, user);

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
//           TODO 这里需要注意一点：work with frontend
//            这里生成的 JWT token（jwtUtil.generateToken(user.getUserId())）只是一个字符串，并不会自动保存到 Spring Security 的上下文或会话中。
//            你需要在登录/注册接口返回 token，前端拿到后每次请求时放到请求头（如 Authorization: Bearer <token>），Spring Security 才能通过自定义的过滤器（如 JWT 认证过滤器）解析并设置认证信息到 SecurityContext。
//            总结：token 生成后需由前端保存和传递，Spring Security 不会自动管理。
//                你需要在登录/注册接口返回 token，前端拿到后每次请求时放到请求头（如 Authorization: Bearer <token>）
//     假设后端返回 { data: ..., token: 'xxxx' }
//                localStorage.setItem('jwt_token', response.token);
//                // 假设后端返回 { data: ..., token: 'xxxx' }
//                localStorage.setItem('jwt_token', response.token);
//                请求时带上 token
//                发送需要认证的请求时，把 token 放到请求头：
//    const token = localStorage.getItem('jwt_token');
//                fetch('/api/xxx', {
//                        method: 'GET',
//                        headers: {
//                    'Authorization': `Bearer ${token}`,
//                    'Content-Type': 'application/json'
//                }
//    });
//                自动携带（如 axios 拦截器）
//                用 axios 可以全局设置：
//    import axios from 'axios';
//
//                axios.interceptors.request.use(config => {
//      const token = localStorage.getItem('jwt_token');
//                if (token) {
//                    config.headers.Authorization = `Bearer ${token}`;
//                }
//                return config;
//    });

            String token = jwtUtil.generateToken(user.getUserId());
            RegisterVO registerVO = new RegisterVO();

            BeanUtil.copyProperties(user, registerVO);
            return ApiResponseUtil.success("success register", registerVO, token);
        } catch (Exception e) {
            log.error("Error during registration", e);
            return ApiResponseUtil.error("Registration failed");
        }
    }

    @Override
    public ApiResponse<LoginUserVO> login(LoginRequest request) {
        User user = null;

        if(request.getAccount() != null && !request.getAccount().isEmpty()){
            user = userRepository.findByAccount(request.getAccount());
        } else if (request.getEmail() != null && !request.getEmail().isEmpty()){
            user = userRepository.findByEmail(request.getEmail());
        } else {
            return ApiResponseUtil.error("Account or Email is required");
        }

        if (user == null) {
            return ApiResponseUtil.error("user not found");
        }

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            return ApiResponseUtil.error("password is incorrect");
        }

        String token = jwtUtil.generateToken(user.getUserId());
        System.out.println("!!!!!!!!!!!!!Generated Token: " + token); // Debugging line to print the token
        LoginUserVO loginUserVO = new LoginUserVO();
        BeanUtil.copyProperties(user, loginUserVO);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        return ApiResponseUtil.success("success login", loginUserVO, token);
    }

    @Override
    public ApiResponse<LoginUserVO> whoami() {
        System.out.println("RequestScopeDate UserId: " + requestScopeDate.getUserId()); // Debugging line to print the userId from RequestScopeDate
        Long userId = requestScopeDate.getUserId();
        if (userId == null) {
            return ApiResponseUtil.error("User not authenticated");
        }
        System.out.println("UserServiceImpl.whoami" + "called");

        try{
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ApiResponseUtil.error("User not found");

            }
            String newToken = jwtUtil.generateToken(user.getUserId());
            if (newToken == null) {
                return ApiResponseUtil.error("Failed to generate new token");
            }
            System.out.println("!!!!!!!!!!!!!");
            LoginUserVO loginUserVO = new LoginUserVO();
            BeanUtil.copyProperties(user, loginUserVO);
            user.setLastLoginAt(LocalDateTime.now());
            System.out.println("!!!!!!!!!!!!!Refreshed Token: " + newToken); // Debugging line to print the token
            System.out.println("!!!!!!!!!!!!!User ID: " + user.getUsername()); // Debugging line to print the user ID
            userRepository.save(user);
            return ApiResponseUtil.success("success", loginUserVO, newToken);
        } catch (Exception e) {
            log.error("Error in whoami", e);
            return ApiResponseUtil.error("Internal server error");

        }



    }

    @Override
    public ApiResponse<UserVO> getUserInfo(Long userId) {
        System.out.println("UserServiceImpl.getUserInfo" + "  " + userId + " called");
        Optional<User> user = userRepository.findByUserId(userId);
        System.out.println("UserServiceImpl.getUserInfo" + "    " + user);
        if (!user.isPresent()) {
            return ApiResponseUtil.error("User not found");
        }
        if (user.isEmpty() || user.get().getUserId() == null) {
            return ApiResponseUtil.error("User not found");
        }
        UserVO userVO = new UserVO();
        BeanUtil.copyProperties(user.get(), userVO);
        return ApiResponseUtil.success("success", userVO);
    }

    @Override
    public ApiResponse<LoginUserVO> updateUserInfo(UpdateUserRequest request) {
       Long userId = requestScopeDate.getUserId();
       User user = new User();
       BeanUtil.copyProperties(request, user);
       String account = userRepository.findById(userId).get().getAccount();
       user.setUserId(userId);
       user.setAccount(account);
       try{
           userRepository.save(user);
           return ApiResponseUtil.success("User info updated successfully");
       } catch (Exception e) {
              log.error("Error updating user info", e);
              return ApiResponseUtil.error("Failed to update user info");
       }

    }

    @Override
    public ApiResponse<AvatarVO> uploadAvatar(MultipartFile file) {

        try {
            String url = fileService.uploadFile(file);
            AvatarVO avatarVO = new AvatarVO();
            avatarVO.setUrl(url);
            return ApiResponseUtil.success("Avatar uploaded successfully", avatarVO);
        } catch (Exception e) {
            log.error("Error uploading avatar", e);
            return ApiResponseUtil.error("Failed to upload avatar");
        }
    }


//    @Override
//    public ApiResponse<List<User>> getUserList(UserQueryParam queryParam) {
//        if (queryParam.getPageSize() < 1) {
//            queryParam.setPageSize(10);
//        }
//
//        Pageable pageable = PageRequest.of(queryParam.getPage() - 1, queryParam.getPageSize());
//        Page<User> userPage = userRepository.findAll(pageable);
//
//        List<User> users = userPage.getContent();
//        return ApiResponsUtil.success("获取用户列表成功", users);
        //UserQueryParam queryParam = new UserQueryParam();
        //queryParam.setPage(2);      // 查询第 2 页
        //queryParam.setPageSize(10);  // 每页 10 条记录
        //
        //    Pageable pageable = PageRequest.of(queryParam.getPage() - 1, queryParam.getPageSize());
        //    Page<User> userPage = userRepository.findAll(pageable);
        //
        //    List<User> users = userPage.getContent();
        //    long totalElements = userPage.getTotalElements(); // 总用户数
        //    int totalPages = userPage.getTotalPages();       // 总页数
        //
        //if (totalElements > 100) {
        //        log.info("总用户数超过 100 条，实际为：{}", totalElements);
        //    }
        //
        //return ApiResponseUtil.success("获取用户列表成功", users);
        //    }





    @Override
    public ApiResponse<List<User>> getUserList(UserQueryParam queryParam) {

        User user = userRepository.findByUserId(requestScopeDate.getUserId()).get();

        if (user.getIsAdmin() == null || user.getIsAdmin() != 1) {
            return ApiResponseUtil.error("Access denied: Admins only");
        }
        if (queryParam.getPageSize() < 1) {
            queryParam.setPageSize(10);
        }
        // 1. 构建动态查询条件 (Specification)
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (queryParam.getUserId() != null) {
                predicates.add(cb.equal(root.get("userId"), queryParam.getUserId()));
            }
            if (queryParam.getAccount() != null) {
                predicates.add(cb.equal(root.get("account"), queryParam.getAccount()));
            }
            if (queryParam.getUsername() != null && !queryParam.getUsername().isEmpty()) {
                predicates.add(cb.like(root.get("username"), "%" + queryParam.getUsername() + "%"));
            }
            if (queryParam.getIsAdmin() != null) {
                predicates.add(cb.equal(root.get("isAdmin"), queryParam.getIsAdmin()));
            }
            if (queryParam.getIsBanned() != null) {
                predicates.add(cb.equal(root.get("isBanned"), queryParam.getIsBanned()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // 2. 创建分页请求 (PageRequest)，JPA 的 page 从 0 开始
        if (queryParam.getPage() < 1) {
            queryParam.setPage(1);
        }
        if (queryParam.getPageSize() < 1) {
            queryParam.setPageSize(10);
        }
        int page = queryParam.getPage() - 1;
        int pageSize = queryParam.getPageSize();
        System.out.println("page: " + page + " pageSize: " + pageSize);
        PageRequest pageRequest = PageRequest.of(page, pageSize);

        // 3. 执行带条件的查询，获取分页结果
        Page<User> userPage = userRepository.findAll(spec, pageRequest);

        // 4. 从分页结果中获取用户列表和总数
        List<User> users = userPage.getContent();
        long total = userPage.getTotalElements();
        Pagination pagination = new Pagination(queryParam.getPage(), queryParam.getPageSize(), (int) total);

        // 5. 返回用户列表和分页信息
        return ApiResponseUtil.success("获取用户列表成功", users, pagination);
    }


//    public int countByQueryParam(UserQueryParam param) {
//        Specification<User> spec = (root, query, cb) -> {
//            List<Predicate> predicates = new ArrayList<>();
//            if (param.getUserId() != null) {
//                predicates.add(cb.equal(root.get("userId"), param.getUserId()));
//            }
//            if (param.getAccount() != null) {
//                predicates.add(cb.equal(root.get("account"), param.getAccount()));
//            }
//            if (param.getUsername() != null) {
//                predicates.add(cb.like(root.get("username"), "%" + param.getUsername() + "%"));
//            }
//            if (param.getIsAdmin() != null) {
//                predicates.add(cb.equal(root.get("isAdmin"), param.getIsAdmin()));
//            }
//            if (param.getIsBanned() != null) {
//                predicates.add(cb.equal(root.get("isBanned"), param.getIsBanned()));
//            }
//            // 其他条件...
//            return cb.and(predicates.toArray(new Predicate[0]));
//        };
//        return (int) userRepository.count(spec);
//    }


    @Override
    public Map<Long, User> getUserMapByIds(List<Long> authorIds) {
        if (authorIds.isEmpty()) {
            return Map.of();
          //  return Collections.emptyMap();
        }
        List<User> users = authorIds.stream().map(authorId ->
                userRepository.findById(authorId).orElse(null))
                .filter(Objects::nonNull)
                .toList();
        return users.stream()
                .collect(Collectors.toMap(User::getUserId, user -> user));
    }


}
