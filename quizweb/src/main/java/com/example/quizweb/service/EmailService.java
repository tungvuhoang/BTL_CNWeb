package com.example.quizweb.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final Resend resend;

    @Value("${resend.from-email}")
    private String fromEmail;

    public EmailService(
            @Value("${resend.api-key}") String resendApiKey
    ) {
        this.resend = new Resend(resendApiKey);
    }

    @Async
    public void sendResetPasswordEmail(
            String to,
            String fullName,
            String resetLink
    ) {
        try {
            log.info("Start sending reset password email via Resend to {}", to);

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(to)
                    .subject("Reset your Web Quiz password")
                    .html(
                            "<p>Xin chào " + safe(fullName) + ",</p>" +
                                    "<p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>" +
                                    "<p>Bấm vào link sau để đổi mật khẩu:</p>" +
                                    "<p><a href=\"" + resetLink + "\">Đặt lại mật khẩu</a></p>" +
                                    "<p>Hoặc copy link này:</p>" +
                                    "<p>" + resetLink + "</p>" +
                                    "<p>Link này có hiệu lực trong 30 phút.</p>" +
                                    "<p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>"
                    )
                    .build();

            CreateEmailResponse response = resend.emails().send(params);

            log.info("Reset password email sent via Resend to {}. Email id: {}", to, response.getId());
        } catch (Exception e) {
            log.error("Failed to send reset password email via Resend to {}", to, e);
        }
    }

    private String safe(String value) {
        if (value == null || value.isBlank()) {
            return "bạn";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}