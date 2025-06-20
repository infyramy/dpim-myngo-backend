export interface JWTPayload {
    id: number;
    email: string;
    role: string;
}
export declare const generateAccessToken: (payload: JWTPayload) => string;
export declare const generateRefreshToken: (payload: JWTPayload) => string;
export declare const verifyAccessToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => JWTPayload;
//# sourceMappingURL=jwt.d.ts.map