package com.example.quizweb.repository;

import com.example.quizweb.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    // Kiểm tra xem tên player đã tồn tại trong một phòng cụ thể chưa
    boolean existsByRoomIdAndName(Long roomId, String name);
}