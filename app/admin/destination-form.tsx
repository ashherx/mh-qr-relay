"use client";

import { useActionState, useState } from "react";
import { Toast } from "@/components/toast";
import { FieldError, buttonClass, inputClass } from "@/components/ui";
import { updateDestinationAction, type DestinationState } from "./actions";

export function DestinationForm({ destination }: { destination: string }) {
  const [state, formAction, pending] = useActionState<DestinationState, FormData>(
    updateDestinationAction,
    { status: "idle" },
  );
  const [value, setValue] = useState(destination);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="destination"
          type="url"
          required
          placeholder="https://example.com/landing"
          aria-label="Destination URL"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${inputClass} py-2.5 text-base`}
        />
        <button
          type="submit"
          disabled={pending || value.trim() === destination}
          className={buttonClass("primary")}
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {state.status === "error" && <FieldError messages={[state.message ?? "Could not save."]} />}
      <p className="text-xs text-zinc-500">Changes apply instantly. The printed QR code never changes.</p>
      {state.status === "success" && state.message && (
        <Toast key={state.savedAt} message={state.message} />
      )}
    </form>
  );
}
