import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message?: string) => {
  return res.json({
    success: true,
    data,
    message,
  });
};

export const sendError = (res: Response, status: number, message: string, errors?: any) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}; 