import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import { expenseSubcategory } from "./expense-subcategory";

export const expense = sqliteTable("expense", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expenseSubcategoryId: integer("expense_subcategory_id")
    .notNull()
    .references(() => expenseSubcategory.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  date: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Expense = typeof expense.$inferSelect;
