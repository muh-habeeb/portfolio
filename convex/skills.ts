import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new skill
export const create = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    level: v.number(),
    icon: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("skills", {
        name: args.name,
        category: args.category,
        level: args.level,
        icon: args.icon,
        iconUrl: args.iconUrl,
        order: 0,
        createdAt: 0,
        updatedAt: 0
    });
  },
});

// Update an existing skill
export const update = mutation({
  args: {
    id: v.id("skills"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    level: v.optional(v.number()),
    icon: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );
    
    return await ctx.db.patch(id, cleanUpdates);
  },
});

// Remove a skill
export const remove = mutation({
  args: {
    id: v.id("skills"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});