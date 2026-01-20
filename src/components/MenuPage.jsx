'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

// Fallback data when database is empty
const fallbackData = [
    {
        id: 'corbalar',
        title: 'ÇORBALAR',
        icon: '🍜',
        items: [
            { name: 'Bamya Çorbası', price: '250.00', description: 'Mevlevi kültüründen doğan, Selçuklu saray mutfağına uzanan; çiçek bamya ve kuzu etiyle hazırlanır.', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=600' },
            { name: 'Tandır Çorbası', price: '280.00', description: 'Dergâh kültüründen gelen, taş fırında sekiz saat tandırda pişmiş kuzu etiyle hazırlanan yoğurtlu çorba.', image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&q=80&w=600' },
            { name: 'Mercimek Çorbası', price: '200.00', description: 'Et ve kemik suyuyla özenle hazırlanmış, pürüzsüz kıvamıyla doyurucu ve tok tutan geleneksel başlangıç.', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&q=80&w=600' },
        ]
    },
    {
        id: 'pideler',
        title: 'PİDELER',
        icon: '🫓',
        items: [
            { name: 'Etliekmek', price: '350.00', description: 'Selçuklu\'dan kalan Konya\'nın simgesi; ince hamura serilen kıyma taş fırında çıtır pişirilir.', image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=600' },
            { name: 'Kuşbaşılı Pide', price: '400.00', description: 'Konya mutfağının öne çıkan etli pidesi; taş fırında hazırlanan kuşbaşılı geleneksel lezzet.', image: 'https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&q=80&w=600' },
            { name: 'Kıymalı Kaşarlı Pide', price: '380.00', description: 'Taş fırında hazırlanan kıymalı-kaşarlı geleneksel pide.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600' },
            { name: 'Lahmacun', price: '180.00', description: 'Güneydoğu mutfağından taş fırın klasiği: İncecik hamur, bol baharatlı harç.', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=600' },
        ]
    },
    {
        id: 'kebaplar',
        title: 'KEBAP VE IZGARALAR',
        icon: '🍖',
        items: [
            { name: 'Kuzu Tandır', price: '1100.00', description: 'Selçuklu\'dan günümüze taş fırın geleneğiyle pişer. Lif lif ayrılan, ağızda dağılan lezzet.', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600' },
            { name: 'Közlü Adana Kebap', price: '790.00', description: 'Acı ve baharatlı, taş ızgarada ustalıkla pişirilir. Közlü patlıcan ile sunulur.', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=600' },
            { name: 'Kuzu Çöp Şiş', price: '890.00', description: 'Odun ateşinde özenle pişmiş, baharatla marine edilmiş şişte sunulan ızgara lezzeti.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600' },
            { name: 'Kuzu Pirzola', price: '940.00', description: 'Osmanlı\'dan günümüze uzanan kemikli et geleneği; ızgarada mühürlenmiş, yumuşak dokulu.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600' },
            { name: 'Izgara Köfte', price: '690.00', description: 'Çıtır dışı altın sarısı, içi yumuşacık özel dana etli köfte.', image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=600' },
            { name: 'Tavuk Şiş', price: '650.00', description: 'Marine edilip dışı kızarmış, içi sulu ve enfes şekilde pişirilir.', image: 'https://images.unsplash.com/photo-1532636875304-0c89119d9b4d?auto=format&fit=crop&q=80&w=600' },
        ]
    },
    {
        id: 'tatlilar',
        title: 'TATLILAR',
        icon: '🍰',
        items: [
            { name: 'Fıstıklı Katmer', price: '380.00', description: 'Gaziantep katmer geleneğinden; bol fıstıklı, kaymaklı ve çıtır tereyağıyla hazırlanır.', image: 'https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?auto=format&fit=crop&q=80&w=600' },
            { name: 'Künefe', price: '400.00', description: 'Antakya kökenli, altın kızarmış kadayıf ve erimiş peynirle hazırlanır.', image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&q=80&w=600' },
            { name: 'Kabak Tatlısı', price: '330.00', description: 'Fırında kızartılan kabak, tahin ve taze cevizlerle zenginleştirilir.', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=600' },
            { name: 'Sakızlı Dondurma', price: '200.00', description: 'Osmanlı\'dan beri yazların vazgeçilmezi, yoğun kıvamlı sakızlı dondurma.', image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&q=80&w=600' },
        ]
    },
    {
        id: 'icecekler',
        title: 'İÇECEKLER',
        icon: '🥤',
        items: [
            { name: 'Ayran', price: '80.00', description: 'Geleneksel ev yapımı ayran.', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&q=80&w=600' },
            { name: 'Şalgam', price: '90.00', description: 'Acılı veya acısız şalgam suyu.', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=600' },
            { name: 'Türk Kahvesi', price: '120.00', description: 'Geleneksel usul hazırlanmış Türk kahvesi.', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600' },
        ]
    },
];

const MenuCard = ({ item }) => (
    <motion.div
        className="group relative bg-zinc-900/60 rounded-2xl overflow-hidden border border-white/5 hover:border-[#d4af37]/30 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
    >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
            <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Price Badge */}
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-[#d4af37] text-black font-black text-sm rounded-full shadow-lg">
                {item.price} ₺
            </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
            <h4 className="text-lg sm:text-xl font-black text-white mb-2 group-hover:text-[#d4af37] transition-colors">
                {item.name}
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
                {item.description}
            </p>
        </div>
    </motion.div>
);

const CategorySection = ({ category, isOpen, onToggle }) => (
    <div className="mb-4">
        {/* Category Header */}
        <motion.button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 sm:p-5 bg-zinc-900/80 hover:bg-zinc-800/80 rounded-2xl border border-white/10 hover:border-[#d4af37]/30 transition-all group"
            whileTap={{ scale: 0.99 }}
        >
            <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl">{category.icon}</span>
                <span className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-wide group-hover:text-[#d4af37] transition-colors">
                    {category.title}
                </span>
                <span className="text-xs text-zinc-500 font-bold">({category.items.length} ürün)</span>
            </div>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-[#d4af37]"
            >
                <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7" />
            </motion.div>
        </motion.button>

        {/* Items Grid */}
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pt-4">
                        {category.items.map((item, index) => (
                            <MenuCard key={index} item={item} />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default function MenuPage() {
    const [openCategories, setOpenCategories] = useState([]);
    const [menuData, setMenuData] = useState(fallbackData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                // Fetch categories
                const { data: categories, error: catError } = await supabase
                    .from('menu_categories')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (catError || !categories || categories.length === 0) {
                    setMenuData(fallbackData);
                    setLoading(false);
                    return;
                }

                // Fetch all menu items
                const { data: items, error: itemError } = await supabase
                    .from('menu_items')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (itemError) {
                    setMenuData(fallbackData);
                    setLoading(false);
                    return;
                }

                // Combine categories with their items
                const transformedData = categories.map(cat => ({
                    id: cat.id,
                    title: cat.title,
                    icon: cat.icon || '🍽️',
                    items: (items || [])
                        .filter(item => item.category_id === cat.id)
                        .map(item => ({
                            name: item.name,
                            price: parseFloat(item.price).toFixed(2),
                            description: item.description || '',
                            image: item.image_url
                        }))
                }));

                setMenuData(transformedData.length > 0 ? transformedData : fallbackData);
            } catch (err) {
                console.error('Error fetching menu:', err);
                setMenuData(fallbackData);
            }
            setLoading(false);
        };

        fetchMenuData();
    }, []);

    const toggleCategory = (id) => {
        setOpenCategories(prev =>
            prev.includes(id)
                ? prev.filter(catId => catId !== id)
                : [...prev, id]
        );
    };

    return (
        <main className="w-full overflow-x-hidden">
            <Navbar />
            <section id="menu" className="min-h-screen bg-[#0a0a0a] pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-24">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-8 sm:mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="w-8 sm:w-10 lg:w-12 h-[2px] bg-[#d4af37]"></span>
                        <span className="text-[#d4af37] text-xs sm:text-sm font-black tracking-[0.3em] sm:tracking-[0.4em] lg:tracking-[0.5em] uppercase">Lezzetler</span>
                        <span className="w-8 sm:w-10 lg:w-12 h-[2px] bg-[#d4af37]"></span>
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter px-2">
                        MENÜMÜZ
                    </h2>
                    <p className="text-zinc-400 mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg max-w-[600px] mx-auto px-2">
                        Konya mutfağının en seçkin lezzetleri, geleneksel tariflerle modern sunumda
                    </p>
                </motion.div>

                {/* Menu Categories */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-zinc-900/80 rounded-2xl h-20 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {menuData.map((category) => (
                            <CategorySection
                                key={category.id}
                                category={category}
                                isOpen={openCategories.includes(category.id)}
                                onToggle={() => toggleCategory(category.id)}
                            />
                        ))}
                    </div>
                )}

                {/* Footer Note */}
                <motion.p
                    className="text-center text-zinc-500 text-xs sm:text-sm mt-8 sm:mt-12 px-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    * Fiyatlar KDV dahildir. Menü içerikleri ve fiyatlar değişiklik gösterebilir.
                </motion.p>
                </div>
            </section>
        </main>
    );
}
