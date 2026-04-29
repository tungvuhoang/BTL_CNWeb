package com.example.quizweb.dto.request;

import com.example.quizweb.entity.AnswerOption;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitAnswerRequest {

    @NotNull(message = "Player ID must not be null")
    private Long playerId;

    @NotNull(message = "Question ID must not be null")
    private Long questionId;

    @NotNull(message = "Selected answer must not be null")
    private AnswerOption selectedAnswer; // Khớp với enum AnswerOption (A, B, C, D)
}