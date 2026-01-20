'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ScrollDownButton from './ScrollDownButton';

// Fallback data
const fallbackPressItems = [
    {
        title: "Konya'nın En İyi Kebap Deneyimi",
        source: "Gurme Rehberi",
        date: "2023-11-15",
        summary: "Şehrin kalbinde, geleneksel lezzetleri modern sunumla buluşturan eşsiz bir mekan.",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"
    },
    {
        title: "Anadolu Mutfağının Yıldızları",
        source: "Lezzet Dergisi",
        date: "2023-08-20",
        summary: "Konya Kebap Evi, otantik tarifleri ve misafirperverliği ile parlıyor.",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800"
    },
    {
        title: "Etliekmek Hakkında Bilmeniz Gerekenler",
        source: "Gastronomi Dünyası",
        date: "2023-05-10",
        summary: "Ustalıkla açılan hamur ve özel harcın muhteşem uyumu.",
        url: "#",
        image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800"
    }
];

export default function PressSection() {
    const [pressItems, setPressItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPressItems = async () => {
            const { data, error } = await supabase
                .from('press_items')
                .select('*')
                .eq('is_active', true)
                .order('published_at', { ascending: false });

            if (!error && data && data.length > 0) {
                setPressItems(data);
            } else {
                setPressItems(fallbackPressItems);
            }
            setLoading(false);
        };

        fetchPressItems();
    }, []);

    return (
        <section id="press" className="relative bg-[#0a0a0a] overflow-hidden w-full">
            <div className="min-h-screen flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
                <motion.div
                    className="relative max-w-[1200px] w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 sm:p-8 md:p-10 lg:p-16 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] text-center shadow-3xl"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Header */}
                    <div className="mb-8 sm:mb-12 lg:mb-16">
                        <motion.div
                            className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6"
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                            <span className="text-[#d4af37] text-xs sm:text-sm font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                                Medyada Biz
                            </span>
                            <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                        </motion.div>

                        <motion.h2
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter mb-4 sm:mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
                                Basında Biz
                            </span>
                        </motion.h2>
                    </div>

                    {/* Press Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-96 bg-zinc-800/30 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {pressItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="group relative bg-black/50 border border-white/5 hover:border-[#d4af37]/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10 }}
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                                        <img
                                            src={item.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800'}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 z-20 bg-[#d4af37] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {item.source}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow text-left">
                                        <div className="flex items-center gap-2 text-zinc-500 text-xs mb-3">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(item.date || item.published_at).toLocaleDateString('tr-TR')}</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#d4af37] transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>

                                        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {item.summary || item.description}
                                        </p>

                                        <div className="mt-auto">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-[#d4af37] text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all"
                                            >
                                                <span>Haberi Oku</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 z-20">
                <ScrollDownButton targetId="sosyal-sorumluluk" light={true} />
            </div>
        </section>
    );
}
