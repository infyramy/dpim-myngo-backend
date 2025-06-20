export interface Business {
  id: string;
  name: string;
  ssm: string;
  address: string;
  phone: string;
  type: BusinessType;
  sector: BusinessSector;
  category: BusinessCategory;
  mofRegistration: boolean;
  mofRegistrationNumber?: string;
  url?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type BusinessType =
  | "sole-proprietorship"
  | "partnership"
  | "sdn-bhd"
  | "berhad";

export type BusinessSector = "manufacturing" | "service";

export type BusinessCategory =
  | "startup"
  | "micro"
  | "small"
  | "medium"
  | "large";

export interface CreateBusinessRequest {
  name: string;
  ssm: string;
  address: string;
  phone: string;
  type: BusinessType;
  sector: BusinessSector;
  category: BusinessCategory;
  mofRegistered: boolean;
  mofRegistrationNumber?: string;
  url?: string | undefined;
}

export interface UpdateBusinessRequest extends Partial<CreateBusinessRequest> {
  id: string;
}

export interface BusinessFormData {
  name: string;
  ssm: string;
  address: string;
  phone: string;
  type: BusinessType | "";
  sector: BusinessSector | "";
  category: BusinessCategory | "";
  mofRegistration: boolean;
  mofRegistrationNumber?: string;
  url?: string;
}

export interface BusinessValidationErrors {
  name?: string;
  ssm?: string;
  address?: string;
  phone?: string;
  type?: string;
  sector?: string;
  category?: string;
  mofRegistrationNumber?: string;
  url?: string;
}

export const BUSINESS_TYPE_OPTIONS = [
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "sdn-bhd", label: "Sdn Bhd" },
  { value: "berhad", label: "Berhad" },
] as const;

export const BUSINESS_SECTOR_OPTIONS = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "service", label: "Service" },
] as const;

export const BUSINESS_CATEGORY_OPTIONS = [
  { value: "startup", label: "Startup" },
  { value: "micro", label: "Micro" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
] as const;
