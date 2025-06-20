export interface User {
  id: string;
  email: string;
  fullname: string;
  user_type: UserRole;
  avatar: string;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'superadmin' | 'admin' | 'operator' | 'user';

export interface UserProfile {
  user_id: string;
  user_email: string;
  user_fullname: string;
  user_mykad_number?: string;
  user_mobile_number?: string;
  user_gender?: 'male' | 'female';
  user_date_of_birth?: string;
  user_residential_address?: string;
  user_postcode?: string;
  user_city?: string;
  user_state?: string;
  user_role: UserRole;
  user_created_at?: string;
  user_last_logged_in?: string;
  user_spouse_name?: string;
  user_spouse_mobile_phone?: string;
  user_social_media?: string;
  avatar?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
}

export interface UpdateProfileRequest {
  fullname?: string;
  mykad_number?: string;
  mobile_number?: string;
  gender?: 'male' | 'female';
  date_of_birth?: string;
  residential_address?: string;
  postcode?: string;
  city?: string;
  state?: string;
  spouse_name?: string;
  spouse_mobile_phone?: string;
  social_media?: Record<string, string>;
  email_notifications?: boolean;
  sms_notifications?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  fullname: string;
  password: string;
  password_confirmation: string;
}

export interface SSOCredentials {
  provider: 'google' | 'facebook';
  token: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface CSRFToken {
  token: string;
} 