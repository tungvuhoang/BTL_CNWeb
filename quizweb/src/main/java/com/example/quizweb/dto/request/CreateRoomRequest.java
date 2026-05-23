package com.example.quizweb.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRoomRequest {

    @NotNull(message = "Quiz ID must not be null")
    private Long quizId;
}