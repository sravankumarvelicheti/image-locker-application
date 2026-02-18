package com.imagelocker.repository;

import com.imagelocker.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    // ✅ Isolation-safe
    Optional<Image> findByIdAndUser_Id(Long id, Long userId);

    List<Image> findAllByUser_IdOrderByCreatedAtDesc(Long userId);
}
