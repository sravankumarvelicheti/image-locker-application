package com.imagelocker.controller;

import com.imagelocker.dto.ImageResponse;
import com.imagelocker.dto.RenameRequest;
import com.imagelocker.security.JwtService;
import com.imagelocker.service.ImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;
    private final JwtService jwtService;

    private Long userIdFromAuthHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing Authorization Bearer token");
        }
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);
        if (userId == null) throw new IllegalArgumentException("Invalid token (missing userId)");
        return userId;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageResponse> upload(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String auth,
            @RequestPart("file") MultipartFile file
    ) throws Exception {
        Long userId = userIdFromAuthHeader(auth);
        return ResponseEntity.ok(imageService.upload(userId, file));
    }
    @PutMapping("/{id}/rename")
    public ResponseEntity<ImageResponse> renamePut(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String auth,
            @PathVariable Long id,
            @Valid @RequestBody RenameRequest req
    ) {
        Long userId = userIdFromAuthHeader(auth);
        return ResponseEntity.ok(imageService.rename(userId, id, req.getNewName()));
    }


    @GetMapping
    public ResponseEntity<List<ImageResponse>> list(@RequestHeader(HttpHeaders.AUTHORIZATION) String auth) {
        Long userId = userIdFromAuthHeader(auth);
        return ResponseEntity.ok(imageService.list(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String auth,
            @PathVariable Long id
    ) {
        Long userId = userIdFromAuthHeader(auth);
        var img = imageService.getForDownload(userId, id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(img.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + img.getOriginalName() + "\"")
                .body(img.getData());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ImageResponse> rename(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String auth,
            @PathVariable Long id,
            @Valid @RequestBody RenameRequest req
    ) {
        Long userId = userIdFromAuthHeader(auth);
        return ResponseEntity.ok(imageService.rename(userId, id, req.getNewName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String auth,
            @PathVariable Long id
    ) {
        Long userId = userIdFromAuthHeader(auth);
        imageService.delete(userId, id);
        return ResponseEntity.ok().body(java.util.Map.of("message", "Deleted"));
    }
}
