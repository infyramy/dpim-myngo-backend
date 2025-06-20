import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";
export class AdminDashboardController {
    /**
     * Get overall dashboard statistics for admin
     */
    static async getDashboardStats(_req, res) {
        try {
            // Get total members across all states
            const totalMembers = await db("user")
                .where("user_status", 1)
                .where("user_role", "user")
                .count("user_id as count")
                .first();
            // Get total active products across all states
            const totalProducts = await db("products")
                .join("businesses", "products.p_business_id", "businesses.b_id")
                .join("user", "businesses.b_user_id", "user.user_id")
                .where("user.user_status", 1)
                .where("products.p_status", 1)
                .where("businesses.b_status", 1)
                .count("products.p_id as count")
                .first();
            // Get total pending applications across all states
            const totalPendingApplications = await db("user")
                .where("user_status", 2)
                .count("user_id as count")
                .first();
            const stats = {
                totalMembers: Number(totalMembers?.count || 0),
                totalProducts: Number(totalProducts?.count || 0),
                totalPendingApplications: Number(totalPendingApplications?.count || 0),
            };
            return sendSuccess(res, { stats }, "Admin dashboard stats retrieved successfully");
        }
        catch (error) {
            console.error("Admin dashboard stats error:", error);
            return sendError(res, 500, "Failed to load admin dashboard statistics");
        }
    }
    /**
     * Get state overview data for admin
     */
    static async getStateOverview(_req, res) {
        try {
            // Get all states with their statistics
            const states = await db("states")
                .select("states.state_id as id", "states.state_title as name", "states.state_code as code")
                .where("states.state_status", 1)
                .orderBy("states.state_title");
            // Get statistics for each state
            const stateOverview = await Promise.all(states.map(async (state) => {
                // Get members count for this state
                const membersCount = await db("user")
                    .where("user_state", state.code)
                    .where("user_status", 1)
                    .count("user_id as count")
                    .first();
                // Get pending applications for this state
                const pendingApplications = await db("user")
                    .where("user_state", state.code)
                    .where("user_status", 2)
                    .count("user_id as count")
                    .first();
                // Get products count for this state
                const productsCount = await db("products")
                    .join("businesses", "products.p_business_id", "businesses.b_id")
                    .join("user", "businesses.b_user_id", "user.user_id")
                    .where("user.user_state", state.code)
                    .where("user.user_status", 1)
                    .where("products.p_status", 1)
                    .where("businesses.b_status", 1)
                    .count("products.p_id as count")
                    .first();
                return {
                    id: state.id,
                    name: state.name,
                    code: state.code,
                    members: Number(membersCount?.count || 0),
                    pendingApplications: Number(pendingApplications?.count || 0),
                    products: Number(productsCount?.count || 0),
                };
            }));
            return sendSuccess(res, { stateData: stateOverview }, "State overview data retrieved successfully");
        }
        catch (error) {
            console.error("State overview error:", error);
            return sendError(res, 500, "Failed to load state overview data");
        }
    }
    /**
     * Get complete admin dashboard overview (all data in one call)
     */
    static async getDashboardOverview(_req, res) {
        try {
            // Get overall statistics
            const totalMembers = await db("user")
                .where("user_status", 1)
                .where("user_role", "user")
                .count("user_id as count")
                .first();
            const totalProducts = await db("products")
                .join("businesses", "products.p_business_id", "businesses.b_id")
                .join("user", "businesses.b_user_id", "user.user_id")
                .where("user.user_status", 1)
                .where("products.p_status", 1)
                .where("businesses.b_status", 1)
                .count("products.p_id as count")
                .first();
            const totalPendingApplications = await db("user")
                .where("user_status", 2)
                .count("user_id as count")
                .first();
            // Get states with their statistics
            const states = await db("states")
                .select("states.state_id as id", "states.state_title as name", "states.state_code as code")
                .where("states.state_status", 1)
                .orderBy("states.state_title");
            const stateOverview = await Promise.all(states.map(async (state) => {
                const membersCount = await db("user")
                    .where("user_state", state.code)
                    .where("user_status", 1)
                    .count("user_id as count")
                    .first();
                const pendingApplications = await db("user")
                    .where("user_state", state.code)
                    .where("user_status", 2)
                    .count("user_id as count")
                    .first();
                const productsCount = await db("products")
                    .join("businesses", "products.p_business_id", "businesses.b_id")
                    .join("user", "businesses.b_user_id", "user.user_id")
                    .where("user.user_state", state.code)
                    .where("user.user_status", 1)
                    .where("products.p_status", 1)
                    .where("businesses.b_status", 1)
                    .count("products.p_id as count")
                    .first();
                return {
                    id: state.id,
                    name: state.name,
                    code: state.code,
                    members: Number(membersCount?.count || 0),
                    pendingApplications: Number(pendingApplications?.count || 0),
                    products: Number(productsCount?.count || 0),
                };
            }));
            const dashboardData = {
                stats: {
                    totalMembers: Number(totalMembers?.count || 0),
                    totalProducts: Number(totalProducts?.count || 0),
                    totalPendingApplications: Number(totalPendingApplications?.count || 0),
                },
                stateData: stateOverview,
            };
            return sendSuccess(res, dashboardData, "Admin dashboard overview retrieved successfully");
        }
        catch (error) {
            console.error("Admin dashboard overview error:", error);
            return sendError(res, 500, "Failed to load admin dashboard overview");
        }
    }
}
//# sourceMappingURL=admin-dashboard.controller.js.map