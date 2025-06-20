import { Router } from "express";
import { AdminDashboardController } from "../controllers/admin-dashboard.controller";
import { authenticateToken } from "../middleware/auth";
const router = Router();
// All admin dashboard routes require authentication
router.use(authenticateToken);
// Admin dashboard data endpoints
router.get("/stats", AdminDashboardController.getDashboardStats);
router.get("/state-overview", AdminDashboardController.getStateOverview);
router.get("/overview", AdminDashboardController.getDashboardOverview);
export default router;
//# sourceMappingURL=admin-dashboard.js.map