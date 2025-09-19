# loging
    Logback and Log4j2 are not configurations for SLF4J; they are actual logging frameworks (implementations).
    
    SLF4J is just a logging API (facade) that your code uses. Logback and Log4j2 are the real logging systems that SLF4J delegates to. You configure Logback (with logback-spring.xml) or Log4j2 (with log4j2-spring.xml) to control how logging works in your application. SLF4J itself does not handle logging output or configuration.

# Composite Primary Key in mysql how to set in spring jpa

# define an annotation class
# config redisTemplate(no config, will use default config)
# config scheduler with multiple thread pool(default is single thread)

# spring security Filter vs Interceptor
    Filter is part of the Servlet specification and works at the web layer, processing requests before they reach the servlet. Interceptors are part of the Spring framework and work at the application layer, allowing pre- and post-processing of method invocations.
    In Spring (including Spring Security), the main differences between an Interceptor and a Filter are:
    
    Filter:
    
    Part of the Servlet specification.
    Executes before the Spring MVC framework processes the request.
    Can modify the request and response.
    Used for cross-cutting concerns like logging, authentication, and CORS.
    Configured with FilterRegistrationBean or in web.xml.
    Interceptor:
    
    Part of the Spring MVC framework.
    Executes after the Filter, but before the controller method.
    Cannot modify the request/response body, but can access and modify model and view.
    Used for tasks like authentication, authorization, logging, and modifying the model.
    Configured by implementing HandlerInterceptor and registering with InterceptorRegistry.
    In Spring Security, most security logic is handled by Filters (like UsernamePasswordAuthenticationFilter). Interceptors are more for application-level logic after security checks. Filters have a broader scope and are more powerful for security-related tasks.


# Spring Security 的认证流程大致如下：
    请求拦截
    用户发起请求（如登录），Spring Security 的过滤器链会拦截所有请求。
    获取认证信息
    认证过滤器（如 UsernamePasswordAuthenticationFilter）从请求中提取用户名和密码，封装成 Authentication 对象。
    认证管理器处理
    认证信息被传递给 AuthenticationManager，通常由 ProviderManager 实现。
    用户信息查询
    AuthenticationManager 会调用 UserDetailsService 加载用户信息（如数据库查找用户）。
    密码校验
    加载到的用户信息会与请求中的密码进行比对。此时会用到 PasswordEncoder（如 BCryptPasswordEncoder）对密码进行加密和校验。
    认证结果
    如果认证通过，生成认证后的 Authentication 对象，存入 SecurityContext，后续请求会自动识别为已登录。
    如果认证失败，抛出异常，返回未认证响应。
    示例流程：
    用户登录时输入用户名和密码，Spring Security 会自动调用你配置的 PasswordEncoder 校验密码是否正确。如果正确，则登录成功，否则返回错误信息。

# use spring mvc 
    先经过所有 Filter（如 traceIdFilter）
    再经过所有 Interceptor（如 tokenInterceptor）
    最后到 Controller
    
    以下是 Spring MVC 和 Spring Security 的核心处理流程对比，并通过一个用户登录的示例说明两者的协作关系：
    
    1. Spring MVC 处理流程
    Spring MVC 的核心流程围绕 HTTP 请求的分发与响应，分为以下步骤：
    
    (1) 请求生命周期
    DispatcherServlet 接收请求
    所有请求首先由 DispatcherServlet （前端控制器）处理。
    HandlerMapping 路由
    根据 URL 找到对应的控制器（ @Controller ）。
    调用控制器方法
    执行 @RequestMapping 注解的方法，处理业务逻辑。
    返回 ModelAndView
    控制器返回数据（ Model ）或视图名称（ View ）。
    视图渲染
    ViewResolver 解析视图（如 JSP、Thymeleaf），生成最终响应。
    (2) 示例代码
    Java
    插入
    复制
    新建文件
    保存
    应用代码
    @Controller
    public class UserController {
    @GetMapping("/login")
    public String loginPage() {
    return "login"; // 返回视图名（渲染 login.html）
    }
    
    @PostMapping("/login")
    public String handleLogin(@RequestParam String username, Model model) {
        model.addAttribute("username", username); // 数据传递到视图
        return "welcome";
    }
    }
    2. Spring Security 处理流程
    Spring Security 的核心流程围绕 认证与授权，分为以下步骤：
    
    (1) 请求生命周期
    过滤器链拦截请求
    FilterChainProxy 管理多个安全过滤器（如 UsernamePasswordAuthenticationFilter ）。
    认证（Authentication）
    验证用户身份（如用户名/密码）。
    授权（Authorization）
    检查用户是否有权限访问资源（基于角色或权限）。
    安全上下文存储
    认证成功后，用户信息存入 SecurityContextHolder 。
    请求继续或拦截
    通过则继续 MVC 流程，否则返回 403 或重定向到登录页。
    (2) 示例配置
    Java
    插入
    复制
    新建文件
    保存
    应用代码
    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
    .authorizeRequests(auth -> auth
    .antMatchers("/login").permitAll() // 允许匿名访问
    .antMatchers("/admin/**").hasRole("ADMIN") // 需 ADMIN 角色
    .anyRequest().authenticated() // 其他请求需登录
    )
    .formLogin(form -> form
    .loginPage("/login") // 自定义登录页
    .defaultSuccessUrl("/home") // 登录成功跳转
    );
    return http.build();
    }
    }
    3. 两者协作示例：用户登录
    (1) 流程对比
    步骤	Spring MVC	Spring Security
       1. 接收请求	DispatcherServlet 处理 /login	过滤器链拦截请求
       2. 路由	调用 UserController.loginPage()	检查是否允许匿名访问（ permitAll() ）
       3. 认证	-	验证用户名/密码（表单提交）
       4. 授权	-	检查用户角色（如 hasRole("ADMIN") ）
       5. 响应	返回 login.html 或 welcome.html	重定向到成功/失败页
         (2) 具体场景
         用户访问 /login
    
    Spring MVC：返回登录页面（ login.html ）。
    Spring Security：允许匿名访问（未认证）。
    提交登录表单
    
    Spring Security：
    拦截 POST /login ，验证用户名密码。
    认证成功后将用户信息存入会话。
    Spring MVC：
    认证通过后，重定向到 /home ，由 HomeController 处理。
    访问 /admin/dashboard
    
    Spring Security：
    检查用户是否有 ADMIN 角色，若无则返回 403。
    Spring MVC：
    仅当授权通过时，才调用 AdminController.dashboard() 。
    4. 关键差异总结
    特性	Spring MVC	Spring Security
    核心目标	处理 HTTP 请求与响应	管理认证与授权
    入口点	DispatcherServlet	FilterChainProxy
    主要注解	@Controller , @RequestMapping	@EnableWebSecurity , @PreAuthorize
    数据流	模型（Model）→ 视图（View）	用户凭证 → 安全上下文（SecurityContext）
    典型扩展点	拦截器（Interceptor）、视图解析器	自定义认证逻辑（ UserDetailsService ）
       5. 常见问题
         执行顺序：
         Spring Security 的过滤器链在 Spring MVC 之前执行。
         自定义登录页：
         需通过 loginPage("/login") 指定 MVC 控制器路径。
         静态资源放行：
         在 Security 配置中通过 antMatchers("/css/**").permitAll() 允许访问。
         通过以上对比和示例，可以清晰理解 Spring MVC 和 Spring Security 如何分工协作，构建安全的 Web 应用。如果需要进一步调整或扩展功能，请告诉我！
    
    JwtService.java (32-32)
    JwtService.java
    spring mvc also has interceptor and filter add this to it
    以下是 Spring MVC 和 Spring Security 的完整处理流程，新增了 拦截器（Interceptor） 和 过滤器（Filter） 的协作说明，并通过用户登录示例展示各组件的作用顺序：
    
    1. Spring MVC 完整流程（含 Interceptor 和 Filter）
    (1) 请求生命周期
    HTTP 请求到达
    先经过 Servlet 容器（如 Tomcat）的 Filter 链（如 CharacterEncodingFilter ）。
    Spring Security 过滤器链
    FilterChainProxy 调用 Spring Security 的过滤器（如 UsernamePasswordAuthenticationFilter ）。
    DispatcherServlet 接收请求
    请求到达 DispatcherServlet （前端控制器）。
    HandlerMapping 路由
    根据 URL 找到对应的 @Controller 方法。
    拦截器（Interceptor）
    执行 preHandle → 调用控制器方法 → 执行 postHandle → 渲染视图 → 执行 afterCompletion 。
    控制器处理
    执行业务逻辑并返回 ModelAndView 。
    视图渲染
    ViewResolver 解析视图生成响应。
    (2) 关键组件代码
    Java
    插入
    复制
    新建文件
    保存
    应用代码
    // 1. 自定义过滤器（Servlet Filter）
    public class LogFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
    System.out.println("Filter: 请求预处理");
    chain.doFilter(request, response); // 继续执行后续过滤器或 DispatcherServlet
    }
    }
    
    // 2. 自定义拦截器（Spring Interceptor）
    public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    System.out.println("Interceptor: 认证检查");
    return true; // 返回 false 则中断请求
    }
    }
    
    // 3. 注册组件
    @Configuration
    public class WebConfig implements WebMvcConfigurer {
    @Bean
    public FilterRegistrationBean<LogFilter> logFilter() {
    FilterRegistrationBean<LogFilter> bean = new FilterRegistrationBean<>();
    bean.setFilter(new LogFilter());
    bean.addUrlPatterns("/*");
    return bean;
    }
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthInterceptor()).addPathPatterns("/**");
    }
    }
    2. Spring Security 流程（与 Filter/Interceptor 协作）
    (1) 执行顺序
    Servlet Filter（如 LogFilter ）
    最早执行，处理原始请求/响应。
    Spring Security Filters
    认证（ AuthenticationFilter ）和授权（ AuthorizationFilter ）。
    Spring Interceptor
    在控制器方法前后插入逻辑（如日志、权限检查）。
    Controller → View
    最后执行业务逻辑和渲染。
    (2) 示例场景：用户登录
    步骤	组件	行为
       1. 请求 /login	LogFilter	记录请求日志
       2. 认证检查	UsernamePasswordAuthenticationFilter	验证用户名/密码（Spring Security）
       3. 权限预检查	AuthInterceptor	检查用户会话（如 preHandle 中验证 Token）
       4. 控制器处理	LoginController	返回登录成功页面
       5. 响应后处理	AuthInterceptor	记录操作日志（ afterCompletion ）
       3. 组件对比与协作
         组件	所属框架	执行顺序	典型用途
         Servlet Filter	Servlet 容器	最早	全局日志、编码转换、CORS 处理
         Spring Security Filter	Spring Security	在 Filter 链中部	认证/授权、CSRF 防护
         Spring Interceptor	Spring MVC	在控制器方法前后	业务级日志、权限补充检查
         @Controller	Spring MVC	最后	核心业务逻辑
       4. 常见问题
         执行顺序冲突：
         Filter 的 @Order 注解或注册顺序决定优先级，Interceptor 通过 addInterceptor 顺序控制。
         重复处理：
         避免在 Filter 和 Interceptor 中重复认证逻辑（如 JWT 校验）。
         静态资源放行：
         在 Security 配置中通过 .antMatchers("/static/**").permitAll() 放行，Interceptor 需排除路径。
       5. 完整示例流程
         代码
         图表
         下载
         View
         Controller
         Interceptor
         SecurityFilter
         Filter
         Client
         View
         Controller
         Interceptor
         SecurityFilter
         Filter
         Client
         HTTP /login
         预处理（如日志）
         认证通过
         权限检查（preHandle）
         返回 welcome.html
         记录日志（afterCompletion）
         通过以上流程和代码示例，可以清晰理解 Spring MVC、拦截器、过滤器与 Spring Security 的协作机制。如果需要进一步调整或扩展功能，请告诉我！
    
    2 个文件

# applicaEvent vs kafka/rabbitmq
    ApplicationEvent is used for in-process event handling within a single application instance, while Kafka and RabbitMQ are messaging systems designed for inter-process communication across distributed systems. ApplicationEvent is synchronous and limited to the application context, whereas Kafka and RabbitMQ support asynchronous messaging, persistence, and scalability across multiple services or applications.
    ApplicationEvent 是 Spring 框架提供的事件机制，而 Kafka 和 RabbitMQ 是消息中间件，它们虽然都涉及“事件/消息”的传递，但在设计目标和使用场景上有显著区别。以下是它们的对比：
    
    1. 核心区别
       特性	Spring ApplicationEvent	Kafka/RabbitMQ
       通信范围	单应用内（JVM 进程内）	跨应用/跨服务（分布式系统）
       可靠性	非持久化（应用重启后事件丢失）	持久化（消息可存储和重放）
       性能	高（内存中直接调用）	依赖网络和中间件性能
       复杂度	简单（无需额外基础设施）	需要搭建和维护消息中间件
       典型场景	应用内部模块解耦	微服务通信、异步任务、流量削峰
       2. 类比说明
          (1) ApplicationEvent （类似“内部广播”）
          场景：用户发表评论后，通知作者、记录日志、更新统计（都在同一个应用中）。
          代码示例：
          Java
          插入
          复制
          新建文件
          保存
          应用代码
          // 发布事件（进程内）
          eventPublisher.publishEvent(new CommentEvent(articleId, content));
    
    // 监听事件
    @EventListener
    public void handleComment(CommentEvent event) { ... }
    (2) Kafka/RabbitMQ（类似“邮局”）
    场景：订单创建后，需要通知库存系统、支付系统、物流系统（跨服务）。
    代码示例：
    Java
    插入
    复制
    新建文件
    保存
    应用代码
    // 发送消息到 Kafka（跨进程）
    kafkaTemplate.send("order-topic", new OrderMessage(orderId));
    
    // 消费消息（另一个服务）
    @KafkaListener(topics = "order-topic")
    public void consumeOrder(OrderMessage message) { ... }
    3. 如何选择？
       用 ApplicationEvent 如果：
    
    所有逻辑在同一个应用内完成。
    不需要持久化或重试机制。
    追求简单和快速开发。
    用 Kafka/RabbitMQ 如果：
    
    需要跨服务通信（如微服务架构）。
    消息需要持久化（如订单处理不能丢失）。
    需要流量削峰或异步任务队列。
    4. 结合使用
       在实际项目中，二者可以互补：
    
    应用内：用 ApplicationEvent 处理轻量级事件（如缓存更新）。
    跨服务：用 Kafka/RabbitMQ 处理核心业务消息（如订单支付）。
    如果需要进一步探讨具体场景或实现细节，请告诉我！
