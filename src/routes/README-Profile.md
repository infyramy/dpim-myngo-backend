# Profile API Documentation

This document describes the Profile API endpoints for managing user profile information.

## Authentication
All profile endpoints require authentication via Bearer token in the Authorization header.

## Endpoints

### GET /api/profile
Get the current user's profile information.

**Response:**
```json
{
  "data": {
    "user_id": "string",
    "user_email": "string",
    "user_fullname": "string",
    "user_mykad_number": "string",
    "user_mobile_number": "string",
    "user_gender": "male|female",
    "user_date_of_birth": "YYYY-MM-DD",
    "user_residential_address": "string",
    "user_postcode": "string",
    "user_city": "string",
    "user_state": "string",
    "user_role": "superadmin|admin|operator|user",
    "user_created_at": "ISO date string",
    "user_last_logged_in": "ISO date string",
    "user_spouse_name": "string",
    "user_spouse_mobile_phone": "string",
    "social_media": "object",
    "email_notifications": "boolean",
    "sms_notifications": "boolean"
  },
  "message": "Profile retrieved successfully",
  "status": 200
}
```

### PUT /api/profile
Update the current user's profile information.

**Request Body:**
```json
{
  "fullname": "string",
  "mykad_number": "string (format: YYMMDD-PB-GGGG)",
  "mobile_number": "string (Malaysian format)",
  "gender": "male|female",
  "date_of_birth": "YYYY-MM-DD",
  "residential_address": "string",
  "postcode": "string",
  "city": "string",
  "state": "string",
  "spouse_name": "string",
  "spouse_mobile_phone": "string",
  "social_media": "object"
}
```

**Response:**
```json
{
  "data": {
    // Updated profile data (same structure as GET)
  },
  "message": "Profile updated successfully",
  "status": 200
}
```

### PUT /api/profile/notifications
Update notification preferences.

**Request Body:**
```json
{
  "email_notifications": "boolean",
  "sms_notifications": "boolean"
}
```

**Response:**
```json
{
  "data": {
    "email_notifications": "boolean",
    "sms_notifications": "boolean"
  },
  "message": "Notification preferences updated successfully",
  "status": 200
}
```

### POST /api/profile/avatar
Upload profile avatar (placeholder endpoint).

**Request:** 
- Multipart/form-data with 'avatar' file field

**Response:**
```json
{
  "data": {
    "message": "Avatar upload functionality to be implemented"
  },
  "message": "Avatar upload endpoint ready",
  "status": 200
}
```

## Error Responses

All endpoints may return the following error responses:

- `401 Unauthorized`: No valid authentication token provided
- `400 Bad Request`: Invalid request data (validation errors)
- `404 Not Found`: Profile not found
- `500 Internal Server Error`: Server error

**Error Response Format:**
```json
{
  "message": "Error description",
  "status": "error_code"
}
```

## Validation Rules

### IC Number (mykad_number)
- Format: YYMMDD-PB-GGGG (e.g., "901234-56-7890")
- Must be unique across all users

### Mobile Number (mobile_number)
- Malaysian format: +6012-345-6789 or 012-345-6789
- Supports various Malaysian mobile prefixes

### Email
- Email field is read-only and cannot be updated via profile API
- Email changes require separate verification process

## Database Schema

The profile data is stored in the `user` table with the following relevant fields:
- `user_id` (Primary Key)
- `user_email`
- `user_fullname`
- `user_mykad_number`
- `user_mobile_number`
- `user_gender`
- `user_date_of_birth`
- `user_residential_address`
- `user_postcode`
- `user_city`
- `user_state`
- `user_role`
- `user_created_at`
- `user_last_logged_in`
- `user_spouse_name`
- `user_spouse_mobile_phone`
- `user_social_media` (JSON)
- `user_notification_preferences` (JSON)

## Frontend Integration

The profile API is integrated with:
- `useProfile()` composable in `/src/composables/useProfile.ts`
- Profile page component in `/src/pages/profile/index.vue`
- TypeScript types in `/src/types/auth.ts`

## Security Considerations

- All endpoints require valid JWT authentication
- IC numbers are validated and checked for uniqueness
- Mobile numbers are validated for Malaysian format
- Social media data is sanitized as JSON
- Email addresses cannot be changed through profile API 