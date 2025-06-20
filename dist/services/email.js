// Email service for backend
export class EmailService {
    async sendPasswordResetEmail(email, resetToken) {
        // TODO: Implement actual email sending (using nodemailer, sendgrid, etc.)
        console.log(`Would send password reset email to ${email} with token: ${resetToken}`);
        return Promise.resolve();
    }
    async sendVerificationEmail(email, verificationToken) {
        // TODO: Implement actual email sending
        console.log(`Would send verification email to ${email} with token: ${verificationToken}`);
        return Promise.resolve();
    }
    async sendWelcomeEmail(email, name) {
        // TODO: Implement actual email sending
        console.log(`Would send welcome email to ${name} at ${email}`);
        return Promise.resolve();
    }
    async sendOtpEmail(email, otp) {
        // TODO: Implement actual email sending
        console.log(`Would send OTP email to ${email} with OTP: ${otp}`);
        return Promise.resolve();
    }
}
export const emailService = new EmailService();
//# sourceMappingURL=email.js.map