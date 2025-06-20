"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All profile routes require authentication
router.use(auth_1.authenticateToken);
// Get current user's profile
router.get('/', profile_controller_1.ProfileController.getProfile);
// Update current user's profile
router.put('/', profile_controller_1.ProfileController.updateProfile);
// Upload profile avatar
router.post('/avatar', profile_controller_1.ProfileController.uploadAvatar);
// Update notification preferences
router.put('/notifications', profile_controller_1.ProfileController.updateNotificationPreferences);
exports.default = router;
//# sourceMappingURL=profile.js.map