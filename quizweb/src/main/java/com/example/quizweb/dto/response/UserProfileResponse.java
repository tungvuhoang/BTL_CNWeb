package com.example.quizweb.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class UserProfileResponse {
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
}