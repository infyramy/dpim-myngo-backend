/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class ApplicationsController {
    /**
     * Send OTP to user's email
     */
    static getApplications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static approveApplication(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static rejectApplication(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=applications.controller.d.ts.map