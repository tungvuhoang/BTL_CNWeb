package com.example.quizweb.dto.response;

import com.example.quizweb.entity.RoomStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomStateResponse {
    private Long roomId;
    private Long quizId;
    private String pin;
    private RoomStatus status;
    private Integer currentQuestionIndex;
    private Integer totalQuestions;
    private Integer playerCount;
}