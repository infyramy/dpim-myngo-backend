"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const database_1 = require("../config/database");
const authenticateToken = async (req, res, next) => {
    console.log("🔵 AUTH: Middleware started");
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    if (!accessToken) {
        return (0, response_1.sendError)(res, 401, "Access token required");
    }
    try {
        // Try to verify access token first
        const user = (0, jwt_1.verifyAccessToken)(accessToken);
        console.log("🔵 AUTH: Access token valid, user:", user);
        req.user = user;
        return next();
    }
    catch (accessTokenError) {
        console.log("🔵 AUTH: Access token invalid/expired, checking refresh token");
        // Access token is invalid/expired, try refresh token
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            console.log("🔵 AUTH: No refresh token found");
            return (0, response_1.sendError)(res, 401, "Access token expired and no refresh token provided");
        }
        try {
            // Verify refresh token
            const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
            console.log("🔵 AUTH: Refresh token valid, user:", decoded);
            // Get user details to ensure user still exists and is active
            const user = await (0, database_1.db)("user").where({ user_id: decoded.id }).first();
            if (!user) {
                console.log("🔵 AUTH: User not found in database");
                res.clearCookie("refreshToken");
                return (0, response_1.sendError)(res, 401, "User not found");
            }
            // Check if user is still active/logged in
            if (user.user_logged_in === 0) {
                console.log("🔵 AUTH: User is logged out");
                res.clearCookie("refreshToken");
                return (0, response_1.sendError)(res, 401, "User is logged out");
            }
            // Generate new tokens
            const tokenPayload = {
                id: user.user_id,
                email: user.user_email,
                role: user.user_role || "user",
            };
            const newAccessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
            const newRefreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
            // Set new refresh token as HTTP-only cookie
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            // Set new access token in response header for client to update
            res.setHeader("X-New-Access-Token", newAccessToken);
            console.log("🔵 AUTH: New tokens generated and set");
            // Set user in request
            req.user = tokenPayload;
            return next();
        }
        catch (refreshTokenError) {
            console.log("🔵 AUTH: Refresh token invalid/expired:", refreshTokenError);
            // Both tokens are invalid, clear refresh token cookie
            res.clearCookie("refreshToken");
            return (0, response_1.sendError)(res, 401, "Authentication failed - please login again");
        }
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=auth.js.map