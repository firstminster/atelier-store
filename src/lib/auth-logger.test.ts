import assert from "node:assert/strict";
import { test } from "node:test";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { toNextJsHandler } from "better-auth/next-js";

import { authLogger } from "./auth-logger";

function readRecord(args: unknown[]) {
  assert.equal(args.length, 1, "emit one serialized record without raw arguments");
  const record = String(args[0]);
  assert.ok(
    !Array.from(record).some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || (code >= 127 && code <= 159) || code === 0x2028 || code === 0x2029;
    }),
    "records must contain no raw line or terminal controls",
  );
  const parsed = JSON.parse(record);
  assert.equal(parsed.source, "Better Auth");
  assert.ok(Number.isFinite(Date.parse(parsed.timestamp)));
  return parsed;
}

test("unauthenticated password-reset redirects are rejected and logged as one record", async (t) => {
  const auth = betterAuth({
    database: memoryAdapter({}),
    baseURL: "http://localhost:3000",
    secret: "local-regression-secret-0123456789abcdef",
    logger: authLogger,
  });
  await auth.$context;
  const errors = t.mock.method(console, "error", () => {});
  const { POST } = toNextJsHandler(auth);

  for (const suffix of ["", "\r\nFORGED EVENT", "\u001b[2J\u0085\u2028\u2029FORGED EVENT"]) {
    const redirectTo = `https://foreign.example/${suffix}`;
    const response = await POST(new Request("http://localhost:3000/api/auth/request-password-reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", redirectTo }),
    }));
    assert.equal(response.status, 403);
    assert.equal((await response.json()).code, "INVALID_REDIRECT_URL");
    const record = readRecord(errors.mock.calls.at(-1)!.arguments);
    assert.equal(record.level, "error");
    assert.equal(record.message, `Invalid redirectURL: ${redirectTo}`);
  }
  assert.equal(errors.mock.callCount(), 3);
});

test("all log levels encode messages and diagnostic arguments safely", (t) => {
  const error = t.mock.method(console, "error", () => {});
  const warn = t.mock.method(console, "warn", () => {});
  const log = t.mock.method(console, "log", () => {});
  const controls = "\r\n\t\b\u0000\u001b[2J\u007f\u0085\u2028\u2029";
  const circular: { self?: unknown } = {};
  circular.self = circular;

  for (const level of ["error", "warn", "info", "debug"] as const) {
    authLogger.log(level, `Rejected %s`, controls, new Error(`details${controls}`), circular);
    const output = level === "error" ? error : level === "warn" ? warn : log;
    const record = readRecord(output.mock.calls.at(-1)!.arguments);
    assert.equal(record.level, level);
    assert.ok(record.message.includes(controls));
    assert.ok(record.message.includes("Error: details"));
    assert.ok(record.message.includes("[Circular"));
  }
  assert.equal(error.mock.callCount(), 1);
  assert.equal(warn.mock.callCount(), 1);
  assert.equal(log.mock.callCount(), 2);
});
