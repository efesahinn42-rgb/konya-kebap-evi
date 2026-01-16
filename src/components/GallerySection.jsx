'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlipReveal, FlipRevealItem } from '@/components/ui/flip-reveal';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const galleryItems = [
    {
        key: 'kebap',
        src: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=400',
        alt: 'Adana Kebap'
    },
    {
        key: 'pide',
        src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400',
        alt: 'Lahmacun'
    },
    {
        key: 'tatli',
        src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=400',
        alt: 'Baklava'
    },
    {
        key: 'kebap',
        src: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400',
        alt: 'Şiş Kebap'
    },
    {
        key: 'pide',
        src: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=400',
        alt: 'Pide'
    },
    {
        key: 'tatli',
        src: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?q=80&w=400',
        alt: 'Künefe'
    },
    {
        key: 'kebap',
        src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400',
        alt: 'Etliekmek'
    },
    {
        key: 'pide',
        src: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400',
        alt: 'Kaşarlı Pide'
    },
    {
        key: 'tatli',
        src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400',
        alt: 'Sütlaç'
    },
];

export default function GallerySection() {
    const [filterKey, setFilterKey] = useState('all');

    return (
        <section id="gallery" className="relative bg-[#0a0a0a] overflow-hidden w-full">
            <div className="min-h-screen flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
                <motion.div
                    className="relative max-w-[1200px] w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 sm:p-8 md:p-10 lg:p-16 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] text-center shadow-3xl"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Header */}
                    <div className="mb-8 sm:mb-12">
                        <motion.div
                            className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6"
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                            <span className="text-[#d4af37] text-xs sm:text-sm font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                                Fotoğraflar
                            </span>
                            <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                        </motion.div>

                        <motion.h2
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
                                Galeri
                            </span>
                        </motion.h2>

                        {/* Filter Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <ToggleGroup
                                type="single"
                                className="bg-zinc-800/50 rounded-full border border-white/10 p-1.5 inline-flex"
                                value={filterKey}
                                onValueChange={(value) => value && setFilterKey(value)}
                            >
                                <ToggleGroupItem
                                    value="all"
                                    className="px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider text-zinc-400 data-[state=on]:bg-[#d4af37] data-[state=on]:text-black transition-all"
                                >
                                    Tümü
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="kebap"
                                    className="px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider text-zinc-400 data-[state=on]:bg-[#d4af37] data-[state=on]:text-black transition-all"
                                >
                                    Kebaplar
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="pide"
                                    className="px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider text-zinc-400 data-[state=on]:bg-[#d4af37] data-[state=on]:text-black transition-all"
                                >
                                    Pideler
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="tatli"
                                    className="px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wider text-zinc-400 data-[state=on]:bg-[#d4af37] data-[state=on]:text-black transition-all"
                                >
                                    Tatlılar
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </motion.div>
                    </div>

                    {/* Gallery Grid with FlipReveal */}
                    <FlipReveal
                        className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
                        keys={[filterKey]}
                        showClass="flex"
                        hideClass="hidden"
                    >
                        {galleryItems.map((item, index) => (
                            <FlipRevealItem
                                key={index}
                                flipKey={item.key}
                                className="group"
                            >
                                <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl border border-white/5 hover:border-[#d4af37]/30 transition-all duration-300">
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-white text-sm sm:text-base font-bold">{item.alt}</p>
                                    </div>
                                </div>
                            </FlipRevealItem>
                        ))}
                    </FlipReveal>
                </motion.div>
            </div>
        </section>
    );
}
