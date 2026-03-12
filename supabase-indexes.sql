-- =============================================
-- KONYA KEBAP EVİ - PERFORMANS İNDEKSLERİ
-- Bu SQL'i Supabase SQL Editor'da çalıştırın
-- =============================================

-- Rezervasyonlar için indeksler
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_date_status ON reservations(date, status);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);

-- Menü için indeksler
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_active ON menu_items(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_menu_categories_order ON menu_categories(display_order);

-- Galeri için indeksler
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery_items(is_active) WHERE is_active = true;

-- Genel sıralama indeksleri
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_awards_order ON awards(display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_press_order ON press_items(display_order) WHERE is_active = true;

-- Admin kullanıcıları için indeks
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- =============================================
-- TAMAMLANDI!
-- Bu indeksler sorgu performansını artıracaktır.
-- =============================================
