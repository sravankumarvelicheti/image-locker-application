package com.imagelocker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:5173",  // local dev (vite)
                                "http://localhost:4173",
                                "http://10.0.0.23:4173",//Staging UI
                                "http://10.0.0.23:4174", // prod UI
                                "http://fromvs.com",
                                "http://www.fromvs.com",
                                "http://10.0.0.23:4174" // prod UI
                                // docker preview (vite preview)
                        )
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(false);
            }
        };
    }
}