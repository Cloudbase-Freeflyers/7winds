# Affiliate program setup

This guide covers the affiliate referral system, partner login portal, QR codes, and environment configuration.

## Overview

| Feature | URL | Who can access |
| --- | --- | --- |
| Admin dashboard | `/admin` | You (HTTP Basic auth) |
| Affiliate management | `/admin/affiliates` | You (HTTP Basic auth) |
| Partner login | `/affiliate/login` | Affiliates with email + password |
| Partner dashboard | `/affiliate/dashboard` | Logged-in affiliates |
| Referral landing page | `/a/{code}` | Public (visitors from affiliate links) |

Affiliates do **not** use the admin password. Each partner gets their own email and password, set by you in the admin panel.

## Environment variables

Copy the example file if you have not already:

```bash
cp .env.example .env.local
```

Fill in `.env.local` with at least:

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `MONGODB_DB` | No | Database name (default: `7winds`) |
| `ADMIN_PASSWORD` | Yes | Password for `/admin` (Basic auth) |
| `AFFILIATE_SESSION_SECRET` | Recommended | Signs affiliate session cookies. Use a long random string in production. Falls back to `ADMIN_PASSWORD` if unset. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Base URL used in affiliate links and QR codes. Use `http://localhost:3000` locally. |

Optional public vars: `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE_NUMBER`, `NEXT_PUBLIC_YOUTUBE_VIDEO_ID`, analytics IDs.

Start the dev server:

```bash
npm install
npm run dev
```

## Creating an affiliate (admin)

1. Open `/admin/affiliates` and sign in with your admin password.
2. Fill in the **new affiliate** form:
   - **Name** — display name
   - **Code** — URL slug (e.g. `dani-cohen` → `/a/dani-cohen`)
   - **Email + password** — optional at create time, but **both are required** for partner login
   - **Commission** — percent or fixed amount per lead/voucher
3. Click **צור שותף + QR**.

After creation you can:

- Copy the referral link
- Download a QR code PNG (generated locally — no external API or cost)
- View visits, leads, vouchers, and estimated commission
- Record payouts

## Enabling login for an existing affiliate

If you created an affiliate without login credentials:

1. Select the affiliate in the table.
2. In **פרטי כניסה לשותף**, enter:
   - Email address
   - New password (minimum 8 characters)
3. Click **שמור פרטי כניסה**.

Share with the partner:

- Login URL: `https://your-domain.com/affiliate/login`
- Their email and password

To reset a password, enter a new password in the same form and save (email can stay the same).

## Partner dashboard

After login at `/affiliate/login`, affiliates see:

- Visit, lead, voucher, and WhatsApp click counts
- Estimated earnings, amount paid, and pending balance
- Their personal referral link
- QR code preview and download
- Link to their public landing page (`/a/{code}`)

Partners cannot see other affiliates’ data or access the admin panel.

## QR codes

QR codes are **generated on your server** using the open-source `qrcode` package. There is nothing to purchase.

- **Admin:** `/api/admin/affiliates/{id}/qr` (admin auth required)
- **Affiliate dashboard:** `/api/affiliate/qr` (affiliate session required)

Both encode the same URL: `{NEXT_PUBLIC_SITE_URL}/a/{code}`

Make sure `NEXT_PUBLIC_SITE_URL` matches your live domain before printing QR codes for production.

## How tracking works

1. Visitor opens `/a/{code}` (or scans QR).
2. Affiliate code is stored in the browser session.
3. Lead forms, voucher requests, and WhatsApp clicks are attributed to that affiliate.
4. Events are stored in MongoDB (`affiliate_events` collection).
5. Commission estimates appear in admin and affiliate dashboards.

## MongoDB collections

```
affiliates
  code, name, email?, passwordHash?, phone?, commissionRate, commissionType,
  status, payoutStatus, totalPaid, notes, createdAt, updatedAt

affiliate_events
  affiliateId, affiliateCode, type (visit | lead | voucher | whatsapp_click),
  metadata?, createdAt
```

## Security notes

- Affiliate passwords are hashed with scrypt before storage.
- Session cookies are HTTP-only and signed with `AFFILIATE_SESSION_SECRET`.
- Admin routes remain protected by HTTP Basic auth (`ADMIN_PASSWORD`).
- Never commit `.env.local` — it is gitignored.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| Partner cannot log in | Confirm affiliate status is **active**, email is set, and password was saved in admin |
| QR link goes to wrong domain | Set `NEXT_PUBLIC_SITE_URL` to your production URL and redeploy |
| Admin shows 503 | Set `ADMIN_PASSWORD` in `.env.local` |
| “אימייל או קוד שותף כבר קיים” | Use a different email or affiliate code |
| Stats show zero | Visitor must use `/a/{code}` (not the homepage) for visit tracking |

## API reference (internal)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/affiliate/login` | Public | Email + password → session cookie |
| POST | `/api/affiliate/logout` | Session | Clears session |
| GET | `/api/affiliate/me` | Session | Dashboard stats |
| GET | `/api/affiliate/qr` | Session | QR PNG for logged-in affiliate |
| GET/POST | `/api/admin/affiliates` | Admin | List / create affiliates |
| PATCH | `/api/admin/affiliates/{id}` | Admin | Update affiliate + credentials |
| GET | `/api/admin/affiliates/{id}/qr` | Admin | QR PNG for any affiliate |
