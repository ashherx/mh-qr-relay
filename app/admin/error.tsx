"use client";

import { buttonClass } from "@/components/ui";

export default function AdminError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
      <p className="font-medium">Something went wrong loading this page.</p>
      <p className="mt-1">This is usually a temporary storage issue. Please try again.</p>
      <button type="button" onClick={() => retry()} className={`${buttonClass()} mt-4`}>
        Try again
      </button>
    </div>
  );
}
