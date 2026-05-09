package com.example.quizweb.repository;

import com.example.quizweb.entity.GameRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRoomRepository extends JpaRepository<GameRoom, Long> {

    // Tìm phòng dựa vào mã PIN (Dùng cho api Join Room)
    Optional<GameRoom> findByPin(String pin);

    // Kiểm tra xem mã PIN đã tồn tại trong DB chưa (Dùng lúc generate PIN)
    boolean existsByPin(String pin);
}