/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class MembersController {
    /**
     * Get all members with filtering and search
     */
    static getMembers(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get member by ID with detailed information
     */
    static getMemberById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Suspend a member
     */
    static suspendMember(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Reactivate a suspended member
     */
    static reactivateMember(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get member statistics
     */
    static getMemberStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=members.controller.d.ts.map