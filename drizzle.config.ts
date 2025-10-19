import type { Config } from "drizzle-kit";

import { join } from "node:path";
import { globbySync } from "globby";

const schemaFiles = globbySync("./src/server/db/schemas/*.ts").map((file) =>
  join(process.cwd(), file),
);

export default {
  schema: schemaFiles,
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
  },
} satisfies Config;
