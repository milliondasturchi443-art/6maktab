# Chortoq tumani 6-sonli umumiy o'rta ta'lim maktabi — Rasmiy sayt

Next.js 15 + TypeScript + Tailwind + Prisma + MongoDB (Atlas). Barcha ma'lumotlar real backend (MongoDB) dan keladi — demo/mock kontent yo'q.

## Xususiyatlar

- Bosh sahifa: Hero, statistika (faqat Sozlamalardagi real qiymatlar), yangiliklar, maktab haqida, ma'muriyat, o'qituvchilar, tadbirlar, yutuqlar, galereya, qabulxona, aloqa
- 15 bo'lim: Bosh sahifa, Maktab haqida, Ma'muriyat, O'qituvchilar, O'quvchilar, Ota-onalar, Yangiliklar, Tadbirlar, Yutuqlar, Galereya, Hujjatlar, Dars jadvali, Virtual qabulxona, Aloqa, Qidiruv
- Admin panel: Dashboard, yangiliklar, o'qituvchilar, ma'muriyat, tadbirlar, yutuqlar, galereya, hujjatlar, dars jadvali, murojaatlar, tarjimalar, sozlamalar
- Auth: JWT (jose) + bcrypt (12 rounds), httpOnly cookie, rate limiting, middleware himoyasi
- Media: fayllar MongoDB GridFS (Atlas) da saqlanadi — disk talab qilinmaydi, `/media/*` orqali xavfsiz beriladi
- Lokalizatsiya: o'zbekcha — asosiy til; ru/en tarjimalari DB orqali admin paneldan boshqariladi
- SEO: sitemap, robots, OpenGraph, semantic HTML
- Light/Dark mode, to'liq responsive

## Talablar

- Node.js 20+
- MongoDB (Atlas yoki lokal) — `mongodb+srv://...`
- npm

## O'rnatish

```bash
cd chortoq-6-maktab
npm install

cp .env.example .env
# .env ni to'ldiring: MONGODB_URL, JWT_SECRET, NEXT_PUBLIC_SITE_URL

# Schemani bazaga qo'llash
npm run db:push

# Administrator yaratish (interaktiv CLI yoki env, demo ma'lumotlar yo'q)
npm run create-admin

npm run dev
# http://localhost:3000
```

## Admin kirish

- URL: `/admin/login`
- Login va parolni `npm run create-admin` bilan o'zingiz yarating (tayyor demo-akkaunt yo'q)

## Muhit o'zgaruvchilari (.env)

```
MONGODB_URL="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE?retryWrites=true&w=majority"
JWT_SECRET="<uzun-maxfiy-kalit>"
NEXT_PUBLIC_SITE_URL="https://example.com"
```

`JWT_SECRET` bo'lmasa ilova ishlamaydi (xato beradi) — bu ongli xavfsizlik talabi.

## Media (rasm / hujjatlar)

- Yuklash: `POST /api/upload` (faqat admin, 10MB gacha, rasm/PDF)
- Saqlash: MongoDB GridFS (`media` bucket) — persistent disk talab qilinmaydi
- Berish: `/media/<nom>` — `nosniff`, to'g'ri content-type, immutable cache
- Fayl nomlari generatsiya qilinadi (UUID), traversal himoyasi bilan

## Backup / restore

```bash
npm run backup                  # scripts/backup.ts — EJSON dump (barcha kolleksiyalar)
npm run restore -- <fayl>       # scripts/restore.ts — kolleksiyalarni almashtiradi
```

## Test / build

```bash
npm test          # unit testlar (vitest)
npm run lint
npm run build     # production build
npm start
```

## Render (production) uchun

1. MongoDB Atlas yarating → `MONGODB_URL` (URL da bazani ko'rsating: `...mongodb.net/BASE?...`)
2. Web Service: build `npm ci && npm run db:push && npm run build`, start `npm start`
3. Env: `MONGODB_URL`, `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL` (`https://<xizmat>.onrender.com`)
4. `npm run create-admin` ni bir marta ishga tushiring (lokal CLI orqali — u Atlas bazasiga yozadi)
5. Media uchun disk kerak emas — GridFS Atlas da saqlanadi

## Loyiha tuzilishi

```
src/
  app/
    page.tsx                 # Bosh sahifa (real DB, bo'sh holatlar)
    layout.tsx               # i18n lug'at + settings
    api/
      auth/ news/ teachers/ events/ achievements/
      gallery/ documents/ schedule/ feedback/
      administration/ settings/ search/ upload/
      translations/ locale/ media/[...path]
    dars-jadvali/
    maktab-haqida/ mamuriyat/ oqituvchilar/ yangiliklar/
    tadbirlar/ yutuqlar/ galereya/ hujjatlar/
    qabulxona/ aloqa/ qidiruv/ oquvchilar/ ota-onalar/
    admin/login
    admin/(protected)/       # dashboard, barcha CRUD, tarjimalar
  components/
    layout/Header, Footer, LanguageSwitcher
    home/Hero, Stats
  lib/
    prisma.ts auth.ts storage.ts dictionary.ts i18n.ts
    utils.ts validations.ts
  middleware.ts              # /admin himoyasi
prisma/
  schema.prisma              # MongoDB provider (migrations yo'q — db push)
scripts/
  create-admin.ts backup.ts restore.ts _env.ts
```

## Xavfsizlik

- Parollar bcrypt (12 rounds); demo akkauntlar yo'q
- JWT httpOnly cookie; `JWT_SECRET` talab qilinadi
- Rate limiting (login, feedback)
- Zod validatsiya, Prisma ORM
- Media: MIME/hajm cheklovi, nom xavfsizligi, traversal himoyasi
- Public so'rovlar faqat `published=true` yozuvlarni ko'rsatadi
