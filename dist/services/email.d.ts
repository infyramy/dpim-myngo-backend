export declare class EmailService {
    private mailjet;
    constructor();
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
    sendVerificationEmail(email: string, verificationToken: string): Promise<void>;
    sendWelcomeEmail(email: string, name: string): Promise<void>;
    sendOtpEmail(email: string, otp: string): Promise<import("node-mailjet").LibraryResponse<import("node-mailjet/declarations/request/Request").RequestData>>;
}
export declare const emailService: EmailService;
//# sourceMappingURL=email.d.ts.map