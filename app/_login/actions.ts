"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { credentialsMatch, startSession } from "@/lib/auth";
import { clientIp, limitLogin } from "@/lib/rate-limit";

export type LoginState = { error?: string; email?: string };

const loginSchema = z.object({
  email: z.string().max(320),
  password: z.string().max(1024),
});

const GENERIC_ERROR = "Email or password is incorrect.";

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });
  if (!parsed.success) return { error: GENERIC_ERROR };
  const { email, password } = parsed.data;

  try {
    const { success, reset } = await limitLogin(clientIp(await headers()));
    if (!success) {
      const minutes = Math.max(1, Math.ceil((reset - Date.now()) / 60_000));
      return {
        email,
        error: `Too many login attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      };
    }
  } catch (error) {
    console.error("[login] Rate limiter unavailable", error);
    return { email, error: "Sign in is temporarily unavailable. Please try again shortly." };
  }

  if (!credentialsMatch(email, password)) return { email, error: GENERIC_ERROR };

  await startSession();
  redirect("/admin");
}
