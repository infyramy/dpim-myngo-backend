import { Response } from 'express';
export declare const sendSuccess: (res: Response, data: any, message?: string) => Response<any, Record<string, any>>;
export declare const sendError: (res: Response, status: number, message: string, errors?: any) => Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map