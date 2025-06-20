import { Router } from 'express';
import { MembersController } from '../controllers/members.controller';
import { authenticateToken } from '../middleware/auth';
const router = Router();
// All member routes require authentication
router.use(authenticateToken);
// Get all members with filtering and pagination
router.get('/', MembersController.getMembers);
// Get member statistics
router.get('/stats', MembersController.getMemberStats);
// Get member by ID
router.get('/:id', MembersController.getMemberById);
// Suspend a member
router.put('/:id/suspend', MembersController.suspendMember);
// Reactivate a suspended member
router.put('/:id/reactivate', MembersController.reactivateMember);
export default router;
//# sourceMappingURL=members.js.map