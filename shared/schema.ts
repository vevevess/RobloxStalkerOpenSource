import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// User authentication schema
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

// Roblox user profile schema (our simplified format for frontend)
export const robloxUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().nullable(),
  created: z.string(),
  isBanned: z.boolean(),
  hasVerifiedBadge: z.boolean(),
  friends: z.number(),
  followers: z.number(),
  following: z.number(),
  badges: z.number(),
  profilePicture: z.string().optional(),
});

export type RobloxUser = z.infer<typeof robloxUserSchema>;

// API response schema (from our backend)
export const robloxApiResponseSchema = z.object({
  status: z.boolean(),
  result: robloxUserSchema,
});

export type RobloxApiResponse = z.infer<typeof robloxApiResponseSchema>;

// External API response schema (from siputzx.my.id)
const externalApiBasicSchema = z.object({
  id: z.number(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().nullable(),
  created: z.string(),
  isBanned: z.boolean(),
  hasVerifiedBadge: z.boolean(),
  externalAppDisplayName: z.string().nullable().optional(),
});

const externalApiSocialSchema = z.object({
  friends: z.object({ count: z.number() }),
  followers: z.object({ count: z.number() }),
  following: z.object({ count: z.number() }),
});

const externalApiAvatarSchema = z.object({
  headshot: z.object({
    data: z.array(
      z.object({
        imageUrl: z.string(),
      })
    ),
  }),
});

const externalApiAchievementsSchema = z.object({
  robloxBadges: z.array(z.any()).nullable(),
  badges: z.any().nullable().optional(),
  collectibles: z.any().nullable().optional(),
});

export const externalApiResponseSchema = z.object({
  status: z.boolean(),
  data: z.object({
    userId: z.number(),
    basic: externalApiBasicSchema,
    social: externalApiSocialSchema,
    avatar: externalApiAvatarSchema.optional(),
    achievements: externalApiAchievementsSchema.optional(),
  }),
  timestamp: z.string().optional(),
});

export type ExternalApiResponse = z.infer<typeof externalApiResponseSchema>;
