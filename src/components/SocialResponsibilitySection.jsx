'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Utensils } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Fallback data
const fallbackInitiatives = [
    {
        title: 'Gıda Yardımı',
        description: 'Her gün ihtiyaç sahiplerine sıcak yemek dağıtımı yapıyoruz.',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800',
    },
    {
        title: 'Eğitim Desteği',
        description: 'Çevre okullarındaki öğrencilere burs ve materyal desteği sağlıyoruz.',
        image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800',
    },
    {
        title: 'Çevre Duyarlılığı',
        description: 'Sıfır atık politikası ve geri dönüşüm programlarımızla doğayı koruyoruz.',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800',
    },
    {
        title: 'Toplum Etkinlikleri',
        description: 'Mahalle festivalleri ve kültürel etkinlikler düzenliyoruz.',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800',
    },
];

const fallbackStats = [
    { number: '10K+', label: 'Dağıtılan Porsiyon' },
    { number: '50+', label: 'Desteklenen Öğrenci' },
    { number: '100%', label: 'Geri Dönüşüm Oranı' },
    { number: '25+', label: 'Toplum Etkinliği' },
];

export default function SocialResponsibilitySection() {
    const [initiatives, setInitiatives] = useState([]);
    const [impactStats, setImpactStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch social projects
            const { data: projectsData, error: projectsError } = await supabase
                .from('social_projects')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            // Fetch impact stats
            const { data: statsData, error: statsError } = await supabase
                .from('impact_stats')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (!projectsError && projectsData && projectsData.length > 0) {
                const projects = projectsData.map(p => ({
                    title: p.title,
                    description: p.description,
                    image: p.image_url
                }));
                setInitiatives(projects);
            } else {
                setInitiatives(fallbackInitiatives);
            }

            if (!statsError && statsData && statsData.length > 0) {
                setImpactStats(statsData);
            } else {
                setImpactStats(fallbackStats);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <section id="sosyal-sorumluluk" className="relative bg-[#0a0a0a] overflow-hidden py-16 sm:py-20 lg:py-28">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 sm:mb-16 lg:mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4af37]" />
                        <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">
                        Sosyal{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f0d675] to-[#d4af37]">
                            Sorumluluk
                        </span>
                    </h2>

                    <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Lezzetin ötesinde, topluma ve çevreye karşı sorumluluklarımızın bilincindeyiz.
                    </p>
                </motion.div>

                {/* Image Gallery Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[4/3] bg-zinc-800 rounded-2xl sm:rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
                        {initiatives.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/3] cursor-pointer"
                            >
                                {/* Image */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                                {/* Content */}
                                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                                    <motion.div
                                        initial={{ y: 20 }}
                                        whileInView={{ y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                            {item.description}
                                        </p>
                                    </motion.div>

                                    {/* Gold accent line */}
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] via-[#f0d675] to-[#d4af37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Impact Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="bg-gradient-to-r from-zinc-900/80 via-zinc-800/60 to-zinc-900/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-12 border border-[#d4af37]/20"
                >
                    <div className="text-center mb-8 sm:mb-10">
                        <Utensils className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37] mx-auto mb-4" />
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                            Topluma Katkımız
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {impactStats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f0d675] mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-zinc-400 text-sm sm:text-base font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
