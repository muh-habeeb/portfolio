import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all social links
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("socialLinks")
      .order("asc")
      .collect();
  },
});

// Create a new social link
export const create = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    iconUrl: v.optional(v.string()),
    defaultEmoji: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the highest order value and add 1
    const existingLinks = await ctx.db.query("socialLinks").collect();
    const maxOrder = Math.max(...existingLinks.map(link => link.order), 0);

    return await ctx.db.insert("socialLinks", {
      name: args.name,
      url: args.url,
      iconUrl: args.iconUrl,
      defaultEmoji: args.defaultEmoji,
      color: args.color,
      order: maxOrder + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update an existing social link
export const update = mutation({
  args: {
    id: v.id("socialLinks"),
    name: v.optional(v.string()),
    url: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    defaultEmoji: v.optional(v.string()),
    color: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    // Add updatedAt timestamp
    cleanUpdates.updatedAt = Date.now();
    
    return await ctx.db.patch(id, cleanUpdates);
  },
});

// Remove a social link
export const remove = mutation({
  args: {
    id: v.id("socialLinks"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});