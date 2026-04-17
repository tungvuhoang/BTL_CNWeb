package com.example.quizweb.service;

import com.example.quizweb.dto.request.CreateRoomRequest;
import com.example.quizweb.dto.request.JoinRoomRequest;
import com.example.quizweb.dto.response.JoinRoomResponse;
import com.example.quizweb.dto.response.RoomResponse;
import com.example.quizweb.entity.GameRoom;
import com.example.quizweb.entity.Player;
import com.example.quizweb.entity.Quiz;
import com.example.quizweb.entity.RoomStatus;
import com.example.quizweb.exception.ApiException;
import com.example.quizweb.exception.ErrorCode;
import com.example.quizweb.repository.GameRoomRepository;
import com.example.quizweb.repository.PlayerRepository;
import com.example.quizweb.repository.QuizRepository;
import com.example.quizweb.websocket.GameEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class GameRoomService {

    private final GameRoomRepository gameRoomRepository;
    private final QuizRepository quizRepository;
    private final PlayerRepository playerRepository;
    private final GameEventPublisher gameEventPublisher;

    @Transactional
    public RoomResponse createRoom(CreateRoomRequest request) {
        // 1. Lấy username của Host đang đăng nhập từ Security Context
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Tìm Quiz theo ID
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new ApiException(ErrorCode.QUIZ_NOT_FOUND, "Quiz not found"));

        // 3. Kiểm tra xem Quiz này có đúng là của Host đang đăng nhập tạo không
        if (!quiz.getHost().getUsername().equals(currentUsername)) {
            throw new ApiException(ErrorCode.QUIZ_FORBIDDEN, "You don't have permission to use this quiz");
        }

        // 4. Generate PIN duy nhất
        String pin = generateUniquePin();

        // 5. Tạo và lưu GameRoom. Trạng thái WAITING và Index -1 đã được set tự động bằng @PrePersist trong entity
        GameRoom room = GameRoom.builder()
                .quiz(quiz)
                .pin(pin)
                .build();

        GameRoom savedRoom = gameRoomRepository.save(room);

        // 6. Trả về kết quả
        return RoomResponse.builder()
                .roomId(savedRoom.getId())
                .quizId(quiz.getId())
                .pin(savedRoom.getPin())
                .status(savedRoom.getStatus())
                .currentQuestionIndex(savedRoom.getCurrentQuestionIndex())
                .createdAt(savedRoom.getCreatedAt())
                .build();
    }

    // Thuật toán sinh mã PIN 6 số ngẫu nhiên
    private String generateUniquePin() {
        Random random = new Random();
        String pin;
        boolean exists;
        do {
            // Sinh số ngẫu nhiên từ 100000 đến 999999
            int pinNumber = 100000 + random.nextInt(900000);
            pin = String.valueOf(pinNumber);
            exists = gameRoomRepository.existsByPin(pin);
        } while (exists); // Nếu PIN đã có trong DB thì sinh lại

        return pin;
    }

    @Transactional
    public JoinRoomResponse joinRoom(JoinRoomRequest request) {
        // 1. Kiểm tra mã PIN có tồn tại không
        GameRoom room = gameRoomRepository.findByPin(request.getPin())
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND, "Room not found"));

        // 2. Validate trạng thái phòng (Không cho join nếu phòng đã FINISHED)
        if (room.getStatus() == RoomStatus.FINISHED) {
            throw new ApiException(ErrorCode.ROOM_ALREADY_FINISHED, "This room has already finished");
        }

        // 3. Validate tên người chơi không được trùng trong cùng một phòng
        if (playerRepository.existsByRoomIdAndName(room.getId(), request.getName())) {
            throw new ApiException(ErrorCode.PLAYER_NAME_ALREADY_EXISTS, "Name already taken in this room. Please choose another name.");
        }

        // 4. Tạo Player mới và lưu vào DB
        Player player = Player.builder()
                .room(room)
                .name(request.getName())
                .score(0)
                .isConnected(true)
                .build();

        Player savedPlayer = playerRepository.save(player);

        // 5. Gọi bộ phát sự kiện WebSocket để báo cho Host và người chơi khác
        gameEventPublisher.publishPlayerJoined(room.getId(), savedPlayer.getId(), savedPlayer.getName());

        // 6. Trả kết quả về cho người chơi vừa join
        return JoinRoomResponse.builder()
                .roomId(room.getId())
                .playerId(savedPlayer.getId())
                .name(savedPlayer.getName())
                .score(savedPlayer.getScore())
                .build();
    }
}