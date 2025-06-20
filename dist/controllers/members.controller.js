import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";
export class MembersController {
    /**
     * Get all members with filtering and search
     */
    static async getMembers(req, res) {
        try {
            const { search, status, page = 1, limit = 10 } = req.query;
            // get current user state
            const currentUser = await db("user")
                .select("user_state as state")
                .where("user_id", req.user?.id)
                .first();
            // Build query
            let query = db("user as u")
                .leftJoin("businesses as b", "u.user_id", "b.b_user_id")
                .select("u.user_id as id", "u.user_fullname as name", "u.user_email as email", "u.user_mobile_number as phone", "u.user_status as status", "u.user_created_at as joinDate", db.raw("COUNT(DISTINCT p.p_id) as productsCount"), db.raw("COUNT(DISTINCT b.b_id) as businessesCount"))
                .leftJoin("products as p", function () {
                this.on("p.p_business_id", "=", "b.b_id").andOn("p.p_status", "=", db.raw("1"));
            })
                .where("u.user_role", "user") // Only get regular users (members)
                .where("u.user_state", currentUser?.state)
                .groupBy("u.user_id", "u.user_fullname", "u.user_email", "u.user_mobile_number", "u.user_status", "u.user_created_at");
            // Apply status filter
            if (status && status !== "all") {
                if (status === "active") {
                    query = query.where("u.user_status", 1);
                }
                else if (status === "suspended") {
                    query = query.where("u.user_status", 3);
                }
                else if (status === "pending") {
                    query = query.where("u.user_status", 2);
                }
            }
            // Apply search filter
            if (search) {
                const searchTerm = `%${search}%`;
                query = query.where(function () {
                    this.where("u.user_fullname", "like", searchTerm).orWhere("u.user_email", "like", searchTerm);
                });
            }
            // Apply pagination
            const offset = (Number(page) - 1) * Number(limit);
            query = query.limit(Number(limit)).offset(offset);
            // Order by most recent
            query = query.orderBy("u.user_created_at", "desc");
            const members = await query;
            // Get total count for pagination
            let countQuery = db("user as u")
                .leftJoin("businesses as b", "u.user_id", "b.b_user_id")
                .where("u.user_role", "user");
            if (status && status !== "all") {
                if (status === "active") {
                    countQuery = countQuery.where("u.user_status", 1);
                }
                else if (status === "suspended") {
                    countQuery = countQuery.where("u.user_status", 3);
                }
                else if (status === "pending") {
                    countQuery = countQuery.where("u.user_status", 2);
                }
            }
            if (search) {
                const searchTerm = `%${search}%`;
                countQuery = countQuery.where(function () {
                    this.where("u.user_fullname", "like", searchTerm).orWhere("u.user_email", "like", searchTerm);
                });
            }
            const [{ total }] = await countQuery.count("u.user_id as total");
            // Format members data
            const formattedMembers = members.map((member) => ({
                id: member.id.toString(),
                name: member.name,
                email: member.email,
                phone: member.phone || "N/A",
                businessesCount: parseInt(member.businessesCount) || 0,
                productsCount: parseInt(member.productsCount) || 0,
                joinDate: member.joinDate,
                status: member.status === 1
                    ? "active"
                    : member.status === 3
                        ? "suspended"
                        : "pending",
            }));
            return sendSuccess(res, {
                members: formattedMembers,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: Number(total),
                    totalPages: Math.ceil(Number(total) / Number(limit)),
                },
            }, "Members fetched successfully");
        }
        catch (error) {
            console.error("Get members error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Get member by ID with detailed information
     */
    static async getMemberById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return sendError(res, 400, "Member ID is required");
            }
            const member = await db("user as u")
                .select("u.user_id as id", "u.user_fullname as name", "u.user_email as email", "u.user_mobile_number as phone", "u.user_residential_address as address", "u.user_postcode as postcode", "u.user_city as city", "u.user_state as state", "u.user_status as status", "u.user_created_at as joinDate", "u.user_last_logged_in as lastLogin", db.raw("COUNT(DISTINCT b.b_id) as businessesCount"), db.raw("COUNT(DISTINCT p.p_id) as productsCount"))
                .leftJoin("businesses as b", function () {
                this.on("b.b_user_id", "=", "u.user_id").andOn("b.b_status", "=", db.raw("1"));
            })
                .leftJoin("products as p", function () {
                this.on("p.p_business_id", "=", "b.b_id").andOn("p.p_status", "=", db.raw("1"));
            })
                .where("u.user_id", id)
                .where("u.user_role", "user")
                .groupBy("u.user_id", "u.user_fullname", "u.user_email", "u.user_mobile_number", "u.user_residential_address", "u.user_postcode", "u.user_city", "u.user_state", "u.user_status", "u.user_created_at", "u.user_last_logged_in")
                .first();
            if (!member) {
                return sendError(res, 404, "Member not found");
            }
            // Get member's businesses
            const businesses = await db("businesses")
                .select("b_id as id", "b_company_name as name", "b_ssm_number as ssm", "b_type as type", "b_sector as sector")
                .where("b_user_id", id)
                .where("b_status", 1);
            // Get member's products
            const products = await db("products as p")
                .join("businesses as b", "p.p_business_id", "b.b_id")
                .select("p.p_id as id", "p.p_name as name", "p.p_category as category", "p.p_created_at as createdAt", "b.b_company_name as businessName")
                .where("b.b_user_id", id)
                .where("p.p_status", 1)
                .orderBy("p.p_created_at", "desc");
            const formattedMember = {
                id: member.id.toString(),
                name: member.name,
                email: member.email,
                phone: member.phone || "N/A",
                address: member.address,
                postcode: member.postcode,
                city: member.city,
                state: member.state,
                businessesCount: parseInt(member.businessesCount) || 0,
                productsCount: parseInt(member.productsCount) || 0,
                joinDate: member.joinDate,
                lastLogin: member.lastLogin,
                status: member.status === 1
                    ? "active"
                    : member.status === 3
                        ? "suspended"
                        : "pending",
                businesses: businesses,
                products: products,
            };
            return sendSuccess(res, { member: formattedMember }, "Member details fetched successfully");
        }
        catch (error) {
            console.error("Get member by ID error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Suspend a member
     */
    static async suspendMember(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            if (!id) {
                return sendError(res, 400, "Member ID is required");
            }
            if (!reason || !reason.trim()) {
                return sendError(res, 400, "Suspension reason is required");
            }
            // Check if member exists and is not already suspended
            const member = await db("user")
                .where("user_id", id)
                .where("user_role", "user")
                .first();
            if (!member) {
                return sendError(res, 404, "Member not found");
            }
            if (member.user_status === 3) {
                return sendError(res, 400, "Member is already suspended");
            }
            // Update member status to suspended (0)
            await db("user").where("user_id", id).update({
                user_status: 3,
                user_rejected_at: new Date(),
                user_rejected_by: req.user?.id,
                user_modified_at: new Date(),
            });
            return sendSuccess(res, {
                message: "Member suspended successfully",
                memberId: id,
                reason: reason.trim(),
            }, "Member has been suspended");
        }
        catch (error) {
            console.error("Suspend member error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Reactivate a suspended member
     */
    static async reactivateMember(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return sendError(res, 400, "Member ID is required");
            }
            // Check if member exists and is suspended
            const member = await db("user")
                .where("user_id", id)
                .where("user_role", "user")
                .first();
            if (!member) {
                return sendError(res, 404, "Member not found");
            }
            if (member.user_status !== 3) {
                return sendError(res, 400, "Member is not suspended");
            }
            // Update member status to active (1)
            await db("user").where("user_id", id).update({
                user_status: 1,
                user_approved_at: new Date(),
                user_approved_by: req.user?.id,
                user_modified_at: new Date(),
            });
            return sendSuccess(res, {
                message: "Member reactivated successfully",
                memberId: id,
            }, "Member has been reactivated");
        }
        catch (error) {
            console.error("Reactivate member error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Get member statistics
     */
    static async getMemberStats(req, res) {
        try {
            // Get current user state
            const currentUser = await db("user")
                .select("user_state as state")
                .where("user_id", req.user?.id)
                .first();
            const stats = await db("user")
                .select(db.raw("COUNT(*) as total"), db.raw("SUM(CASE WHEN user_status = 1 THEN 1 ELSE 0 END) as active"), db.raw("SUM(CASE WHEN user_status = 3 THEN 1 ELSE 0 END) as suspended"), db.raw("SUM(CASE WHEN user_status = 2 THEN 1 ELSE 0 END) as pending"))
                .where("user_role", "user")
                .where("user_state", currentUser?.state)
                .first();
            const recentMembers = await db("user")
                .select("user_id as id", "user_fullname as name", "user_created_at as joinDate")
                .where("user_role", "user")
                .where("user_state", currentUser?.state)
                .orderBy("user_created_at", "desc")
                .limit(5);
            return sendSuccess(res, {
                stats: {
                    total: parseInt(stats.total) || 0,
                    active: parseInt(stats.active) || 0,
                    suspended: parseInt(stats.suspended) || 0,
                    pending: parseInt(stats.pending) || 0,
                },
                recentMembers,
            }, "Member statistics fetched successfully");
        }
        catch (error) {
            console.error("Get member stats error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
}
//# sourceMappingURL=members.controller.js.map