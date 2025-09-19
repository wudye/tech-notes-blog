package com.mwu.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.path:E://upload}")
    private String uploadPath;

    @Autowired
    private TokenInterceptor tokenInterceptor;

    //    总结来说，这段代码的作用是将本地文件系统中的某个目录（如 E://upload）映射为 Web 可访问的路径（如 /images/**），从而实现静态资源的对外暴露。

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(tokenInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/login", "/error");
    }

    // spring security 已经处理了跨域问题
   // @Override
   // public void addCorsMappings(CorsRegistry registry) {
   //     registry.addMapping("/**")
   //             .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")  // 允许的域名
   //             .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")// 允许的 HTTP 方法
   //             .allowedHeaders("*")
   //             .allowCredentials(true)
   //             .maxAge(3600);
   // }

    @Bean
    public FilterRegistrationBean<TraceIdFilter> traceIdFilter() {
        FilterRegistrationBean<TraceIdFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new TraceIdFilter());
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }
}
