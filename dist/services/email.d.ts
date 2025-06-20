export declare class EmailService {
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
    sendVerificationEmail(email: string, verificationToken: string): Promise<void>;
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendOtpEmail(email: string, otp: string): Promise<void>;
}
export declare const emailService: EmailService;
//# sourceMappingURL=email.d.ts.map