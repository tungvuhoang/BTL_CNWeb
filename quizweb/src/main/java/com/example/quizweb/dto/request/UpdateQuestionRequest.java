package com.example.quizweb.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateQuestionRequest {

    @NotBlank(message = "Content must not be blank")
    private String content;

    @NotBlank(message = "Answer A must not be blank")
    private String answerA;

    @NotBlank(message = "Answer B must not be blank")
    private String answerB;

    @NotBlank(message = "Answer C must not be blank")
    private String answerC;

    @NotBlank(message = "Answer D must not be blank")
    private String answerD;

    @NotBlank(message = "Correct answer must not be blank")
    private String correctAnswer;

    @Min(value = 1, message = "Time limit must be greater than 0")
    private Integer timeLimit;
}