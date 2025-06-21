"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const operator_dashboard_controller_1 = require("../controllers/operator-dashboard.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All operator dashboard routes require authentication
router.use(auth_1.authenticateToken);
// Operator dashboard data endpoints
router.get("/stats", operator_dashboard_controller_1.OperatorDashboardController.getDashboardStats);
router.get("/recent-applications", operator_dashboard_controller_1.OperatorDashboardController.getRecentApplications);
router.get("/recent-members", operator_dashboard_controller_1.OperatorDashboardController.getRecentMembers);
router.get("/overview", operator_dashboard_controller_1.OperatorDashboardController.getDashboardOverview);
exports.default = router;
//# sourceMappingURL=operator-dashboard.js.map