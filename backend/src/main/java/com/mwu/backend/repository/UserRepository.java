package com.mwu.backend.repository;

import com.mwu.backend.model.entity.User;
import com.mwu.backend.model.requests.user.UserQueryParam;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByUserId(Long userId);

    @Query("SELECT COUNT(*) " +
            "FROM User u " +
            "WHERE FUNCTION('DATE', u.lastLoginAt) = CURRENT_DATE")
    int getTodayLoginCount();

    @Query("SELECT COUNT(*) " +
            "FROM User u " +
            "WHERE FUNCTION('DATE', u.createdAt) = CURRENT_DATE")
    int getTodayRegisterCount();
    @Query("SELECT COUNT(*) FROM User")
    int getTotalRegisterCount();

    User findByAccount(@NotBlank(message = "用户账号不能为空") @Size(min = 6, max = 32, message = "账号长度必须在 6 到 32 个字符之间") @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "账号只能包含字母、数字和下划线") String account);

    User findByEmail(@Email(message = "邮箱格式不正确") String email);


//    @Query("SELECT COUNT(u) FROM User u WHERE " +
//            "(:#{#param.userId} IS NULL OR u.userId = :#{#param.userId}) AND " +
//            "(:#{#param.account} IS NULL OR u.account = :#{#param.account}) AND " +
//            "(:#{#param.username} IS NULL OR u.username LIKE %:#{#param.username}%) AND " +
//            "(:#{#param.isAdmin} IS NULL OR u.isAdmin = :#{#param.isAdmin}) AND " +
//            "(:#{#param.isBanned} IS NULL OR u.isBanned = :#{#param.isBanned})")
//    int countByQueryParam(@Param("param") UserQueryParam param);

}
