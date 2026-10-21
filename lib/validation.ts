import { z } from "zod";

export const destinationSchema = z
  .string()
  .trim()
  .min(1, "Destination URL is required.")
  .pipe(
    z.url({
      protocol: /^https?$/,
      error: "Enter a full URL starting with http:// or https://",
    }),
  );
