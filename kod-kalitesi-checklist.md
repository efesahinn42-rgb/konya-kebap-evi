# 🛡️ Konya Kebap Evi - Kod Kalitesi & Güvenlik Checklist

> **Stack:** Next.js 16 + Supabase (PostgreSQL) + Upstash Redis + Verimor SMS API
> **Bu checklist projenizdeki mevcut durumu ve iyileştirme önerilerini içerir.**

---

## 📊 MEVCUT DURUM ANALİZİ

### ✅ Yapılanlar (İyi Pratikler)
| Özellik | Dosya | Durum |
|---------|-------|-------|
| Rate Limiting | `rateLimit.js` | ✅ 3 istek/5 dk/IP |
| Form Validasyonu | `validation.js` | ✅ Zod schema |
| Rol Bazlı Erişim | `auth.js` | ✅ Admin/Staff rolleri |
| Hata Kodları | `route.js` | ✅ 400, 429, 500 ayrımı |
| Input Sanitization | `validation.js` | ✅ Regex ile kontrol |
| Environment Variables | `.env.local` | ✅ Kod dışında tutulmuş |

### ⚠️ İyileştirme Gereken Alanlar
- Transaction yönetimi
- Timezone standardizasyonu
- ~~Caching stratejisi~~ ✅ React Query yapılandırıldı
- Monitoring/Logging
- ~~Error boundary~~ ✅ Mevcut

---

## 🗄️ VERİTABANI & SORGULAR

### N+1 Query Problemi
- [ ] **Admin panelde liste çekerken:** Her satır için ayrı sorgu yapılıyor mu kontrol et
- [ ] **Çözüm:** `.select('*, category:menu_categories(*)')` gibi join kullan

```javascript
// ❌ YANLIŞ - N+1 Problem
const items = await supabase.from('menu_items').select('*');
for (const item of items) {
  const category = await supabase.from('menu_categories').select('*').eq('id', item.category_id);
}

// ✅ DOĞRU - Tek sorgu
const items = await supabase.from('menu_items').select('*, category:menu_categories(*)');
```

### İndeksleme
- [x] **SQL dosyası hazır:** `supabase-indexes.sql` oluşturuldu
- [ ] **Supabase'de çalıştır:** Dashboard → SQL Editor'da dosyayı çalıştır
```sql
-- supabase-indexes.sql dosyasını Supabase SQL Editor'da çalıştırın
-- 12 adet performans indexi içerir
```

### Transaction Eksikliği
- [ ] **Risk:** Rezervasyon + SMS adımlarında biri başarısız olursa tutarsızlık
- [ ] **Mevcut Durum:** SMS başarısız olsa bile rezervasyon kaydediliyor (doğru yaklaşım)
- [ ] **Gelecek:** Çoklu tablo güncellemelerinde transaction kullan:
```javascript
// Supabase Edge Function'da transaction örneği
const { data, error } = await supabase.rpc('create_reservation_with_log', {
  p_name: name,
  p_phone: phone,
  // ...
});
```

### Timezone Sorunu
- [ ] **Kontrol et:** Tüm tarih/saat işlemlerinde UTC kullanılıyor mu?
- [ ] **`validation.js`'de:**
```javascript
// ⚠️ MEVCUT - Local timezone
const today = new Date();

// ✅ ÖNERİ - UTC standardı
const today = new Date();
today.setUTCHours(0, 0, 0, 0);
```
- [ ] **Supabase'de TIMESTAMPTZ kullanılıyor** ✅ (zaten doğru)

### SELECT * Kullanımı
- [ ] **Gereksiz kolon çekme:** Sadece gerekli kolonları seç
```javascript
// ❌ YANLIŞ
.select('*')

// ✅ DOĞRU
.select('id, name, date, time, guests, status')
```

### Pagination
- [ ] **Admin panelde büyük listelerde:** LIMIT/OFFSET yerine keyset pagination
```javascript
// ❌ Yavaş (büyük offset'lerde)
.range(1000, 1020)

// ✅ Hızlı (keyset pagination)
.lt('created_at', lastCreatedAt)
.order('created_at', { ascending: false })
.limit(20)
```

### Soft Delete
- [ ] **`is_active` filtreleme:** RLS politikalarında yapılmış ✅
- [ ] **Admin panelde dikkat:** Tüm kayıtları çekerken `is_active` filtresini atla

---

## 🔒 GÜVENLİK

### SQL Injection ✅
- [x] **Supabase client parametre bağlama yapıyor** - Güvenli

### XSS (Cross-Site Scripting)
- [ ] **Kullanıcı girdileri:** React otomatik escape ediyor ✅
- [ ] **Kontrol et:** `dangerouslySetInnerHTML` kullanımı var mı?
```bash
# Projede ara
grep -r "dangerouslySetInnerHTML" src/
```

### CSRF
- [ ] **Next.js App Router:** Cookie tabanlı auth kullanılmıyorsa sorun yok ✅
- [ ] **Supabase Auth:** JWT token kullanıyor ✅

### Yetkilendirme (AuthZ)
- [ ] **Mevcut:** `hasAccess()` fonksiyonu sayfa bazlı kontrol yapıyor ✅
- [ ] **Eksik:** API route'larında rol kontrolü yok
- [ ] **Öneri:** API route'lara middleware ekle:
```javascript
// src/app/api/admin/route.js
import { getUserRole } from '@/lib/auth';

export async function GET(request) {
  const user = await supabase.auth.getUser();
  const role = await getUserRole(user?.data?.user?.id);
  
  if (!role || role.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  // ...
}
```

### Secret Yönetimi ✅
- [x] **`.env.local` kullanılıyor**
- [x] **`.gitignore`'da `.env*` var**
- [ ] **Kontrol et:** GitHub repo'da secret yok mu?

### CORS
- [ ] **Next.js API routes:** Varsayılan olarak same-origin ✅
- [ ] **Dikkat:** Public API açarsan CORS düzgün ayarla

---

## ⚡ PERFORMANS

### Cache Stratejisi
- [x] **React Query cache yapılandırıldı:** `react-query.js`
  - `staleTime: 5 dakika`
  - `gcTime: 10 dakika`
  - `retry: 3`
  - `refetchOnWindowFocus: false`
```javascript
// src/lib/react-query.js - MEVCUT
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 dakika ✅
      gcTime: 10 * 60 * 1000,   // 10 dakika ✅
    },
  },
})
```

### Cache Stampede Önleme
- [ ] **Risk:** Cache boşalınca herkes DB'ye yüklenir
- [ ] **Öneri:** `stale-while-revalidate` pattern

### Paralel API Çağrıları
- [ ] **Kontrol et:** Bağımsız API çağrıları paralel mi?
```javascript
// ❌ YANLIŞ - Seri
const slides = await supabase.from('hero_slides').select('*');
const videos = await supabase.from('ocakbasi_videos').select('*');

// ✅ DOĞRU - Paralel
const [slides, videos] = await Promise.all([
  supabase.from('hero_slides').select('*'),
  supabase.from('ocakbasi_videos').select('*')
]);
```

---

## 🔄 CONCURRENCY & DAĞıTIK SİSTEM

### Race Condition
- [ ] **Stok/Kapasite:** Rezervasyon sisteminde aynı slot için race condition var mı?
- [ ] **Öneri:** Supabase'de atomic update veya row lock kullan
```sql
-- Örnek: Slot kontrolü
SELECT * FROM reservations 
WHERE date = '2024-01-20' AND time = '19:00' 
FOR UPDATE; -- Row lock
```

### Idempotency (Tekrar Güvenliği)
- [ ] **SMS Gönderimi:** Aynı rezervasyon için çift SMS riski var mı?
- [ ] **Mevcut:** `sms_campaign_id` ile takip ediliyor ✅
- [ ] **Öneri:** API'ye idempotency key ekle:
```javascript
// Request header'da
const idempotencyKey = request.headers.get('X-Idempotency-Key');
if (idempotencyKey) {
  const existing = await redis.get(`idempotency:${idempotencyKey}`);
  if (existing) return NextResponse.json(JSON.parse(existing));
}
```

---

## 🐛 HATA YÖNETİMİ

### Exception Yutma
- [ ] **Kontrol et:** `catch {}` bloklarında error loglanıyor mu?
```javascript
// ❌ YANLIŞ
try { ... } catch (e) { }

// ✅ DOĞRU
try { ... } catch (e) { 
  console.error('İşlem hatası:', e);
  // Sentry, LogRocket vb. gönder
}
```

### Log'larda PII Sızdırma
- [ ] **Kontrol et:** Telefon, isim, IP tam loglanıyor mu?
- [ ] **`route.js`'de:** IP maskeleniyor ✅
```javascript
// ✅ İYİ - Maskelenmiş
console.log(`📱 SMS Request: ${normalizedPhone.substring(0, 5)}****`);
```

### Error Boundary
- [x] **React Error Boundary mevcut:** `src/components/ErrorBoundary.jsx`
  - Retry butonu ile kullanıcı dostu UI
  - Console.error ile logging
  - Projenin tasarımına uygun stil

---

## 🔌 API & ENTEGRASYON

### Timeout/Retry Politikası
- [ ] **SMS servisi:** 30 saniye timeout + 3 retry ✅
- [ ] **Supabase:** Varsayılan timeout kullanılıyor

### Webhook Doğrulama
- [ ] **Şu an:** Webhook yok
- [ ] **Gelecekte:** Verimor'dan callback alırsan imza doğrula

### API Versioning
- [ ] **Şu an:** `/api/reservation` - versiyon yok
- [ ] **Öneri:** `/api/v1/reservation` şeklinde versiyonla

---

## 🧪 TEST

### Mevcut Durum
- [ ] Unit test yok
- [ ] Integration test yok
- [ ] E2E test yok

### Önerilen Test Stratejisi
```
tests/
├── unit/
│   ├── validation.test.js
│   └── auth.test.js
├── integration/
│   └── reservation.test.js
└── e2e/
    └── reservation-flow.spec.js
```

### Kritik Test Senaryoları
- [ ] Rezervasyon validasyonu (tarih, saat, telefon)
- [ ] Rate limiting çalışıyor mu?
- [ ] Rol bazlı erişim kontrolü
- [ ] SMS simülasyon modu

---

## 📈 MONİTORİNG & OBSERVABİLİTY

### Mevcut Durum
- [ ] Console.log ile basic logging ✅
- [ ] Structured logging yok
- [ ] Metrics yok
- [ ] Tracing yok

### Önerilen Araçlar
| Araç | Amaç | Fiyat |
|------|------|-------|
| Sentry | Error tracking | Ücretsiz (10K/ay) |
| LogRocket | Session replay | Ücretsiz (1K session) |
| Upstash (mevcut) | Redis + Metrics | Ücretsiz tier |
| Supabase Dashboard | DB metrics | Dahil |

### Sentry Entegrasyonu (Öneri)
```javascript
// next.config.mjs
import { withSentryConfig } from '@sentry/nextjs';

// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

---

## 📋 ÖNCELİKLENDİRİLMİŞ EYLEM PLANI

### 🔴 Kritik (Hemen Yapılmalı)
1. [ ] API route'lara yetkilendirme middleware'i ekle
2. [ ] Timezone sorununu UTC'ye standardize et
3. [ ] Admin panelde N+1 query'leri düzelt

### 🟠 Önemli (1-2 Hafta)
4. [x] Database index'leri ekle → `supabase-indexes.sql` oluşturuldu
5. [x] Error Boundary component'i ekle → Zaten mevcut ✅
6. [x] Cache stratejisi uygula → React Query yapılandırıldı ✅
7. [ ] Paralel API çağrıları için Promise.all kullan

### 🟡 İyileştirme (1 Ay)
8. [ ] Sentry veya benzeri error tracking ekle
9. [ ] Unit testler yaz (validation, auth)
10. [ ] API versiyonlama ekle (/api/v1/)

### 🟢 Gelecek (Opsiyonel)
11. [ ] TypeScript'e geçiş
12. [ ] E2E testler (Playwright)
13. [ ] Feature flag sistemi
14. [ ] Rate limiting dashboard

---

## 🔧 HIZLI DÜZELTME ÖRNEKLERİ

### 1. API Yetkilendirme Middleware
```javascript
// src/lib/apiAuth.js
export async function requireAdmin(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  const role = await getUserRole(user.id);
  if (!role || role.role !== 'admin') {
    return { error: 'Forbidden', status: 403 };
  }
  
  return { user, role };
}
```

### 2. Paralel Veri Çekme
```javascript
// src/app/page.js
async function fetchHomePageData() {
  const [slides, videos, awards, press] = await Promise.all([
    supabase.from('hero_slides').select('*').eq('is_active', true),
    supabase.from('ocakbasi_videos').select('*').eq('is_active', true),
    supabase.from('awards').select('*').eq('is_active', true),
    supabase.from('press_items').select('*').eq('is_active', true)
  ]);
  
  return { slides, videos, awards, press };
}
```

### 3. React Query Cache
```javascript
// src/hooks/useMenu.js
export function useMenu() {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('menu_categories')
        .select('*, items:menu_items(*)')
        .eq('is_active', true);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 dakika cache
  });
}
```

---

**Son Güncelleme:** 2026-01-28
**Durum:** İnceleme için hazır
