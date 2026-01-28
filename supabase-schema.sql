-- =============================================
-- KONYA KEBAP EVİ - SUPABASE VERITABANI ŞEMASI
-- Bu SQL'i Supabase SQL Editor'da çalıştırın
-- =============================================

-- 1. Hero Slider Tablosu
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ocakbaşı Videoları Tablosu
CREATE TABLE IF NOT EXISTS ocakbasi_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_background BOOLEAN DEFAULT false,
    is_modal BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Galeri Tablosu (Misafirler + İmza Lezzetleri)
CREATE TABLE IF NOT EXISTS gallery_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('misafir', 'imza')),
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Ödüllerimiz Tablosu
CREATE TABLE IF NOT EXISTS awards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    year TEXT NOT NULL,
    organization TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'trophy',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Basında Biz Tablosu
CREATE TABLE IF NOT EXISTS press_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    outlet TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    quote TEXT,
    image_url TEXT NOT NULL,
    external_url TEXT,
    color TEXT DEFAULT '#d4af37',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Sosyal Sorumluluk Projeleri Tablosu
CREATE TABLE IF NOT EXISTS social_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Sosyal Sorumluluk İstatistikleri
CREATE TABLE IF NOT EXISTS impact_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    number TEXT NOT NULL,
    label TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. İnsan Kaynakları - Açık Pozisyonlar
CREATE TABLE IF NOT EXISTS job_positions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. İş Başvuruları
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position_id UUID REFERENCES job_positions(id) ON DELETE SET NULL,
    position_title TEXT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    cv_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- =============================================

-- Hero Slides
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_hero" ON hero_slides;
DROP POLICY IF EXISTS "admin_all_hero" ON hero_slides;
CREATE POLICY "public_read_hero" ON hero_slides FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_hero" ON hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Ocakbasi Videos
ALTER TABLE ocakbasi_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_videos" ON ocakbasi_videos;
DROP POLICY IF EXISTS "admin_all_videos" ON ocakbasi_videos;
CREATE POLICY "public_read_videos" ON ocakbasi_videos FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_videos" ON ocakbasi_videos FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Gallery Items
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_gallery" ON gallery_items;
DROP POLICY IF EXISTS "admin_all_gallery" ON gallery_items;
CREATE POLICY "public_read_gallery" ON gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_gallery" ON gallery_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Awards
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_awards" ON awards;
DROP POLICY IF EXISTS "admin_all_awards" ON awards;
CREATE POLICY "public_read_awards" ON awards FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_awards" ON awards FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Press Items
ALTER TABLE press_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_press" ON press_items;
DROP POLICY IF EXISTS "admin_all_press" ON press_items;
CREATE POLICY "public_read_press" ON press_items FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_press" ON press_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Social Projects
ALTER TABLE social_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_social" ON social_projects;
DROP POLICY IF EXISTS "admin_all_social" ON social_projects;
CREATE POLICY "public_read_social" ON social_projects FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_social" ON social_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Impact Stats
ALTER TABLE impact_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_stats" ON impact_stats;
DROP POLICY IF EXISTS "admin_all_stats" ON impact_stats;
CREATE POLICY "public_read_stats" ON impact_stats FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_stats" ON impact_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Job Positions
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_positions" ON job_positions;
DROP POLICY IF EXISTS "admin_all_positions" ON job_positions;
CREATE POLICY "public_read_positions" ON job_positions FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_positions" ON job_positions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Job Applications (sadece authenticated users görebilir, public insert yapabilir)
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_insert_applications" ON job_applications;
DROP POLICY IF EXISTS "admin_all_applications" ON job_applications;
CREATE POLICY "public_insert_applications" ON job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_applications" ON job_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- 10. Menü Kategorileri Tablosu
-- =============================================
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    icon TEXT DEFAULT '🍽️',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. Menü Öğeleri (Yemekler) Tablosu
-- =============================================
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Categories RLS
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_menu_categories" ON menu_categories;
DROP POLICY IF EXISTS "admin_all_menu_categories" ON menu_categories;
CREATE POLICY "public_read_menu_categories" ON menu_categories FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_menu_categories" ON menu_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Menu Items RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_menu_items" ON menu_items;
DROP POLICY IF EXISTS "admin_all_menu_items" ON menu_items;
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_menu_items" ON menu_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- 12. Rezervasyonlar Tablosu
-- =============================================
CREATE TABLE IF NOT EXISTS reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Müşteri Bilgileri
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    -- Rezervasyon Detayları
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests TEXT NOT NULL,
    notes TEXT,
    
    -- SMS Durumu
    sms_sent BOOLEAN DEFAULT false,
    sms_campaign_id TEXT,
    sms_sent_at TIMESTAMPTZ,
    
    -- Rezervasyon Durumu
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    
    -- Admin Notları
    admin_notes TEXT,
    confirmed_by TEXT,
    confirmed_at TIMESTAMPTZ,
    
    -- Metadata
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rezervasyonlar - RLS AKTİF
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_insert_reservations" ON reservations;
DROP POLICY IF EXISTS "admin_all_reservations" ON reservations;
-- Herkes yeni rezervasyon oluşturabilir (form gönderimi)
CREATE POLICY "public_insert_reservations" ON reservations FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Authenticated users tüm rezervasyonları yönetebilir
CREATE POLICY "admin_all_reservations" ON reservations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Rezervasyon updated_at trigger
CREATE OR REPLACE FUNCTION update_reservation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reservation_updated_at ON reservations;
CREATE TRIGGER reservation_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_reservation_timestamp();

-- =============================================
-- 13. Rezervasyon İstatistikleri View'ları
-- =============================================

-- Bugünün rezervasyonları (SECURITY INVOKER)
CREATE OR REPLACE VIEW today_reservations 
WITH (security_invoker = true) AS
SELECT * FROM reservations 
WHERE date = CURRENT_DATE
ORDER BY time ASC;

-- Bu haftanın rezervasyonları (SECURITY INVOKER)
CREATE OR REPLACE VIEW weekly_reservations 
WITH (security_invoker = true) AS
SELECT * FROM reservations 
WHERE date >= CURRENT_DATE 
  AND date < CURRENT_DATE + INTERVAL '7 days'
ORDER BY date ASC, time ASC;

-- Günlük rezervasyon sayısı - son 30 gün (SECURITY INVOKER)
CREATE OR REPLACE VIEW daily_reservation_stats 
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

-- Saatlik yoğunluk - bugün (SECURITY INVOKER)
CREATE OR REPLACE VIEW hourly_availability 
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
-- 14. Admin Kullanıcıları Tablosu (Rol Bazlı Erişim)
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Admin Users RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_read_users" ON admin_users;
DROP POLICY IF EXISTS "admin_write_users" ON admin_users;
-- Sadece authenticated users okuyabilir (kendi rolünü görmek için)
CREATE POLICY "admin_read_users" ON admin_users FOR SELECT TO authenticated USING (true);
-- Sadece admin rolündekiler yazabilir
CREATE POLICY "admin_write_users" ON admin_users FOR ALL TO authenticated 
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

-- Admin updated_at trigger
CREATE OR REPLACE FUNCTION update_admin_user_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS admin_user_updated_at ON admin_users;
CREATE TRIGGER admin_user_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_user_timestamp();

-- =============================================
-- İLK ADMIN KULLANICI EKLEME (Mevcut kullanıcınızı ekleyin)
-- =============================================
-- NOT: Aşağıdaki komutu kendi kullanıcınızla güncellemeniz gerekiyor!
-- Bu komutu çalıştırmadan önce auth.users tablosundan user_id'nizi alın

-- Örnek: (Kendi bilgilerinizi doldurun)
-- INSERT INTO admin_users (user_id, email, name, role) VALUES (
--     'BURAYA_SUPABASE_AUTH_USER_ID',
--     'admin@example.com',
--     'Admin Kullanıcı',
--     'admin'
-- );

-- =============================================
-- TAMAMLANDI!
-- =============================================
