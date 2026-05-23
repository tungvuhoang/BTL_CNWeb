package com.example.quizweb.controller;

import com.example.quizweb.common.ApiResponse;
import com.example.quizweb.dto.request.*;
import com.example.quizweb.dto.response.LoginResponse;
import com.example.quizweb.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import com.example.quizweb.dto.response.UserProfileResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

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

    @PutMapping("/change-password")
    public ApiResponse<Object> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        authService.changePassword(authentication.getName(), request);
        return ApiResponse.success(null, "Password changed successfully");
    }

    @GetMapping("/me")
    public ApiResponse<UserProfileResponse> getMyProfile(Authentication authentication) {
        return ApiResponse.success(
                authService.getMyProfile(authentication.getName()),
                "Profile fetched"
        );
    }

    @PutMapping("/me")
    public ApiResponse<UserProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        return ApiResponse.success(
                authService.updateMyProfile(authentication.getName(), request),
                "Profile updated"
        );
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Object> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        authService.forgotPassword(request);
        return ApiResponse.success(null, "Reset password email sent");
    }

    @PostMapping("/reset-password")
    public ApiResponse<Object> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(request);
        return ApiResponse.success(null, "Password reset successfully");
    }
}