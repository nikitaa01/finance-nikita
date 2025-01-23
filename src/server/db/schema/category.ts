import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createdAtColumn, updatedAtColumn } from "../utils";
import { user } from "./auth";

export const category = sqliteTable(
  "category",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    color: text("color").notNull(),
    userId: text("user_id")
      .references(() => user.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    uniqueNamePerUser: uniqueIndex("unique_name_per_user").on(
      table.name,
      table.userId,
    ),
  }),
);

export type Category = InferSelectModel<typeof category>;

export type InsertCategory = InferInsertModel<typeof category>;
