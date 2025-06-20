export interface EmailOptions {
  to: string | string[];
  subject?: string;
  body?: string;
  textBody?: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
  templateId?: string;
  variables?: Record<string, any>;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    to: string | string[];
    subject?: string;
    createdAt: string;
  };
  error?: any;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
} 