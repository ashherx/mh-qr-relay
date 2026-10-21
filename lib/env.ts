import { z } from "zod";

const httpUrl = z.url({ protocol: /^https?$/ });

const schema = z.object({
  ADMIN_EMAIL: z.string().trim().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  AUTH_SECRET: z.string().min(32, "must be at least 32 characters"),
  UPSTASH_REDIS_REST_URL: httpUrl,
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  NEXT_PUBLIC_APP_URL: httpUrl,
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

function read(): Env {
  const raw = {
    ...process.env,
    // The Vercel Marketplace Upstash integration may expose KV_* names instead.
    UPSTASH_REDIS_REST_URL:
      process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
    UPSTASH_REDIS_REST_TOKEN:
      process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  };
  const result = schema.safeParse(raw);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid or missing environment variables:\n${problems}\nSee .env.example.`,
    );
  }
  return {
    ...result.data,
    NEXT_PUBLIC_APP_URL: result.data.NEXT_PUBLIC_APP_URL.replace(/\/+$/, ""),
  };
}

/** Validated environment. Throws a descriptive error if anything is missing. */
export function env(): Env {
  cached ??= read();
  return cached;
}

/** The URL printed in the QR code. */
export function relayUrl(): string {
  return `${env().NEXT_PUBLIC_APP_URL}/go`;
}
