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
export type BusinessType = "sole-proprietorship" | "partnership" | "sdn-bhd" | "berhad";
export type BusinessSector = "manufacturing" | "service";
export type BusinessCategory = "startup" | "micro" | "small" | "medium" | "large";
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
export declare const BUSINESS_TYPE_OPTIONS: readonly [{
    readonly value: "sole-proprietorship";
    readonly label: "Sole Proprietorship";
}, {
    readonly value: "partnership";
    readonly label: "Partnership";
}, {
    readonly value: "sdn-bhd";
    readonly label: "Sdn Bhd";
}, {
    readonly value: "berhad";
    readonly label: "Berhad";
}];
export declare const BUSINESS_SECTOR_OPTIONS: readonly [{
    readonly value: "manufacturing";
    readonly label: "Manufacturing";
}, {
    readonly value: "service";
    readonly label: "Service";
}];
export declare const BUSINESS_CATEGORY_OPTIONS: readonly [{
    readonly value: "startup";
    readonly label: "Startup";
}, {
    readonly value: "micro";
    readonly label: "Micro";
}, {
    readonly value: "small";
    readonly label: "Small";
}, {
    readonly value: "medium";
    readonly label: "Medium";
}, {
    readonly value: "large";
    readonly label: "Large";
}];
//# sourceMappingURL=business.d.ts.map