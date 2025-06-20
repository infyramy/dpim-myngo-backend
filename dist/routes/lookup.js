"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lookup_controller_1 = require("../controllers/lookup.controller");
const router = (0, express_1.Router)();
// OTP-based authentication routes
router.get("/", lookup_controller_1.LookupController.getLookup);
exports.default = router;
//# sourceMappingURL=lookup.js.map