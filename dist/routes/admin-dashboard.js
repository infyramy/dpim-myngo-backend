"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_dashboard_controller_1 = require("../controllers/admin-dashboard.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All admin dashboard routes require authentication
router.use(auth_1.authenticateToken);
// Admin dashboard data endpoints
router.get("/stats", admin_dashboard_controller_1.AdminDashboardController.getDashboardStats);
router.get("/state-overview", admin_dashboard_controller_1.AdminDashboardController.getStateOverview);
router.get("/overview", admin_dashboard_controller_1.AdminDashboardController.getDashboardOverview);
exports.default = router;
//# sourceMappingURL=admin-dashboard.js.map