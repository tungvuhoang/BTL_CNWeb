package com.example.quizweb.controller;

import com.example.quizweb.common.ApiResponse;
import com.example.quizweb.dto.request.CreateRoomRequest;
import com.example.quizweb.dto.request.JoinRoomRequest;
import com.example.quizweb.dto.request.SubmitAnswerRequest;
import com.example.quizweb.dto.response.*;
import com.example.quizweb.service.GameRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game-rooms")
@RequiredArgsConstructor
public class GameRoomController {

    private final GameRoomService gameRoomService;

    @PostMapping
    public ApiResponse<RoomResponse> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        RoomResponse response = gameRoomService.createRoom(request);
        return ApiResponse.success(response, "Room created");
    }

    @PostMapping("/join")
    public ApiResponse<JoinRoomResponse> joinRoom(@Valid @RequestBody JoinRoomRequest request) {
        JoinRoomResponse response = gameRoomService.joinRoom(request);
        return ApiResponse.success(response, "Joined successfully");
    }

    @GetMapping("/{roomId}")
    public ApiResponse<RoomStateResponse> getRoomState(@PathVariable Long roomId) {
        RoomStateResponse response = gameRoomService.getRoomState(roomId);
        return ApiResponse.success(response, "Room state fetched");
    }

    @GetMapping("/{roomId}/players")
    public ApiResponse<List<PlayerResponse>> getPlayersInRoom(@PathVariable Long roomId) {
        List<PlayerResponse> response = gameRoomService.getPlayersInRoom(roomId);
        return ApiResponse.success(response, "Players fetched");
    }

    @PostMapping("/{roomId}/start")
    public ApiResponse<Object> startGame(@PathVariable Long roomId) {
        gameRoomService.startGame(roomId);
        return ApiResponse.success(null, "Game started");
    }

    @PostMapping("/{roomId}/next")
    public ApiResponse<Object> nextQuestion(@PathVariable Long roomId) {
        gameRoomService.nextQuestion(roomId);
        return ApiResponse.success(null, "Next question");
    }

    @PostMapping("/{roomId}/end")
    public ApiResponse<Object> endGame(@PathVariable Long roomId) {
        gameRoomService.endGame(roomId);
        return ApiResponse.success(null, "Game ended");
    }

    @GetMapping("/{roomId}/current-question")
    public ApiResponse<CurrentQuestionResponse> getCurrentQuestion(@PathVariable Long roomId) {
        CurrentQuestionResponse response = gameRoomService.getCurrentQuestion(roomId);
        return ApiResponse.success(response, "Current question fetched");
    }

    @PostMapping("/{roomId}/submit-answer")
    public ApiResponse<SubmitAnswerResponse> submitAnswer(
            @PathVariable Long roomId,
            @Valid @RequestBody SubmitAnswerRequest request) {

        SubmitAnswerResponse response = gameRoomService.submitAnswer(roomId, request);
        return ApiResponse.success(response, "Answer submitted");
    }

    @GetMapping("/{roomId}/leaderboard")
    public ApiResponse<List<LeaderboardEntryResponse>> getLeaderboard(@PathVariable Long roomId) {
        List<LeaderboardEntryResponse> response = gameRoomService.getLeaderboard(roomId);

        // Trả về response kèm message chuẩn theo tài liệu
        return ApiResponse.success(response, "Leaderboard fetched");
    }
}