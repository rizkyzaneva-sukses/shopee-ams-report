# Shopee AMS Report

Dashboard performa Affiliate Marketing Solution (AMS) Shopee.

## Fitur

- 📊 **Dashboard Overview** — GMV, order, komisi, reject summary
- 📈 **Grafik Tren** — GMV, order, komisi harian (Recharts)
- 📦 **Product Performance** — Detail per produk (search, sort, filter)
- 📣 **Campaign Performance** — Open vs Targeted campaign breakdown
- 🔄 **Conversion Report** — Detail per order (status, komisi, attribution)
- ✅ **Validation Tracker** — Komisi di-reject, alasan, selisih
- 🏪 **Multi-Shop** — Monitor 4 toko dari 1 dashboard
- 📥 **Export Excel** — Multi-sheet, download langsung
- ⏰ **Auto-Sync** — Cron harian jam 14:00 WIB + retry 3x
- 🔄 **Manual Sync** — Trigger sync kapan saja dari dashboard

## Tech Stack

- Next.js 15 (App Router)
- PostgreSQL + Prisma
- Recharts
- Tailwind CSS
- ExcelJS (export)

## Setup

```bash
cp .env.example .env
# Isi credentials Shopee

npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Deploy

```bash
docker build -t shopee-ams-report .
```

## API

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/cron/sync` | POST | Trigger sync data dari Shopee |
| `/api/cron/sync` | GET | Cek status sync |
| `/api/report/product` | GET | Data produk (filter: from, to, sort) |
| `/api/report/campaign` | GET | Data campaign (filter: from, to, type) |
| `/api/report/conversion` | GET | Conversion report (filter: from, to, status) |
| `/api/report/export` | GET | Download Excel |
| `/api/validation` | GET | Validation report |
| `/api/shops` | GET | Daftar toko |

## Limitasi

- Data dari Shopee update H+1 atau H+2
- Cron sync jam 14:00 WIB dengan retry sampai jam 20:00
- Dashboard READ-ONLY (tidak ubah setting campaign/komisi)
