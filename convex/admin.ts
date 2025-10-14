import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Admin-only mutations (auth will be handled at API level)

// Projects CRUD
export const createProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    techStack: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    codeUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    techStack: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    codeUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Skills CRUD
export const createSkill = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    level: v.number(),
    icon: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("skills", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateSkill = mutation({
  args: {
    id: v.id("skills"),
    name: v.string(),
    category: v.string(),
    level: v.number(),
    icon: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteSkill = mutation({
  args: { id: v.id("skills") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Experience CRUD
export const createExperience = mutation({
  args: {
    type: v.union(v.literal("work"), v.literal("education")),
    title: v.string(),
    organization: v.string(),
    location: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    current: v.boolean(),
    description: v.string(),
    highlights: v.optional(v.array(v.string())),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("experience", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateExperience = mutation({
  args: {
    id: v.id("experience"),
    type: v.union(v.literal("work"), v.literal("education")),
    title: v.string(),
    organization: v.string(),
    location: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    current: v.boolean(),
    description: v.string(),
    highlights: v.optional(v.array(v.string())),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteExperience = mutation({
  args: { id: v.id("experience") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Settings CRUD
export const updateSetting = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("key"), args.key))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt: Date.now(),
      });
    } else {
      return await ctx.db.insert("settings", {
        key: args.key,
        value: args.value,
        updatedAt: Date.now(),
      });
    }
  },
});

// Contact messages
export const getContactMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("contactMessages")
      .order("desc")
      .collect();
  },
});

export const updateContactStatus = mutation({
  args: {
    id: v.id("contactMessages"),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});

export const getContactMessage = query({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const markMessageAsRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: "read",
    });
  },
});

export const markMessageAsUnread = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: "new",
    });
  },
});

export const bulkUpdateMessageStatus = mutation({
  args: {
    ids: v.array(v.id("contactMessages")),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
  },
  handler: async (ctx, args) => {
    console.log("� Simple bulk update - IDs:", args.ids.length, "Status:", args.status);
    
    // Simple approach: just try to update each ID
    const results = [];
    for (const id of args.ids) {
      try {
        console.log("🔄 Updating:", id);
        await ctx.db.patch(id, { status: args.status });
        results.push(id);
        console.log("✅ Updated:", id);
      } catch (error) {
        console.error("❌ Failed to update:", id, error);
      }
    }
    
    console.log("🎉 Successfully updated:", results.length, "messages");
    return results;
  },
});

export const deleteContactMessage = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const bulkDeleteMessages = mutation({
  args: { ids: v.array(v.id("contactMessages")) },
  handler: async (ctx, args) => {
    console.log("🗑️ Simple bulk delete - IDs:", args.ids.length);
    
    // Simple approach: just try to delete each ID
    const results = [];
    for (const id of args.ids) {
      try {
        console.log("🔄 Deleting:", id);
        await ctx.db.delete(id);
        results.push(id);
        console.log("✅ Deleted:", id);
      } catch (error) {
        console.error("❌ Failed to delete:", id, error);
      }
    }
    
    console.log("🎉 Successfully deleted:", results.length, "messages");
    return results;
  },
});

export const addMessageReply = mutation({
  args: {
    messageId: v.id("contactMessages"),
    replyText: v.string(),
    repliedAt: v.string(),
    emailSent: v.boolean(),
    emailMessageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { messageId, ...replyData } = args;
    return await ctx.db.patch(messageId, {
      status: "replied" as const,
      ...replyData,
    });
  },
});