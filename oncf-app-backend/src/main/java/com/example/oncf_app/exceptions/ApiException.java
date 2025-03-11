package com.example.oncf_app.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Getter
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String message;
    private final LocalDateTime timestamp;

    public ApiException(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public static ApiException notFound(String entity, Long id) {
        return new ApiException(
                HttpStatus.NOT_FOUND,
                String.format("%s not found with id: %d", entity, id)
        );
    }

    public static ApiException notFound(String entity, String id) {
        return new ApiException(
                HttpStatus.NOT_FOUND,
                String.format("%s not found with id: %s", entity, id)
        );
    }

    public static ApiException badRequest(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }
}