import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const financialProfilesTable = pgTable("financial_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  monthlyIncome: numeric("monthly_income", { precision: 15, scale: 2 }).notNull(),
  monthlyExpenses: numeric("monthly_expenses", { precision: 15, scale: 2 }).notNull(),
  riskProfile: text("risk_profile").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFinancialProfileSchema = createInsertSchema(financialProfilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFinancialProfile = z.infer<typeof insertFinancialProfileSchema>;
export type FinancialProfile = typeof financialProfilesTable.$inferSelect;
