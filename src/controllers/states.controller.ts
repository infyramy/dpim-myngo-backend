import { Request, Response } from "express";
import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";

export class StatesController {
  /**
   * Get all states
   */
  static async getStates(_req: Request, res: Response) {
    try {
      const states = await db("states")
        .select(
          "state_title as title",
          "state_code as code",
          "state_flag as flag"
        )
        .where("state_status", 1);

      return sendSuccess(res, { states }, "States fetched successfully");
    } catch (error) {
      console.error("States error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Get all states with admin information (supports multiple admins per state)
   */
  static async getStatesWithAdmins(_req: Request, res: Response) {
    try {
      // Get all states
      const statesQuery = await db("states")
        .select(
          "state_id as id",
          "state_title as name",
          "state_code as code",
          "state_flag as flag"
        )
        .where("state_status", 1)
        .orderBy("state_title");

      // Get all admins for all states
      const adminsQuery = await db("operator")
        .select(
          "operator.op_states_id as stateId",
          "operator.op_user_id as adminId",
          "user.user_fullname as adminName",
          "user.user_email as adminEmail"
        )
        .join("user", "user.user_id", "operator.op_user_id")
        .where("user.user_status", 1);

      // Group admins by state
      const adminsByState = adminsQuery.reduce((acc, admin) => {
        if (!acc[admin.stateId]) {
          acc[admin.stateId] = [];
        }
        acc[admin.stateId].push({
          adminId: admin.adminId,
          adminName: admin.adminName,
          adminEmail: admin.adminEmail,
        });
        return acc;
      }, {} as Record<string, any[]>);

      // Combine states with their admins
      const states = statesQuery.map(state => ({
        ...state,
        admins: adminsByState[state.id] || [],
        isActive: (adminsByState[state.id] || []).length > 0,
      }));

      return sendSuccess(
        res,
        { states },
        "States with admins fetched successfully"
      );
    } catch (error) {
      console.error("States with admins error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Get available users for a specific state (users registered under that state)
   */
  static async getAvailableUsersForState(req: Request, res: Response) {
    try {
      const { stateId } = req.params;

      if (!stateId) {
        return sendError(res, 400, "State ID is required");
      }

      // Get state code
      const state = await db("states")
        .select("state_code")
        .where("state_id", stateId)
        .first();

      if (!state) {
        return sendError(res, 404, "State not found");
      }

      // Get users registered under this state who are not already operators for this state
      const availableUsers = await db("user")
        .select(
          "user_id as id",
          "user_fullname as name",
          "user_email as email"
        )
        .where("user_state", state.state_code)
        .where("user_status", 1)
        .whereNotExists(function() {
          this.select("*")
            .from("operator")
            .whereRaw("operator.op_user_id = user.user_id")
            .where("operator.op_states_id", stateId);
        })
        .orderBy("user_fullname");

      return sendSuccess(
        res,
        { users: availableUsers },
        "Available users fetched successfully"
      );
    } catch (error) {
      console.error("Get available users error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Assign existing user as admin to a state
   */
  static async assignAdmin(req: Request, res: Response) {
    try {
      const { stateId, userId } = req.body;

      if (!stateId || !userId) {
        return sendError(
          res,
          400,
          "State ID and User ID are required"
        );
      }

      // Check if state exists
      const state = await db("states").where("state_id", stateId).first();

      if (!state) {
        return sendError(res, 404, "State not found");
      }

      // Check if user exists and is from the same state
      const user = await db("user")
        .where("user_id", userId)
        .where("user_state", state.state_code)
        .where("user_status", 1)
        .first();

      if (!user) {
        return sendError(res, 404, "User not found or not from this state");
      }

      // Check if user is already an operator for this state
      const existingOperator = await db("operator")
        .where("op_user_id", userId)
        .where("op_states_id", stateId)
        .first();

      if (existingOperator) {
        return sendError(res, 400, "User is already an admin for this state");
      }

      // Create new operator record
      await db("operator").insert({
        op_user_id: userId,
        op_states_id: stateId,
        op_created_at: new Date(),
        op_modified_at: new Date(),
      });

      // Update user role to operator if not already
      // await db("user")
      //   .where("user_id", userId)
      //   .update({
      //     user_role: "operator",
      //     user_modified_at: new Date(),
      //   });

      return sendSuccess(res, { userId }, "Admin assigned successfully");
    } catch (error) {
      console.error("Assign admin error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Update admin information (keeping for backward compatibility but not creating new users)
   */
  static async updateAdmin(req: Request, res: Response) {
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
    } catch (error) {
      console.error("Update admin error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Remove specific admin from a state
   */
  static async removeAdmin(req: Request, res: Response) {
    try {
      const { stateId, userId } = req.params;

      if (!stateId || !userId) {
        return sendError(res, 400, "State ID and User ID are required");
      }

      // Get current operator for this state and user
      const operator = await db("operator")
        .where("op_states_id", stateId)
        .where("op_user_id", userId)
        .first();

      if (!operator) {
        return sendError(res, 404, "Admin assignment not found");
      }

      // Delete operator record (but keep the user)
      await db("operator")
        .where("op_states_id", stateId)
        .where("op_user_id", userId)
        .del();

      // Check if user has other operator roles, if not, change role back to user
      const otherOperatorRoles = await db("operator")
        .where("op_user_id", userId)
        .first();

      if (!otherOperatorRoles) {
        await db("user")
          .where("user_id", userId)
          .update({
            user_role: "user",
            user_modified_at: new Date(),
          });
      }

      return sendSuccess(res, {}, "Admin removed successfully");
    } catch (error) {
      console.error("Remove admin error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }
}
