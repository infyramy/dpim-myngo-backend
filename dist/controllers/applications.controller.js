"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsController = void 0;
const database_1 = require("../config/database");
const response_1 = require("../utils/response");
class ApplicationsController {
    /**
     * Send OTP to user's email
     */
    static async getApplications(req, res) {
        try {
            // Get states code from operator user
            const operatorState = await (0, database_1.db)("operator")
                .select("states.state_code as code")
                .leftJoin("states", "states.state_id", "operator.op_states_id")
                .where("op_user_id", req.user?.id)
                .first();
            const applications = await (0, database_1.db)("user")
                .select("user_id as id", "user_fullname as fullname", "user_email as email", "user_mykad_number as mykad_number", "user_residential_address as address", "user_postcode as postcode", "user_city as city", "user_mobile_number as phone", "user_created_at as apply_at", "user_status as status")
                .where("user_status", 2)
                .where("user_state", operatorState.code);
            // map status
            applications.forEach((application) => {
                application.address = `${application.address}, ${application.postcode}, ${application.city}`;
                application.status = application.status === 2 ? "pending" : "approved";
            });
            return (0, response_1.sendSuccess)(res, { applications }, "Applications fetched successfully");
        }
        catch (error) {
            console.error("Businesses error:", error);
            return (0, response_1.sendError)(res, 500, "Internal server error");
        }
    }
    static async approveApplication(req, res) {
        try {
            const { id } = req.body;
            // update user status to 1
            await (0, database_1.db)("user").where("user_id", id).update({
                user_status: 1,
                user_approved_at: new Date(),
                user_approved_by: req.user?.id,
            });
            return (0, response_1.sendSuccess)(res, null, "Application approved successfully");
        }
        catch (error) {
            console.error("Applications error:", error);
            return (0, response_1.sendError)(res, 500, "Internal server error");
        }
    }
    static async rejectApplication(req, res) {
        try {
            const { id, reason } = req.body;
            // update user status to 3
            await (0, database_1.db)("user").where("user_id", id).update({
                user_status: 3,
                user_rejected_at: new Date(),
                user_rejected_by: req.user?.id,
                user_rejected_reason: reason,
            });
            return (0, response_1.sendSuccess)(res, null, "Application rejected successfully");
        }
        catch (error) {
            console.error("Applications error:", error);
            return (0, response_1.sendError)(res, 500, "Internal server error");
        }
    }
}
exports.ApplicationsController = ApplicationsController;
//# sourceMappingURL=applications.controller.js.map