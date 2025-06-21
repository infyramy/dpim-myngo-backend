import Mailjet from "node-mailjet";

// Email service for backend
export class EmailService {
  private mailjet: Mailjet;

  constructor() {
    // Initialize Mailjet with API credentials from environment variables
    this.mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY || "",
      apiSecret: process.env.MAILJET_SECRET_KEY || "",
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    // TODO: Implement actual email sending (using nodemailer, sendgrid, etc.)
    console.log(
      `Would send password reset email to ${email} with token: ${resetToken}`
    );
    return Promise.resolve();
  }

  async sendVerificationEmail(email: string, verificationToken: string) {
    // TODO: Implement actual email sending
    console.log(
      `Would send verification email to ${email} with token: ${verificationToken}`
    );
    return Promise.resolve();
  }

  async sendWelcomeEmail(email: string, name: string) {
    // TODO: Implement actual email sending
    console.log(`Would send welcome email to ${name} at ${email}`);
    return Promise.resolve();
  }

  async sendOtpEmail(email: string, otp: string) {
    try {
      const fromEmail = process.env.MAILJET_FROM_EMAIL || "noreply@myngo.com";
      const fromName = process.env.MAILJET_FROM_NAME || "myNGO";

      const request = this.mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            To: [
              {
                Email: email,
                Name: "",
              },
            ],
            Subject: "Your OTP Code - myNGO",
            TextPart: `Your OTP code is: ${otp}. This code will expire in 10 minutes. Please do not share this code with anyone.`,
            HTMLPart: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
                    <h1 style="color: #333; margin-bottom: 20px;">myNGO - OTP Verification</h1>
                    <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                      Please use the following OTP code to complete your verification:
                    </p>
                    <div style="background-color: #007bff; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
                      ${otp}
                    </div>
                    <p style="color: #999; font-size: 14px; margin-top: 30px;">
                      This code will expire in 10 minutes. Please do not share this code with anyone.
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                      If you didn't request this code, please ignore this email.
                    </p>
                  </div>
                </div>
              `,
          },
        ],
      });

      const result = await request;
      console.log("Mailjet result status:", result.response.status);
      console.log("Mailjet result statusText:", result.response.statusText);

      console.log(`OTP email sent successfully to ${email}`);
      return result;
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw new Error("Failed to send OTP email");
    }
  }
}

export const emailService = new EmailService();
