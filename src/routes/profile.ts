import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All profile routes require authentication
router.use(authenticateToken);

// Get current user's profile
router.get('/', ProfileController.getProfile);

// Update current user's profile
router.put('/', ProfileController.updateProfile);

// Upload profile avatar
router.post('/avatar', ProfileController.uploadAvatar);

// Update notification preferences
router.put('/notifications', ProfileController.updateNotificationPreferences);

export default router; 