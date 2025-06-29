import { Router } from "express";
import { StatesController } from "../controllers/states.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public route - get basic states list
router.get("/", StatesController.getStates);

// Admin routes - require authentication
router.use("/admin", authenticateToken);

// Get states with admin information
router.get("/admin", StatesController.getStatesWithAdmins);

// Get available users for a specific state
router.get("/admin/:stateId/users", StatesController.getAvailableUsersForState);

// Assign admin to a state
router.post("/admin/assign", StatesController.assignAdmin);

// Update admin information
router.put("/admin/:stateId", StatesController.updateAdmin);

// Remove admin from a state
router.delete("/admin/:stateId/:userId", StatesController.removeAdmin);

export default router;
