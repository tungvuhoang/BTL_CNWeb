package com.example.quizweb.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendResetPasswordEmail(
            String to,
            String fullName,
            String resetLink
    ) {
        try {
            log.info("Start sending reset password email to {}", to);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Reset your Web Quiz password");
            message.setText(
                    "Xin chào " + fullName + ",\n\n" +
                            "Bạn vừa yêu cầu đặt lại mật khẩu.\n" +
                            "Bấm vào link sau để đổi mật khẩu:\n" +
                            resetLink + "\n\n" +
                            "Link này có hiệu lực trong 30 phút.\n\n" +
                            "Nếu bạn không yêu cầu, hãy bỏ qua email này."
            );

            mailSender.send(message);

            log.info("Reset password email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send reset password email to {}", to, e);
        }
    }
}