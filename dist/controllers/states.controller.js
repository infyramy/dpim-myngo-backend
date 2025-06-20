import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";
export class StatesController {
    /**
     * Get all states
     */
    static async getStates(_req, res) {
        try {
            const states = await db("states")
                .select("state_title as title", "state_code as code", "state_flag as flag")
                .where("state_status", 1);
            return sendSuccess(res, { states }, "States fetched successfully");
        }
        catch (error) {
            console.error("States error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Get all states with admin information
     */
    static async getStatesWithAdmins(_req, res) {
        try {
            const states = await db("states")
                .select("states.state_id as id", "states.state_title as name", "states.state_code as code", "states.state_flag as flag", "states.state_status as isActive", "operator.op_user_id as adminId", "user.user_fullname as adminName", "user.user_email as adminEmail")
                .leftJoin("operator", "operator.op_states_id", "states.state_id")
                .leftJoin("user", "user.user_id", "operator.op_user_id")
                .where("states.state_status", 1)
                .orderBy("states.state_title");
            return sendSuccess(res, { states }, "States with admins fetched successfully");
        }
        catch (error) {
            console.error("States with admins error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Assign admin to a state
     */
    static async assignAdmin(req, res) {
        try {
            const { stateId, adminName, adminEmail } = req.body;
            if (!stateId || !adminName || !adminEmail) {
                return sendError(res, 400, "State ID, admin name, and email are required");
            }
            // Check if state exists
            const state = await db("states").where("state_id", stateId).first();
            if (!state) {
                return sendError(res, 404, "State not found");
            }
            // Check if email already exists
            const existingUser = await db("user")
                .where("user_email", adminEmail)
                .first();
            if (existingUser) {
                return sendError(res, 400, "Email already exists");
            }
            // Start transaction
            const trx = await db.transaction();
            try {
                // Create new user with admin role
                const [userId] = await trx("user").insert({
                    user_fullname: adminName,
                    user_email: adminEmail,
                    user_role: "operator",
                    user_state: state.state_code,
                    user_status: 1,
                    user_created_at: new Date(),
                    user_modified_at: new Date(),
                });
                // Check if operator already exists for this state
                const existingOperator = await trx("operator")
                    .where("op_states_id", stateId)
                    .first();
                if (existingOperator) {
                    // Update existing operator
                    await trx("operator").where("op_states_id", stateId).update({
                        op_user_id: userId,
                        op_modified_at: new Date(),
                    });
                }
                else {
                    // Create new operator record
                    await trx("operator").insert({
                        op_user_id: userId,
                        op_states_id: stateId,
                        op_created_at: new Date(),
                        op_modified_at: new Date(),
                    });
                }
                await trx.commit();
                return sendSuccess(res, { userId }, "Admin assigned successfully");
            }
            catch (error) {
                await trx.rollback();
                throw error;
            }
        }
        catch (error) {
            console.error("Assign admin error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Update admin information
     */
    static async updateAdmin(req, res) {
        try {
            const { stateId } = req.params;
            const { adminName, adminEmail } = req.body;
            if (!adminName || !adminEmail) {
                return sendError(res, 400, "Admin name and email are required");
            }
            // Get current operator for this state
            const operator = await db("operator")
                .where("op_states_id", stateId)
                .first();
            if (!operator) {
                return sendError(res, 404, "No admin found for this state");
            }
            // Check if email already exists (excluding current user)
            const existingUser = await db("user")
                .where("user_email", adminEmail)
                .where("user_id", "!=", operator.op_user_id)
                .first();
            if (existingUser) {
                return sendError(res, 400, "Email already exists");
            }
            // Update user information
            await db("user").where("user_id", operator.op_user_id).update({
                user_fullname: adminName,
                user_email: adminEmail,
                user_modified_at: new Date(),
            });
            return sendSuccess(res, {}, "Admin updated successfully");
        }
        catch (error) {
            console.error("Update admin error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Remove admin from a state
     */
    static async removeAdmin(req, res) {
        try {
            const { stateId } = req.params;
            // Get current operator for this state
            const operator = await db("operator")
                .where("op_states_id", stateId)
                .first();
            if (!operator) {
                return sendError(res, 404, "No admin found for this state");
            }
            // Start transaction
            const trx = await db.transaction();
            try {
                // Delete operator record
                await trx("operator").where("op_states_id", stateId).del();
                // Delete user record
                await trx("user").where("user_id", operator.op_user_id).del();
                await trx.commit();
                return sendSuccess(res, {}, "Admin removed successfully");
            }
            catch (error) {
                await trx.rollback();
                throw error;
            }
        }
        catch (error) {
            console.error("Remove admin error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
}
//# sourceMappingURL=states.controller.js.map