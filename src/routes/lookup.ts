import { Router } from "express";
import { LookupController } from "../controllers/lookup.controller";

const router = Router();

// OTP-based authentication routes
router.get("/", LookupController.getLookup);

export default router;
