package com.imagelocker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RenameRequest {
    @NotBlank
    @Size(min = 1, max = 255)
    private String newName;
}
