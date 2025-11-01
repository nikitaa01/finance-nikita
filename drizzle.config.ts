import type { Config } from "drizzle-kit";

import { globbySync } from "globby";
import { join } from "node:path";

const schemaFiles = globbySync("./src/server/db/schemas/*.ts").map((file) =>
  join(process.cwd(), file),
);

// Check if we should use local SQLite database
const useLocalDb =
  process.env.USE_LOCAL_DB === "true" || process.env.SQLITE_PATH;
const sqlitePath = process.env.SQLITE_PATH ?? "./local.db";

export default {
  schema: schemaFiles,
  out: "./migrations",
  dialect: "turso", // libsql works with both Turso and local SQLite files
  dbCredentials: useLocalDb
    ? {
        url: `file:${sqlitePath}`,
      }
    : {
        url: process.env.TURSO_CONNECTION_URL as string,
        authToken: process.env.TURSO_AUTH_TOKEN as string,
      },
} satisfies Config;
