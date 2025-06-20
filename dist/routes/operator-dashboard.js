import { Router } from "express";
import { OperatorDashboardController } from "../controllers/operator-dashboard.controller";
import { authenticateToken } from "../middleware/auth";
const router = Router();
// All operator dashboard routes require authentication
router.use(authenticateToken);
// Operator dashboard data endpoints
router.get("/stats", OperatorDashboardController.getDashboardStats);
router.get("/recent-applications", OperatorDashboardController.getRecentApplications);
router.get("/recent-members", OperatorDashboardController.getRecentMembers);
router.get("/overview", OperatorDashboardController.getDashboardOverview);
export default router;
//# sourceMappingURL=operator-dashboard.js.map