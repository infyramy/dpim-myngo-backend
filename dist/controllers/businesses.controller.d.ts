/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class BusinessesController {
    /**
     * Get all businesses
     */
    static getBusinesses(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Create a new business
     */
    static createBusiness(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update an existing business
     */
    static updateBusiness(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete a business (soft delete)
     */
    static deleteBusiness(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get a single business by ID
     */
    static getBusinessById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=businesses.controller.d.ts.map