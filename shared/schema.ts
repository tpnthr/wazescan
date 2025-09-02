import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey(),
  type: text("type").notNull(), // 'ACCIDENT' or 'SHOULDER'
  title: text("title").notNull(),
  description: text("description"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  severity: text("severity"), // 'High', 'Medium', 'Low'
  status: text("status"), // 'Active', 'Clearing', etc.
  reportedTime: timestamp("reported_time").notNull(),
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
  reliability: integer("reliability"), // Waze reliability score
  reporter: text("reporter"), // Who posted the report
  rating: integer("rating"), // User rating of the incident
  confidence: integer("confidence"), // Confidence level of the report
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  lastUpdated: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;

// Additional types for the dashboard
export interface DashboardStats {
  totalAccidents: number;
  carsOnShoulder: number;
  lastUpdated: string;
  apiStatus: 'Online' | 'Offline' | 'Error';
}

export interface WazeApiResponse {
  incidents: Incident[];
  stats: DashboardStats;
}
