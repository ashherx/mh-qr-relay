export async function register() {
  // Fail fast at server startup if configuration is missing (skipped during `next build`).
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const { env } = await import("./lib/env");
  env();
}
