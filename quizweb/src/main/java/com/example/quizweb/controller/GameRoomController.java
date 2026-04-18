package com.example.quizweb.controller;

import com.example.quizweb.common.ApiResponse;
import com.example.quizweb.dto.request.CreateRoomRequest;
import com.example.quizweb.dto.request.JoinRoomRequest;
import com.example.quizweb.dto.response.JoinRoomResponse;
import com.example.quizweb.dto.response.PlayerResponse;
import com.example.quizweb.dto.response.RoomResponse;
import com.example.quizweb.dto.response.RoomStateResponse;
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
}