"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, requireAdmin } from "@/lib/auth";
import { setDestination } from "@/lib/store";
import { destinationSchema } from "@/lib/validation";

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/");
}

export type DestinationState = {
  status: "idle" | "success" | "error";
  message?: string;
  savedAt?: number;
};

export async function updateDestinationAction(
  _prev: DestinationState,
  formData: FormData,
): Promise<DestinationState> {
  await requireAdmin();
  const raw = formData.get("destination");
  const destination = destinationSchema.safeParse(typeof raw === "string" ? raw : "");
  if (!destination.success) {
    return { status: "error", message: destination.error.issues[0]?.message };
  }

  try {
    await setDestination(destination.data);
  } catch (error) {
    console.error("[updateDestination]", error);
    return { status: "error", message: "Could not save. Please try again." };
  }

  refresh();
  return {
    status: "success",
    message: `Saved. New scans go to ${new URL(destination.data).host}.`,
    savedAt: Date.now(),
  };
}
