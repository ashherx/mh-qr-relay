import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

let limiter: Ratelimit | undefined;

function loginLimiter(): Ratelimit {
  limiter ??= new Ratelimit({
    redis: redis(),
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "ratelimit:login",
  });
  return limiter;
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

/** 5 attempts per 15 minutes per IP. The IP is hashed before it reaches Redis. */
export async function limitLogin(ip: string): Promise<{ success: boolean; reset: number }> {
  const id = createHash("sha256").update(ip).digest("hex");
  const { success, reset } = await loginLimiter().limit(id);
  return { success, reset };
}
