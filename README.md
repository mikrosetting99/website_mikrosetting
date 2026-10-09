# Mikrosetting

Katalog tools, script, template, dan layanan jaringan (MikroTik, Hotspot, OLT, VPN, Website, dan lainnya) dengan sistem akses Free / Pakai Koin / Subscriber.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives)
- **PostgreSQL** (self-hosted, bukan Supabase) + **Prisma 7** (driver adapter `@prisma/adapter-pg`)
- **Auth.js (NextAuth v5)** — credentials/email+password, session JWT
- **Docker** + **docker-compose** untuk deployment

## 1. Persiapan

```bash
npm install
cp .env.example .env
```

Isi `.env`:

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL, contoh: `postgresql://user:pass@localhost:5432/mikrosetting` |
| `AUTH_SECRET` | Generate dengan `npx auth secret` |
| `NEXTAUTH_URL` | URL aplikasi, contoh `http://localhost:3000` |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` / `POSTGRES_PORT` | Hanya dipakai oleh `docker-compose.yml` untuk container database |

## 2. Setup PostgreSQL (tanpa Docker, untuk development lokal)

Buat database & user khusus (sesuaikan password):

```sql
CREATE USER mikrosetting WITH PASSWORD 'mikrosetting';
CREATE DATABASE mikrosetting OWNER mikrosetting;
```

Lalu set `DATABASE_URL` di `.env` sesuai kredensial tersebut.

## 3. Migrasi & Seed

```bash
npm run db:generate   # generate Prisma Client
npm run db:migrate    # buat & jalankan migration (development)
npm run db:seed       # isi kategori, tools, paket koin, subscription plan contoh
npm run create-admin -- admin@mikrosetting.com passwordAdmin123 "Super Admin"
```

`create-admin` bisa juga dijalankan lewat environment variable:

```bash
ADMIN_EMAIL=admin@mikrosetting.com ADMIN_PASSWORD=passwordAdmin123 ADMIN_NAME="Super Admin" npm run create-admin
```

Script ini **upsert** — aman dijalankan ulang untuk menaikkan role user yang sudah ada menjadi `ADMIN`.

## 4. Development

```bash
npm run dev
```

Buka `http://localhost:3000`. Login admin di `/login`, lalu akses `/admin`.

## 5. Build Production (tanpa Docker)

```bash
npm run build
npm run db:deploy   # jalankan migration di server (prisma migrate deploy)
npm run start
```

## 6. Docker Deployment

```bash
cp .env.example .env   # isi AUTH_SECRET, dan sesuaikan kredensial DB bila perlu
docker compose build
docker compose up -d
```

`docker-compose.yml` menjalankan dua service:

- `db` — PostgreSQL 16 dengan volume persisten `db_data`
- `app` — build Next.js (`output: "standalone"`), otomatis connect ke service `db`

Container `app` memakai Next.js standalone output (tanpa `node_modules` penuh), jadi migrate/seed/create-admin dijalankan dari **host** — `docker-compose.yml` mengekspos port `POSTGRES_PORT` (default 5432) ke host, jadi cukup pastikan `DATABASE_URL` di `.env` host mengarah ke `localhost:<POSTGRES_PORT>` dengan kredensial yang sama:

```bash
npm run db:deploy
npm run db:seed
npm run create-admin -- admin@mikrosetting.com passwordAdmin123 "Super Admin"
```

## Struktur Proyek

```
src/
  app/              # routes (App Router)
    (auth)/         # login, register, server actions auth
    admin/          # admin panel (dilindungi proxy.ts, role ADMIN)
    tools/[slug]/   # halaman tool + gate akses (free/coin/subscriber)
    coins/          # beli koin & subscriber
  components/
    catalog/        # komponen homepage katalog
    tools/          # gate akses koin, konten tool (VPN generator, dll)
    admin/          # form & table admin
    ui/             # shadcn/ui primitives
  lib/
    db/prisma.ts    # Prisma client singleton (driver adapter pg)
    services/       # coin, tool-access, subscription, payment, settings
    validators/     # skema zod
  generated/prisma/  # Prisma Client hasil generate (jangan commit, lihat .gitignore)
prisma/
  schema.prisma
  seed.ts
  create-admin.ts
```

## Sistem Koin & Keamanan

- Saldo koin **tidak pernah** dipercaya dari frontend. Pengecekan saldo, akses, dan pemotongan koin selalu lewat `lib/services/coin.service.ts` & `lib/services/tool-access.service.ts` di server (Server Actions).
- Pemotongan saldo memakai `UPDATE ... WHERE coinBalance >= cost` dalam satu `prisma.$transaction`, sehingga aman dari race condition / double spending saat request bersamaan — tanpa perlu row lock eksplisit.
- Setiap perubahan saldo tercatat di tabel `coin_transactions` (`PURCHASE`, `TOOL_USAGE`, `BONUS`, `ADMIN_ADJUSTMENT`, `REFUND`), dan setiap pemakaian tool berbayar tercatat di `tool_usage`.
- Pembayaran paket koin memakai abstraksi `PaymentProvider` (`lib/services/payment.service.ts`). Saat ini pakai `DummyPaymentProvider` yang langsung meng-approve (untuk development/testing) — ganti dengan implementasi gateway sungguhan (Midtrans/Xendit/dll) tanpa mengubah pemanggilnya.

## Catatan Implementasi Tool

Tool dengan konten khusus (`src/components/tools/tool-content.tsx`):

- `vpn-mikrotik` → generator config VPN (L2TP/PPTP/WireGuard/OpenVPN) — fungsional penuh.
- `ip-calculator` → kalkulator subnetting IPv4 — fungsional penuh.
- Tool lain → `GenericScriptGenerator`, menghasilkan skrip RouterOS dasar dari input pengguna. Ini generator fungsional (bukan placeholder kosong), tapi belum spesifik per-tool — tambahkan komponen khusus di `tool-content.tsx` seperti pola `vpn-mikrotik` saat ingin membuat logika unik untuk tool tertentu.
