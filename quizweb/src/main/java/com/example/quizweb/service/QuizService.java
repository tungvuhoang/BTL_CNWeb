package com.example.quizweb.service;

import com.example.quizweb.dto.request.CreateQuizRequest;
import com.example.quizweb.dto.request.UpdateQuizRequest;
import com.example.quizweb.dto.response.CreateQuizResponse;
import com.example.quizweb.dto.response.QuestionDetailResponse;
import com.example.quizweb.dto.response.QuizDetailResponse;
import com.example.quizweb.dto.response.QuizItemResponse;
import com.example.quizweb.entity.Question;
import com.example.quizweb.entity.Quiz;
import com.example.quizweb.entity.User;
import com.example.quizweb.exception.ApiException;
import com.example.quizweb.exception.ErrorCode;
import com.example.quizweb.repository.QuizRepository;
import com.example.quizweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    @Transactional
    public CreateQuizResponse createQuiz(String username, CreateQuizRequest request) {
        User host = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(
                        ErrorCode.AUTH_UNAUTHORIZED,
                        "Unauthorized"
                ));

        Quiz quiz = Quiz.builder()
                .host(host)
                .title(request.getTitle())
                .build();

        quizRepository.save(quiz);

        return CreateQuizResponse.builder()
                .quizId(quiz.getId())
                .title(quiz.getTitle())
                .hostId(host.getId())
                .build();
    }

    @Transactional(readOnly = true)
    public List<QuizItemResponse> getMyQuizzes(String username) {
        return quizRepository.findByHostUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(quiz -> QuizItemResponse.builder()
                        .quizId(quiz.getId())
                        .title(quiz.getTitle())
                        .createdAt(quiz.getCreatedAt())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public QuizDetailResponse getQuizDetail(Long quizId, String username) {
        Quiz quiz = quizRepository.findWithQuestionsByIdAndHostUsername(quizId, username)
                .orElseThrow(() -> buildQuizNotFoundOrForbidden(quizId, username));

        return QuizDetailResponse.builder()
                .quizId(quiz.getId())
                .title(quiz.getTitle())
                .hostId(quiz.getHost().getId())
                .createdAt(quiz.getCreatedAt())
                .questions(
                        quiz.getQuestions().stream()
                                .map(this::mapQuestionDetail)
                                .toList()
                )
                .build();
    }

    @Transactional
    public void updateQuiz(Long quizId, String username, UpdateQuizRequest request) {
        Quiz quiz = quizRepository.findByIdAndHostUsername(quizId, username)
                .orElseThrow(() -> buildQuizNotFoundOrForbidden(quizId, username));

        quiz.setTitle(request.getTitle());
    }

    @Transactional
    public void deleteQuiz(Long quizId, String username) {
        Quiz quiz = quizRepository.findByIdAndHostUsername(quizId, username)
                .orElseThrow(() -> buildQuizNotFoundOrForbidden(quizId, username));

        quizRepository.delete(quiz);
    }

    private QuestionDetailResponse mapQuestionDetail(Question question) {
        return QuestionDetailResponse.builder()
                .questionId(question.getId())
                .content(question.getContent())
                .answerA(question.getAnswerA())
                .answerB(question.getAnswerB())
                .answerC(question.getAnswerC())
                .answerD(question.getAnswerD())
                .correctAnswer(question.getCorrectAnswer().name())
                .timeLimit(question.getTimeLimit())
                .build();
    }

    private ApiException buildQuizNotFoundOrForbidden(Long quizId, String username) {
        boolean exists = quizRepository.existsById(quizId);

        if (!exists) {
            return new ApiException(ErrorCode.QUIZ_NOT_FOUND, "Quiz not found");
        }

        return new ApiException(ErrorCode.QUIZ_FORBIDDEN, "You do not have permission to access this quiz");
    }
}