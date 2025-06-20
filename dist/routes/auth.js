import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth";
const router = Router();
// OTP-based authentication routes
router.post("/send-otp", AuthController.sendOTP);
router.post("/verify-otp", AuthController.verifyOTP);
// Token refresh route
router.post("/refresh-token", AuthController.refreshToken);
// Legacy routes (login now redirects to OTP flow)
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", authenticateToken, AuthController.logout);
export default router;
//# sourceMappingURL=auth.js.map