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
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isVisible: v.optional(v.boolean()),
  }),

  categories: defineTable({
    name: v.string(),
    href: v.string(),
    order: v.number(),
    image: v.id("_storage"),
  }).index("by_order", ["order"]),

  partnersPage: defineTable({
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isVisible: v.optional(v.boolean()),
  }),

  partners: defineTable({
    name: v.string(),
    order: v.number(),
    image: v.id("_storage"),
  }).index("by_order", ["order"]),

  featuresPage: defineTable({
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isVisible: v.optional(v.boolean()),
  }),

  features: defineTable({
    name: v.string(),
    description: v.string(),
    order: v.number(),
    image: v.id("_storage"),
  }).index("by_order", ["order"]),

  newsletter: defineTable({
    title: v.string(),
    description: v.string(),
    isVisible: v.boolean(),
    featureOneTitle: v.optional(v.string()),
    featureOneImage: v.optional(v.string()),
    featureTwoTitle: v.optional(v.string()),
    featureTwoImage: v.optional(v.string()),
    buttonText: v.optional(v.string()),
    subscribers: v.array(
      v.object({
        email: v.string(),
        subscribedAt: v.string(),
        isRead: v.boolean(),
      })
    ),
  }),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    mainImage: v.id("_storage"),
    gallery: v.array(v.id("_storage")),
    price: v.number(),
    discountPercentage: v.number(),
    quantity: v.number(),
    sizes: v.array(v.string()),
    colors: v.array(
      v.object({
        name: v.string(),
        value: v.string(),
      })
    ),
    categoryId: v.id("categories"),
    badges: v.array(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_category", ["categoryId"])
    .index("by_created", ["createdAt"]),
});
