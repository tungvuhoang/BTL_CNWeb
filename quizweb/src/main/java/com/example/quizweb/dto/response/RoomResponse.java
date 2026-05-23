package com.example.quizweb.dto.response;

import com.example.quizweb.entity.RoomStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RoomResponse {
    private Long roomId;
    private Long quizId;
    private String pin;
    private RoomStatus status;
    private Integer currentQuestionIndex;
    private LocalDateTime createdAt;
}