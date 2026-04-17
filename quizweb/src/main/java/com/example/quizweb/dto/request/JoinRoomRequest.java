package com.example.quizweb.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRoomRequest {

    @NotBlank(message = "PIN must not be blank")
    private String pin;

    @NotBlank(message = "Name must not be blank")
    private String name;
}