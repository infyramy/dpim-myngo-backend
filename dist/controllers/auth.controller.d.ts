/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class AuthController {
    /**
     * Generate a 6-digit OTP code
     */
    private static generateOTP;
    /**
     * Clean expired OTPs from memory
     */
    private static cleanExpiredOTPs;
    /**
     * Send OTP to user's email
     */
    static sendOTP(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Verify OTP and login user
     */
    static verifyOTP(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Legacy login method (kept for backward compatibility)
     * Now redirects to OTP-based flow
     */
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Refresh access token using refresh token
     */
    static refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=auth.controller.d.ts.map