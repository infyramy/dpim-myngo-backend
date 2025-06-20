import { Router } from "express";
import { BusinessesController } from "../controllers/businesses.controller";
import { authenticateToken } from "../middleware/auth";
const router = Router();
// Apply authentication middleware to all routes
router.use(authenticateToken);
router.get("/", BusinessesController.getBusinesses);
router.get("/:id", BusinessesController.getBusinessById);
router.post("/", BusinessesController.createBusiness);
router.put("/:id", BusinessesController.updateBusiness);
router.delete("/:id", BusinessesController.deleteBusiness);
export default router;
//# sourceMappingURL=businesses.js.map