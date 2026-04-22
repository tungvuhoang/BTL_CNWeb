package com.example.quizweb.controller;

import com.example.quizweb.common.ApiResponse;
import com.example.quizweb.dto.request.CreateQuestionRequest;
import com.example.quizweb.dto.request.UpdateQuestionRequest;
import com.example.quizweb.dto.response.CreateQuestionResponse;
import com.example.quizweb.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/api/quizzes/{quizId}/questions")
    public ApiResponse<CreateQuestionResponse> addQuestion(
            @PathVariable Long quizId,
            @Valid @RequestBody CreateQuestionRequest request,
            Authentication authentication
    ) {
        return ApiResponse.success(
                questionService.addQuestion(quizId, authentication.getName(), request),
                "Question added"
        );
    }

    @PutMapping("/api/questions/{questionId}")
    public ApiResponse<Object> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody UpdateQuestionRequest request,
            Authentication authentication
    ) {
        questionService.updateQuestion(questionId, authentication.getName(), request);
        return ApiResponse.success(null, "Question updated");
    }

    @DeleteMapping("/api/questions/{questionId}")
    public ApiResponse<Object> deleteQuestion(
            @PathVariable Long questionId,
            Authentication authentication
    ) {
        questionService.deleteQuestion(questionId, authentication.getName());
        return ApiResponse.success(null, "Question deleted");
    }
}