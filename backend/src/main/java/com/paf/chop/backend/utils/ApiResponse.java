package com.paf.chop.backend.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T result;


    public ApiResponse<T> error(String message) {
        this.success = false;
        this.result = null;
        this.message = message;
        return this;
    }

    public ApiResponse<T> success(T result, String message) {
        this.success = true;
        this.result = result;
        this.message = message;
        return this;
    }
}
