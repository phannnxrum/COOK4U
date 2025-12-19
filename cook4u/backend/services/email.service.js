import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Cấu hình Brevo SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
    }
});

// Lưu trữ OTP tạm thời (trong production nên dùng Redis)
const otpStore = new Map();

// Tạo mã OTP ngẫu nhiên 6 chữ số
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Lưu OTP với thời gian hết hạn (5 phút)
export const saveOTP = (email, otp) => {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 phút
    otpStore.set(email.toLowerCase(), { otp, expiresAt });
    console.log(`OTP saved for ${email}: ${otp}, expires at: ${new Date(expiresAt).toLocaleTimeString()}`);
};

// Kiểm tra OTP
export const verifyOTP = (email, otp) => {
    const stored = otpStore.get(email.toLowerCase());

    if (!stored) {
        return { valid: false, message: 'Không tìm thấy mã OTP. Vui lòng yêu cầu mã mới.' };
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email.toLowerCase());
        return { valid: false, message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.' };
    }

    if (stored.otp !== otp) {
        return { valid: false, message: 'Mã OTP không đúng.' };
    }

    // OTP hợp lệ - xóa khỏi store
    otpStore.delete(email.toLowerCase());
    return { valid: true, message: 'Xác thực thành công.' };
};

// Gửi email OTP
export const sendOTPEmail = async (email, otp, fullname) => {
    try {
        const mailOptions = {
            from: `"COOK4U" <${process.env.BREVO_SENDER_EMAIL}>`,
            to: email,
            subject: '🔐 Mã xác nhận đặt lại mật khẩu - COOK4U',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🍳 COOK4U</h1>
                                            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Đặt lại mật khẩu</p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <p style="margin: 0 0 20px 0; color: #333; font-size: 16px;">
                                                Xin chào <strong>${fullname || 'bạn'}</strong>,
                                            </p>
                                            <p style="margin: 0 0 30px 0; color: #666; font-size: 15px; line-height: 1.6;">
                                                Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản COOK4U. Sử dụng mã OTP bên dưới để xác nhận:
                                            </p>
                                            
                                            <!-- OTP Box -->
                                            <div style="text-align: center; margin: 30px 0;">
                                                <div style="display: inline-block; background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #f97316; border-radius: 12px; padding: 20px 40px;">
                                                    <span style="font-size: 36px; font-weight: bold; color: #ea580c; letter-spacing: 8px;">${otp}</span>
                                                </div>
                                            </div>
                                            
                                            <p style="margin: 30px 0 0 0; color: #999; font-size: 13px; text-align: center;">
                                                ⏱️ Mã này sẽ hết hạn sau <strong>5 phút</strong>
                                            </p>
                                            
                                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                                            
                                            <p style="margin: 0; color: #999; font-size: 13px; line-height: 1.6;">
                                                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #fafafa; padding: 20px 30px; text-align: center; border-radius: 0 0 16px 16px;">
                                            <p style="margin: 0; color: #999; font-size: 12px;">
                                                © 2024 COOK4U. All rights reserved.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Send email error:', error);
        return { success: false, error: error.message };
    }
};

export default { generateOTP, saveOTP, verifyOTP, sendOTPEmail };
