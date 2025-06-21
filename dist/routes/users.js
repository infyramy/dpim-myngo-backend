"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const response_1 = require("../utils/response");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken); // All user routes require authentication
router.get('/', async (_req, res) => {
    try {
        const users = await (0, database_1.db)('users')
            .select(['id', 'name', 'email', 'role'])
            .orderBy('id', 'desc');
        return (0, response_1.sendSuccess)(res, users);
    }
    catch (error) {
        console.error('Get users error:', error);
        return (0, response_1.sendError)(res, 500, 'Internal server error');
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await (0, database_1.db)('users')
            .where({ id })
            .select(['id', 'name', 'email', 'role'])
            .first();
        if (!user) {
            return (0, response_1.sendError)(res, 404, 'User not found');
        }
        return (0, response_1.sendSuccess)(res, user);
    }
    catch (error) {
        console.error('Get user error:', error);
        return (0, response_1.sendError)(res, 500, 'Internal server error');
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map