/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class DashboardController {
    /**
     * Get dashboard overview data for authenticated user
     */
    static getDashboardData(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user activity summary
     */
    static getActivitySummary(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map