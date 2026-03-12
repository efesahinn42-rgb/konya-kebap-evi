'use client';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Users } from 'lucide-react';

const stats = [
    {
        value: '4.8',
        label: 'Google Puanı',
        icon: Star,
        color: '#d4af37'
    },
    {
        value: '5.0',
        label: 'Tripadvisor Puanı',
        icon: Star,
        color: '#d4af37'
    },
    {
        value: '132k',
        label: 'Instagram Takipçisi',
        icon: TrendingUp,
        color: '#d4af37'
    },
    {
        value: '98%',
        label: 'Tekrarlanan Müşteri',
        icon: Users,
        color: '#d4af37'
    }
];

export default function StatsSection() {
    return (
        <section id="stats" className="relative bg-black py-12 sm:py-16 lg:py-20 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center group"
                            >
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <motion.span
                                        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {stat.value}
                                    </motion.span>
                                    <Icon
                                        className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110"
                                        style={{ color: stat.color }}
                                        fill={stat.icon === Star ? stat.color : 'none'}
                                    />
                                </div>
                                <p className="text-sm sm:text-base text-zinc-400 font-medium tracking-wide">
                                    {stat.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom border accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        </section>
    );
}
