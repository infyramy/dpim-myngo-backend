import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';
const router = Router();
router.use(authenticateToken); // All user routes require authentication
router.get('/', async (_req, res) => {
    try {
        const users = await db('users')
            .select(['id', 'name', 'email', 'role'])
            .orderBy('id', 'desc');
        return sendSuccess(res, users);
    }
    catch (error) {
        console.error('Get users error:', error);
        return sendError(res, 500, 'Internal server error');
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db('users')
            .where({ id })
            .select(['id', 'name', 'email', 'role'])
            .first();
        if (!user) {
            return sendError(res, 404, 'User not found');
        }
        return sendSuccess(res, user);
    }
    catch (error) {
        console.error('Get user error:', error);
        return sendError(res, 500, 'Internal server error');
    }
});
export default router;
//# sourceMappingURL=users.js.map