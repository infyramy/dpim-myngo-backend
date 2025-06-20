"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All dashboard routes require authentication
router.use(auth_1.authenticateToken);
// Dashboard data endpoints
router.get("/", dashboard_controller_1.DashboardController.getDashboardData);
router.get("/activity", dashboard_controller_1.DashboardController.getActivitySummary);
exports.default = router;
//# sourceMappingURL=dashboard.js.map