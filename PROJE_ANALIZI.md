# KONYA KEBAP EVİ - PROJE ANALİZ RAPORU

## 📋 GENEL BAKIŞ

**Proje Adı:** Konya Kebap Evi  
**Proje Türü:** Restoran Web Sitesi + Admin Paneli  
**Framework:** Next.js 16.1.1 (App Router)  
**React Versiyonu:** 19.2.3  
**Veritabanı:** Supabase (PostgreSQL)  
**Stil:** Tailwind CSS 3.4.19  
**Durum:** Aktif Geliştirme

---

## 🏗️ PROJE YAPISI

### Kök Dizin Yapısı
```
konyakebap/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin paneli sayfaları
│   │   ├── api/                # API route'ları
│   │   ├── menu/               # Menü sayfası
│   │   ├── layout.js           # Root layout
│   │   ├── page.js             # Ana sayfa
│   │   └── globals.css         # Global stiller
│   ├── components/             # React component'leri
│   │   ├── ui/                 # UI component'leri
│   │   └── [18 component]      # Ana sayfa section'ları
│   └── lib/                    # Yardımcı fonksiyonlar
│       ├── auth.js             # Rol bazlı yetkilendirme
│       ├── supabase.js         # Supabase client
│       ├── sms.js              # SMS servisi (Verimor)
│       ├── rateLimit.js        # Rate limiting (Upstash)
│       ├── validation.js       # Form validasyonu (Zod)
│       └── utils.js            # Genel yardımcılar
├── public/                     # Statik dosyalar
│   ├── images/                 # Görseller
│   ├── videos/                 # Videolar
│   └── logo.png                # Logo
├── supabase-schema.sql         # Veritabanı şeması
├── package.json                # Bağımlılıklar
├── next.config.mjs             # Next.js yapılandırması
├── tailwind.config.js          # Tailwind yapılandırması
└── eslint.config.mjs           # ESLint yapılandırması
```

---

## 🎯 ANA ÖZELLİKLER

### 1. **Frontend (Müşteri Tarafı)**
- ✅ Modern, responsive tasarım
- ✅ Hero slider (Supabase'den dinamik)
- ✅ Hakkımızda bölümü
- ✅ Rezervasyon formu (gerçek zamanlı validasyon)
- ✅ Menü görüntüleme (modal ve ayrı sayfa)
- ✅ Galeri (Misafirler + İmza Lezzetler)
- ✅ Ödüller bölümü
- ✅ Basında biz bölümü
- ✅ Sosyal sorumluluk projeleri
- ✅ İK bölümü (açık pozisyonlar + başvuru formu)
- ✅ Footer (iletişim bilgileri)
- ✅ Smooth scroll animasyonları (GSAP + Framer Motion)

### 2. **Admin Paneli**
- ✅ Rol bazlı erişim kontrolü (Admin/Staff)
- ✅ Dashboard (istatistikler)
- ✅ Hero Slider yönetimi
- ✅ Ocakbaşı videoları yönetimi
- ✅ Menü yönetimi (kategoriler + yemekler)
- ✅ Galeri yönetimi
- ✅ Ödüller yönetimi
- ✅ Basın haberleri yönetimi
- ✅ Sosyal sorumluluk projeleri yönetimi
- ✅ Rezervasyon yönetimi
- ✅ İK yönetimi (pozisyonlar + başvurular)
- ✅ Kullanıcı yönetimi
- ✅ Responsive admin arayüzü

### 3. **Backend & API**
- ✅ Rezervasyon API endpoint (`/api/reservation`)
- ✅ Rate limiting (Upstash Redis)
- ✅ SMS entegrasyonu (Verimor API)
- ✅ Form validasyonu (Zod)
- ✅ Supabase veritabanı entegrasyonu

---

## 🗄️ VERİTABANI YAPISI

### Tablolar (14 adet)

1. **hero_slides** - Ana sayfa slider görselleri
2. **ocakbasi_videos** - Ocakbaşı videoları
3. **gallery_items** - Galeri (misafir/imza kategorileri)
4. **awards** - Ödüller
5. **press_items** - Basın haberleri
6. **social_projects** - Sosyal sorumluluk projeleri
7. **impact_stats** - Sosyal sorumluluk istatistikleri
8. **menu_categories** - Menü kategorileri
9. **menu_items** - Menü öğeleri (yemekler)
10. **reservations** - Rezervasyonlar
11. **job_positions** - Açık iş pozisyonları
12. **job_applications** - İş başvuruları
13. **admin_users** - Admin kullanıcıları (rol yönetimi)
14. **auth.users** - Supabase Auth kullanıcıları

### Güvenlik (RLS - Row Level Security)
- ✅ Tüm tablolarda RLS aktif
- ✅ Public read (sadece aktif kayıtlar)
- ✅ Authenticated write (admin kullanıcılar)
- ✅ Rezervasyonlar: Public insert, authenticated read

### View'lar
- `today_reservations` - Bugünün rezervasyonları
- `weekly_reservations` - Bu haftanın rezervasyonları
- `daily_reservation_stats` - Günlük istatistikler (30 gün)
- `hourly_availability` - Saatlik yoğunluk

---

## 🔐 GÜVENLİK ÖZELLİKLERİ

### 1. **Rate Limiting**
- **Servis:** Upstash Redis
- **Limit:** 3 istek / 5 dakika / IP
- **Kullanım:** Rezervasyon formu koruması

### 2. **Rol Bazlı Erişim Kontrolü**
- **Roller:** `admin`, `staff`
- **Admin Yetkileri:** Tüm sayfalara erişim
- **Staff Yetkileri:** 
  - Dashboard
  - Rezervasyonlar
  - İş başvuruları

### 3. **Form Validasyonu**
- **Kütüphane:** Zod
- **Kontroller:**
  - İsim: 2-50 karakter, sadece harf
  - Telefon: Türk telefon formatı (05XX XXX XX XX)
  - Tarih: Bugünden 30 güne kadar
  - Saat: Çalışma saatleri içinde (12:00-22:00)
  - Kişi sayısı: Geçerli format

### 4. **SMS Entegrasyonu**
- **Servis:** Verimor SMS API
- **Özellikler:**
  - Rezervasyon bildirimi (işletmeye)
  - Simülasyon modu (geliştirme için)
  - Türkçe karakter desteği

---

## 📦 BAĞIMLILIKLAR

### Production Dependencies
```json
{
  "@gsap/react": "^2.1.2",           // GSAP React entegrasyonu
  "@radix-ui/react-toggle": "^1.1.10", // UI component
  "@radix-ui/react-toggle-group": "^1.1.11",
  "@supabase/supabase-js": "^2.90.1", // Supabase client
  "@upstash/ratelimit": "^2.0.8",     // Rate limiting
  "@upstash/redis": "^1.36.1",        // Redis client
  "class-variance-authority": "^0.7.1", // CSS variant yönetimi
  "clsx": "^2.1.1",                   // Class name utility
  "framer-motion": "^12.25.0",        // Animasyonlar
  "gsap": "^3.14.2",                  // Animasyonlar
  "lucide-react": "^0.562.0",         // İkonlar
  "next": "16.1.1",                    // Next.js framework
  "react": "19.2.3",                   // React
  "react-dom": "19.2.3",               // React DOM
  "tailwind-merge": "^3.4.0",          // Tailwind class merge
  "zod": "^4.3.5"                      // Validasyon
}
```

### Development Dependencies
```json
{
  "autoprefixer": "^10.4.23",
  "babel-plugin-react-compiler": "1.0.0",
  "eslint": "^9",
  "eslint-config-next": "16.1.1",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.19"
}
```

---

## 🎨 TASARIM SİSTEMİ

### Renk Paleti
- **Ana Renk:** `#d4af37` (Altın sarısı)
- **İkincil Renk:** `#b8962e` (Koyu altın)
- **Arka Plan:** `zinc-950`, `zinc-900`, `zinc-800`
- **Metin:** `white`, `zinc-400`, `zinc-500`

### Animasyonlar
- **GSAP:** Scroll animasyonları, reveal efektleri
- **Framer Motion:** Sayfa geçişleri, hover efektleri
- **CSS Transitions:** Smooth geçişler

### Responsive Tasarım
- **Mobile First:** Tüm component'ler mobil uyumlu
- **Breakpoints:** Tailwind default (sm, md, lg, xl)
- **Mobile Nav:** Hamburger menü

---

## 📱 SAYFA YAPISI

### Public Sayfalar
1. **/** - Ana sayfa (tüm section'lar)
2. **/menu** - Menü sayfası

### Admin Sayfaları
1. **/admin** - Dashboard
2. **/admin/login** - Giriş sayfası
3. **/admin/reservations** - Rezervasyon yönetimi
4. **/admin/slider** - Hero slider yönetimi
5. **/admin/videos** - Video yönetimi
6. **/admin/menu** - Menü yönetimi
7. **/admin/gallery** - Galeri yönetimi
8. **/admin/awards** - Ödül yönetimi
9. **/admin/press** - Basın haberleri yönetimi
10. **/admin/social** - Sosyal sorumluluk yönetimi
11. **/admin/hr/positions** - İş pozisyonları
12. **/admin/hr/applications** - İş başvuruları
13. **/admin/users** - Kullanıcı yönetimi

---

## 🔧 YAPILANDIRMA

### Gerekli Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# SMS (Verimor)
VERIMOR_USERNAME=
VERIMOR_PASSWORD=
VERIMOR_SENDER=KONYAKEBAP
BUSINESS_PHONE=905XXXXXXXXX

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# SMS Simülasyon Modu (opsiyonel)
SMS_SIMULATION_MODE=true
```

### Next.js Yapılandırması
- **Image Domains:** `thehunger.com.tr`, `images.unsplash.com`
- **App Router:** Aktif
- **React Compiler:** Aktif

---

## 🚀 ÇALIŞTIRMA

### Geliştirme
```bash
npm run dev
# http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## 📊 İSTATİSTİKLER

### Dosya Sayıları
- **Component'ler:** 18 adet
- **Admin Sayfaları:** 13 adet
- **API Route'ları:** 1 adet
- **Lib Fonksiyonları:** 6 adet
- **Veritabanı Tabloları:** 14 adet
- **View'lar:** 4 adet

### Kod Özellikleri
- ✅ TypeScript kullanılmıyor (JavaScript)
- ✅ Client Components: `'use client'` direktifi
- ✅ Server Components: Varsayılan
- ✅ Form validasyonu: Zod schema
- ✅ Animasyonlar: GSAP + Framer Motion
- ✅ Stil: Tailwind CSS

---

## 🎯 ÖNE ÇIKAN ÖZELLİKLER

### 1. **Rezervasyon Sistemi**
- Gerçek zamanlı form validasyonu
- Rate limiting koruması
- Otomatik SMS bildirimi
- Veritabanı kaydı
- IP ve User-Agent takibi

### 2. **Admin Paneli**
- Rol bazlı yetkilendirme
- Responsive tasarım
- Dashboard istatistikleri
- CRUD operasyonları
- Supabase Storage entegrasyonu

### 3. **Güvenlik**
- Row Level Security (RLS)
- Rate limiting
- Form validasyonu
- Rol bazlı erişim kontrolü
- IP takibi

### 4. **Performans**
- Next.js App Router
- Image optimization
- Lazy loading
- Code splitting
- Static generation (mümkün olduğunda)

---

## 🔄 GELİŞTİRME ÖNERİLERİ

### Kısa Vadeli
1. ✅ Environment variables dokümantasyonu
2. ✅ Error boundary eklenmesi
3. ✅ Loading state'lerin iyileştirilmesi
4. ✅ SEO optimizasyonu (meta tags)

### Orta Vadeli
1. ⚠️ TypeScript'e geçiş
2. ⚠️ Unit test'ler (Jest + React Testing Library)
3. ⚠️ E2E test'ler (Playwright)
4. ⚠️ Analytics entegrasyonu

### Uzun Vadeli
1. 🔮 Email bildirimleri
2. 🔮 Müşteri rezervasyon takibi
3. 🔮 Online ödeme entegrasyonu
4. 🔮 Çoklu dil desteği

---

## 📝 NOTLAR

### Mevcut Durum
- ✅ Proje aktif geliştirme aşamasında
- ✅ Temel özellikler tamamlanmış
- ✅ Admin paneli çalışır durumda
- ✅ Rezervasyon sistemi aktif

### Bilinen Sınırlamalar
- ⚠️ TypeScript kullanılmıyor
- ⚠️ Test coverage yok
- ⚠️ Error handling bazı yerlerde eksik
- ⚠️ Loading state'ler bazı component'lerde eksik

---

## 📞 İLETİŞİM & DESTEK

Proje hakkında sorularınız için:
- **Proje Adı:** Konya Kebap Evi
- **Framework:** Next.js 16
- **Veritabanı:** Supabase

---

**Son Güncelleme:** 2024  
**Versiyon:** 0.1.0  
**Durum:** Aktif Geliştirme
