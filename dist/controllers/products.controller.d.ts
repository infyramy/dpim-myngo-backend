/// <reference types="cookie-parser" />
import { Request, Response } from "express";
interface Tag {
    id: number;
    name: string;
    slug: string;
}
export declare class ProductsController {
    /**
     * Get all products in the system (for product matching)
     */
    static getAllProducts(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getLookupTitle(lookupValue: string, lookupId: number): Promise<any>;
    /**
     * Get all products with their tags
     */
    static getProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Helper method to create or get tags
     */
    static createOrGetTags(tagNames: string[], userId: number): Promise<Tag[]>;
    /**
     * Helper method to associate tags with a product
     */
    static associateProductTags(productId: number, tagIds: number[]): Promise<void>;
    /**
     * Create a new product with tags
     */
    static createProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update an existing product with tags
     */
    static updateProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete a product (and its associated tags)
     */
    static deleteProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get a single product by ID with tags
     */
    static getProductById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all tags from all users (for product matching)
     */
    static getAllTags(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get all user's tags
     */
    static getUserTags(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export {};
//# sourceMappingURL=products.controller.d.ts.map