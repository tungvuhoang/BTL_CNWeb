package com.example.quizweb.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PlayerResponse {
    private Long playerId;
    private String name;
    private Integer score;
    private LocalDateTime joinedAt;
}