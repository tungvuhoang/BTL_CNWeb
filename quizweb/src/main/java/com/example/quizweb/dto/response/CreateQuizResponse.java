package com.example.quizweb.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateQuizResponse {
    private Long quizId;
    private String title;
    private Long hostId;
}