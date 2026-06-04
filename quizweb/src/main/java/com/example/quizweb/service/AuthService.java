package com.example.quizweb.service;

import com.example.quizweb.config.JwtTokenProvider;
import com.example.quizweb.dto.request.ChangePasswordRequest;
import com.example.quizweb.dto.request.ForgotPasswordRequest;
import com.example.quizweb.dto.request.LoginRequest;
import com.example.quizweb.dto.request.RegisterRequest;
import com.example.quizweb.dto.request.ResetPasswordRequest;
import com.example.quizweb.dto.request.UpdateProfileRequest;
import com.example.quizweb.dto.response.LoginResponse;
import com.example.quizweb.dto.response.UserProfileResponse;
import com.example.quizweb.entity.User;
import com.example.quizweb.exception.ApiException;
import com.example.quizweb.exception.ErrorCode;
import com.example.quizweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ApiException(
                    ErrorCode.AUTH_USERNAME_ALREADY_EXISTS,
                    "Username already exists"
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(
                    ErrorCode.AUTH_USERNAME_ALREADY_EXISTS,
                    "Email already exists"
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .dateOfBirth(request.getDateOfBirth())
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ApiException(
                        ErrorCode.AUTH_INVALID_CREDENTIALS,
                        "Invalid username or password"
                ));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException(
                    ErrorCode.AUTH_INVALID_CREDENTIALS,
                    "Invalid username or password"
            );
        }

        String token = jwtTokenProvider.generateToken(user.getUsername());

        return LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .build();
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(
                        ErrorCode.AUTH_INVALID_CREDENTIALS,
                        "User not found"
                ));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new ApiException(
                    ErrorCode.AUTH_INVALID_CREDENTIALS,
                    "Current password is incorrect"
            );
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public UserProfileResponse getMyProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(
                        ErrorCode.AUTH_INVALID_CREDENTIALS,
                        "User not found"
                ));

        return UserProfileResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }

    @Transactional
    public UserProfileResponse updateMyProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(
                        ErrorCode.AUTH_INVALID_CREDENTIALS,
                        "User not found"
                ));

        if (userRepository.existsByEmailAndUsernameNot(request.getEmail(), username)) {
            throw new ApiException(
                    ErrorCode.AUTH_USERNAME_ALREADY_EXISTS,
                    "Email already exists"
            );
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setDateOfBirth(request.getDateOfBirth());

        userRepository.save(user);

        return UserProfileResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        // Không báo email có tồn tại hay không để tránh lộ thông tin tài khoản
        if (user == null) {
            return;
        }

        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setResetTokenExpiredAt(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        String resetLink = frontendUrl + "/reset-password?token=" + token;

        // Gửi mail async để API không bị treo/timeout
        emailService.sendResetPasswordEmail(
                user.getEmail(),
                user.getFullName(),
                resetLink
        );
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new ApiException(
                        ErrorCode.AUTH_INVALID_CREDENTIALS,
                        "Invalid reset token"
                ));

        if (user.getResetTokenExpiredAt() == null ||
                user.getResetTokenExpiredAt().isBefore(LocalDateTime.now())) {
            throw new ApiException(
                    ErrorCode.AUTH_INVALID_CREDENTIALS,
                    "Reset token expired"
            );
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiredAt(null);

        userRepository.save(user);
    }
}