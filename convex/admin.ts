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
    console.log("🔵 Convex bulkUpdateMessageStatus called");
    console.log("📝 Received IDs:", args.ids);
    console.log("📝 Status:", args.status);
    console.log("📝 Array length:", args.ids.length);
    
    // Since we're using v.id() validator, Convex should ensure valid IDs
    // But let's add extra safety
    const safeIds = args.ids.filter((id, index) => {
      if (!id) {
        console.error(`❌ Empty ID at index ${index}`);
        return false;
      }
      console.log(`✅ ID ${index}: ${id}`);
      return true;
    });
    
    console.log("🟢 Safe IDs to process:", safeIds.length);
    
    if (safeIds.length === 0) {
      console.error("❌ No valid IDs to process");
      throw new Error("No valid message IDs provided");
    }

    const promises = safeIds.map(async (id, index) => {
      try {
        console.log(`🔄 Processing ID ${index}: ${id}`);
        // Check if message exists before updating
        const message = await ctx.db.get(id);
        if (message) {
          console.log(`✅ Message found, updating to status: ${args.status}`);
          return await ctx.db.patch(id, { status: args.status });
        } else {
          console.log(`⚠️ Message not found for ID: ${id}`);
          return null;
        }
      } catch (error) {
        console.error(`❌ Error processing ID ${id}:`, error);
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    const successfulUpdates = results.filter(result => result !== null);
    console.log(`🎉 Successfully updated ${successfulUpdates.length} messages`);
    return successfulUpdates;
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
    const promises = args.ids.map(id => ctx.db.delete(id));
    return await Promise.all(promises);
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