package com.example.quizweb.controller;

import com.example.quizweb.common.ApiResponse;
import com.example.quizweb.dto.request.CreateQuizRequest;
import com.example.quizweb.dto.request.UpdateQuizRequest;
import com.example.quizweb.dto.response.CreateQuizResponse;
import com.example.quizweb.dto.response.QuizDetailResponse;
import com.example.quizweb.dto.response.QuizItemResponse;
import com.example.quizweb.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping
    public ApiResponse<CreateQuizResponse> createQuiz(
            @Valid @RequestBody CreateQuizRequest request,
            Authentication authentication
    ) {
        return ApiResponse.success(
                quizService.createQuiz(authentication.getName(), request),
                "Quiz created"
        );
    }

    @GetMapping("/my")
    public ApiResponse<List<QuizItemResponse>> getMyQuizzes(Authentication authentication) {
        return ApiResponse.success(
                quizService.getMyQuizzes(authentication.getName()),
                "Quiz list fetched"
        );
    }

    @GetMapping("/{quizId}")
    public ApiResponse<QuizDetailResponse> getQuizDetail(
            @PathVariable Long quizId,
            Authentication authentication
    ) {
        return ApiResponse.success(
                quizService.getQuizDetail(quizId, authentication.getName()),
                "Quiz detail fetched"
        );
    }

    @PutMapping("/{quizId}")
    public ApiResponse<Object> updateQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody UpdateQuizRequest request,
            Authentication authentication
    ) {
        quizService.updateQuiz(quizId, authentication.getName(), request);
        return ApiResponse.success(null, "Quiz updated");
    }

    @DeleteMapping("/{quizId}")
    public ApiResponse<Object> deleteQuiz(
            @PathVariable Long quizId,
            Authentication authentication
    ) {
        quizService.deleteQuiz(quizId, authentication.getName());
        return ApiResponse.success(null, "Quiz deleted");
    }
}