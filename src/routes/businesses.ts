import { Router } from "express";
import { BusinessesController } from "../controllers/businesses.controller";
import { authenticateToken } from "../middleware/auth";
import { uploadBusinessImages } from "../middleware/upload";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

router.get("/", BusinessesController.getBusinesses);

router.get("/:id", BusinessesController.getBusinessById);

router.post("/", uploadBusinessImages, BusinessesController.createBusiness);

router.put("/:id", uploadBusinessImages, BusinessesController.updateBusiness);

router.delete("/:id", BusinessesController.deleteBusiness);

export default router;
