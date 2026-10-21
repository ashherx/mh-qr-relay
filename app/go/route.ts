import { connection } from "next/server";
import { getDestination } from "@/lib/store";

const noStore = { "Cache-Control": "no-store" };

// The printed QR code points here. Always 307 (never 301/308) so browsers
// don't cache the redirect and destination changes apply immediately.
export async function GET() {
  await connection();
  try {
    const destination = await getDestination();
    if (destination) {
      return new Response(null, {
        status: 307,
        headers: { ...noStore, Location: destination.url },
      });
    }
  } catch (error) {
    console.error("[go] Redis lookup failed", error);
  }
  return new Response("This link isn't available right now. Please try again shortly.", {
    status: 503,
    headers: { ...noStore, "Content-Type": "text/plain; charset=utf-8" },
  });
}
