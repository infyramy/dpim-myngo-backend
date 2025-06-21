"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// OTP-based authentication routes
router.post("/send-otp", auth_controller_1.AuthController.sendOTP);
router.post("/verify-otp", auth_controller_1.AuthController.verifyOTP);
// Token refresh route
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
// Legacy routes (login now redirects to OTP flow)
router.post("/login", auth_controller_1.AuthController.login);
router.post("/register", auth_controller_1.AuthController.register);
router.post("/logout", auth_1.authenticateToken, auth_controller_1.AuthController.logout);
exports.default = router;
//# sourceMappingURL=auth.js.map