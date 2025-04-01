import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all products with their images URLs
export const getProducts = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").order("desc").collect();

    return await Promise.all(
      products.map(async (product) => ({
        ...product,
        mainImageUrl: await ctx.storage.getUrl(product.mainImage),
        galleryUrls: await Promise.all(
          product.gallery.map(
            async (imageId) => await ctx.storage.getUrl(imageId)
          )
        ),
      }))
    );
  },
});

// Get a single product by ID
export const getProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return null;

    return {
      ...product,
      mainImageUrl: await ctx.storage.getUrl(product.mainImage),
      galleryUrls: await Promise.all(
        product.gallery.map(
          async (imageId) => await ctx.storage.getUrl(imageId)
        )
      ),
    };
  },
});

// Save or update a product
export const saveProduct = mutation({
  args: {
    id: v.optional(v.id("products")),
    name: v.string(),
    description: v.string(),
    mainImage: v.id("_storage"),
    gallery: v.array(v.id("_storage")),
    price: v.number(),
    discountPercentage: v.number(),
    quantity: v.number(),
    sizes: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
      })
    ),
    colors: v.array(
      v.object({
        name: v.string(),
        value: v.string(),
      })
    ),
    categoryId: v.id("categories"),
    badges: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...productData } = args;
    const now = new Date().toISOString();

    const sortedSizes = [...productData.sizes].sort((a, b) => {
      const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
      return sizeOrder.indexOf(a.name) - sizeOrder.indexOf(b.name);
    });

    const mainPrice =
      sortedSizes.length > 0 ? sortedSizes[0].price : productData.price;

    if (id) {
      return await ctx.db.patch(id, {
        ...productData,
        price: mainPrice,
        updatedAt: now,
      });
    }

    return await ctx.db.insert("products", {
      ...productData,
      price: mainPrice,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Delete a product
export const deleteProduct = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");

    await ctx.storage.delete(product.mainImage);

    for (const imageId of product.gallery) {
      await ctx.storage.delete(imageId);
    }

    await ctx.db.delete(args.productId);
    return true;
  },
});
