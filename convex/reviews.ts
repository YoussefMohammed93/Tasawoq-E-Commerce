import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

// Get all reviews for a product
export const getProductReviews = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .collect();

    // Get user information for each review
    const reviewsWithUserInfo = await Promise.all(
      reviews.map(async (review) => {
        const user = await ctx.db.get(review.userId);
        return {
          ...review,
          userName: user
            ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
            : "مستخدم",
          userImage: user?.imageUrl,
        };
      })
    );

    return reviewsWithUserInfo;
  },
});

// Get all reviews for the current user
export const getUserReviews = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // Get product information for each review
    const reviewsWithProductInfo = await Promise.all(
      reviews.map(async (review) => {
        const product = await ctx.db.get(review.productId);
        return {
          ...review,
          productName: product?.name || "منتج غير متوفر",
          productImage: product
            ? await ctx.storage.getUrl(product.mainImage)
            : null,
        };
      })
    );

    return reviewsWithProductInfo;
  },
});

// Get all reviews for admin dashboard
export const getAllReviews = query({
  handler: async (ctx) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_created")
      .order("desc")
      .collect();

    // Get user and product information for each review
    const reviewsWithInfo = await Promise.all(
      reviews.map(async (review) => {
        const user = await ctx.db.get(review.userId);
        const product = await ctx.db.get(review.productId);

        return {
          ...review,
          userName: user
            ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
            : "مستخدم",
          userImage: user?.imageUrl,
          productName: product?.name || "منتج غير متوفر",
          productImage: product
            ? await ctx.storage.getUrl(product.mainImage)
            : null,
        };
      })
    );

    return reviewsWithInfo;
  },
});

// Add a new review
export const addReview = mutation({
  args: {
    productId: v.id("products"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Check if user has already reviewed this product
    const existingReview = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (existingReview) {
      // Update existing review
      return await ctx.db.patch(existingReview._id, {
        rating: args.rating,
        comment: args.comment,
        createdAt: new Date().toISOString(),
      });
    }

    // Create new review
    return await ctx.db.insert("reviews", {
      userId: user._id,
      productId: args.productId,
      rating: args.rating,
      comment: args.comment,
      createdAt: new Date().toISOString(),
    });
  },
});

// Delete a review
export const deleteReview = mutation({
  args: {
    reviewId: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const review = await ctx.db.get(args.reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    // Only allow users to delete their own reviews (or implement admin check here)
    if (review.userId !== user._id) {
      throw new Error("Unauthorized to delete this review");
    }

    await ctx.db.delete(args.reviewId);
    return true;
  },
});

// Admin delete review (no user check)
export const adminDeleteReview = mutation({
  args: {
    reviewId: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reviewId);
    return true;
  },
});
