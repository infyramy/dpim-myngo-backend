import { Request, Response } from "express";
import { db } from "../config/database";
import { sendSuccess, sendError } from "../utils/response";

// Types
interface Tag {
  id: number;
  name: string;
  slug: string;
}

export class ProductsController {
  /**
   * Get all products in the system (for product matching)
   */
  static async getAllProducts(_req: Request, res: Response) {
    try {
      const products = await db("products")
        .leftJoin("businesses", "products.p_business_id", "businesses.b_id")
        .select(
          "products.p_id as id",
          "products.p_name as name",
          "products.p_description as description",
          "products.p_category as category",
          "products.p_image_url as image",
          "products.p_link as link",
          "products.p_status as status",
          "products.p_featured as featured",
          "products.p_slug as slug",
          "products.p_business_id as businessId",
          "products.p_created_at as createdAt",
          "products.p_modified_at as modifiedAt",
          // Business fields
          "businesses.b_id as business_id",
          "businesses.b_company_name as business_name",
          "businesses.b_ssm_number as business_ssm",
          "businesses.b_office_number as business_phone",
          "businesses.b_address as business_address",
          "businesses.b_type as business_type",
          "businesses.b_sector as business_sector",
          "businesses.b_category as business_category",
          "businesses.b_mof_registration as business_mof_registration",
          "businesses.b_mof_registration_number as business_mof_registration_number",
          "businesses.b_url as business_url",
          "businesses.b_created_at as business_created_at"
        )
        .where("products.p_status", 1) // Only active products
        .orderBy("products.p_created_at", "desc");

      console.log("Total products fetched for matching:", products.length);

      // Get tags for all products
      const productIds = products.map((p) => p.id);
      const productTags =
        productIds.length > 0
          ? await db("product_tags")
              .join("tags", "product_tags.pt_tag_id", "tags.t_id")
              .select(
                "product_tags.pt_product_id as productId",
                "tags.t_id as id",
                "tags.t_name as name",
                "tags.t_slug as slug"
              )
              .whereIn("product_tags.pt_product_id", productIds)
          : [];

      // Group tags by product ID
      const tagsByProduct = productTags.reduce((acc, tag) => {
        if (!acc[tag.productId]) {
          acc[tag.productId] = [];
        }
        acc[tag.productId].push({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        });
        return acc;
      }, {} as Record<number, any[]>);

      // Get lookup title (business_type, business_sector, business_category)
      // const businessType = await db("lookup")
      //   .select("lookup_title as title")
      //   .where("lookup_value", "business_type")
      //   .first();
      // const businessSector = await db("lookup")
      //   .select("lookup_title as title")
      //   .where("lookup_value", "business_sector")
      //   .first();
      // const businessCategory = await db("lookup")
      //   .select("lookup_title as title")
      //   .where("lookup_value", "business_category")
      //   .first();

      // Convert status and featured to proper format and add tags with business info
      const formattedProducts = await Promise.all(
        products.map(async (product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          image:
            product.image ||
            "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image",
          link: product.link,
          status: product.status === 1 ? "active" : "inactive",
          featured: product.featured === 1,
          slug: product.slug,
          businessId: product.businessId,
          createdAt: product.createdAt,
          modifiedAt: product.modifiedAt,
          tags: tagsByProduct[product.id] || [],
          // Include business information if available
          business: product.business_id
            ? {
                id: product.business_id,
                name: product.business_name,
                ssm: product.business_ssm,
                phone: product.business_phone,
                address: product.business_address,
                type: await ProductsController.getLookupTitle(
                  "business_type",
                  product.business_type
                ),
                sector: await ProductsController.getLookupTitle(
                  "business_sector",
                  product.business_sector
                ),
                category: await ProductsController.getLookupTitle(
                  "business_category",
                  product.business_category
                ),
                mofRegistration: product.business_mof_registration === 1,
                mofRegistrationNumber: product.business_mof_registration_number,
                url: product.business_url,
                createdAt: product.business_created_at,
              }
            : null,
        }))
      );

      return sendSuccess(
        res,
        { products: formattedProducts },
        "All products fetched successfully"
      );
    } catch (error) {
      console.error("Get all products error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  static async getLookupTitle(lookupValue: string, lookupId: number) {
    let lookupGroupcode = 1;

    if (lookupValue === "business_type") lookupGroupcode = 1;
    else if (lookupValue === "business_sector") lookupGroupcode = 6;
    else if (lookupValue === "business_category") lookupGroupcode = 12;

    const lookup = await db("lookup")
      .select("lookup_title as title")
      .where("lookup_groupcode", lookupGroupcode)
      .where("lookup_value", lookupId)
      .first();

    return lookup?.title;
  }

  /**
   * Get all products with their tags
   */
  static async getProducts(req: Request, res: Response) {
    try {
      // Get user ID from request
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 401, "User authentication required");
      }

      const products = await db("products")
        .leftJoin("businesses", "products.p_business_id", "businesses.b_id")
        .select(
          "products.p_id as id",
          "products.p_name as name",
          "products.p_description as description",
          "products.p_category as category",
          "products.p_image_url as image",
          "products.p_link as link",
          "products.p_status as status",
          "products.p_featured as featured",
          "products.p_slug as slug",
          "products.p_business_id as businessId",
          "products.p_created_at as createdAt",
          "products.p_modified_at as modifiedAt",
          // Business fields
          "businesses.b_id as business_id",
          "businesses.b_company_name as business_name",
          "businesses.b_ssm_number as business_ssm",
          "businesses.b_office_number as business_phone",
          "businesses.b_address as business_address",
          "businesses.b_type as business_type",
          "businesses.b_sector as business_sector",
          "businesses.b_category as business_category",
          "businesses.b_mof_registration as business_mof_registration",
          "businesses.b_mof_registration_number as business_mof_registration_number",
          "businesses.b_url as business_url",
          "businesses.b_created_at as business_created_at"
        )
        .where("products.p_user_id", userId)
        .orderBy("products.p_created_at", "desc");

      console.log("Total products fetched:", products.length);

      // Get tags for all products
      const productIds = products.map((p) => p.id);
      const productTags =
        productIds.length > 0
          ? await db("product_tags")
              .join("tags", "product_tags.pt_tag_id", "tags.t_id")
              .select(
                "product_tags.pt_product_id as productId",
                "tags.t_id as id",
                "tags.t_name as name",
                "tags.t_slug as slug"
              )
              .whereIn("product_tags.pt_product_id", productIds)
          : [];

      // Group tags by product ID
      const tagsByProduct = productTags.reduce((acc, tag) => {
        if (!acc[tag.productId]) {
          acc[tag.productId] = [];
        }
        acc[tag.productId].push({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        });
        return acc;
      }, {} as Record<number, any[]>);

      // Convert status and featured to proper format and add tags with business info
      const formattedProducts = products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        image:
          product.image ||
          "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image",
        link: product.link,
        status: product.status === 1 ? "active" : "inactive",
        featured: product.featured === 1,
        slug: product.slug,
        businessId: product.businessId,
        createdAt: product.createdAt,
        modifiedAt: product.modifiedAt,
        tags: tagsByProduct[product.id] || [],
        // Include business information if available
        business: product.business_id
          ? {
              id: product.business_id,
              name: product.business_name,
              ssm: product.business_ssm,
              phone: product.business_phone,
              address: product.business_address,
              type: product.business_type,
              sector: product.business_sector,
              category: product.business_category,
              mofRegistration: product.business_mof_registration === 1,
              mofRegistrationNumber: product.business_mof_registration_number,
              url: product.business_url,
              createdAt: product.business_created_at,
            }
          : null,
      }));

      return sendSuccess(
        res,
        { products: formattedProducts },
        "Products fetched successfully"
      );
    } catch (error) {
      console.error("Get products error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Helper method to create or get tags
   */
  static async createOrGetTags(
    tagNames: string[],
    userId: number
  ): Promise<Tag[]> {
    const tags: Tag[] = [];

    for (const tagName of tagNames) {
      const cleanTagName = tagName.trim().toLowerCase();
      if (!cleanTagName) continue;

      // Generate slug
      const slug = cleanTagName
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Check if tag exists for this user
      let existingTag = await db("tags")
        .where("t_name", cleanTagName)
        .where("t_user_id", userId)
        .first();

      if (!existingTag) {
        // Create new tag
        const [tagId] = await db("tags").insert({
          t_name: cleanTagName,
          t_slug: slug,
          t_user_id: userId,
        });

        existingTag = {
          t_id: tagId,
          t_name: cleanTagName,
          t_slug: slug,
        };
      }

      tags.push({
        id: existingTag.t_id,
        name: existingTag.t_name,
        slug: existingTag.t_slug,
      });
    }

    return tags;
  }

  /**
   * Helper method to associate tags with a product
   */
  static async associateProductTags(productId: number, tagIds: number[]) {
    // Remove existing associations
    await db("product_tags").where("pt_product_id", productId).del();

    // Add new associations
    if (tagIds.length > 0) {
      const productTagData = tagIds.map((tagId) => ({
        pt_product_id: productId,
        pt_tag_id: tagId,
      }));

      await db("product_tags").insert(productTagData);
    }
  }

  /**
   * Create a new product with tags
   */
  static async createProduct(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        category,
        image,
        link,
        status,
        featured,
        businessId,
        tags: tagNames = [],
      } = req.body;

      // Basic validation
      if (!name || !description || !category) {
        return sendError(
          res,
          400,
          "Name, description, and category are required"
        );
      }

      // Get user ID from request
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 401, "User authentication required");
      }

      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim("-");

      // Check if slug already exists for this user
      let finalSlug = slug;
      let counter = 1;
      while (true) {
        const existingProduct = await db("products")
          .where("p_slug", finalSlug)
          .where("p_user_id", userId)
          .first();

        if (!existingProduct) break;

        finalSlug = `${slug}-${counter}`;
        counter++;
      }

      // Prepare product data for database insertion
      const productData = {
        p_name: name.trim(),
        p_description: description.trim(),
        p_category: category,
        p_image_url: image?.trim() || null,
        p_link: link?.trim() || null,
        p_status: status === "active" ? 1 : 0,
        p_featured: featured ? 1 : 0,
        p_slug: finalSlug,
        p_business_id: businessId || null,
        p_user_id: userId,
      };

      // Insert the product
      const [productId] = await db("products").insert(productData);

      // Handle tags
      let productTags: Tag[] = [];
      if (Array.isArray(tagNames) && tagNames.length > 0) {
        productTags = await ProductsController.createOrGetTags(
          tagNames,
          userId
        );
        const tagIds = productTags.map((tag) => tag.id);
        await ProductsController.associateProductTags(productId, tagIds);
      }

      // Fetch the created product with proper field mapping
      const createdProduct = await db("products")
        .select(
          "p_id as id",
          "p_name as name",
          "p_description as description",
          "p_category as category",
          "p_image_url as image",
          "p_link as link",
          "p_status as status",
          "p_featured as featured",
          "p_slug as slug",
          "p_business_id as businessId",
          "p_created_at as createdAt",
          "p_modified_at as modifiedAt"
        )
        .where("p_id", productId)
        .first();

      // Format the response
      const formattedProduct = {
        ...createdProduct,
        status: createdProduct.status === 1 ? "active" : "inactive",
        featured: createdProduct.featured === 1,
        image:
          createdProduct.image ||
          "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image",
        tags: productTags,
      };

      return sendSuccess(
        res,
        { product: formattedProduct },
        "Product created successfully"
      );
    } catch (error) {
      console.error("Create product error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Update an existing product with tags
   */
  static async updateProduct(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const {
        name,
        description,
        category,
        image,
        link,
        status,
        featured,
        businessId,
        tags: tagNames = [],
      } = req.body;

      // Validate product ID
      if (!productId || isNaN(Number(productId))) {
        return sendError(res, 400, "Invalid product ID");
      }

      // Get user ID from request
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 401, "User authentication required");
      }

      // Check if product exists and belongs to user
      const existingProduct = await db("products")
        .where("p_id", productId)
        .where("p_user_id", userId)
        .first();

      if (!existingProduct) {
        return sendError(res, 404, "Product not found or access denied");
      }

      // Basic validation
      if (!name || !description || !category) {
        return sendError(
          res,
          400,
          "Name, description, and category are required"
        );
      }

      // Generate slug from name if name changed
      let finalSlug = existingProduct.p_slug;
      if (name.trim() !== existingProduct.p_name) {
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim("-");

        // Check if new slug already exists for other products
        let counter = 1;
        finalSlug = slug;
        while (true) {
          const duplicateSlug = await db("products")
            .where("p_slug", finalSlug)
            .where("p_user_id", userId)
            .where("p_id", "!=", productId)
            .first();

          if (!duplicateSlug) break;

          finalSlug = `${slug}-${counter}`;
          counter++;
        }
      }

      // Prepare product data for update
      const productData = {
        p_name: name.trim(),
        p_description: description.trim(),
        p_category: category,
        p_image_url: image?.trim() || null,
        p_link: link?.trim() || null,
        p_status: status === "active" ? 1 : 0,
        p_featured: featured ? 1 : 0,
        p_slug: finalSlug,
        p_business_id: businessId || null,
        p_modified_at: new Date(),
      };

      // Update the product
      await db("products")
        .where("p_id", productId)
        .where("p_user_id", userId)
        .update(productData);

      // Handle tags
      let productTags: Tag[] = [];
      if (Array.isArray(tagNames) && tagNames.length > 0) {
        productTags = await ProductsController.createOrGetTags(
          tagNames,
          userId
        );
        const tagIds = productTags.map((tag) => tag.id);
        await ProductsController.associateProductTags(
          Number(productId),
          tagIds
        );
      } else {
        // Remove all tags if no tags provided
        await ProductsController.associateProductTags(Number(productId), []);
      }

      // Fetch the updated product with proper field mapping
      const updatedProduct = await db("products")
        .select(
          "p_id as id",
          "p_name as name",
          "p_description as description",
          "p_category as category",
          "p_image_url as image",
          "p_link as link",
          "p_status as status",
          "p_featured as featured",
          "p_slug as slug",
          "p_business_id as businessId",
          "p_created_at as createdAt",
          "p_modified_at as modifiedAt"
        )
        .where("p_id", productId)
        .first();

      // Format the response
      const formattedProduct = {
        ...updatedProduct,
        status: updatedProduct.status === 1 ? "active" : "inactive",
        featured: updatedProduct.featured === 1,
        image:
          updatedProduct.image ||
          "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image",
        tags: productTags,
      };

      return sendSuccess(
        res,
        { product: formattedProduct },
        "Product updated successfully"
      );
    } catch (error) {
      console.error("Update product error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Delete a product (and its associated tags)
   */
  static async deleteProduct(req: Request, res: Response) {
    try {
      const productId = req.params.id;

      // Validate product ID
      if (!productId || isNaN(Number(productId))) {
        return sendError(res, 400, "Invalid product ID");
      }

      // Get user ID from request
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 401, "User authentication required");
      }

      // Check if product exists and belongs to user
      const existingProduct = await db("products")
        .where("p_id", productId)
        .where("p_user_id", userId)
        .first();

      if (!existingProduct) {
        return sendError(res, 404, "Product not found or access denied");
      }

      // Delete the product (cascade will handle product_tags deletion)
      await db("products")
        .where("p_id", productId)
        .where("p_user_id", userId)
        .del();

      return sendSuccess(
        res,
        { productId: Number(productId) },
        "Product deleted successfully"
      );
    } catch (error) {
      console.error("Delete product error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Get a single product by ID with tags
   */
  static async getProductById(req: Request, res: Response) {
    try {
      const productId = req.params.id;

      // Validate product ID
      if (!productId || isNaN(Number(productId))) {
        return sendError(res, 400, "Invalid product ID");
      }

      // Get user ID from request
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 401, "User authentication required");
      }

      // Fetch the product
      const product = await db("products")
        .select(
          "p_id as id",
          "p_name as name",
          "p_description as description",
          "p_category as category",
          "p_image_url as image",
          "p_link as link",
          "p_status as status",
          "p_featured as featured",
          "p_slug as slug",
          "p_business_id as businessId",
          "p_created_at as createdAt",
          "p_modified_at as modifiedAt"
        )
        .where("p_id", productId)
        .where("p_user_id", userId)
        .first();

      if (!product) {
        return sendError(res, 404, "Product not found or access denied");
      }

      // Get tags for this product
      const tags = await db("product_tags")
        .join("tags", "product_tags.pt_tag_id", "tags.t_id")
        .select("tags.t_id as id", "tags.t_name as name", "tags.t_slug as slug")
        .where("product_tags.pt_product_id", productId);

      // Format the response
      const formattedProduct = {
        ...product,
        status: product.status === 1 ? "active" : "inactive",
        featured: product.featured === 1,
        image:
          product.image ||
          "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image",
        tags: tags,
      };

      return sendSuccess(
        res,
        { product: formattedProduct },
        "Product fetched successfully"
      );
    } catch (error) {
      console.error("Get product by ID error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Get all tags from all users (for product matching)
   */
  static async getAllTags(_req: Request, res: Response) {
    try {
      const tags = await db("tags")
        .select(
          "t_id as id",
          "t_name as name",
          "t_slug as slug",
          "t_created_at as createdAt"
        )
        .orderBy("t_name", "asc");

      return sendSuccess(res, { tags }, "All tags fetched successfully");
    } catch (error) {
      console.error("Get all tags error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }

  /**
   * Get all user's tags
   */
  static async getUserTags(req: Request, res: Response) {
    try {
      // Get user ID from request
      const userId = req.user?.id;
      if (!userId) {
        return sendError(res, 401, "User authentication required");
      }

      const tags = await db("tags")
        .select(
          "t_id as id",
          "t_name as name",
          "t_slug as slug",
          "t_created_at as createdAt"
        )
        .where("t_user_id", userId)
        .orderBy("t_name", "asc");

      return sendSuccess(res, { tags }, "Tags fetched successfully");
    } catch (error) {
      console.error("Get user tags error:", error);
      return sendError(res, 500, "Internal server error");
    }
  }
}
