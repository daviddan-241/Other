import { db } from "./db";
import {
  users, conversations, messages, settings,
  type User, type InsertUser,
  type Conversation, type Message, type Settings,
  type InsertConversation, type InsertMessage, type InsertSettings
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User (from auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Conversations
  getConversations(userId: string): Promise<Conversation[]>;
  getConversation(id: number): Promise<Conversation | undefined>;
  createConversation(userId: string, title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;

  // Messages
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(conversationId: number, message: InsertMessage): Promise<Message>;

  // Settings
  getSettings(userId: string): Promise<Settings | undefined>;
  updateSettings(userId: string, settings: Partial<InsertSettings>): Promise<Settings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Auth users don't have username in the default schema, but they have email.
    // This method is legacy/backup.
    return undefined; 
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return await db.select().from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(userId: string, title: string): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values({ userId, title }).returning();
    return conversation;
  }

  async deleteConversation(id: number): Promise<void> {
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(conversationId: number, message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages)
      .values({ ...message, conversationId })
      .returning();
    return newMessage;
  }

  async getSettings(userId: string): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.userId, userId));
    return setting;
  }

  async updateSettings(userId: string, newSettings: Partial<InsertSettings>): Promise<Settings> {
    const existing = await this.getSettings(userId);
    if (existing) {
      const [updated] = await db.update(settings)
        .set(newSettings)
        .where(eq(settings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(settings)
        .values({ ...newSettings, userId } as any)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
