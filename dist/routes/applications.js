"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applications_controller_1 = require("../controllers/applications.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
// OTP-based authentication routes
router.get("/", applications_controller_1.ApplicationsController.getApplications);
router.post("/approve", applications_controller_1.ApplicationsController.approveApplication);
router.post("/reject", applications_controller_1.ApplicationsController.rejectApplication);
exports.default = router;
//# sourceMappingURL=applications.js.map