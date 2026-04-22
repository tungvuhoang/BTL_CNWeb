package com.example.quizweb.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class QuizDetailResponse {
    private Long quizId;
    private String title;
    private Long hostId;
    private LocalDateTime createdAt;
    private List<QuestionDetailResponse> questions;
}