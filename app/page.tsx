import { redirect } from "next/navigation";
import { Suspense } from "react";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "./_login/login-form";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold">QR Relay</h1>
        <p className="mb-6 mt-1 text-sm text-zinc-500">Sign in to manage the destination.</p>
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
          <LoginGate />
        </Suspense>
      </div>
    </main>
  );
}

async function LoginGate() {
  if (await isAuthenticated()) redirect("/admin");
  return <LoginForm />;
}
