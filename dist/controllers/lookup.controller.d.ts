/// <reference types="cookie-parser" />
import { Request, Response } from "express";
export declare class LookupController {
    /**
     * Send OTP to user's email
     */
    static getLookup(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=lookup.controller.d.ts.map