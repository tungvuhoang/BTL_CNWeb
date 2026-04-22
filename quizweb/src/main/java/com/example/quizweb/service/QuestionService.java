package com.example.quizweb.service;

import com.example.quizweb.dto.request.CreateQuestionRequest;
import com.example.quizweb.dto.request.UpdateQuestionRequest;
import com.example.quizweb.dto.response.CreateQuestionResponse;
import com.example.quizweb.entity.AnswerOption;
import com.example.quizweb.entity.Question;
import com.example.quizweb.entity.Quiz;
import com.example.quizweb.exception.ApiException;
import com.example.quizweb.exception.ErrorCode;
import com.example.quizweb.repository.QuestionRepository;
import com.example.quizweb.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    @Transactional
    public CreateQuestionResponse addQuestion(Long quizId, String username, CreateQuestionRequest request) {
        Quiz quiz = quizRepository.findByIdAndHostUsername(quizId, username)
                .orElseThrow(() -> buildQuizNotFoundOrForbidden(quizId, username));

        AnswerOption correctAnswer = parseAnswerOption(request.getCorrectAnswer());

        Question question = Question.builder()
                .quiz(quiz)
                .content(request.getContent())
                .answerA(request.getAnswerA())
                .answerB(request.getAnswerB())
                .answerC(request.getAnswerC())
                .answerD(request.getAnswerD())
                .correctAnswer(correctAnswer)
                .timeLimit(request.getTimeLimit())
                .build();

        questionRepository.save(question);

        return CreateQuestionResponse.builder()
                .questionId(question.getId())
                .build();
    }

    @Transactional
    public void updateQuestion(Long questionId, String username, UpdateQuestionRequest request) {
        Question question = questionRepository.findByIdAndQuizHostUsername(questionId, username)
                .orElseThrow(() -> buildQuestionNotFoundOrForbidden(questionId, username));

        AnswerOption correctAnswer = parseAnswerOption(request.getCorrectAnswer());

        question.setContent(request.getContent());
        question.setAnswerA(request.getAnswerA());
        question.setAnswerB(request.getAnswerB());
        question.setAnswerC(request.getAnswerC());
        question.setAnswerD(request.getAnswerD());
        question.setCorrectAnswer(correctAnswer);
        question.setTimeLimit(request.getTimeLimit());
    }

    @Transactional
    public void deleteQuestion(Long questionId, String username) {
        Question question = questionRepository.findByIdAndQuizHostUsername(questionId, username)
                .orElseThrow(() -> buildQuestionNotFoundOrForbidden(questionId, username));

        questionRepository.delete(question);
    }

    private AnswerOption parseAnswerOption(String value) {
        try {
            return AnswerOption.valueOf(value.trim().toUpperCase());
        } catch (Exception ex) {
            throw new ApiException(
                    ErrorCode.INVALID_QUESTION_DATA,
                    "Correct answer must be one of A, B, C, D"
            );
        }
    }

    private ApiException buildQuizNotFoundOrForbidden(Long quizId, String username) {
        boolean exists = quizRepository.existsById(quizId);

        if (!exists) {
            return new ApiException(ErrorCode.QUIZ_NOT_FOUND, "Quiz not found");
        }

        return new ApiException(ErrorCode.QUIZ_FORBIDDEN, "You do not have permission to access this quiz");
    }

    private ApiException buildQuestionNotFoundOrForbidden(Long questionId, String username) {
        boolean exists = questionRepository.existsById(questionId);

        if (!exists) {
            return new ApiException(ErrorCode.QUESTION_NOT_FOUND, "Question not found");
        }

        return new ApiException(ErrorCode.QUIZ_FORBIDDEN, "You do not have permission to access this question");
    }
}