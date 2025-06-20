/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class AdminDashboardController {
    /**
     * Get overall dashboard statistics for admin
     */
    static getDashboardStats(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get state overview data for admin
     */
    static getStateOverview(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get complete admin dashboard overview (all data in one call)
     */
    static getDashboardOverview(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=admin-dashboard.controller.d.ts.map