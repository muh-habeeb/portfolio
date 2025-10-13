import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Public queries - no auth required
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .collect();
    
    // Sort by order field ascending (lower numbers first)
    return projects.sort((a, b) => a.order - b.order);
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
    const experience = await ctx.db
      .query("experience")
      .collect();
    
    // Sort by order field descending (higher numbers first - latest experience on top)
    return experience.sort((a, b) => b.order - a.order);
  },
});

export const getWorkExperience = query({
  args: {},
  handler: async (ctx) => {
    const workExperience = await ctx.db
      .query("experience")
      .filter((q) => q.eq(q.field("type"), "work"))
      .collect();
    
    // Sort by order field descending (higher numbers first - latest experience on top)
    return workExperience.sort((a, b) => b.order - a.order);
  },
});

export const getEducation = query({
  args: {},
  handler: async (ctx) => {
    const education = await ctx.db
      .query("experience")
      .filter((q) => q.eq(q.field("type"), "education"))
      .collect();
    
    // Sort by order field descending (higher numbers first - latest education on top)
    return education.sort((a, b) => b.order - a.order);
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