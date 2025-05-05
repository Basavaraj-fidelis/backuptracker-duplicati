import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('viewer'),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  deviceId: integer("device_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  lastUsed: timestamp("last_used"),
  isActive: boolean("is_active").notNull().default(true),
});

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  hostname: text("hostname").notNull(),
  ip: text("ip"),
  deviceType: text("device_type").notNull(), // server, workstation, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const backupReports = pgTable("backup_reports", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").notNull(),
  status: text("status").notNull(), // success, warning, failed
  time: timestamp("time").notNull(),
  size: text("size"), // e.g., "56.2 GB"
  sizeBytes: integer("size_bytes"), // actual size in bytes
  duration: integer("duration"), // duration in seconds
  jobName: text("job_name"),
  errorMessage: text("error_message"),
  fileCount: integer("file_count"), // number of files backed up
  
  // Additional fields for detailed reporting
  sourcePath: text("source_path"),
  destinationPath: text("destination_path"),
  compressionRatio: integer("compression_ratio"),
  changedFiles: integer("changed_files"),
  deletedFiles: integer("deleted_files"),
  addedFiles: integer("added_files"),
  modifiedFiles: integer("modified_files"),
  examiningFiles: integer("examining_files"),
  
  // Validation related fields
  wasVerified: boolean("was_verified"),
  verificationResult: text("verification_result"), // success, warning, failed
  verificationErrors: text("verification_errors"),
  lastVerification: timestamp("last_verification"),
  
  metadata: json("metadata"), // any additional data
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull(), // error, warning, info
  time: timestamp("time").notNull().defaultNow(),
  isRead: boolean("is_read").notNull().default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  key: true,
  name: true,
  deviceId: true,
  expiresAt: true,
  isActive: true,
});

export const insertDeviceSchema = createInsertSchema(devices).pick({
  hostname: true,
  ip: true,
  deviceType: true,
});

export const insertBackupReportSchema = createInsertSchema(backupReports).pick({
  deviceId: true,
  status: true,
  time: true,
  size: true,
  sizeBytes: true,
  duration: true,
  jobName: true,
  errorMessage: true,
  fileCount: true,
  
  // Additional reporting fields
  sourcePath: true,
  destinationPath: true,
  compressionRatio: true,
  changedFiles: true,
  deletedFiles: true,
  addedFiles: true,
  modifiedFiles: true,
  examiningFiles: true,
  
  // Validation fields
  wasVerified: true,
  verificationResult: true,
  verificationErrors: true,
  lastVerification: true,
  
  metadata: true,
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  deviceId: true,
  title: true,
  message: true,
  severity: true,
  time: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type InsertBackupReport = z.infer<typeof insertBackupReportSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type User = typeof users.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type Device = typeof devices.$inferSelect;
export type BackupReport = typeof backupReports.$inferSelect;
export type Alert = typeof alerts.$inferSelect;

// Report schema used for API endpoints
export const duplicatiReportSchema = z.object({
  hostname: z.string(),
  status: z.enum(["success", "warning", "failed"]),
  time: z.coerce.date(),
  size: z.string().optional(),
  sizeBytes: z.number().optional(),
  duration: z.number().optional(),
  jobName: z.string().optional(),
  errorMessage: z.string().optional(),
  fileCount: z.number().optional(),
  
  // Additional fields for more detailed reporting
  sourcePath: z.string().optional(),
  destinationPath: z.string().optional(),
  compressionRatio: z.number().optional(),
  changedFiles: z.number().optional(),
  deletedFiles: z.number().optional(),
  addedFiles: z.number().optional(),
  modifiedFiles: z.number().optional(),
  examiningFiles: z.number().optional(),
  
  // Validation related fields
  wasVerified: z.boolean().optional(),
  verificationResult: z.enum(["success", "warning", "failed"]).optional(),
  verificationErrors: z.string().optional(),
  lastVerification: z.coerce.date().optional(),
  
  metadata: z.record(z.any()).optional(),
  ip: z.string().optional(),
  deviceType: z.string().optional(),
  
  // Authentication fields
  apiKey: z.string().optional(),
});

export type DuplicatiReport = z.infer<typeof duplicatiReportSchema>;
