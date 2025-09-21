package com.mwu.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

    public static void main(String[] args) {


        SpringApplication.run(BackendApplication.class, args);
//        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!user.dir!!!!!!!!!!!!!!!!!!!!");
//        System.out.println(System.getProperty("user.dir"));
//        System.out.println(System.getProperty("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!user.dir!!!!!!!!!!!!!!!!!!!!"));
    }

}
