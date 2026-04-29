package com.example.quizweb.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeaderboardEntryResponse {
    private Long playerId;
    private String name;
    private Integer score;
}