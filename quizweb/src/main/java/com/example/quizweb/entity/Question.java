package com.example.quizweb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "answer_a", nullable = false, columnDefinition = "TEXT")
    private String answerA;

    @Column(name = "answer_b", nullable = false, columnDefinition = "TEXT")
    private String answerB;

    @Column(name = "answer_c", nullable = false, columnDefinition = "TEXT")
    private String answerC;

    @Column(name = "answer_d", nullable = false, columnDefinition = "TEXT")
    private String answerD;

    @Enumerated(EnumType.STRING)
    @Column(name = "correct_answer", nullable = false, length = 1)
    private AnswerOption correctAnswer;

    @Column(name = "time_limit", nullable = false)
    private Integer timeLimit;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "question")
    @Builder.Default
    private List<PlayerAnswer> playerAnswers = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}