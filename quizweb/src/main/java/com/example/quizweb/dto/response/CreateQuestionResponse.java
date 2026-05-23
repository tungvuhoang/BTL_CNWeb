package com.example.quizweb.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateQuestionResponse {
    private Long questionId;
}