package com.mwu.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
@EnableScheduling
public class SchedulerConfig {
// define a ThreadPoolTaskScheduler bean to manage scheduled tasks
    // spring boot default is single thread, which may cause blocking if a task takes too long
    // this bean allows multiple scheduled tasks to run concurrently
    @Bean
    public ThreadPoolTaskScheduler threadPoolTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(10); // Set the pool size as needed
        scheduler.setThreadNamePrefix("scheduledTask-");
        return scheduler;
    }
}
