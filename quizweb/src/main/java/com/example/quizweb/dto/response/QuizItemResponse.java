package com.example.quizweb.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class QuizItemResponse {
    private Long quizId;
    private String title;
    private LocalDateTime createdAt;
}