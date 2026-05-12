package com.example.quizweb.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // Cấu hình endpoint /ws
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // Mở endpoint "/ws" để client kết nối vào
                .setAllowedOriginPatterns("*") // Mở CORS để React app ở port khác có thể kết nối
                .withSockJS(); // Cung cấp fallback SockJS nếu trình duyệt bị chặn WebSockets thuần
    }

    // Cấu hình broker và prefix
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Cấu hình broker /topic để Server push event (broadcast) về cho Client
        registry.enableSimpleBroker("/topic");

        // Cấu hình prefix /app để nhận message từ Client gửi lên (nếu có)
        registry.setApplicationDestinationPrefixes("/app");
    }
}