/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class OperatorDashboardController {
    /**
     * Get dashboard statistics for operator
     */
    static getDashboardStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get recent applications for operator's state
     */
    static getRecentApplications(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get recent members for operator's state
     */
    static getRecentMembers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get complete dashboard overview (all data in one call)
     */
    static getDashboardOverview(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=operator-dashboard.controller.d.ts.map