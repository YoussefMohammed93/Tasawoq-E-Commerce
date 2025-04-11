import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Record a new website view with 24-hour unique visitor tracking
export const recordView = mutation({
  args: {
    visitorId: v.string(),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const now = new Date().toISOString();

    // Get current user if authenticated
    const currentUser = await getCurrentUser(ctx);
    const isAuthenticated = !!currentUser;

    // Check if this visitor has been seen before
    const existingVisitor = await ctx.db
      .query("visitorSessions")
      .withIndex("by_visitor_id", (q) => q.eq("visitorId", args.visitorId))
      .first();

    let isNewUniqueView = false;

    if (existingVisitor) {
      // Check if the last visit was on a different day
      if (existingVisitor.lastVisitDate !== today) {
        isNewUniqueView = true;

        // Update the visitor's last visit timestamp
        await ctx.db.patch(existingVisitor._id, {
          lastVisitDate: today,
          lastVisitTimestamp: now,
          isAuthenticated,
          userId: currentUser ? currentUser._id : undefined,
        });
      }
    } else {
      // This is a new visitor
      isNewUniqueView = true;

      // Create a new visitor record
      await ctx.db.insert("visitorSessions", {
        visitorId: args.visitorId,
        lastVisitDate: today,
        lastVisitTimestamp: now,
        isAuthenticated,
        userId: currentUser ? currentUser._id : undefined,
      });
    }

    // Check if we already have a record for today
    const existingRecord = await ctx.db
      .query("websiteViews")
      .withIndex("by_date", (q) => q.eq("date", today))
      .first();

    if (existingRecord) {
      // Update the existing record
      await ctx.db.patch(existingRecord._id, {
        count: existingRecord.count + 1,
        uniqueCount: isNewUniqueView
          ? existingRecord.uniqueCount + 1
          : existingRecord.uniqueCount,
        updatedAt: now,
      });
      return {
        totalViews: existingRecord.count + 1,
        uniqueViews: isNewUniqueView
          ? existingRecord.uniqueCount + 1
          : existingRecord.uniqueCount,
      };
    } else {
      // Create a new record for today
      await ctx.db.insert("websiteViews", {
        date: today,
        count: 1,
        uniqueCount: 1, // First view of the day is always unique
        updatedAt: now,
      });
      return {
        totalViews: 1,
        uniqueViews: 1,
      };
    }
  },
});

// Get total website views
export const getTotalViews = query({
  args: {},
  handler: async (ctx) => {
    const records = await ctx.db.query("websiteViews").collect();

    // Calculate total views and unique views
    const totalViews = records.reduce((sum, record) => sum + record.count, 0);
    const uniqueViews = records.reduce(
      (sum, record) => sum + record.uniqueCount,
      0
    );

    return {
      totalViews,
      uniqueViews,
    };
  },
});

// Get total unique visitors (for backward compatibility)
export const getTotalUniqueViews = query({
  args: {},
  handler: async (ctx) => {
    const records = await ctx.db.query("websiteViews").collect();
    const uniqueViews = records.reduce(
      (sum, record) => sum + record.uniqueCount,
      0
    );
    return uniqueViews;
  },
});

// Get views for the last 7 days
export const getRecentViews = query({
  args: {},
  handler: async (ctx) => {
    const records = await ctx.db.query("websiteViews").order("desc").take(7);

    return records;
  },
});

// Get views for a specific date range
export const getViewsByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("websiteViews")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .collect();

    return records;
  },
});
