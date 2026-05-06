# 7Winds Paragliding — Hebrew Landing Page

Single-page Hebrew RTL landing site for **7Winds Paragliding Club**, built on **Next.js 15 (App Router) + TypeScript + Tailwind CSS** with **MongoDB Atlas** for lead capture, gift-voucher requests, and a tiny password-protected admin viewer.

## Quick start

```bash
cp .env.example .env.local      # then fill in real values
npm install
npm run dev                     # http://localhost:3000
```

## Environment variables

| Var | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | yes (prod) | MongoDB Atlas connection string. The app refuses to write leads/vouchers if this is unset. |
| `MONGODB_DB` | no | DB name. Defaults to `7winds`. |
| `ADMIN_PASSWORD` | yes | Password for HTTP Basic auth on `/admin`. |
| `NEXT_PUBLIC_SITE_URL` | no | Used for canonical / OG URLs. Defaults to the production domain. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | recommended | Digits only, e.g. `972500000000`. Drives every WhatsApp link. |
| `NEXT_PUBLIC_PHONE_NUMBER` | recommended | Display string, e.g. `+972-50-000-0000`. |
| `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` | recommended | YouTube video ID for the explainer section. |
| `NEXT_PUBLIC_GA_ID` | optional | GA4 measurement ID. Script only loads when set. |
| `NEXT_PUBLIC_META_PIXEL_ID` | optional | Meta Pixel ID. Script only loads when set. |

## Project structure

```
src/
├── app/
│   ├── layout.tsx                # <html lang="he" dir="rtl"> + fonts + tracking
│   ├── page.tsx                  # composes all landing sections
│   ├── globals.css
│   ├── api/leads/route.ts        # POST → leads collection
│   ├── api/vouchers/route.ts     # POST → vouchers collection
│   ├── api/admin/list/route.ts   # GET (basic-auth) → JSON or CSV
│   └── admin/page.tsx            # password-gated submissions viewer
├── components/                   # all landing-page sections + forms
├── lib/                          # mongodb, validation (zod), analytics, constants
├── types/submissions.ts
└── middleware.ts                 # HTTP Basic auth on /admin/*
```

## MongoDB collections

```ts
// leads
{ name, phone, message?, source: "contact" | "accessibility",
  createdAt, userAgent?, referrer? }

// vouchers
{ buyerName, buyerPhone, recipientName?, occasion?,
  package: "10min" | "20min" | "acro" | "golan" | "gilboa",
  notes?, createdAt }
```

Validation lives in [src/lib/validation.ts](src/lib/validation.ts) (zod). Phone numbers are normalized to digits + leading `+` before insert.

## Admin

- Visit `/admin` — the browser prompts for HTTP Basic auth.
- Username can be anything; password must equal `ADMIN_PASSWORD`.
- Read-only tables of the latest 100 leads and 100 vouchers.
- CSV export buttons hit `/api/admin/list?type=leads|vouchers&format=csv`.

## Useful scripts

```bash
npm run dev         # dev server
npm run build       # production build
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
npm run lint
```

## TODOs to swap in before launch

- `public/logo.png` is the supplied logo; add real hero/gallery imagery as you get them.
- `NEXT_PUBLIC_YOUTUBE_VIDEO_ID` currently points at a placeholder; replace with the real explainer video.
- WhatsApp + phone numbers must be set via env before going live.
