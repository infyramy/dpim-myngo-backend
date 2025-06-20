import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All dashboard routes require authentication
router.use(authenticateToken);

// Dashboard data endpoints
router.get("/", DashboardController.getDashboardData);
router.get("/activity", DashboardController.getActivitySummary);

export default router; 