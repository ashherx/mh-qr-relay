import { z } from "zod";
import { redis } from "./redis";

const KEY = "relay:destination";

const destinationSchema = z.object({ url: z.string(), updatedAt: z.string() });

export type Destination = z.infer<typeof destinationSchema>;

export async function getDestination(): Promise<Destination | null> {
  const parsed = destinationSchema.safeParse(await redis().get<unknown>(KEY));
  return parsed.success ? parsed.data : null;
}

export async function setDestination(url: string): Promise<void> {
  const value: Destination = { url, updatedAt: new Date().toISOString() };
  await redis().set(KEY, value);
}
