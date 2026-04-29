package com.example.quizweb.repository;

import com.example.quizweb.entity.PlayerAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerAnswerRepository extends JpaRepository<PlayerAnswer, Long> {

    // Kiểm tra xem player này đã trả lời câu hỏi này trong phòng này chưa (Chống nộp đúp)
    boolean existsByRoomIdAndPlayerIdAndQuestionId(Long roomId, Long playerId, Long questionId);
}