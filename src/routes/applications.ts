import { Router } from "express";
import { ApplicationsController } from "../controllers/applications.controller";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

// OTP-based authentication routes
router.get("/", ApplicationsController.getApplications);

router.post("/approve", ApplicationsController.approveApplication);
router.post("/reject", ApplicationsController.rejectApplication);

export default router;
