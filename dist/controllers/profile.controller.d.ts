/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class ProfileController {
    /**
     * Get current user's profile
     */
    static getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update current user's profile
     */
    static updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Upload profile avatar
     */
    static uploadAvatar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update notification preferences
     */
    static updateNotificationPreferences(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=profile.controller.d.ts.map