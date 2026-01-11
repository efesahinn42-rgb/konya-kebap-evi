'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const menuData = [
    {
        id: 'corbalar',
        title: 'ÇORBALAR',
        icon: '🍜',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200',
        items: [
            { name: 'Bamya Çorbası', price: '250.00', description: 'Mevlevi kültüründen doğan, Selçuklu saray mutfağına uzanan; çiçek bamya ve kuzu etiyle hazırlanır.' },
            { name: 'Tandır Çorbası', price: '280.00', description: 'Dergâh kültüründen gelen, taş fırında sekiz saat tandırda pişmiş kuzu etiyle hazırlanan yoğurtlu çorba.' },
            { name: 'Mercimek Çorbası', price: '200.00', description: 'Et ve kemik suyuyla özenle hazırlanmış, pürüzsüz kıvamıyla doyurucu ve tok tutan geleneksel başlangıç.' },
        ]
    },
    {
        id: 'pideler',
        title: 'PİDELER',
        icon: '🫓',
        image: 'https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&q=80&w=1200',
        items: [
            { name: 'Etliekmek', price: '350.00', description: 'Selçuklu\'dan kalan Konya\'nın simgesi; ince hamura serilen kıyma taş fırında çıtır pişirilir.' },
            { name: 'Kuşbaşılı Pide', price: '400.00', description: 'Konya mutfağının öne çıkan etli pidesi; taş fırında hazırlanan kuşbaşılı geleneksel lezzet.' },
            { name: 'Kıymalı Kaşarlı Pide', price: '380.00', description: 'Taş fırında hazırlanan kıymalı-kaşarlı geleneksel pide.' },
            { name: 'Otlu Pide', price: '300.00', description: 'Anadolu otlu pide geleneğinin taş fırın yorumu; ince hamur üzerine bol kekikle hazırlanır.' },
            { name: 'Yağ Somunu', price: '280.00', description: 'Konya\'ya özgü geleneksel fırın lezzeti; bol tereyağlı yapısıyla yumuşak dokulu.' },
            { name: 'Yağ Somunu Atom', price: '450.00', description: 'Kaşar, küflü peynir, pastırma ve sucukla zenginleştirilmiş özel yağ somunu.' },
            { name: 'Lahmacun', price: '180.00', description: 'Güneydoğu mutfağından taş fırın klasiği: İncecik hamur, bol baharatlı harç.' },
        ]
    },
    {
        id: 'kebaplar',
        title: 'KEBAP VE IZGARALAR',
        icon: '🍖',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200',
        items: [
            { name: 'Kuzu Tandır (Fırın Kebabı)', price: '1100.00', description: 'Selçuklu\'dan günümüze taş fırın geleneğiyle pişer. Lif lif ayrılan, ağızda dağılan lezzet.' },
            { name: 'Konya Tridi (Köfteli)', price: '690.00', description: 'Mevlevi mutfağının ekmekli etli sunumu: Et suyuyla ıslatılan yufka üzerine sıcak etle sunulur.' },
            { name: 'Konya Tridi (Kuşbaşılı)', price: '790.00', description: 'Geleneksel Konya tridisi kuşbaşı et ile.' },
            { name: 'Kuzu Ciğer Şiş', price: '790.00', description: 'Orta Anadolu mangal kültüründen gelen lezzet; hafif kızarmış dış, yumuşak iç doku.' },
            { name: 'Közlü Adana Kebap', price: '790.00', description: 'Acı ve baharatlı, taş ızgarada ustalıkla pişirilir. Közlü patlıcan ile sunulur.' },
            { name: 'Közlü Urfa Kebap', price: '790.00', description: 'Sade ve yumuşak dokusuyla taş ızgarada ustalıkla pişirilir.' },
            { name: 'Kuzu Çöp Şiş', price: '890.00', description: 'Odun ateşinde özenle pişmiş, baharatla marine edilmiş şişte sunulan ızgara lezzeti.' },
            { name: 'Beyti Kebap (Kaşarlı)', price: '890.00', description: 'Lavaşta sunulan soslu, yoğurtlu ve kaşarlı kebap.' },
            { name: 'Vali Kebabı', price: '1300.00', description: '1/2 Çöp Şiş, 1/2 Adana, 1/2 Tavuk Şiş ve Fındık Lahmacun ile özel sunum.' },
            { name: 'Kuzu Saç Tava', price: '880.00', description: 'Anadolu\'nun geleneksel kuzu saç kavurması. Yüksek ateşte cızırdayarak pişer.' },
            { name: 'Izgara Köfte', price: '690.00', description: 'Çıtır dışı altın sarısı, içi yumuşacık özel dana etli köfte.' },
            { name: 'Kuzu Pirzola', price: '940.00', description: 'Osmanlı\'dan günümüze uzanan kemikli et geleneği; ızgarada mühürlenmiş, yumuşak dokulu.' },
            { name: 'Kuzu Kaburga', price: '840.00', description: 'Izgara mühürlenmiş, lokum gibi yumuşak ve dengeli yağıyla damakta kalıcı tat.' },
            { name: 'Tavuk Kanat', price: '690.00', description: 'Özenle marine edilmiş, dışı altın rengi kızarmış, içi sulu.' },
            { name: 'Tavuk Şiş', price: '650.00', description: 'Marine edilip dışı kızarmış, içi sulu ve enfes şekilde pişirilir.' },
            { name: 'Kuzu Ekmek Salması', price: '790.00', description: 'Tandır ekmeği, kuzu kuşbaşı ve tereyağının sıcak buluşması.' },
        ]
    },
    {
        id: 'tatlilar',
        title: 'TATLILAR',
        icon: '🍰',
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=1200',
        items: [
            { name: 'Fıstıklı Katmer', price: '380.00', description: 'Gaziantep katmer geleneğinden; bol fıstıklı, kaymaklı ve çıtır tereyağıyla hazırlanır.' },
            { name: 'Künefe', price: '400.00', description: 'Antakya kökenli, altın kızarmış kadayıf ve erimiş peynirle hazırlanır.' },
            { name: 'Hoşmerim', price: '320.00', description: 'Konya\'ya özgü geleneksel tatlı. Kaymak ve unun kavrulmasıyla hazırlanır.' },
            { name: 'Karışık Tatlı Tabağı', price: '540.00', description: 'Türk tatlı çeşitlerinin özel karışımı; dengeli ve uyumlu tatlar.' },
            { name: 'İncir Tatlısı', price: '430.00', description: 'Kurutulmuş incir, cevizle doldurulup şerbetle tatlandırılarak kaymakla sunulur.' },
            { name: 'Kabak Tatlısı', price: '330.00', description: 'Fırında kızartılan kabak, tahin ve taze cevizlerle zenginleştirilir.' },
            { name: 'Sütlü Burma Kadayıf', price: '360.00', description: 'Geleneksel Burma kadayıf sütlü sunumu.' },
            { name: 'Sakızlı Dondurma', price: '200.00', description: 'Osmanlı\'dan beri yazların vazgeçilmezi, yoğun kıvamlı sakızlı dondurma.' },
        ]
    },
    {
        id: 'icecekler',
        title: 'İÇECEKLER',
        icon: '🥤',
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=1200',
        items: [
            { name: 'Meşrubatlar', price: '120.00', description: 'Coca-Cola, Fanta, Sprite ve diğer meşrubat çeşitleri.' },
            { name: 'Soda', price: '100.00', description: 'Taze ve serinletici soda.' },
            { name: 'Ayran', price: '80.00', description: 'Geleneksel ev yapımı ayran.' },
            { name: 'Şalgam', price: '90.00', description: 'Acılı veya acısız şalgam suyu.' },
            { name: 'Türk Kahvesi', price: '120.00', description: 'Geleneksel usul hazırlanmış Türk kahvesi.' },
            { name: 'Çay', price: '50.00', description: 'Demlik çay.' },
        ]
    },
];

const AccordionItem = ({ category, isOpen, onToggle }) => {
    return (
        <div className="border-b border-white/10 overflow-hidden">
            <motion.button
                onClick={onToggle}
                className="relative w-full flex items-center justify-between p-4 sm:p-5 md:p-6 lg:p-8 text-left transition-colors group"
                whileTap={{ scale: 0.99 }}
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/70 group-hover:from-black/80 group-hover:via-black/70 group-hover:to-black/60 transition-colors" />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-3 sm:gap-4 lg:gap-6">
                    <span className="text-2xl sm:text-3xl lg:text-4xl drop-shadow-lg">{category.icon}</span>
                    <span className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-wide drop-shadow-lg">{category.title}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 text-[#d4af37] drop-shadow-lg flex-shrink-0"
                >
                    <svg width="24" height="24" className="sm:w-6 sm:h-6 lg:w-7 lg:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden bg-zinc-900/50"
                    >
                        <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                            {category.items.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 p-3 sm:p-4 lg:p-5 bg-zinc-800/50 rounded-xl sm:rounded-2xl hover:bg-zinc-700/50 transition-colors group"
                                >
                                    <div className="flex-1 sm:pr-4">
                                        <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right flex-shrink-0">
                                        <span className="text-lg sm:text-xl lg:text-2xl font-black text-[#d4af37]">
                                            {item.price}
                                        </span>
                                        <span className="text-xs sm:text-sm text-[#d4af37]/70 ml-1">₺</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function MenuPage() {
    const [openCategories, setOpenCategories] = useState([]);

    const toggleCategory = (id) => {
        setOpenCategories(prev =>
            prev.includes(id)
                ? prev.filter(catId => catId !== id)
                : [...prev, id]
        );
    };

    return (
        <section id="menu" className="min-h-screen bg-black py-12 sm:py-16 lg:py-24">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
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

                {/* Accordion Menu */}
                <motion.div
                    className="bg-zinc-900/40 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {menuData.map((category) => (
                        <AccordionItem
                            key={category.id}
                            category={category}
                            isOpen={openCategories.includes(category.id)}
                            onToggle={() => toggleCategory(category.id)}
                        />
                    ))}
                </motion.div>

                {/* Footer Note */}
                <motion.p
                    className="text-center text-zinc-500 text-xs sm:text-sm mt-6 sm:mt-8 px-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    * Fiyatlar KDV dahildir. Menü içerikleri ve fiyatlar değişiklik gösterebilir.
                </motion.p>
            </div>
        </section>
    );
}
