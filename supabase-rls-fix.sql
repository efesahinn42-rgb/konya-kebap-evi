-- =============================================
-- KONYA KEBAP EVİ - RLS GÜVENLİK DÜZELTMELERİ
-- Bu SQL'i Supabase Dashboard → SQL Editor'da çalıştırın
-- =============================================

-- ⚠️ DİKKAT: Bu script mevcut veritabanındaki güvenlik açıklarını kapatır
-- Çalıştırmadan önce admin panel login'in çalıştığından emin olun

-- =============================================
-- 1. ADMIN_USERS TABLOSU - RLS AKTİFLEŞTİRME (KRİTİK)
-- =============================================
-- Sorun: RLS politikaları var ama RLS aktif değil
-- Çözüm: RLS'i aktifleştir

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları yeniden oluştur (varsa üzerine yazar)
DROP POLICY IF EXISTS "admin_read_users" ON admin_users;
DROP POLICY IF EXISTS "admin_write_users" ON admin_users;

-- Authenticated users tüm admin_users'ı okuyabilir (kendi rolünü görmek için)
CREATE POLICY "admin_read_users" ON admin_users 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Sadece admin rolündekiler yazabilir
CREATE POLICY "admin_write_users" ON admin_users 
    FOR ALL 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- 2. RESERVATIONS TABLOSU - RLS AKTİFLEŞTİRME (KRİTİK)
-- =============================================
-- Sorun: RLS politikaları var ama RLS aktif değil
-- Çözüm: RLS'i aktifleştir + doğru politikalar

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "public_insert_reservations" ON reservations;
DROP POLICY IF EXISTS "admin_all_reservations" ON reservations;

-- Herkes yeni rezervasyon oluşturabilir (public insert)
CREATE POLICY "public_insert_reservations" ON reservations 
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Authenticated users (admin/staff) tüm rezervasyonları görebilir ve yönetebilir
CREATE POLICY "admin_all_reservations" ON reservations 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- =============================================
-- 3. VIEW'LAR - SECURITY INVOKER (ORTA ÖNCELİK)
-- =============================================
-- Sorun: View'lar SECURITY DEFINER ile oluşturulmuş
-- Çözüm: SECURITY INVOKER olarak yeniden oluştur

-- Bugünün rezervasyonları
DROP VIEW IF EXISTS today_reservations;
CREATE VIEW today_reservations 
WITH (security_invoker = true) AS
SELECT * FROM reservations 
WHERE date = CURRENT_DATE
ORDER BY time ASC;

-- Bu haftanın rezervasyonları
DROP VIEW IF EXISTS weekly_reservations;
CREATE VIEW weekly_reservations 
WITH (security_invoker = true) AS
SELECT * FROM reservations 
WHERE date >= CURRENT_DATE 
  AND date < CURRENT_DATE + INTERVAL '7 days'
ORDER BY date ASC, time ASC;

-- Günlük rezervasyon istatistikleri
DROP VIEW IF EXISTS daily_reservation_stats;
CREATE VIEW daily_reservation_stats 
WITH (security_invoker = true) AS
SELECT 
    date,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE status = 'no_show') as no_show
FROM reservations
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY date
ORDER BY date DESC;

-- Saatlik yoğunluk
DROP VIEW IF EXISTS hourly_availability;
CREATE VIEW hourly_availability 
WITH (security_invoker = true) AS
SELECT 
    time,
    COUNT(*) as reservation_count
FROM reservations
WHERE date = CURRENT_DATE
  AND status IN ('pending', 'confirmed')
GROUP BY time
ORDER BY time;

-- =============================================
-- DOĞRULAMA SORGULARI
-- =============================================
-- Aşağıdaki sorguları çalıştırarak düzeltmeleri doğrulayabilirsiniz:

-- RLS durumunu kontrol et:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- View güvenlik ayarlarını kontrol et:
-- SELECT viewname, definition FROM pg_views WHERE schemaname = 'public';

-- =============================================
-- TAMAMLANDI!
-- Supabase Dashboard'daki uyarılar artık kaybolmalı.
-- =============================================
