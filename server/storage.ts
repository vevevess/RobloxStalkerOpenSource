
import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { promises as fs } from "fs";
import { join } from "path";

const USERS_FILE = join(process.cwd(), "users.json");

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmailOrUsername(emailOrUsername: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(user: User, password: string): Promise<boolean>;
}

interface UsersData {
  users: User[];
}

export class FileStorage implements IStorage {
  private async readUsers(): Promise<User[]> {
    try {
      const data = await fs.readFile(USERS_FILE, "utf-8");
      const parsed: UsersData = JSON.parse(data);
      return parsed.users || [];
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  private async writeUsers(users: User[]): Promise<void> {
    const data: UsersData = { users };
    await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2), "utf-8");
  }

  async getUser(id: string): Promise<User | undefined> {
    const users = await this.readUsers();
    return users.find((user) => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.readUsers();
    return users.find((user) => user.email === email.toLowerCase());
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.readUsers();
    return users.find((user) => user.username === username.toLowerCase());
  }

  async getUserByEmailOrUsername(emailOrUsername: string): Promise<User | undefined> {
    const users = await this.readUsers();
    const lowercased = emailOrUsername.toLowerCase();
    return users.find(
      (user) => user.email === lowercased || user.username === lowercased
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await this.readUsers();
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);

    const user: User = {
      id,
      email: insertUser.email.toLowerCase(),
      username: insertUser.username.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.push(user);
    await this.writeUsers(users);
    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}

export const storage = new FileStorage();
