package com.example.quizweb.service;

import com.example.quizweb.dto.request.CreateRoomRequest;
import com.example.quizweb.dto.request.JoinRoomRequest;
import com.example.quizweb.dto.response.*;
import com.example.quizweb.entity.*;
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

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.List;

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

    @Transactional(readOnly = true)
    public RoomStateResponse getRoomState(Long roomId) {
        // 1. Tìm phòng
        GameRoom room = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND, "Room not found"));

        // 2. Tính toán chính xác tổng số câu và số người chơi
        int totalQuestions = room.getQuiz().getQuestions().size();
        int playerCount = room.getPlayers().size();

        // 3. Trả về format chuẩn
        return RoomStateResponse.builder()
                .roomId(room.getId())
                .quizId(room.getQuiz().getId())
                .pin(room.getPin())
                .status(room.getStatus())
                .currentQuestionIndex(room.getCurrentQuestionIndex())
                .totalQuestions(totalQuestions)
                .playerCount(playerCount)
                .build();
    }

    @Transactional(readOnly = true)
    public List<PlayerResponse> getPlayersInRoom(Long roomId) {
        // 1. Tìm phòng
        GameRoom room = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND, "Room not found"));

        // 2. Map từ Entity Player sang PlayerResponse DTO
        return room.getPlayers().stream()
                .map(player -> PlayerResponse.builder()
                        .playerId(player.getId())
                        .name(player.getName())
                        .score(player.getScore())
                        .joinedAt(player.getJoinedAt())
                        .build())
                .toList();
    }

    @Transactional
    public void startGame(Long roomId) {
        // 1. Kiểm tra phòng có tồn tại không
        GameRoom room = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND, "Room not found"));

        // 2. Validate quyền của Host đang đăng nhập
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!room.getQuiz().getHost().getUsername().equals(currentUsername)) {
            throw new ApiException(ErrorCode.QUIZ_FORBIDDEN, "You don't have permission to manage this room");
        }

        // 3. Validate trạng thái phòng (chỉ được start khi đang WAITING)
//        if (room.getStatus() != RoomStatus.WAITING) {
//            throw new ApiException(ErrorCode.ROOM_ALREADY_STARTED, "Room has already started or finished");
//        }

        // 4. Validate quiz phải có ít nhất 1 câu hỏi
        List<Question> questions = room.getQuiz().getQuestions();
        if (questions.isEmpty()) {
            throw new ApiException(ErrorCode.VALIDATION_ERROR, "Quiz must have at least 1 question to start");
        }

        // 5. Cập nhật trạng thái vòng đời game
        LocalDateTime now = LocalDateTime.now();
        room.setStatus(RoomStatus.PLAYING);
        room.setCurrentQuestionIndex(0);
        room.setStartedAt(now);
        room.setQuestionStartedAt(now);

        // 6. Broadcast events cho các client đang subscribe
        gameEventPublisher.publishGameStarted(room.getId(), 0, now);

        Question firstQuestion = questions.get(0);
        gameEventPublisher.publishQuestionChanged(room.getId(), firstQuestion, 1, questions.size(), now);
    }

    @Transactional
    public void nextQuestion(Long roomId) {
        // 1. Tìm phòng và check quyền Host
        GameRoom room = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND, "Room not found"));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!room.getQuiz().getHost().getUsername().equals(currentUsername)) {
            throw new ApiException(ErrorCode.QUIZ_FORBIDDEN, "You don't have permission to manage this room");
        }

        // 2. Validate trạng thái (Chỉ được Next khi room đang PLAYING)
        if (room.getStatus() == RoomStatus.WAITING) {
            throw new ApiException(ErrorCode.GAME_NOT_STARTED, "Game has not started yet");
        }

        if (room.getStatus() == RoomStatus.FINISHED) {
            throw new ApiException(ErrorCode.GAME_ALREADY_FINISHED, "Game has already finished");
        }

        // 3. Logic chuyển câu
        List<Question> questions = room.getQuiz().getQuestions();
        int nextIndex = room.getCurrentQuestionIndex() + 1;
        LocalDateTime now = LocalDateTime.now();

        if (nextIndex < questions.size()) {
            // Trường hợp vẫn còn câu hỏi tiếp theo
            room.setCurrentQuestionIndex(nextIndex);
            room.setQuestionStartedAt(now); // Cập nhật lại thời gian bắt đầu câu mới

            Question nextQuestion = questions.get(nextIndex);
            gameEventPublisher.publishQuestionChanged(room.getId(), nextQuestion, nextIndex + 1, questions.size(), now);
        } else {
            // Trường hợp đã hết câu hỏi -> Tự động End Game
            room.setStatus(RoomStatus.FINISHED);
            room.setEndedAt(now);
            gameEventPublisher.publishGameEnded(room.getId(), now);
        }
    }

    @Transactional
    public void endGame(Long roomId) {
        // 1. Tìm phòng và check quyền Host
        GameRoom room = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND, "Room not found"));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!room.getQuiz().getHost().getUsername().equals(currentUsername)) {
            throw new ApiException(ErrorCode.QUIZ_FORBIDDEN, "You don't have permission to manage this room");
        }

        // Nếu đã End rồi thì thông báo (End game chủ động khi đã End game bị động)
        if (room.getStatus() == RoomStatus.FINISHED) {
            throw new ApiException(ErrorCode.ROOM_ALREADY_FINISHED, "Game has already ended");
        }

        // 2. End Game chủ động
        LocalDateTime now = LocalDateTime.now();
        room.setStatus(RoomStatus.FINISHED);
        room.setEndedAt(now);
        gameEventPublisher.publishGameEnded(room.getId(), now);
    }

    @Transactional(readOnly = true)
    public CurrentQuestionResponse getCurrentQuestion(Long roomId) {
        // 1. Tìm phòng và kiểm tra sự tồn tại
        GameRoom room = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND, "Room not found"));

        // 2. Kiểm tra trạng thái phòng, phải đang PLAYING mới có câu hỏi hiện tại
        if (room.getStatus() == RoomStatus.WAITING) {
            throw new ApiException(ErrorCode.GAME_NOT_STARTED, "Game has not started yet");
        }

        if (room.getStatus() == RoomStatus.FINISHED) {
            throw new ApiException(ErrorCode.GAME_ALREADY_FINISHED, "Game has already finished");
        }

        // 3. Lấy danh sách câu hỏi và vị trí hiện tại
        List<Question> questions = room.getQuiz().getQuestions();
        int currentIndex = room.getCurrentQuestionIndex();

        if (currentIndex < 0 || currentIndex >= questions.size()) {
            throw new ApiException(ErrorCode.QUESTION_NOT_FOUND, "Current question not found");
        }

        Question currentQuestion = questions.get(currentIndex);

        // 4. Tính toán thời gian còn lại (timeRemaining)
        // Phục vụ client F5 hoặc bị văng, FE cần gọi API để tiếp tục hiển thị countdown đúng
        // Công thức: timeRemaining = timeLimit - (currentTime - questionStartedAt)
        long secondsElapsed = Duration.between(room.getQuestionStartedAt(), LocalDateTime.now()).getSeconds();
        long timeRemaining = Math.max(0, currentQuestion.getTimeLimit() - secondsElapsed); // Min là 0, khỏi đưa số âm đỡ phải validate

        // 5. Trả về DTO (không chứa correctAnswer)
        return CurrentQuestionResponse.builder()
                .questionId(currentQuestion.getId())
                .content(currentQuestion.getContent())
                .answerA(currentQuestion.getAnswerA())
                .answerB(currentQuestion.getAnswerB())
                .answerC(currentQuestion.getAnswerC())
                .answerD(currentQuestion.getAnswerD())
                .timeLimit(currentQuestion.getTimeLimit())
                .timeRemaining(timeRemaining)
                .questionNumber(currentIndex + 1)
                .totalQuestions(questions.size())
                .build();
    }
}