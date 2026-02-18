package com.imagelocker.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthUtil {

    private final JwtService jwtService;

    public Long currentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalStateException("Unauthenticated");
        }

        // auth.getName() == email (subject)
        // But we want userId from token: easiest is to read header in controller,
        // OR store userId in SecurityContext (advanced).
        // We'll implement a cleaner approach in controller by reading Authorization header.
        throw new UnsupportedOperationException("Use controller header-based userId extraction (below).");
    }
}
