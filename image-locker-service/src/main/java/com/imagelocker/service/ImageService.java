package com.imagelocker.service;

import com.imagelocker.dto.ImageResponse;
import com.imagelocker.entity.Image;
import com.imagelocker.entity.User;
import com.imagelocker.repository.ImageRepository;
import com.imagelocker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageRepository imageRepository;
    private final UserRepository userRepository;

    public ImageResponse upload(Long userId, MultipartFile file) throws Exception {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        String ct = file.getContentType();
        if (ct == null || !(ct.equals("image/jpeg")
                || ct.equals("image/png")
                || ct.equals("image/webp"))) {
            throw new IllegalArgumentException("Only JPEG, PNG, WEBP allowed");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 🔹 REQUIRED because DB column stored_name is NOT NULL
        String storedName = UUID.randomUUID().toString();

        Image img = Image.builder()
                .user(user)
                .originalName(file.getOriginalFilename() == null
                        ? "image"
                        : file.getOriginalFilename())
                .storedName(storedName)   // ✅ FIXED
                .contentType(ct)
                .sizeBytes(file.getSize())
                .data(file.getBytes())
                .build();

        Image saved = imageRepository.save(img);

        return ImageResponse.builder()
                .id(saved.getId())
                .originalName(saved.getOriginalName())
                .contentType(saved.getContentType())
                .sizeBytes(saved.getSizeBytes())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public List<ImageResponse> list(Long userId) {
        return imageRepository.findAllByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(i -> ImageResponse.builder()
                        .id(i.getId())
                        .originalName(i.getOriginalName())
                        .contentType(i.getContentType())
                        .sizeBytes(i.getSizeBytes())
                        .createdAt(i.getCreatedAt())
                        .build())
                .toList();
    }

    public Image getForDownload(Long userId, Long imageId) {
        return imageRepository.findByIdAndUser_Id(imageId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
    }

    public void delete(Long userId, Long imageId) {
        Image img = imageRepository.findByIdAndUser_Id(imageId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
        imageRepository.delete(img);
    }

    public ImageResponse rename(Long userId, Long imageId, String newName) {

        if (newName == null || newName.isBlank()) {
            throw new IllegalArgumentException("newName is required");
        }

        Image img = imageRepository.findByIdAndUser_Id(imageId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));

        img.setOriginalName(newName.trim());

        Image saved = imageRepository.save(img);

        return ImageResponse.builder()
                .id(saved.getId())
                .originalName(saved.getOriginalName())
                .contentType(saved.getContentType())
                .sizeBytes(saved.getSizeBytes())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}
