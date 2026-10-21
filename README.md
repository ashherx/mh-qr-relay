# QR Relay

A password-protected relay for one printed QR code.

- `relay.medhelix.com/` shows the login form. After you sign in, the dashboard lets you set the destination URL and download the QR code.
- `relay.medhelix.com/go` is the URL printed in the QR code. It sends a `307` redirect to the saved destination with `Cache-Control: no-store`, so changes take effect on the very next scan.

The destination is stored as a single key (`relay:destination`) in Upstash Redis, because Vercel functions can't keep data between requests on their own.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the env template and fill it in:
   ```bash
   cp .env.example .env.local
   ```
   | Variable | Value |
   | --- | --- |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Your login |
   | `AUTH_SECRET` | Output of `openssl rand -base64 32` (must be 32+ characters) |
   | `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | From your Upstash database (see below) |
   | `NEXT_PUBLIC_APP_URL` | `https://relay.medhelix.com` in production, `http://localhost:3000` locally |

   The server refuses to start, with a clear message, if any of these are missing or invalid.
3. Run the dev server and open http://localhost:3000:
   ```bash
   npm run dev
   ```

## Adding Upstash Redis through the Vercel Marketplace

1. In the Vercel dashboard, open your project, go to **Storage**, click **Create Database** and choose **Upstash for Redis**. The free plan is plenty.
2. Connect the database to the project for all environments. Vercel adds the connection env vars for you. They may be named `KV_REST_API_URL` / `KV_REST_API_TOKEN`, and the app accepts those too.
3. For local development, copy the REST URL and token from the Upstash console into `.env.local` (or run `vercel env pull .env.local`).

## Deploying on Vercel

1. Add `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` and `NEXT_PUBLIC_APP_URL=https://relay.medhelix.com` under **Project → Settings → Environment Variables**.
2. Env var changes only apply to new deployments. Go to **Deployments → ⋯ → Redeploy**, or push a commit.
3. Attach the domain under **Project → Settings → Domains → Add**, then enter `relay.medhelix.com`. At your DNS provider, add the `CNAME` record Vercel shows (`relay` → `cname.vercel-dns.com`). HTTPS is set up automatically.

> **Print the QR code only after `NEXT_PUBLIC_APP_URL` is set to `https://relay.medhelix.com`.** Check the "Encoded URL" on the dashboard first. It must never be a `*.vercel.app` URL.

## Security

- Credentials are compared in constant time.
- Sessions are HS256-signed JWTs stored in an `httpOnly` cookie and valid for 7 days.
- Login is limited to 5 attempts per 15 minutes per IP.
- `proxy.ts` guards `/admin` and `/api/admin/*`, and every Server Action and admin API route also checks the session itself.
- Security headers, `noindex` and a disallow-all `robots.txt` are set.
# mh-qr-relay
