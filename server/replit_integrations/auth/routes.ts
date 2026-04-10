import type { Express } from "express";
import bcrypt from "bcrypt";
import { db } from "../../db";
import { users } from "@shared/models/auth";
import { eq } from "drizzle-orm";

export function registerAuthRoutes(app: Express): void {
  app.post("/api/auth/register", async (req: any, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.username, username.toLowerCase()));

      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const [user] = await db
        .insert(users)
        .values({ username: username.toLowerCase(), passwordHash })
        .returning();

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (err: any) {
      console.error("Register error:", err);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: any, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username.toLowerCase()));

      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (err: any) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) console.error("Logout error:", err);
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/user", async (req: any, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const [user] = await db
        .select({ id: users.id, username: users.username })
        .from(users)
        .where(eq(users.id, req.session.userId));

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err: any) {
      console.error("Get user error:", err);
      res.status(500).json({ message: "Failed to get user" });
    }
  });
}
