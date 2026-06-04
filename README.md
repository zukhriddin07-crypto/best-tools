# 🔧 Best Tools — Premium Elektr Asboblar E-commerce

O'zbekistondagi eng yaxshi professional elektr asboblar do'koni.  
**Bosch | Milwaukee | DeWalt | Makita | Hilti | Metabo**

---

## 🚀 Texnologiyalar

| Qatlam | Texnologiya |
|--------|-------------|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + Custom CSS |
| Database | PostgreSQL (Supabase) + Prisma v7 |
| Auth | NextAuth.js (admin) + SMS OTP (mijozlar) |
| Fayl saqlash | Cloudinary |
| SMS | Eskiz.uz |
| Telegram | grammY + Mini App |
| To'lov | Click, Payme, Uzum Nasiya |
| AI | Anthropic Claude API |
| Deploy | Vercel |

---

## 📁 Loyiha tuzilmasi

```
best-tools/
├── app/
│   ├── (shop)/          # Mijozlar sahifalari
│   ├── admin/           # Admin panel
│   ├── api/             # Backend API
│   └── tma/             # Telegram Mini App
├── components/
│   ├── layout/          # Header, Footer
│   ├── shop/            # Mahsulot, Savat komponentlar
│   └── admin/           # Admin UI
├── lib/                 # Utilities
├── prisma/              # Database schema
└── public/              # Statik fayllar
```

---

## ⚙️ O'rnatish

### 1. Klonlash va paketlar o'rnatish

```bash
cd "d:\BEST TOOLS E COM\best-tools"
npm install
```

### 2. Environment variables

`.env.local` faylini to'ldiring:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
NEXTAUTH_SECRET="min-32-char-random-string"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Supabase sozlash

1. [supabase.com](https://supabase.com) → New Project
2. `DATABASE_URL` ni `.env.local` ga ko'chiring
3. Database migratsiya qiling:
   ```bash
   npx prisma migrate dev --name init
   ```

### 4. Ishga tushirish

```bash
npm run dev
# http://localhost:3000
```

---

## ✅ Bajarilgan bosqichlar

### Bosqich 1 — Setup ✅
- [x] Next.js 16 + TypeScript + Tailwind CSS v4
- [x] Prisma v7 + schema (15 model)
- [x] Environment variables template
- [x] Supabase integratsiya tayyor

### Bosqich 2 — Statik sayt ✅
- [x] Bosh sahifa (Hero, Brendlar, Kategoriyalar, Mahsulotlar)
- [x] Katalog sahifasi (filtrlar, sorting)
- [x] Mahsulot tafsiloti (specs, installment, similar)
- [x] Header (sticky, search, cart, mobile menu)
- [x] Footer (kategoriyalar, brendlar, kontakt)
- [x] Mobile-first responsive dizayn
- [x] Industrial dark theme (#FACC15 aksent)

---

## 📋 Keyingi bosqichlar (TODO)

### Bosqich 3 — Admin panel
- [ ] Admin login (email + parol)
- [ ] Mahsulot CRUD
- [ ] Rasm yuklash (Cloudinary)
- [ ] Brend va kategoriya boshqaruvi

### Bosqich 4 — Savat va buyurtma
- [ ] Savat (localStorage + database)
- [ ] Checkout flow (5 qadam)
- [ ] SMS OTP (Eskiz.uz)
- [ ] Buyurtma yaratish

### Bosqich 5 — To'lov
- [ ] Click integration
- [ ] Payme integration
- [ ] Webhook handlers
- [ ] Test rejimi

### Bosqich 6 — Telegram Bot
- [ ] grammY bot setup
- [ ] Mini App sahifalari
- [ ] Telegram autentifikatsiya
- [ ] Buyurtma xabarnomalari

### Bosqich 7 — Logistika
- [ ] BTS Express API
- [ ] Yandex Delivery
- [ ] Jo'natma yaratish

### Bosqich 8 — Uzum Nasiya
- [ ] API integratsiyasi (hujjatlar keyin)

### Bosqich 9 — AI
- [ ] Claude API ulash
- [ ] Mahsulot tavsifini avtomat yaratish
- [ ] Admin paneldagi "AI bilan to'ldirish"

### Bosqich 10 — Analytics
- [ ] Dashboard grafiklar
- [ ] SEO optimizatsiya
- [ ] Vercel Analytics

### Bosqich 11 — Ishga tushirish
- [ ] besttools.uz domen
- [ ] SSL sertifikat
- [ ] Birinchi 10 mahsulot

---

## 🌐 Sahifalar

| URL | Tavsif | Holat |
|-----|--------|-------|
| `/` | Bosh sahifa | ✅ Tayyor |
| `/catalog` | Katalog | ✅ Tayyor |
| `/product/[slug]` | Mahsulot tafsiloti | ✅ Tayyor |
| `/cart` | Savat | 🔜 Keyingi |
| `/checkout` | Buyurtma | 🔜 Keyingi |
| `/account` | Shaxsiy kabinet | 🔜 Keyingi |
| `/admin` | Admin panel | 🔜 Keyingi |

---

## 📞 Aloqa

- **Telefon:** +998 71 234-56-78
- **Email:** info@besttools.uz
- **Telegram:** [@besttoolsuz](https://t.me/besttoolsuz)
- **Manzil:** Toshkent, Chilonzor tumani
