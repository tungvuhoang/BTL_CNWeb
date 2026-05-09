package com.example.quizweb.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CurrentQuestionResponse {
    private Long questionId;
    private String content;
    private String answerA;
    private String answerB;
    private String answerC;
    private String answerD;
    private Integer timeLimit;
    private Long timeRemaining; // Thời gian còn lại tính theo giây
    private Integer questionNumber;
    private Integer totalQuestions;
}