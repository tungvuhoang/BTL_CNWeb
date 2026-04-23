package com.example.quizweb.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import com.example.quizweb.entity.Question;
import java.time.LocalDateTime;

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

    public void publishGameStarted(Long roomId, Integer currentQuestionIndex, LocalDateTime questionStartedAt) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("currentQuestionIndex", currentQuestionIndex);
        payload.put("questionStartedAt", questionStartedAt);
        payload.put("serverTime", LocalDateTime.now());

        Map<String, Object> event = new HashMap<>();
        event.put("type", "GAME_STARTED");
        event.put("roomId", roomId);
        event.put("payload", payload);

        messagingTemplate.convertAndSend("/topic/rooms/" + roomId, event);
    }

    public void publishQuestionChanged(Long roomId, Question question, int questionNumber, int totalQuestions, LocalDateTime questionStartedAt) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("questionId", question.getId());
        payload.put("content", question.getContent());
        payload.put("answerA", question.getAnswerA());
        payload.put("answerB", question.getAnswerB());
        payload.put("answerC", question.getAnswerC());
        payload.put("answerD", question.getAnswerD());
        payload.put("timeLimit", question.getTimeLimit());
        payload.put("questionNumber", questionNumber);
        payload.put("totalQuestions", totalQuestions);
        payload.put("questionStartedAt", questionStartedAt);
        payload.put("serverTime", LocalDateTime.now());

        Map<String, Object> event = new HashMap<>();
        event.put("type", "QUESTION_CHANGED");
        event.put("roomId", roomId);
        event.put("payload", payload);

        messagingTemplate.convertAndSend("/topic/rooms/" + roomId + "/question", event);
    }

    public void publishGameEnded(Long roomId, LocalDateTime endedAt) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("endedAt", endedAt);

        Map<String, Object> event = new HashMap<>();
        event.put("type", "GAME_ENDED");
        event.put("roomId", roomId);
        event.put("payload", payload);

        messagingTemplate.convertAndSend("/topic/rooms/" + roomId, event);
    }
}