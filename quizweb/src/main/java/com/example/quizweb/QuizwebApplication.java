package com.example.quizweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class QuizwebApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuizwebApplication.class, args);
    }

}
