'use client';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, Medal } from 'lucide-react';
import { useAwards } from '@/hooks/useAwards';
import ScrollDownButton from './ScrollDownButton';

// Icon mapping
const iconMap = {
    trophy: Trophy,
    award: Award,
    star: Star,
    medal: Medal
};

// Fallback data
const fallbackAwards = [
    {
        icon: 'trophy',
        title: "Yılın En İyi Kebapçısı",
        year: "2023",
        organization: "Türkiye Gastronomi Derneği",
        description: "Geleneksel lezzetleri modern sunumla birleştiren en başarılı restoran."
    },
    {
        icon: 'award',
        title: "Altın Kepçe Ödülü",
        year: "2022",
        organization: "Anadolu Mutfak Akademisi",
        description: "Otantik Konya mutfağının en iyi temsilcisi."
    },
    {
        icon: 'star',
        title: "Mükemmellik Yıldızı",
        year: "2023",
        organization: "Restoran Değerlendirme Platformu",
        description: "Müşteri memnuniyetinde %98 başarı oranı."
    },
    {
        icon: 'medal',
        title: "En İyi Etliekmek",
        year: "2021",
        organization: "Konya Gastronomi Festivali",
        description: "Jüri özel ödülü ile taçlandırılan eşsiz lezzet."
    }
];

export default function AwardsSection() {
    const { data: awards = fallbackAwards, isLoading: loading } = useAwards();

    const getIcon = (iconName) => {
        return iconMap[iconName] || Trophy;
    };

    return (
        <section id="awards" className="relative bg-[#0a0a0a] overflow-hidden w-full">
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
                                Başarılarımız
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
                                Ödüllerimiz
                            </span>
                        </motion.h2>

                        <motion.p
                            className="text-zinc-400 max-w-lg mx-auto text-sm sm:text-base"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Yılların deneyimi ve tutku dolu çalışmalarımızın takdir görmüş kanıtları.
                        </motion.p>
                    </div>

                    {/* Awards Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-48 bg-zinc-800/30 rounded-xl sm:rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {awards.map((award, index) => {
                                const IconComponent = getIcon(award.icon);
                                return (
                                    <motion.div
                                        key={index}
                                        className="group relative bg-zinc-800/30 backdrop-blur-sm border border-white/5 hover:border-[#d4af37]/30 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 text-left transition-all duration-300 overflow-hidden"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -5 }}
                                    >
                                        {/* Background Logo */}
                                        <div
                                            className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
                                            style={{
                                                backgroundImage: 'url(/logo.png)',
                                                backgroundSize: '60%',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                        />

                                        {/* Gold Glow on Hover */}
                                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#d4af37]/0 via-[#d4af37]/0 to-[#d4af37]/0 group-hover:from-[#d4af37]/5 group-hover:via-transparent group-hover:to-[#d4af37]/5 transition-all duration-500" />

                                        <div className="relative z-10">
                                            {/* Icon */}
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-[#d4af37]/20 transition-colors">
                                                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4af37]" />
                                            </div>

                                            {/* Year Badge */}
                                            <div className="inline-block px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full mb-3 sm:mb-4">
                                                <span className="text-[10px] sm:text-xs font-bold text-[#d4af37] tracking-wider">{award.year}</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white mb-2 tracking-tight">
                                                {award.title}
                                            </h3>

                                            {/* Organization */}
                                            <p className="text-xs sm:text-sm text-[#d4af37] font-semibold mb-3 uppercase tracking-wider">
                                                {award.organization}
                                            </p>

                                            {/* Description */}
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                {award.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom Stats */}
                    <motion.div
                        className="mt-10 sm:mt-12 lg:mt-16 flex justify-center gap-8 sm:gap-12 lg:gap-24"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#d4af37]">{awards.length > 0 ? `${awards.length}+` : '15+'}</span>
                            <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-[0.2em] mt-1 font-bold">Ödül</span>
                        </div>
                        <div className="w-[1px] h-12 sm:h-16 bg-zinc-800"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#d4af37]">5</span>
                            <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-[0.2em] mt-1 font-bold">Altın Madalya</span>
                        </div>
                        <div className="w-[1px] h-12 sm:h-16 bg-zinc-800"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#d4af37]">%98</span>
                            <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-[0.2em] mt-1 font-bold">Memnuniyet</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 z-20">
                <ScrollDownButton targetId="press" light={true} />
            </div>
        </section>
    );
}
