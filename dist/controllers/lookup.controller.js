"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupController = void 0;
const database_1 = require("../config/database");
const response_1 = require("../utils/response");
class LookupController {
    /**
     * Send OTP to user's email
     */
    static async getLookup(req, res) {
        try {
            if (!req.query.lookup_group) {
                return (0, response_1.sendError)(res, 400, "Lookup group is required");
            }
            // Get lookup group id
            const lookup_group = await (0, database_1.db)("lookup")
                .select("lookup_id as id")
                .where("lookup_group", req.query.lookup_group)
                .first();
            if (!lookup_group) {
                return (0, response_1.sendError)(res, 404, "Lookup group not found");
            }
            // Get lookup data
            const lookup_data = await (0, database_1.db)("lookup")
                .select("lookup_title as title", "lookup_value as value")
                .where("lookup_groupcode", lookup_group.id);
            return (0, response_1.sendSuccess)(res, { lookup_data }, "Lookup data fetched successfully");
        }
        catch (error) {
            console.error("Businesses error:", error);
            return (0, response_1.sendError)(res, 500, "Internal server error");
        }
    }
}
exports.LookupController = LookupController;
//# sourceMappingURL=lookup.controller.js.map