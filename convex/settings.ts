import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all settings
export const get = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first();
    return settings || null;
  },
});

// Get shipping settings specifically
export const getShippingSettings = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first();
    if (!settings) {
      return {
        shippingCost: 15, // Default shipping cost
        freeShippingThreshold: null, // Default no free shipping
      };
    }
    return {
      shippingCost: settings.shippingCost,
      freeShippingThreshold: settings.freeShippingThreshold,
    };
  },
});

// Save settings
export const save = mutation({
  args: {
    shippingCost: v.number(),
    freeShippingThreshold: v.union(v.number(), v.null()),
    // Add other settings as needed
    notificationType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("settings").first();

    if (existing) {
      return await ctx.db.patch(existing._id, args);
    }

    return await ctx.db.insert("settings", args);
  },
});
