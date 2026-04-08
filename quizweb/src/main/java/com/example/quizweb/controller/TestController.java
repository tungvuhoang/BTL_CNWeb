package com.example.quizweb.controller;

import com.example.quizweb.common.ApiResponse;
import com.example.quizweb.exception.ApiException;
import com.example.quizweb.exception.ErrorCode;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/test-ok")
    public ApiResponse<?> testOk() {
        return ApiResponse.success(Map.of("name", "quizweb"), "Test success");
    }

    @GetMapping("/test-error")
    public ApiResponse<?> testError() {
        throw new ApiException(ErrorCode.QUIZ_NOT_FOUND, "Quiz not found");
    }
}