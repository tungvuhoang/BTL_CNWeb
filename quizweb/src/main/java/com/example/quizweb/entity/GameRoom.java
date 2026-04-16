package com.example.quizweb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "game_rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "pin", nullable = false, unique = true, length = 20)
    private String pin;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RoomStatus status;

    @Column(name = "current_question_index", nullable = false)
    private Integer currentQuestionIndex;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(name = "question_started_at")
    private LocalDateTime questionStartedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "room")
    @Builder.Default
    private List<Player> players = new ArrayList<>();

    @OneToMany(mappedBy = "room")
    @Builder.Default
    private List<PlayerAnswer> playerAnswers = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = RoomStatus.WAITING;
        }
        if (currentQuestionIndex == null) {
            currentQuestionIndex = -1;
        }
    }
}