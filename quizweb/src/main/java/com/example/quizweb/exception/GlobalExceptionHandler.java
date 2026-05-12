package com.example.quizweb.exception;

import com.example.quizweb.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Object>> handleApiException(ApiException ex) {
        HttpStatus status = mapStatus(ex.getErrorCode());

        return ResponseEntity.status(status)
                .body(ApiResponse.error(ex.getMessage(), ex.getErrorCode().name()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(message, ErrorCode.VALIDATION_ERROR.name()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Internal server error", ErrorCode.INTERNAL_SERVER_ERROR.name()));
    }

    private HttpStatus mapStatus(ErrorCode errorCode) {
        return switch (errorCode) {
            case AUTH_USERNAME_ALREADY_EXISTS,
                 INVALID_QUESTION_DATA,
                 ROOM_ALREADY_FINISHED,
                 ROOM_NOT_PLAYING,
                 ROOM_ALREADY_STARTED,
                 ROOM_INVALID_STATUS,
                 PLAYER_NAME_ALREADY_EXISTS,
                 ANSWER_ALREADY_SUBMITTED,
                 QUESTION_NOT_CURRENT,
                 QUESTION_TIME_EXPIRED,
                 GAME_ALREADY_FINISHED,
                 VALIDATION_ERROR -> HttpStatus.BAD_REQUEST;

            case AUTH_UNAUTHORIZED,
                 AUTH_INVALID_CREDENTIALS -> HttpStatus.UNAUTHORIZED;

            case AUTH_FORBIDDEN,
                 QUIZ_FORBIDDEN,
                 PLAYER_NOT_IN_ROOM -> HttpStatus.FORBIDDEN;

            case QUIZ_NOT_FOUND,
                 QUESTION_NOT_FOUND,
                 ROOM_NOT_FOUND,
                 PLAYER_NOT_FOUND,
                 GAME_NOT_STARTED -> HttpStatus.NOT_FOUND;

            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }
}