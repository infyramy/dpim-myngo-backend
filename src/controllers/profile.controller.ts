import { Request, Response } from "express";
import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";
import { UpdateProfileRequest, UserProfile } from "../types/auth";

export class ProfileController {
  /**
   * Get current user's profile
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, 401, "User not authenticated");
      }

      const profile = await db("user")
        .where({ user_id: userId })
        .select([
          "user_id",
          "user_email",
          "user_fullname",
          "user_mykad_number",
          "user_mobile_number",
          "user_gender",
          "user_date_of_birth",
          "user_residential_address",
          "user_postcode",
          "user_city",
          "user_state",
          "user_role",
          "user_created_at",
          "user_last_logged_in",
          "user_spouse_name",
          "user_spouse_mobile_phone",
          "user_social_media",
        ])
        .first();

      if (!profile) {
        return sendError(res, 404, "Profile not found");
      }

      // Parse social media JSON if it exists
      let socialMedia = null;
      if (profile.user_social_media) {
        try {
          socialMedia = JSON.parse(profile.user_social_media);
        } catch (error) {
          console.warn("Error parsing social media JSON:", error);
        }
      }

      const profileData: UserProfile = {
        ...profile,
        social_media: socialMedia,
        email_notifications: true, // Default values - you might want to store these in the database
        sms_notifications: true,
      };

      return sendSuccess(res, profileData, "Profile retrieved successfully");
    } catch (error) {
      console.error("Get profile error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Update current user's profile
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, 401, "User not authenticated");
      }

      const updateData: UpdateProfileRequest = req.body;

      // Validate required fields if they're being updated
      if (updateData.fullname && updateData.fullname.trim().length === 0) {
        return sendError(res, 400, "Full name cannot be empty");
      }

      if (updateData.mobile_number) {
        // Basic mobile validation (Malaysian format)
        const mobileRegex = /^(\+?6?01)[0-46-9]-*\d{7,8}$/;
        if (!mobileRegex.test(updateData.mobile_number.replace(/[\s-]/g, ""))) {
          return sendError(res, 400, "Invalid mobile number format");
        }
      }

      // Prepare update object with proper database field names
      const dbUpdateData: any = {};

      if (updateData.fullname !== undefined) {
        dbUpdateData.user_fullname = updateData.fullname.trim();
      }
      if (updateData.mobile_number !== undefined) {
        dbUpdateData.user_mobile_number = updateData.mobile_number;
      }
      if (updateData.gender !== undefined) {
        dbUpdateData.user_gender = updateData.gender;
      }
      if (updateData.date_of_birth !== undefined) {
        dbUpdateData.user_date_of_birth = updateData.date_of_birth;
      }
      if (updateData.residential_address !== undefined) {
        dbUpdateData.user_residential_address = updateData.residential_address;
      }
      if (updateData.postcode !== undefined) {
        dbUpdateData.user_postcode = updateData.postcode;
      }
      if (updateData.city !== undefined) {
        dbUpdateData.user_city = updateData.city;
      }
      if (updateData.state !== undefined) {
        dbUpdateData.user_state = updateData.state;
      }
      if (updateData.spouse_name !== undefined) {
        dbUpdateData.user_spouse_name = updateData.spouse_name;
      }
      if (updateData.spouse_mobile_phone !== undefined) {
        dbUpdateData.user_spouse_mobile_phone = updateData.spouse_mobile_phone;
      }
      if (updateData.social_media !== undefined) {
        dbUpdateData.user_social_media = JSON.stringify(
          updateData.social_media
        );
      }

      // Update the profile
      const updatedRows = await db("user")
        .where({ user_id: userId })
        .update(dbUpdateData);

      if (updatedRows === 0) {
        return sendError(res, 404, "Profile not found");
      }

      // Fetch the updated profile
      const updatedProfile = await db("user")
        .where({ user_id: userId })
        .select([
          "user_id",
          "user_email",
          "user_fullname",
          "user_mykad_number",
          "user_mobile_number",
          "user_gender",
          "user_date_of_birth",
          "user_residential_address",
          "user_postcode",
          "user_city",
          "user_state",
          "user_role",
          "user_created_at",
          "user_last_logged_in",
          "user_spouse_name",
          "user_spouse_mobile_phone",
          "user_social_media",
        ])
        .first();

      // Parse social media JSON if it exists
      let socialMedia = null;
      if (updatedProfile.user_social_media) {
        try {
          socialMedia = JSON.parse(updatedProfile.user_social_media);
        } catch (error) {
          console.warn("Error parsing social media JSON:", error);
        }
      }

      const profileData: UserProfile = {
        ...updatedProfile,
        social_media: socialMedia,
        email_notifications: true,
        sms_notifications: true,
      };

      return sendSuccess(res, profileData, "Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Upload profile avatar
   */
  static async uploadAvatar(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, 401, "User not authenticated");
      }

      // This is a placeholder for file upload functionality
      // You would need to implement actual file upload logic here
      // using multer or similar middleware

      return sendSuccess(
        res,
        { message: "Avatar upload functionality to be implemented" },
        "Avatar upload endpoint ready"
      );
    } catch (error) {
      console.error("Upload avatar error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return sendError(res, 401, "User not authenticated");
      }

      const { email_notifications, sms_notifications } = req.body;

      // For now, we'll store these preferences in a simple way
      // In a production app, you might want a separate preferences table
      const preferences = {
        email_notifications: Boolean(email_notifications),
        sms_notifications: Boolean(sms_notifications),
      };

      // Store preferences as JSON in a user preferences field
      // or create a separate user_preferences table
      await db("user")
        .where({ user_id: userId })
        .update({
          user_notification_preferences: JSON.stringify(preferences),
        });

      return sendSuccess(
        res,
        preferences,
        "Notification preferences updated successfully"
      );
    } catch (error) {
      console.error("Update notification preferences error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }
}
