'use client';
import { motion } from 'framer-motion';
import { Quote, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const pressItems = [
    {
        outlet: "TRT Haber",
        title: "Konya'nın Lezzet Elçisi",
        date: "Ocak 2024",
        quote: "Geleneksel Konya mutfağını yeni nesillere taşıyan öncü restoran.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600",
        color: "#dc2626"
    },
    {
        outlet: "Hürriyet Gastro",
        title: "Yılın En İyi 10 Kebapçısı",
        date: "Aralık 2023",
        quote: "Etliekmek ve bıçak arası kebabıyla fark yaratan lezzet durağı.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600",
        color: "#2563eb"
    },
    {
        outlet: "CNN Türk",
        title: "Anadolu'nun Gastronomi Mirası",
        date: "Kasım 2023",
        quote: "Asırlık tariflerle modern mutfağın buluşma noktası.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600",
        color: "#dc2626"
    },
    {
        outlet: "Radyo Konya",
        title: "Lezzet Söyleşisi",
        date: "Ekim 2023",
        quote: "Ustalarımızın ağzından geleneksel tariflerin hikayesi.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600",
        color: "#16a34a"
    }
];

export default function PressSection() {
    return (
        <section id="press" className="relative bg-[#0a0a0a] overflow-hidden w-full">
            <div className="min-h-screen flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
                <div className="relative max-w-[1400px] w-full">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-12 sm:mb-16 lg:mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                            <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                            <span className="text-[#d4af37] text-xs sm:text-sm font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                                Medyada Biz
                            </span>
                            <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter mb-4 sm:mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
                                Basında Biz
                            </span>
                        </h2>

                        <p className="text-zinc-400 max-w-lg mx-auto text-sm sm:text-base">
                            Ulusal ve yerel medyada yer alan haberlerimiz.
                        </p>
                    </motion.div>

                    {/* Featured Press Item - Large */}
                    <motion.div
                        className="relative mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.01 }}
                    >
                        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
                            <img
                                src={pressItems[0].image}
                                alt={pressItems[0].title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="px-3 py-1.5 rounded-full text-white text-xs font-black tracking-wider"
                                        style={{ backgroundColor: pressItems[0].color }}
                                    >
                                        {pressItems[0].outlet}
                                    </div>
                                    <span className="text-zinc-400 text-sm">{pressItems[0].date}</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-4 max-w-2xl">
                                    {pressItems[0].title}
                                </h3>
                                <div className="flex items-start gap-3 max-w-xl">
                                    <Quote className="w-6 h-6 text-[#d4af37] flex-shrink-0 mt-1" />
                                    <p className="text-zinc-300 text-base sm:text-lg italic">
                                        {pressItems[0].quote}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Arrow */}
                            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-[#d4af37]">
                                <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-black" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Smaller Press Items - Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {pressItems.slice(1).map((item, index) => (
                            <motion.div
                                key={index}
                                className="relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="relative h-[200px] sm:h-[250px] lg:h-[300px]">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">
                                        <div
                                            className="inline-block px-2.5 py-1 rounded-full text-white text-[10px] sm:text-xs font-bold tracking-wider mb-3"
                                            style={{ backgroundColor: item.color }}
                                        >
                                            {item.outlet}
                                        </div>
                                        <h4 className="text-lg sm:text-xl font-black text-white mb-2 leading-tight">
                                            {item.title}
                                        </h4>
                                        <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 italic">
                                            "{item.quote}"
                                        </p>
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4af37]/50 rounded-xl sm:rounded-2xl transition-all duration-300" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Marquee / Ticker */}
                    <motion.div
                        className="mt-12 sm:mt-16 overflow-hidden"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-8 text-zinc-600 animate-marquee whitespace-nowrap">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-8">
                                    <span className="text-sm font-bold tracking-wider">MICHELIN GUIDE</span>
                                    <span className="text-[#d4af37]">★</span>
                                    <span className="text-sm font-bold tracking-wider">WORLD'S 50 BEST</span>
                                    <span className="text-[#d4af37]">★</span>
                                    <span className="text-sm font-bold tracking-wider">TÜRKIYE GASTRONOMİ DERNEĞİ</span>
                                    <span className="text-[#d4af37]">★</span>
                                    <span className="text-sm font-bold tracking-wider">ANADOLU MUTFAK AKADEMİSİ</span>
                                    <span className="text-[#d4af37]">★</span>
                                    <span className="text-sm font-bold tracking-wider">SLOW FOOD TÜRKİYE</span>
                                    <span className="text-[#d4af37]">★</span>
                                    <span className="text-sm font-bold tracking-wider">JAMES BEARD FOUNDATION</span>
                                    <span className="text-[#d4af37]">★</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
