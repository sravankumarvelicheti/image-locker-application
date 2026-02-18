package com.imagelocker.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ImageResponse {
    private Long id;
    private String originalName;
    private String contentType;
    private Long sizeBytes;
    private LocalDateTime createdAt;
}
