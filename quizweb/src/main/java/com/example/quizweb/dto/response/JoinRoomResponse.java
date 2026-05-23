package com.example.quizweb.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JoinRoomResponse {
    private Long roomId;
    private Long playerId;
    private String name;
    private Integer score;
}