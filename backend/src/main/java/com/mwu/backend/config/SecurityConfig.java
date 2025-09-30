package com.mwu.backend.config;

import com.mwu.backend.model.entity.User;
import com.mwu.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


//    @Bean
//    public UserDetailsService userDetailService() {
//        return new UserProfileDetailsService();
//    }


//
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//        return config.getAuthenticationManager();
//    }
//
//    @Bean
//    public AuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
//        authProvider.setUserDetailsService(userDetailService());
//        authProvider.setPasswordEncoder(passwordEncoder());
//        return authProvider;
//    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        .cors(Customizer.withDefaults())：启用跨域资源共享（CORS），允许前端（如 React、Vue）跨域访问后端接口。
//.csrf(AbstractHttpConfigurer::disable)：禁用 CSRF 保护，常用于 REST API 或前后端分离项目，否则 POST/PUT/DELETE 请求会被拦截。
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated())

//        pring Security 的 .formLogin((form) -> form.loginPage("/login")) 是让后端自己提供
//        /login 页面（通常是后端渲染的 HTML）。如果你前后端分离，前端有自己的登录页面，后端不需要配置
//        .formLogin()，只需让前端直接调用后端的登录接口（如 /api/login），前端自己负责页面跳转和表单提交。
//                .formLogin((form) -> form
//                        .loginPage("/login")
//                .permitAll())
                .logout((logout) -> logout.permitAll())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(AbstractHttpConfigurer::disable); // 推荐写法
//        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)：设置为无状态，不会创建或使用 HTTP Session，适合 REST API。
//.httpBasic(AbstractHttpConfigurer::disable)：禁用 HTTP Basic 认证，只允许表单登录。
        return http.build();
    }
//    @Bean
//    public UserDetailsService userDetailsService() {
//        UserDetails user =
//                User.withDefaultPasswordEncoder()
//                        .username("user")
//                        .password("password")
//                        .roles("USER")
//                        .build();
//
//        return new InMemoryUserDetailsManager(user);
//    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // 允许的前端域名
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;

//        // 对 /api/** 路径允许所有来源
//        CorsConfiguration apiConfig = new CorsConfiguration();
//        apiConfig.setAllowedOrigins(Arrays.asList("*"));
//        source.registerCorsConfiguration("/api/**", apiConfig);
//
//// 对 /admin/** 路径仅允许特定来源
//        CorsConfiguration adminConfig = new CorsConfiguration();
//        adminConfig.setAllowedOrigins(Arrays.asList("http://admin.example.com"));
//        source.registerCorsConfiguration("/admin/**", adminConfig);

    }

//    是的，passwordEncoder 虽然没有在 securityFilterChain 方法中直接调用，但它会被 Spring Security 自动用于用户认证流程（如登录时密码校验）。
//    如果你配置了自定义用户认证（如 UserDetailsService），Spring Security 会自动注入并使用该 PasswordEncoder Bean。
//    所以，securityFilterChain 间接依赖于 passwordEncoder，共同完成安全认证。
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


//    @Bean
//    public CommandLineRunner initUser(UserRepository userRepository) {
//        return args -> {
//            com.mwu.backend.model.entity.User user = new User();
//            user.setAccount("fortest123");
//            user.setUsername("mwu12345678");
//            user.setEmail("mingwei.wu@hotmail.com");
//            user.setPassword(passwordEncoder().encode("12345678"));
//            user.setIsAdmin(1); // 1 表示 true
//            userRepository.save(user);
//        };
//    }
}