import { type User, type InsertUser, type Incident, type InsertIncident } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Incident methods
  getIncidents(): Promise<Incident[]>;
  getIncidentsByType(type: string): Promise<Incident[]>;
  upsertIncident(incident: InsertIncident): Promise<Incident>;
  clearIncidents(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private incidents: Map<string, Incident>;

  constructor() {
    this.users = new Map();
    this.incidents = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values());
  }

  async getIncidentsByType(type: string): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(incident => incident.type === type);
  }

  async upsertIncident(insertIncident: InsertIncident): Promise<Incident> {
    const incident: Incident = {
      ...insertIncident,
      lastUpdated: new Date(),
    };
    this.incidents.set(incident.id, incident);
    return incident;
  }

  async clearIncidents(): Promise<void> {
    this.incidents.clear();
  }
}

export const storage = new MemStorage();
