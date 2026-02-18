package com.imagelocker.service;

import com.imagelocker.dto.*;
import com.imagelocker.entity.User;
import com.imagelocker.repository.UserRepository;
import com.imagelocker.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${app.jwt.expiration-minutes}")
    private long expirationMinutes;

    public AuthResponse signup(SignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .email(req.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .build();

        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getId(), saved.getEmail(), expirationMinutes);
        return new AuthResponse(token, saved.getId(), saved.getEmail());
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        String token = jwtService.generateToken(user.getId(), user.getEmail(), expirationMinutes);
        return new AuthResponse(token, user.getId(), user.getEmail());
    }
}
