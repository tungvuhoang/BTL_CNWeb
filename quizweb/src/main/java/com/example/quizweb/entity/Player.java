package com.example.quizweb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "players",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_room_name", columnNames = {"room_id", "name"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private GameRoom room;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "session_id", length = 255)
    private String sessionId;

    @Column(name = "is_connected", nullable = false)
    private Boolean isConnected;

    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;

    @OneToMany(mappedBy = "player")
    @Builder.Default
    private List<PlayerAnswer> playerAnswers = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (score == null) {
            score = 0;
        }
        if (isConnected == null) {
            isConnected = true;
        }
        if (joinedAt == null) {
            joinedAt = LocalDateTime.now();
        }
    }
}