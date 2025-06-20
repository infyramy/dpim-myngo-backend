"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("../controllers/products.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes for product matching (no auth required)
router.get("/all", products_controller_1.ProductsController.getAllProducts);
router.get("/tags/all-public", products_controller_1.ProductsController.getAllTags);
// Apply authentication middleware to all other routes
router.use(auth_1.authenticateToken);
router.get("/", products_controller_1.ProductsController.getProducts);
// Tags routes (must come before /:id route)
router.get("/tags/all", products_controller_1.ProductsController.getUserTags);
router.get("/:id", products_controller_1.ProductsController.getProductById);
router.post("/", products_controller_1.ProductsController.createProduct);
router.put("/:id", products_controller_1.ProductsController.updateProduct);
router.delete("/:id", products_controller_1.ProductsController.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.js.map