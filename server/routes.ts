import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { externalApiResponseSchema, type RobloxUser, insertUserSchema, loginSchema, type User } from "@shared/schema";
import { storage } from "./storage";
import session from "express-session";
import { config } from "./config";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: config.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          status: false,
          error: result.error.errors[0].message,
        });
      }

      const existingEmail = await storage.getUserByEmail(result.data.email);
      if (existingEmail) {
        return res.status(400).json({
          status: false,
          error: "Email already registered",
        });
      }

      const existingUsername = await storage.getUserByUsername(result.data.username);
      if (existingUsername) {
        return res.status(400).json({
          status: false,
          error: "Username already taken",
        });
      }

      const user = await storage.createUser(result.data);
      
      req.session.userId = user.id;

      return res.json({
        status: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("Error during signup:", error);
      return res.status(500).json({
        status: false,
        error: "Failed to create account",
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          status: false,
          error: result.error.errors[0].message,
        });
      }

      const user = await storage.getUserByEmailOrUsername(result.data.emailOrUsername);
      
      if (!user) {
        return res.status(401).json({
          status: false,
          error: "Invalid credentials",
        });
      }

      const isValidPassword = await storage.verifyPassword(user, result.data.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          status: false,
          error: "Invalid credentials",
        });
      }

      req.session.userId = user.id;

      return res.json({
        status: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({
        status: false,
        error: "Failed to login",
      });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          status: false,
          error: "Failed to logout",
        });
      }
      res.clearCookie("connect.sid");
      return res.json({
        status: true,
      });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({
        status: false,
        error: "Not authenticated",
      });
    }

    const user = await storage.getUser(req.session.userId);
    
    if (!user) {
      return res.status(401).json({
        status: false,
        error: "User not found",
      });
    }

    return res.json({
      status: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  });

  app.get("/api/roblox/:username", async (req, res) => {
    try {
      const { username } = req.params;

      if (!username || username.trim() === "") {
        return res.status(400).json({
          status: false,
          error: "Username is required",
        });
      }

      const apiUrl = `https://api.siputzx.my.id/api/stalk/roblox?user=${encodeURIComponent(username)}`;

      const response = await fetch(apiUrl, {
        headers: {
          accept: "*/*",
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({
          status: false,
          error: "Failed to fetch user data from external API",
        });
      }

      const rawData = await response.json();

      // Validate the external API response
      const validatedData = externalApiResponseSchema.parse(rawData);

      if (!validatedData.status || !validatedData.data) {
        return res.status(404).json({
          status: false,
          error: "User not found",
        });
      }

      // Transform the external API response to our simplified format
      const { basic, social, avatar, achievements } = validatedData.data;
      
      const transformedUser: RobloxUser = {
        id: basic.id,
        name: basic.name,
        displayName: basic.displayName,
        description: basic.description,
        created: basic.created,
        isBanned: basic.isBanned,
        hasVerifiedBadge: basic.hasVerifiedBadge,
        friends: social.friends.count,
        followers: social.followers.count,
        following: social.following.count,
        badges: achievements?.robloxBadges?.length ?? 0,
        profilePicture: avatar?.headshot?.data?.[0]?.imageUrl,
      };

      return res.json({
        status: true,
        result: transformedUser,
      });
    } catch (error) {
      console.error("Error fetching Roblox user data:", error);

      if (error instanceof Error && error.message.includes("parse")) {
        return res.status(500).json({
          status: false,
          error: "Invalid response format from external API",
        });
      }

      return res.status(500).json({
        status: false,
        error: "An unexpected error occurred",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
