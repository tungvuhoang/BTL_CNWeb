package com.example.quizweb.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // Cho phép preflight request của CORS
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // Auth public
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password"
                        ).permitAll()

                        // Public quiz
                        .requestMatchers("/api/quizzes/public").permitAll()

                        // Public game/player APIs
                        .requestMatchers("/api/game-rooms/join").permitAll()
                        .requestMatchers("/api/game-rooms/*").permitAll()
                        .requestMatchers("/api/game-rooms/*/players").permitAll()
                        .requestMatchers("/api/game-rooms/*/current-question").permitAll()
                        .requestMatchers("/api/game-rooms/*/submit-answer").permitAll()
                        .requestMatchers("/api/game-rooms/*/leaderboard").permitAll()
                        .requestMatchers("/api/game-rooms/*/players/*/answers").permitAll()

                        // Authenticated APIs
                        .requestMatchers("/api/auth/me", "/api/auth/change-password").authenticated()
                        .requestMatchers("/api/quizzes/**").authenticated()
                        .requestMatchers("/api/questions/**").authenticated()
                        .requestMatchers("/api/game-rooms").authenticated()
                        .requestMatchers("/api/game-rooms/*/start").authenticated()
                        .requestMatchers("/api/game-rooms/*/next").authenticated()
                        .requestMatchers("/api/game-rooms/*/end").authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://quiz-arena-ivory.vercel.app",
                "https://quiz-arena-ivarmgkaw-tung-s-projects10.vercel.app"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}