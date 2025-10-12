import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Public queries - no auth required
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .order("desc")
      .collect();
  },
});

export const getSkills = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("skills")
      .order("asc")
      .collect();
  },
});

export const getExperience = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("experience")
      .order("desc")
      .collect();
  },
});

export const getSettings = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();
    return setting?.value || null;
  },
});

export const getSocialLinks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("socialLinks")
      .order("asc")
      .collect();
  },
});

// Contact form submission
export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", {
      name: args.name,
      email: args.email,
      message: args.message,
      status: "new",
      createdAt: Date.now(),
    });
  },
});