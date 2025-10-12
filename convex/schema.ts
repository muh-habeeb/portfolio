import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    techStack: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    codeUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  skills: defineTable({
    name: v.string(),
    category: v.string(), // "frontend", "backend", "database", "tools"
    level: v.number(), // 1-5
    icon: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  experience: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  settings: defineTable({
    key: v.string(),
    value: v.any(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
    createdAt: v.number(),
  }),

  socialLinks: defineTable({
    name: v.string(), // Display name
    url: v.string(),
    iconUrl: v.optional(v.string()),
    defaultEmoji: v.string(),
    color: v.string(), // CSS classes for styling
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});