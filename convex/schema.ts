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
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_category", ["categoryId"])
    .index("by_created", ["createdAt"]),

  reviews: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.string(),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),

  pages: defineTable({
    name: v.string(),
    title: v.string(),
    slug: v.string(),
    order: v.number(),
    isVisible: v.boolean(),
  }).index("by_order", ["order"]),

  aboutPage: defineTable({
    title: v.string(),
    description: v.string(),
    mainImage: v.optional(v.id("_storage")),
    companyHistory: v.string(),
    companyHistoryImage: v.optional(v.id("_storage")),
    companyHistoryVisible: v.optional(v.boolean()),
    vision: v.string(),
    mission: v.string(),
    values: v.string(),
    visionMissionValuesVisible: v.optional(v.boolean()),
    teamTitle: v.string(),
    teamDescription: v.string(),
    teamMembers: v.array(
      v.object({
        name: v.string(),
        position: v.string(),
        bio: v.string(),
        image: v.optional(v.id("_storage")),
        order: v.number(),
      })
    ),
    teamVisible: v.optional(v.boolean()),
    contactPhone: v.string(),
    contactEmail: v.string(),
    contactAddress: v.string(),
    contactInfoVisible: v.optional(v.boolean()),
    isVisible: v.boolean(),
  }),

  terms: defineTable({
    title: v.string(),
    description: v.string(),
    introduction: v.string(),
    accountTerms: v.string(),
    paymentTerms: v.string(),
    shippingPolicy: v.string(),
    returnPolicy: v.string(),
    lastUpdated: v.string(),
    introductionVisible: v.boolean(),
    accountTermsVisible: v.boolean(),
    paymentTermsVisible: v.boolean(),
    shippingPolicyVisible: v.boolean(),
    returnPolicyVisible: v.boolean(),
    contactInfoVisible: v.boolean(),
    isVisible: v.boolean(),
    contactInfo: v.object({
      email: v.string(),
      phone: v.string(),
      address: v.string(),
    }),
  }),

  contactPage: defineTable({
    title: v.string(),
    description: v.string(),
    phone: v.string(),
    email: v.string(),
    address: v.string(),
    mapLocation: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    workingHours: v.string(),
    formTitle: v.string(),
    formDescription: v.string(),
    mapTitle: v.string(),
    mapDescription: v.string(),
  }),

  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.optional(v.string()),
    message: v.string(),
    status: v.string(),
    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  wishlist: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    addedAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),

  cart: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
    selectedSize: v.optional(v.string()),
    selectedColor: v.optional(v.string()),
    addedAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),

  coupons: defineTable({
    name: v.string(),
    code: v.string(),
    discountPercentage: v.number(),
    isActive: v.boolean(),
    usageLimit: v.optional(v.number()),
    usageCount: v.optional(v.number()),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_code", ["code"]),

  settings: defineTable({
    shippingCost: v.number(),
    freeShippingThreshold: v.union(v.number(), v.null()),
    notificationType: v.optional(v.string()),
    // Add other settings fields as needed
  }),
});
