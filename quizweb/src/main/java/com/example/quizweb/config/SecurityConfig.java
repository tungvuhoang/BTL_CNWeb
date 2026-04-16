package com.example.quizweb.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // public auth APIs
                        .requestMatchers("/api/auth/**").permitAll()

                        // public player APIs theo spec
                        .requestMatchers("/api/game-rooms/join").permitAll()
                        .requestMatchers("/api/game-rooms/*").permitAll()
                        .requestMatchers("/api/game-rooms/*/players").permitAll()
                        .requestMatchers("/api/game-rooms/*/current-question").permitAll()
                        .requestMatchers("/api/game-rooms/*/submit-answer").permitAll()
                        .requestMatchers("/api/game-rooms/*/leaderboard").permitAll()
                        .requestMatchers("/api/game-rooms/*/players/*/answers").permitAll()

                        // host protected APIs
                        .requestMatchers("/api/quizzes/**").authenticated()
                        .requestMatchers("/api/questions/**").authenticated()
                        .requestMatchers("/api/game-rooms").authenticated()
                        .requestMatchers("/api/game-rooms/*/start").authenticated()
                        .requestMatchers("/api/game-rooms/*/next").authenticated()
                        .requestMatchers("/api/game-rooms/*/end").authenticated()

                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}