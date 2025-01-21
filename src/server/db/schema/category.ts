import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAtColumn, updatedAtColumn } from "../utils";
import { user } from "./auth";

export const category = sqliteTable("category", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  userId: text("user_id")
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export type Category = InferSelectModel<typeof category>;
