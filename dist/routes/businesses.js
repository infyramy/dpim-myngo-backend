"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const businesses_controller_1 = require("../controllers/businesses.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
router.get("/", businesses_controller_1.BusinessesController.getBusinesses);
router.get("/:id", businesses_controller_1.BusinessesController.getBusinessById);
router.post("/", businesses_controller_1.BusinessesController.createBusiness);
router.put("/:id", businesses_controller_1.BusinessesController.updateBusiness);
router.delete("/:id", businesses_controller_1.BusinessesController.deleteBusiness);
exports.default = router;
//# sourceMappingURL=businesses.js.map