package com.verification.system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(
            RuntimeException exception
    ) {

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "success",
                false
        );

        response.put(
                "message",
                exception.getMessage()
        );

        return ResponseEntity
                .status(
                        HttpStatus.BAD_REQUEST
                )
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(
            Exception exception
    ) {

        exception.printStackTrace();

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "success",
                false
        );

        response.put(
                "message",
                exception.getMessage() == null
                        ? "Internal server error"
                        : exception.getMessage()
        );

        return ResponseEntity
                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(response);
    }
}