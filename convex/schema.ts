import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkUserId: v.string(),
    imageUrl: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  }).index("byClerkUserId", ["clerkUserId"]),

  headerLinks: defineTable({
    name: v.string(),
    href: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  hero: defineTable({
    title: v.string(),
    description: v.string(),
    mainImage: v.optional(v.id("_storage")),
    primaryButtonText: v.string(),
    primaryButtonHref: v.string(),
    secondaryButtonText: v.string(),
    secondaryButtonHref: v.string(),
    customerCount: v.number(),
    customerText: v.string(),
    customerImages: v.array(v.id("_storage")),
  }),

  categoriesPage: defineTable({
    title: v.string(),
    description: v.string(),
  }),

  categories: defineTable({
    name: v.string(),
    href: v.string(),
    order: v.number(),
    image: v.id("_storage"),
  }).index("by_order", ["order"]),
});
