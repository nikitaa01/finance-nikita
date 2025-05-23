import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

export const updatedAtColumn = () =>
  integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now') * 1000)`)
    .$onUpdate(() => sql`(strftime('%s', 'now') * 1000)`)
    .notNull();

export const createdAtColumn = () =>
  integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now') * 1000)`)
    .notNull();
