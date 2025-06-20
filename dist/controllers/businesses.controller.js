import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";
export class BusinessesController {
    /**
     * Get all businesses
     */
    static async getBusinesses(req, res) {
        try {
            // Get user ID from request
            const userId = req.user?.id;
            if (!userId) {
                return sendError(res, 401, "User authentication required");
            }
            const businesses = await db("businesses")
                .select("b_id as id", "b_company_name as name", "b_ssm_number as ssm", "b_office_number as phone", "b_address as address", "b_type as type", "b_sector as sector", "b_category as category", "b_mof_registration as mofRegistration", "b_mof_registration_number as mofRegistrationNumber", "b_url as url", "b_created_at as createdAt", "b_modified_at as modifiedAt")
                .where("b_status", 1)
                .where("b_user_id", userId)
                .orderBy("b_created_at", "desc");
            // Convert mofRegistered to boolean for each business
            const formattedBusinesses = businesses.map((business) => ({
                ...business,
                mofRegistration: business.mofRegistration === "1",
            }));
            return sendSuccess(res, { businesses: formattedBusinesses }, "Businesses fetched successfully");
        }
        catch (error) {
            console.error("Get businesses error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Create a new business
     */
    static async createBusiness(req, res) {
        try {
            const { name, ssm, phone, address, type, sector, category, mofRegistration, mofRegistrationNumber, url, } = req.body;
            // Basic validation
            if (!name ||
                !ssm ||
                !phone ||
                !address ||
                !type ||
                !sector ||
                !category) {
                return sendError(res, 400, "All required fields must be provided");
            }
            // Validate MOF Registration Number if MOF Registration is true
            if (mofRegistration && !mofRegistrationNumber?.trim()) {
                return sendError(res, 400, "MOF Registration Number is required when MOF Registration is selected");
            }
            // Validate SSM number format (should be 12 digits)
            const ssmClean = ssm.replace(/[-\s]/g, "");
            if (!/^\d{12}$/.test(ssmClean)) {
                return sendError(res, 400, "Invalid SSM number format (12 digits required)");
            }
            // Validate phone number format
            const phoneClean = phone.replace(/[-\s]/g, "");
            if (!/^(\+?60|0)[0-9]{8,11}$/.test(phoneClean)) {
                return sendError(res, 400, "Invalid phone number format");
            }
            // Validate URL if provided
            if (url && url.trim()) {
                const urlPattern = /^https?:\/\/.+\..+/;
                if (!urlPattern.test(url)) {
                    return sendError(res, 400, "Invalid URL format");
                }
            }
            // Check if SSM number already exists
            const existingBusiness = await db("businesses")
                .where("b_ssm_number", ssmClean)
                .first();
            if (existingBusiness) {
                return sendError(res, 409, "Business with this SSM number already exists");
            }
            // Get user ID from request (assuming auth middleware is applied)
            const userId = req.user?.id;
            if (!userId) {
                return sendError(res, 401, "User authentication required");
            }
            // Prepare business data for database insertion
            const businessData = {
                b_company_name: name.trim(),
                b_ssm_number: ssmClean,
                b_office_number: phone.trim(),
                b_address: address.trim(),
                b_type: type,
                b_sector: sector,
                b_category: category,
                b_mof_registration: mofRegistration ? 1 : 0,
                b_mof_registration_number: mofRegistration ? mofRegistrationNumber?.trim() || null : null,
                b_url: url?.trim() || null,
                b_user_id: userId,
                b_status: 1, // Active status
            };
            // Insert the business
            const [businessId] = await db("businesses").insert(businessData);
            // Fetch the created business with proper field mapping
            const createdBusiness = await db("businesses")
                .select("b_id as id", "b_company_name as name", "b_ssm_number as ssm", "b_office_number as phone", "b_address as address", "b_type as type", "b_sector as sector", "b_category as category", "b_mof_registration as mofRegistration", "b_mof_registration_number as mofRegistrationNumber", "b_url as url", "b_created_at as createdAt", "b_modified_at as modifiedAt")
                .where("b_id", businessId)
                .first();
            // Convert mofRegistered to boolean
            const formattedBusiness = {
                ...createdBusiness,
                mofRegistration: createdBusiness.mofRegistration === 1,
            };
            return sendSuccess(res, { business: formattedBusiness }, "Business created successfully");
        }
        catch (error) {
            console.error("Create business error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Update an existing business
     */
    static async updateBusiness(req, res) {
        try {
            const businessId = req.params.id;
            const { name, ssm, phone, address, type, sector, category, mofRegistration, mofRegistrationNumber, url, } = req.body;
            // Validate business ID
            if (!businessId || isNaN(Number(businessId))) {
                return sendError(res, 400, "Invalid business ID");
            }
            // Get user ID from request
            const userId = req.user?.id;
            if (!userId) {
                return sendError(res, 401, "User authentication required");
            }
            // Check if business exists and belongs to user
            const existingBusiness = await db("businesses")
                .where("b_id", businessId)
                .where("b_user_id", userId)
                .where("b_status", 1)
                .first();
            if (!existingBusiness) {
                return sendError(res, 404, "Business not found or access denied");
            }
            // Basic validation
            if (!name ||
                !ssm ||
                !phone ||
                !address ||
                !type ||
                !sector ||
                !category) {
                return sendError(res, 400, "All required fields must be provided");
            }
            // Validate MOF Registration Number if MOF Registration is true
            if (mofRegistration && !mofRegistrationNumber?.trim()) {
                return sendError(res, 400, "MOF Registration Number is required when MOF Registration is selected");
            }
            // Validate SSM number format (should be 12 digits)
            const ssmClean = ssm.replace(/[-\s]/g, "");
            if (!/^\d{12}$/.test(ssmClean)) {
                return sendError(res, 400, "Invalid SSM number format (12 digits required)");
            }
            // Validate phone number format
            const phoneClean = phone.replace(/[-\s]/g, "");
            if (!/^(\+?60|0)[0-9]{8,11}$/.test(phoneClean)) {
                return sendError(res, 400, "Invalid phone number format");
            }
            // Validate URL if provided
            if (url && url.trim()) {
                const urlPattern = /^https?:\/\/.+\..+/;
                if (!urlPattern.test(url)) {
                    return sendError(res, 400, "Invalid URL format");
                }
            }
            // Check if SSM number already exists for other businesses
            const duplicateSSM = await db("businesses")
                .where("b_ssm_number", ssmClean)
                .where("b_id", "!=", businessId)
                .where("b_status", 1)
                .first();
            if (duplicateSSM) {
                return sendError(res, 409, "Business with this SSM number already exists");
            }
            // Prepare business data for update
            const businessData = {
                b_company_name: name.trim(),
                b_ssm_number: ssmClean,
                b_office_number: phone.trim(),
                b_address: address.trim(),
                b_type: type,
                b_sector: sector,
                b_category: category,
                b_mof_registration: mofRegistration ? 1 : 0,
                b_mof_registration_number: mofRegistration ? mofRegistrationNumber?.trim() || null : null,
                b_url: url?.trim() || null,
                b_modified_at: new Date(),
            };
            // Update the business
            await db("businesses")
                .where("b_id", businessId)
                .where("b_user_id", userId)
                .update(businessData);
            // Fetch the updated business with proper field mapping
            const updatedBusiness = await db("businesses")
                .select("b_id as id", "b_company_name as name", "b_ssm_number as ssm", "b_office_number as phone", "b_address as address", "b_type as type", "b_sector as sector", "b_category as category", "b_mof_registration as mofRegistration", "b_mof_registration_number as mofRegistrationNumber", "b_url as url", "b_created_at as createdAt", "b_modified_at as modifiedAt")
                .where("b_id", businessId)
                .first();
            // Convert mofRegistered to boolean
            const formattedBusiness = {
                ...updatedBusiness,
                mofRegistration: updatedBusiness.mofRegistration === "1",
            };
            return sendSuccess(res, { business: formattedBusiness }, "Business updated successfully");
        }
        catch (error) {
            console.error("Update business error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Delete a business (soft delete)
     */
    static async deleteBusiness(req, res) {
        try {
            const businessId = req.params.id;
            // Validate business ID
            if (!businessId || isNaN(Number(businessId))) {
                return sendError(res, 400, "Invalid business ID");
            }
            // Get user ID from request
            const userId = req.user?.id;
            if (!userId) {
                return sendError(res, 401, "User authentication required");
            }
            // Check if business exists and belongs to user
            const existingBusiness = await db("businesses")
                .where("b_id", businessId)
                .where("b_user_id", userId)
                .where("b_status", 1)
                .first();
            if (!existingBusiness) {
                return sendError(res, 404, "Business not found or access denied");
            }
            // Soft delete the business by setting status to 0
            await db("businesses")
                .where("b_id", businessId)
                .where("b_user_id", userId)
                .update({
                b_status: 0,
                b_modified_at: new Date(),
            });
            return sendSuccess(res, { businessId: Number(businessId) }, "Business deleted successfully");
        }
        catch (error) {
            console.error("Delete business error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
    /**
     * Get a single business by ID
     */
    static async getBusinessById(req, res) {
        try {
            const businessId = req.params.id;
            // Validate business ID
            if (!businessId || isNaN(Number(businessId))) {
                return sendError(res, 400, "Invalid business ID");
            }
            // Get user ID from request
            const userId = req.user?.id;
            if (!userId) {
                return sendError(res, 401, "User authentication required");
            }
            // Fetch the business
            const business = await db("businesses")
                .select("b_id as id", "b_company_name as name", "b_ssm_number as ssm", "b_office_number as phone", "b_address as address", "b_type as type", "b_sector as sector", "b_category as category", "b_mof_registration as mofRegistration", "b_mof_registration_number as mofRegistrationNumber", "b_url as url", "b_created_at as createdAt", "b_modified_at as modifiedAt")
                .where("b_id", businessId)
                .where("b_user_id", userId)
                .where("b_status", 1)
                .first();
            if (!business) {
                return sendError(res, 404, "Business not found or access denied");
            }
            // Convert mofRegistered to boolean
            const formattedBusiness = {
                ...business,
                mofRegistration: business.mofRegistration === "1",
            };
            return sendSuccess(res, { business: formattedBusiness }, "Business fetched successfully");
        }
        catch (error) {
            console.error("Get business by ID error:", error);
            return sendError(res, 500, "Internal server error");
        }
    }
}
//# sourceMappingURL=businesses.controller.js.map