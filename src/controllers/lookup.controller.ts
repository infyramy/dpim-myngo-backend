import { Request, Response } from "express";
import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";

export class LookupController {
  /**
   * Send OTP to user's email
   */
  static async getLookup(req: Request, res: Response) {
    try {
      if (!req.query.lookup_group) {
        return sendError(res, 400, "Lookup group is required");
      }

      // Get lookup group id
      const lookup_group = await db("lookup")
        .select("lookup_id as id")
        .where("lookup_group", req.query.lookup_group)
        .first();

      if (!lookup_group) {
        return sendError(res, 404, "Lookup group not found");
      }

      // Get lookup data
      const lookup_data = await db("lookup")
        .select("lookup_title as title", "lookup_value as value")
        .where("lookup_groupcode", lookup_group.id);

      return sendSuccess(
        res,
        { lookup_data },
        "Lookup data fetched successfully"
      );
    } catch (error) {
      console.error("Businesses error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }
}
