-- Add user notification preferences column to user table
ALTER TABLE user ADD COLUMN user_notification_preferences TEXT DEFAULT NULL;

-- Add index for better performance
CREATE INDEX idx_user_notification_preferences ON user(user_notification_preferences); 