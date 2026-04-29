package com.example.quizweb.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SubmitAnswerResponse {
    private Boolean isCorrect;
    private Integer pointsEarned;
    private Integer totalScore;
}