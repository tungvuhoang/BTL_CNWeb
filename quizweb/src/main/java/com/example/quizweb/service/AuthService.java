package com.example.quizweb.service;

import com.example.quizweb.config.JwtTokenProvider;
import com.example.quizweb.dto.request.LoginRequest;
import com.example.quizweb.dto.request.RegisterRequest;
import com.example.quizweb.dto.response.LoginResponse;
import com.example.quizweb.entity.User;
import com.example.quizweb.exception.ApiException;
import com.example.quizweb.exception.ErrorCode;
import com.example.quizweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ApiException(
                    ErrorCode.AUTH_USERNAME_ALREADY_EXISTS,
                    "Username already exists"
            );
        }

        User user = User.builder()
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
}