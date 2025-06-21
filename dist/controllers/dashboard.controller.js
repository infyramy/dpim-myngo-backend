"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const database_1 = require("../config/database");
const response_1 = require("../utils/response");
class DashboardController {
    /**
     * Get dashboard overview data for authenticated user
     */
    static async getDashboardData(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.sendError)(res, 401, "User not authenticated");
            }
            // Get user businesses count
            const businessCount = await (0, database_1.db)("businesses")
                .where({ b_user_id: userId, b_status: 1 })
                .count("b_id as count")
                .first();
            // Get user products count
            const productCount = await (0, database_1.db)("products")
                .join("businesses", "products.p_business_id", "businesses.b_id")
                .where({
                "businesses.b_user_id": userId,
                "products.p_status": 1,
                "businesses.b_status": 1
            })
                .count("products.p_id as count")
                .first();
            // Get active listings (products that are published)
            const activeListings = await (0, database_1.db)("products")
                .join("businesses", "products.p_business_id", "businesses.b_id")
                .where({
                "businesses.b_user_id": userId,
                "products.p_status": 1,
                "businesses.b_status": 1
            })
                .count("products.p_id as count")
                .first();
            // Get recent products (last 5)
            const recentProducts = await (0, database_1.db)("products")
                .select("products.p_id as id", "products.p_name as name", "products.p_category as category", "products.p_status as status", "products.p_created_at as created_at")
                .join("businesses", "products.p_business_id", "businesses.b_id")
                .where({
                "businesses.b_user_id": userId,
                "businesses.b_status": 1
            })
                .orderBy("products.p_created_at", "desc")
                .limit(5);
            // Get user businesses
            const businesses = await (0, database_1.db)("businesses")
                .select("b_id as id", "b_company_name as name", "b_ssm_number as ssm", "b_type as type", "b_created_at as created_at")
                .where({ b_user_id: userId, b_status: 1 })
                .orderBy("b_created_at", "desc");
            // Calculate profile completeness
            const user = await (0, database_1.db)("user")
                .select("user_fullname", "user_email", "user_mobile_number", "user_residential_address")
                .where({ user_id: userId })
                .first();
            const profileFields = [
                user?.user_fullname,
                user?.user_email,
                user?.user_mobile_number,
                user?.user_residential_address
            ];
            const completedFields = profileFields.filter(field => field && field.trim() !== '').length;
            const profileComplete = completedFields >= 3; // Consider complete if at least 3/4 fields filled
            // Generate pending actions based on user's current state
            const pendingActions = [];
            if ((businessCount?.count || 0) === 0) {
                pendingActions.push({
                    id: 'register-business',
                    title: 'Register Your Business',
                    description: 'Add your business details to start listing products',
                    buttonText: 'Register Now',
                    action: 'register-business',
                    priority: 1
                });
            }
            if (Number(businessCount?.count || 0) > 0 && Number(productCount?.count || 0) === 0) {
                pendingActions.push({
                    id: 'add-product',
                    title: 'Add Your First Product',
                    description: 'Start showcasing what your business offers',
                    buttonText: 'Add Product',
                    action: 'add-product',
                    priority: 2
                });
            }
            if (!profileComplete) {
                pendingActions.push({
                    id: 'complete-profile',
                    title: 'Complete Your Profile',
                    description: 'Add missing information to improve your visibility',
                    buttonText: 'Update Profile',
                    action: 'complete-profile',
                    priority: 3
                });
            }
            // Mock profile views (you might want to implement actual tracking)
            const profileViews = 0;
            const dashboardData = {
                statistics: {
                    businessCount: businessCount?.count || 0,
                    productCount: productCount?.count || 0,
                    activeListings: activeListings?.count || 0,
                    profileViews: profileViews
                },
                recentProducts: recentProducts.map(product => ({
                    ...product,
                    status: product.status === 1 ? 'active' : 'inactive'
                })),
                businesses: businesses,
                pendingActions: pendingActions.sort((a, b) => a.priority - b.priority),
                profileComplete: profileComplete,
                showGettingStarted: (businessCount?.count || 0) === 0 ||
                    (productCount?.count || 0) === 0 ||
                    !profileComplete
            };
            return (0, response_1.sendSuccess)(res, dashboardData, "Dashboard data retrieved successfully");
        }
        catch (error) {
            console.error("Dashboard data error:", error);
            return (0, response_1.sendError)(res, 500, "Failed to load dashboard data");
        }
    }
    /**
     * Get user activity summary
     */
    static async getActivitySummary(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.sendError)(res, 401, "User not authenticated");
            }
            // Get recent activities (mock data - implement based on your activity tracking)
            const recentActivities = [
                {
                    id: 1,
                    type: 'product_added',
                    title: 'Product Added',
                    description: 'New product was added to your listing',
                    timestamp: new Date().toISOString(),
                    metadata: {}
                }
            ];
            return (0, response_1.sendSuccess)(res, { activities: recentActivities }, "Activity summary retrieved successfully");
        }
        catch (error) {
            console.error("Activity summary error:", error);
            return (0, response_1.sendError)(res, 500, "Failed to load activity summary");
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map