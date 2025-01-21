require("dotenv").config();

import type { Config } from "drizzle-kit";
import { globbySync } from "globby";
import { join } from "path";

const schemaFiles = globbySync("./src/server/db/schema/*.ts").map((file) =>
  join(process.cwd(), file)
);

export default {
  schema: schemaFiles,
  out: "./src/server/db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
