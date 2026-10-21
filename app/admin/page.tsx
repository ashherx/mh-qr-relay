import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { CopyButton } from "@/components/copy-button";
import { Card, Skeleton, buttonClass } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { relayUrl } from "@/lib/env";
import { qrDataUrl } from "@/lib/qr";
import { getDestination } from "@/lib/store";
import { DestinationForm } from "./destination-form";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await requireAdmin();
  const url = relayUrl();
  const [destination, qrPreview] = await Promise.all([getDestination(), qrDataUrl(url)]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        <Card title="Destination">
          <DestinationForm destination={destination?.url ?? ""} />
          {!destination && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
              No destination saved yet. Scans won&apos;t redirect anywhere until you save one.
            </p>
          )}
        </Card>
      </div>

      <Card title="QR code">
        <Image
          src={qrPreview}
          alt={`QR code for ${url}`}
          width={480}
          height={480}
          unoptimized
          className="mx-auto w-full max-w-64 rounded-lg border border-zinc-200 dark:border-zinc-800"
        />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href="/api/admin/qr?format=png" download className={buttonClass("primary")}>
            PNG
          </a>
          <a href="/api/admin/qr?format=svg" download className={buttonClass()}>
            SVG
          </a>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-zinc-500">Encoded URL</p>
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg bg-zinc-100 px-2.5 py-2 text-xs dark:bg-zinc-800">
              {url}
            </code>
            <CopyButton text={url} />
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className={`${buttonClass()} w-full`}>
            Test link ↗
          </a>
        </div>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Skeleton className="h-32" />
      <Skeleton className="h-96" />
    </div>
  );
}
