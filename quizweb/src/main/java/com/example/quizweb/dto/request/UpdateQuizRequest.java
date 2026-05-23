package com.example.quizweb.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateQuizRequest {

    @NotBlank(message = "Title must not be blank")
    private String title;
}