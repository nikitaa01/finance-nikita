import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { expenseCategory } from "./expense-category";

export const expenseSubcategory = sqliteTable("expense_subcategory", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  expenseCategoryId: integer("expense_category_id")
    .notNull()
    .references(() => expenseCategory.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color", { length: 7 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type ExpenseSubcategory = typeof expenseSubcategory.$inferSelect;
