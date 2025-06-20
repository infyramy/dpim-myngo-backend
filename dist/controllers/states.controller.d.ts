/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class StatesController {
    /**
     * Get all states
     */
    static getStates(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all states with admin information
     */
    static getStatesWithAdmins(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Assign admin to a state
     */
    static assignAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update admin information
     */
    static updateAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Remove admin from a state
     */
    static removeAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=states.controller.d.ts.map