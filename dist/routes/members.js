"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const members_controller_1 = require("../controllers/members.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All member routes require authentication
router.use(auth_1.authenticateToken);
// Get all members with filtering and pagination
router.get('/', members_controller_1.MembersController.getMembers);
// Get member statistics
router.get('/stats', members_controller_1.MembersController.getMemberStats);
// Get member by ID
router.get('/:id', members_controller_1.MembersController.getMemberById);
// Suspend a member
router.put('/:id/suspend', members_controller_1.MembersController.suspendMember);
// Reactivate a suspended member
router.put('/:id/reactivate', members_controller_1.MembersController.reactivateMember);
exports.default = router;
//# sourceMappingURL=members.js.map