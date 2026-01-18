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
-- TAMAMLANDI!
-- =============================================
