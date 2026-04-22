package com.example.quizweb.repository;

import com.example.quizweb.entity.Quiz;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByHostUsernameOrderByCreatedAtDesc(String username);

    Optional<Quiz> findByIdAndHostUsername(Long id, String username);

    @EntityGraph(attributePaths = {"questions"})
    Optional<Quiz> findWithQuestionsByIdAndHostUsername(Long id, String username);
}