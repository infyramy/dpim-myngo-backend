"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const database_1 = require("../config/database");
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const email_1 = require("../services/email");
// In-memory OTP storage (use Redis in production)
const otpStorage = new Map();
class AuthController {
    /**
     * Generate a 6-digit OTP code
     */
    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    /**
     * Clean expired OTPs from memory
     */
    static cleanExpiredOTPs() {
        const now = Date.now();
        for (const [email, otpData] of otpStorage.entries()) {
            if (otpData.expiresAt < now) {
                otpStorage.delete(email);
            }
        }
    }
    /**
     * Send OTP to user's email
     */
    static async sendOTP(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return (0, response_1.sendError)(res, 400, "Email is required");
            }
            // Check if user exists
            const user = await (0, database_1.db)("user")
                .where({ user_email: email, user_status: 1 })
                .first();
            if (!user) {
                return (0, response_1.sendError)(res, 404, "No account found with this email address");
            }
            // Clean expired OTPs
            AuthController.cleanExpiredOTPs();
            // Generate OTP
            const otpCode = AuthController.generateOTP();
            const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now
            // Store OTP in memory
            otpStorage.set(email.toLowerCase(), {
                code: otpCode,
                expiresAt,
                used: false,
            });
            // Send OTP email
            await email_1.emailService.sendOtpEmail(email, otpCode);
            // Email sent successfully (no error handling needed for basic implementation)
            return (0, response_1.sendSuccess)(res, { message: "OTP sent successfully" }, "Verification code sent to your email");
        }
        catch (error) {
            console.error("Send OTP error:", error);
            return (0, response_1.sendError)(res, 500, "Internal server error");
        }
    }
    /**
     * Verify OTP and login user
     */
    static async verifyOTP(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return (0, response_1.sendError)(res, 400, "Email and OTP are required");
            }
            // Clean expired OTPs
            AuthController.cleanExpiredOTPs();
            // Check OTP in memory
            const otpData = otpStorage.get(email.toLowerCase());
            console.log("OTP Data: ", otpData);
            if (!otpData) {
                return (0, response_1.sendError)(res, 401, "No OTP found for this email. Please request a new code.");
            }
            if (otpData.used) {
                return (0, response_1.sendError)(res, 401, "OTP has already been used");
            }
            if (otpData.expiresAt < Date.now()) {
                otpStorage.delete(email.toLowerCase());
                return (0, response_1.sendError)(res, 401, "OTP has expired. Please request a new code.");
            }
            if (otpData.code !== otp) {
                return (0, response_1.sendError)(res, 401, "Invalid OTP code");
            }
            // Mark OTP as used
            otpData.used = true;
            // Get user details
            const user = await (0, database_1.db)("user").where({ user_email: email }).first();
            if (!user) {
                return (0, response_1.sendError)(res, 404, "User not found");
            }
            let operatorStates = null;
            // IF role is "operator" then need to get operator states
            if (user.user_role === "operator") {
                operatorStates = await (0, database_1.db)("states")
                    .where({ state_code: user.user_state })
                    .select("state_title", "state_code", "state_flag")
                    .first();
            }
            // Generate tokens
            const tokenPayload = {
                id: user.user_id,
                email: user.user_email,
                role: user.user_role || "user",
                // is_operator: user.user_is_operator || false,
            };
            const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
            const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
            // Update last login if the column exists
            try {
                await (0, database_1.db)("user")
                    .where({ user_id: user.user_id })
                    .update({ user_logged_in: 1, user_last_logged_in: new Date() });
            }
            catch (error) {
                // Column might not exist, that's okay
            }
            // Set refresh token as HTTP-only cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            // Return user data and access token
            const { password: _, ...userWithoutPassword } = user;
            // Clean up used OTP
            otpStorage.delete(email.toLowerCase());
            return (0, response_1.sendSuccess)(res, {
                user: userWithoutPassword,
                operator_states: operatorStates,
                access_token: accessToken,
            }, "Login successful");
        }
        catch (error) {
            console.error("Verify OTP error:", error);
            return (0, response_1.sendError)(res, 500, "Internal server error");
        }
    }
    /**
     * Legacy login method (kept for backward compatibility)
     * Now redirects to OTP-based flow
     */
    static async login(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return (0, response_1.sendError)(res, 400, "Email is required");
            }
            // Instead of password login, trigger OTP flow
            return AuthController.sendOTP(req, res);
        }
        catch (error) {
            console.error("Login error:", error);
            return (0, response_1.sendError)(res, 500, "Internal server error");
        }
    }
    static async register(req, res) {
        try {
            console.log("Body: ", req.body);
            const { state, email, mykadNumber, fullName, mobilePhone, gender, spouseName, dateOfBirth, residentialAddress, spouseMobilePhone, postcode, city, socialMedia, } = req.body;
            // Validate required fields
            if (!email ||
                !mykadNumber ||
                !fullName ||
                !mobilePhone ||
                !gender ||
                !residentialAddress ||
                !postcode ||
                !city ||
                !state) {
                return (0, response_1.sendError)(res, 400, "Please fill in all required fields");
            }
            // Check if user exists
            const existingUser = await (0, database_1.db)("user")
                .where({ user_email: email, user_status: 1 })
                .first();
            if (existingUser) {
                return (0, response_1.sendError)(res, 409, "User already exists with this email");
            }
            // Check if MyKad number already exists
            const existingMykad = await (0, database_1.db)("user")
                .where({ user_mykad_number: mykadNumber })
                .first();
            if (existingMykad) {
                return (0, response_1.sendError)(res, 409, "User already exists with this MyKad number");
            }
            // Prepare user data for insertion
            const userData = {
                user_email: email,
                user_mykad_number: mykadNumber,
                user_fullname: fullName,
                user_mobile_number: mobilePhone,
                user_gender: gender,
                user_date_of_birth: dateOfBirth
                    ? new Date(dateOfBirth).toISOString().split("T")[0]
                    : null,
                user_residential_address: residentialAddress,
                user_postcode: postcode,
                user_city: city,
                user_state: state,
                user_role: "user",
                user_logged_in: 0,
                user_created_at: new Date(),
                user_status: 2,
                // Optional fields
                user_spouse_name: spouseName || null,
                user_spouse_mobile_phone: spouseMobilePhone || null,
                user_social_media: socialMedia ? JSON.stringify(socialMedia) : null,
            };
            // Create user
            const [user] = await (0, database_1.db)("user")
                .insert(userData)
                .returning([
                "user_id",
                "user_email",
                "user_full_name",
                "user_mobile_phone",
                "user_role",
                "user_state",
                "user_city",
            ]);
            return (0, response_1.sendSuccess)(res, { user }, "User registered successfully");
        }
        catch (error) {
            console.error("Register error:", error);
            return (0, response_1.sendError)(res, 500, "Internal server error");
        }
    }
    /**
     * Refresh access token using refresh token
     */
    static async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return (0, response_1.sendError)(res, 401, "Refresh token not provided");
            }
            try {
                // Verify refresh token
                const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
                // Get user details to ensure user still exists
                const user = await (0, database_1.db)("user").where({ user_id: decoded.id }).first();
                if (!user) {
                    return (0, response_1.sendError)(res, 401, "User not found");
                }
                // Generate new access token
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
                return (0, response_1.sendSuccess)(res, {
                    access_token: newAccessToken,
                }, "Token refreshed successfully");
            }
            catch (error) {
                // Refresh token is invalid or expired
                res.clearCookie("refreshToken");
                return (0, response_1.sendError)(res, 401, "Invalid or expired refresh token");
            }
        }
        catch (error) {
            console.error("Refresh token error:", error);
            return (0, response_1.sendError)(res, 500, "Internal server error");
        }
    }
    static async logout(req, res) {
        try {
            // Get user ID from authenticated token
            const userId = req.user?.id;
            console.log("🔵 LOGOUT: User ID: ", userId);
            if (userId) {
                // Update user's logged in status
                try {
                    await (0, database_1.db)("user")
                        .where({ user_id: userId })
                        .update({ user_logged_in: 0 });
                }
                catch (error) {
                    // Column might not exist, that's okay
                    console.warn("Failed to update user logged in status:", error);
                }
            }
            res.clearCookie("refreshToken");
            return (0, response_1.sendSuccess)(res, {}, "Logged out successfully");
        }
        catch (error) {
            return (0, response_1.sendError)(res, 500, "Internal server error");
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map