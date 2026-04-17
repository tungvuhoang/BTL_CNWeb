package com.example.quizweb.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class GameEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishPlayerJoined(Long roomId, Long playerId, String name) {
        // 1. Tạo payload chứa data của player
        Map<String, Object> payload = new HashMap<>();
        payload.put("playerId", playerId);
        payload.put("name", name);

        // 2. Gói vào format chung của toàn bộ Event
        Map<String, Object> event = new HashMap<>();
        event.put("type", "PLAYER_JOINED");
        event.put("roomId", roomId);
        event.put("payload", payload);

        // 3. Broadcast xuống kênh của phòng đó
        String destination = "/topic/rooms/" + roomId + "/players";
        messagingTemplate.convertAndSend(destination, event);
    }
}