import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import { authLogger } from "@/lib/auth-logger";

export const auth = betterAuth({
  logger: authLogger,
  database: drizzleAdapter(db, { provider: "pg" }),
  plugins: [nextCookies()],
});
