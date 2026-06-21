import { createClient } from "@libsql/client";
import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.TURSO_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("TURSO_DATABASE_URL is required to connect to the database.");
}

const client = createClient({
  url: databaseUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
export { schema };
