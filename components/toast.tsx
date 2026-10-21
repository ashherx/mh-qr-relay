"use client";

import { useEffect, useState } from "react";

/** Shows once on mount and hides itself. Remount (via `key`) to show again. */
export function Toast({ message }: { message: string }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-lg bg-zinc-900 px-4 py-3 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
    >
      {message}
    </div>
  );
}
