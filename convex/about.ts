import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get the about page data
export const getAboutPage = query({
  handler: async (ctx) => {
    const aboutPage = await ctx.db.query("aboutPage").first();

    if (!aboutPage) {
      return null;
    }

    // Get image URLs if they exist
    let mainImageUrl = null;
    let companyHistoryImageUrl = null;
    let teamMembersWithImages = [...aboutPage.teamMembers];

    if (aboutPage.mainImage) {
      mainImageUrl = await ctx.storage.getUrl(aboutPage.mainImage);
    }

    if (aboutPage.companyHistoryImage) {
      companyHistoryImageUrl = await ctx.storage.getUrl(
        aboutPage.companyHistoryImage
      );
    }

    // Get team member image URLs
    if (aboutPage.teamMembers && aboutPage.teamMembers.length > 0) {
      teamMembersWithImages = await Promise.all(
        aboutPage.teamMembers.map(async (member) => {
          if (member.image) {
            const imageUrl = await ctx.storage.getUrl(member.image);
            return { ...member, imageUrl };
          }
          return member;
        })
      );
    }

    return {
      ...aboutPage,
      mainImageUrl,
      companyHistoryImageUrl,
      teamMembers: teamMembersWithImages,
    };
  },
});

// Save the about page data
export const saveAboutPage = mutation({
  args: {
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
    teamMembers: v.optional(
      v.array(
        v.object({
          name: v.string(),
          position: v.string(),
          bio: v.string(),
          image: v.optional(v.id("_storage")),
          order: v.number(),
        })
      )
    ),
    teamVisible: v.optional(v.boolean()),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("aboutPage").first();

    // Clean up team members data by removing imageUrl field
    const cleanedArgs = { ...args };

    // If teamMembers is undefined, don't modify the existing teamMembers
    if (args.teamMembers === undefined) {
      // If teamMembers is undefined, remove it from cleanedArgs to avoid overwriting
      delete cleanedArgs.teamMembers;
    } else if (args.teamMembers && args.teamMembers.length > 0) {
      // Define a type for team member with optional imageUrl
      type TeamMemberWithImageUrl = {
        name: string;
        position: string;
        bio: string;
        image?: Id<"_storage">;
        imageUrl?: string;
        order: number;
      };

      cleanedArgs.teamMembers = args.teamMembers.map((member) => {
        // Create a new object without the imageUrl field
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { imageUrl, ...cleanMember } = member as TeamMemberWithImageUrl;
        // imageUrl is intentionally unused as we're removing it
        return cleanMember;
      });
    }

    if (existing) {
      return await ctx.db.patch(existing._id, cleanedArgs);
    }

    // Initialize with empty team members array if not provided
    const dataToInsert = {
      ...cleanedArgs,
      teamMembers: cleanedArgs.teamMembers || [],
    };

    return await ctx.db.insert("aboutPage", dataToInsert);
  },
});

// Save a team member
export const saveTeamMember = mutation({
  args: {
    aboutPageId: v.id("aboutPage"),
    memberId: v.optional(v.string()),
    name: v.string(),
    position: v.string(),
    bio: v.string(),
    image: v.optional(v.id("_storage")),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { aboutPageId, memberId, ...memberData } = args;
    const aboutPage = await ctx.db.get(aboutPageId);

    if (!aboutPage) {
      throw new Error("About page not found");
    }

    const teamMembers = [...(aboutPage.teamMembers || [])];

    if (memberId) {
      // Update existing member
      const memberIndex = teamMembers.findIndex((m) => m.name === memberId);
      if (memberIndex !== -1) {
        // Remove imageUrl from the existing member data if it exists
        const existingMember = teamMembers[memberIndex];

        // Define a type for team member with optional imageUrl
        type TeamMemberWithImageUrl = {
          name: string;
          position: string;
          bio: string;
          image?: Id<"_storage">;
          imageUrl?: string;
          order: number;
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { imageUrl: _, ...cleanExistingMember } =
          existingMember as TeamMemberWithImageUrl;

        teamMembers[memberIndex] = {
          ...cleanExistingMember,
          ...memberData,
        };
      }
    } else {
      // Add new member
      teamMembers.push({
        ...memberData,
        order: args.order ?? teamMembers.length,
      });
    }

    return await ctx.db.patch(aboutPageId, { teamMembers });
  },
});

// Delete a team member
export const deleteTeamMember = mutation({
  args: {
    aboutPageId: v.id("aboutPage"),
    memberName: v.string(),
  },
  handler: async (ctx, { aboutPageId, memberName }) => {
    const aboutPage = await ctx.db.get(aboutPageId);

    if (!aboutPage || !aboutPage.teamMembers) {
      throw new Error("About page or team members not found");
    }

    const teamMembers = aboutPage.teamMembers.filter(
      (member) => member.name !== memberName
    );

    return await ctx.db.patch(aboutPageId, { teamMembers });
  },
});

// Update team members order
export const updateTeamMembersOrder = mutation({
  args: {
    aboutPageId: v.id("aboutPage"),
    teamMembers: v.array(
      v.object({
        name: v.string(),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, { aboutPageId, teamMembers }) => {
    const aboutPage = await ctx.db.get(aboutPageId);

    if (!aboutPage || !aboutPage.teamMembers) {
      throw new Error("About page or team members not found");
    }

    const updatedTeamMembers = [...aboutPage.teamMembers];

    // Update the order of each team member
    teamMembers.forEach(({ name, order }) => {
      const memberIndex = updatedTeamMembers.findIndex((m) => m.name === name);
      if (memberIndex !== -1) {
        // Define a type for team member with optional imageUrl
        type TeamMemberWithImageUrl = {
          name: string;
          position: string;
          bio: string;
          image?: Id<"_storage">;
          imageUrl?: string;
          order: number;
        };

        // Remove imageUrl from the existing member data if it exists
        const existingMember = updatedTeamMembers[memberIndex];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { imageUrl: _, ...cleanExistingMember } =
          existingMember as TeamMemberWithImageUrl;

        updatedTeamMembers[memberIndex] = {
          ...cleanExistingMember,
          order,
        };
      }
    });

    return await ctx.db.patch(aboutPageId, { teamMembers: updatedTeamMembers });
  },
});

// Get all pages
export const getPages = query({
  handler: async (ctx) => {
    return await ctx.db.query("pages").withIndex("by_order").collect();
  },
});

// Save a page
export const savePage = mutation({
  args: {
    id: v.optional(v.id("pages")),
    name: v.string(),
    title: v.string(),
    slug: v.string(),
    order: v.optional(v.number()),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    if (id) {
      return await ctx.db.patch(id, data);
    }

    const pages = await ctx.db.query("pages").collect();
    return await ctx.db.insert("pages", {
      ...data,
      order: args.order ?? pages.length,
    });
  },
});

// Delete a page
export const deletePage = mutation({
  args: {
    id: v.id("pages"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return true;
  },
});

// Update pages order
export const updatePagesOrder = mutation({
  args: {
    pages: v.array(
      v.object({
        id: v.id("pages"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await Promise.all(
      args.pages.map(({ id, order }) => ctx.db.patch(id, { order }))
    );
    return true;
  },
});
