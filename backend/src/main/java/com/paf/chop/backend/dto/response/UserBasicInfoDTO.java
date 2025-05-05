package com.paf.chop.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBasicInfoDTO {
    private Long id;
    private String username;
    private String email;
    private String name;
} 