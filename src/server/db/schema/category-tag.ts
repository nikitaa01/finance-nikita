import type { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAtColumn, updatedAtColumn } from "../utils";
import { category } from "./category";

export const categoryTag = sqliteTable("category-tag", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  color: text("color").default("#fff").notNull(),
  categoryId: integer("category_id")
    .references(() => category.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export type CategoryTag = InferSelectModel<typeof categoryTag>;
