import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";
export class OperatorDashboardController {
    /**
     * Get dashboard statistics for operator
     */
    static async getDashboardStats(req, res) {
        try {
            // Get operator's state code
            const operatorState = await db("operator")
                .select("states.state_code as code", "states.state_title as name")
                .leftJoin("states", "states.state_id", "operator.op_states_id")
                .where("op_user_id", req.user?.id)
                .first();
            if (!operatorState) {
                return sendError(res, 404, "Operator state not found");
            }
            // Get total members in operator's state
            const totalMembers = await db("user")
                .where("user_state", operatorState.code)
                .where("user_status", 1)
                .count("user_id as count")
                .first();
            // Get active members (status = 1)
            const activeMembers = await db("user")
                .where("user_state", operatorState.code)
                .where("user_status", 1)
                .count("user_id as count")
                .first();
            // Get pending applications (status = 2)
            const pendingApplications = await db("user")
                .where("user_state", operatorState.code)
                .where("user_status", 2)
                .count("user_id as count")
                .first();
            // Get total products from users in this state
            const totalProducts = await db("products")
                .join("businesses", "products.p_business_id", "businesses.b_id")
                .join("user", "businesses.b_user_id", "user.user_id")
                .where("user.user_state", operatorState.code)
                .where("user.user_status", 1)
                .where("products.p_status", 1)
                .count("products.p_id as count")
                .first();
            // Get recent members count (joined in last 7 days)
            const recentMembersCount = await db("user")
                .where("user_state", operatorState.code)
                .where("user_status", 1)
                .where("user_created_at", ">=", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                .count("user_id as count")
                .first();
            const stats = {
                totalMembers: Number(totalMembers?.count || 0),
                activeMembers: Number(activeMembers?.count || 0),
                pendingApplications: Number(pendingApplications?.count || 0),
                totalProducts: Number(totalProducts?.count || 0),
                recentMembersCount: Number(recentMembersCount?.count || 0),
                stateName: operatorState.name,
                stateCode: operatorState.code,
            };
            return sendSuccess(res, { stats }, "Dashboard stats retrieved successfully");
        }
        catch (error) {
            console.error("Dashboard stats error:", error);
            return sendError(res, 500, "Failed to load dashboard statistics");
        }
    }
    /**
     * Get recent applications for operator's state
     */
    static async getRecentApplications(req, res) {
        try {
            // Get operator's state code
            const operatorState = await db("operator")
                .select("states.state_code as code")
                .leftJoin("states", "states.state_id", "operator.op_states_id")
                .where("op_user_id", req.user?.id)
                .first();
            if (!operatorState) {
                return sendError(res, 404, "Operator state not found");
            }
            // Get recent applications (last 10, only pending)
            const applications = await db("user")
                .select("user_id as id", "user_fullname as fullname", "user_email as email", "user_mykad_number as mykad_number", "user_created_at as apply_at", "user_status as status")
                .where("user_status", 2) // pending status
                .where("user_state", operatorState.code)
                .orderBy("user_created_at", "desc")
                .limit(10);
            // Format the applications
            const formattedApplications = applications.map((app) => ({
                ...app,
                status: "pending",
            }));
            return sendSuccess(res, { applications: formattedApplications }, "Recent applications retrieved successfully");
        }
        catch (error) {
            console.error("Recent applications error:", error);
            return sendError(res, 500, "Failed to load recent applications");
        }
    }
    /**
     * Get recent members for operator's state
     */
    static async getRecentMembers(req, res) {
        try {
            // Get operator's state code
            const operatorState = await db("operator")
                .select("states.state_code as code")
                .leftJoin("states", "states.state_id", "operator.op_states_id")
                .where("op_user_id", req.user?.id)
                .first();
            if (!operatorState) {
                return sendError(res, 404, "Operator state not found");
            }
            // Get recent members (last 10, only active)
            const members = await db("user")
                .select("user_id as id", "user_fullname as name", "user_email as email", "user_mobile_number as phone", "user_created_at as joinDate", "user_status as status")
                .where("user_status", 1) // active status
                .where("user_state", operatorState.code)
                .orderBy("user_created_at", "desc")
                .limit(10);
            // Get business and product counts for each member
            const membersWithCounts = await Promise.all(members.map(async (member) => {
                // Get business count
                const businessCount = await db("businesses")
                    .where("b_user_id", member.id)
                    .where("b_status", 1)
                    .count("b_id as count")
                    .first();
                // Get product count
                const productCount = await db("products")
                    .join("businesses", "products.p_business_id", "businesses.b_id")
                    .where("businesses.b_user_id", member.id)
                    .where("products.p_status", 1)
                    .where("businesses.b_status", 1)
                    .count("products.p_id as count")
                    .first();
                return {
                    ...member,
                    status: "active",
                    businessesCount: Number(businessCount?.count || 0),
                    productsCount: Number(productCount?.count || 0),
                };
            }));
            return sendSuccess(res, { members: membersWithCounts }, "Recent members retrieved successfully");
        }
        catch (error) {
            console.error("Recent members error:", error);
            return sendError(res, 500, "Failed to load recent members");
        }
    }
    /**
     * Get complete dashboard overview (all data in one call)
     */
    static async getDashboardOverview(req, res) {
        try {
            // Get operator's state code
            const operatorState = await db("operator")
                .select("states.state_code as code", "states.state_title as name")
                .leftJoin("states", "states.state_id", "operator.op_states_id")
                .where("op_user_id", req.user?.id)
                .first();
            if (!operatorState) {
                return sendError(res, 404, "Operator state not found");
            }
            // Get dashboard stats
            const [totalMembers, activeMembers, pendingApplications, totalProducts, recentMembersCount,] = await Promise.all([
                db("user")
                    .where("user_state", operatorState.code)
                    .where("user_status", 1)
                    .count("user_id as count")
                    .first(),
                db("user")
                    .where("user_state", operatorState.code)
                    .where("user_status", 1)
                    .count("user_id as count")
                    .first(),
                db("user")
                    .where("user_state", operatorState.code)
                    .where("user_status", 2)
                    .count("user_id as count")
                    .first(),
                db("products")
                    .join("businesses", "products.p_business_id", "businesses.b_id")
                    .join("user", "businesses.b_user_id", "user.user_id")
                    .where("user.user_state", operatorState.code)
                    .where("user.user_status", 1)
                    .where("products.p_status", 1)
                    .count("products.p_id as count")
                    .first(),
                db("user")
                    .where("user_state", operatorState.code)
                    .where("user_status", 1)
                    .where("user_created_at", ">=", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                    .count("user_id as count")
                    .first(),
            ]);
            // Get recent applications
            const recentApplications = await db("user")
                .select("user_id as id", "user_fullname as fullname", "user_email as email", "user_created_at as apply_at")
                .where("user_status", 2)
                .where("user_state", operatorState.code)
                .orderBy("user_created_at", "desc")
                .limit(5);
            // Get recent members
            const recentMembers = await db("user")
                .select("user_id as id", "user_fullname as name", "user_email as email", "user_created_at as joinDate")
                .where("user_status", 1)
                .where("user_state", operatorState.code)
                .orderBy("user_created_at", "desc")
                .limit(5);
            // Get counts for recent members
            const recentMembersWithCounts = await Promise.all(recentMembers.map(async (member) => {
                const [businessCount, productCount] = await Promise.all([
                    db("businesses")
                        .where("b_user_id", member.id)
                        .where("b_status", 1)
                        .count("b_id as count")
                        .first(),
                    db("products")
                        .join("businesses", "products.p_business_id", "businesses.b_id")
                        .where("businesses.b_user_id", member.id)
                        .where("products.p_status", 1)
                        .where("businesses.b_status", 1)
                        .count("products.p_id as count")
                        .first(),
                ]);
                return {
                    ...member,
                    status: "active",
                    businessesCount: Number(businessCount?.count || 0),
                    productsCount: Number(productCount?.count || 0),
                };
            }));
            const overview = {
                stats: {
                    totalMembers: Number(totalMembers?.count || 0),
                    activeMembers: Number(activeMembers?.count || 0),
                    pendingApplications: Number(pendingApplications?.count || 0),
                    totalProducts: Number(totalProducts?.count || 0),
                    recentMembersCount: Number(recentMembersCount?.count || 0),
                    stateName: operatorState.name,
                    stateCode: operatorState.code,
                },
                recentApplications: recentApplications.map((app) => ({
                    ...app,
                    status: "pending",
                })),
                recentMembers: recentMembersWithCounts,
            };
            return sendSuccess(res, overview, "Dashboard overview retrieved successfully");
        }
        catch (error) {
            console.error("Dashboard overview error:", error);
            return sendError(res, 500, "Failed to load dashboard overview");
        }
    }
}
//# sourceMappingURL=operator-dashboard.controller.js.map