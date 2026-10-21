import type { NextRequest } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { relayUrl } from "@/lib/env";
import { qrPng, qrSvg } from "@/lib/qr";

const formatSchema = z.enum(["png", "svg"]);

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const format = formatSchema.safeParse(request.nextUrl.searchParams.get("format") ?? "png");
  if (!format.success) return Response.json({ error: "Invalid format" }, { status: 400 });

  const headers = {
    "Content-Disposition": `attachment; filename="qr-relay.${format.data}"`,
    "Cache-Control": "no-store",
  };
  if (format.data === "svg") {
    return new Response(await qrSvg(relayUrl()), {
      headers: { ...headers, "Content-Type": "image/svg+xml; charset=utf-8" },
    });
  }
  const png = await qrPng(relayUrl(), 1024);
  return new Response(new Uint8Array(png), {
    headers: { ...headers, "Content-Type": "image/png" },
  });
}
