package com.example.quizweb.controller;

import com.example.quizweb.common.ApiResponse;
import com.example.quizweb.dto.request.LoginRequest;
import com.example.quizweb.dto.request.RegisterRequest;
import com.example.quizweb.dto.response.LoginResponse;
import com.example.quizweb.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.success(null, "Register successful");
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(
                authService.login(request),
                "Login successful"
        );
    }
}