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


   public static <T> ApiResponse<T> error(String message) {
       ApiResponse<T> response = new ApiResponse<>();
       response.success = false;
       response.result = null;
       response.message = message;
       return response;
   }

   public static <T> ApiResponse<T> success(T result, String message) {
       ApiResponse<T> response = new ApiResponse<>();
       response.success = true;
       response.result = result;
       response.message = message;
       return response;
   }
}
