package com.mwu.backend.aspect;

import com.mwu.backend.annotation.NeedLogin;
import com.mwu.backend.model.scope.RequestScopeDate;
import com.mwu.backend.utils.ApiResponseUtil;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class NeedLoginAspect {
    @Autowired
    private RequestScopeDate requestScopeDate;

    @Around("@annotation(needLogin)")
    public Object around(ProceedingJoinPoint joinPoint, NeedLogin needLogin) throws Throwable {
        if (!requestScopeDate.isLogin() ) {
            return ApiResponseUtil.error("用户未登录");
        }
        if (requestScopeDate.getUserId() == null) {
            return ApiResponseUtil.error("用户 ID 异常");
        }
        return joinPoint.proceed();
    }
}
