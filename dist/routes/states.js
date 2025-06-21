"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const states_controller_1 = require("../controllers/states.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public route - get basic states list
router.get("/", states_controller_1.StatesController.getStates);
// Admin routes - require authentication
router.use("/admin", auth_1.authenticateToken);
// Get states with admin information
router.get("/admin", states_controller_1.StatesController.getStatesWithAdmins);
// Assign admin to a state
router.post("/admin/assign", states_controller_1.StatesController.assignAdmin);
// Update admin information
router.put("/admin/:stateId", states_controller_1.StatesController.updateAdmin);
// Remove admin from a state
router.delete("/admin/:stateId", states_controller_1.StatesController.removeAdmin);
exports.default = router;
//# sourceMappingURL=states.js.map