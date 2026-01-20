'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ScrollDownButton from './ScrollDownButton';

// Fallback data in case database is empty
const fallbackItems = [
    { category: 'misafir', src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800', alt: 'Misafirlerimiz' },
    { category: 'imza', src: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800', alt: 'İmza Lezzetlerimiz' },
];

export default function GallerySection() {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('misafir');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentCategoryImages, setCurrentCategoryImages] = useState([]);

    // Fetch gallery items from Supabase
    useEffect(() => {
        const fetchGalleryItems = async () => {
            const { data, error } = await supabase
                .from('gallery_items')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (!error && data && data.length > 0) {
                // Transform data to match the component's expected format
                const items = data.map(item => ({
                    category: item.category,
                    src: item.image_url,
                    alt: item.alt_text || (item.category === 'misafir' ? 'Misafirlerimiz' : 'İmza Lezzeti')
                }));
                setGalleryItems(items);
            } else {
                setGalleryItems(fallbackItems);
            }
            setLoading(false);
        };

        fetchGalleryItems();
    }, []);

    // Filter images by category
    const filteredItems = galleryItems.filter(item => item.category === activeCategory);

    // Open lightbox
    const openLightbox = (index, category) => {
        const categoryImages = galleryItems.filter(item => item.category === category);
        setCurrentCategoryImages(categoryImages);
        const actualIndex = categoryImages.findIndex(img => img.src === filteredItems[index].src);
        setCurrentImageIndex(actualIndex);
        setLightboxOpen(true);
    };

    // Navigate within category
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % currentCategoryImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + currentCategoryImages.length) % currentCategoryImages.length);
    };

    // Close on escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setLightboxOpen(false);
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        if (lightboxOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [lightboxOpen, currentCategoryImages.length]);

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
                                Misafirlerimiz
                            </span>
                        </motion.h2>

                        {/* Filter Buttons */}
                        <motion.div
                            className="flex flex-wrap justify-center gap-4 sm:gap-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            {[
                                { key: 'misafir', label: 'Misafirlerimiz' },
                                { key: 'imza', label: 'İmza Lezzetlerimiz' },
                            ].map((cat) => (
                                <motion.button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`group relative px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-sm sm:text-lg font-bold tracking-wide transition-all duration-300 overflow-hidden ${activeCategory === cat.key
                                        ? 'bg-gradient-to-r from-[#d4af37] via-[#f0d675] to-[#d4af37] text-black shadow-[0_0_30px_rgba(212,175,55,0.4)]'
                                        : 'bg-zinc-800/80 text-white hover:bg-zinc-700/90 border border-[#d4af37]/30 hover:border-[#d4af37]/60'
                                        }`}
                                >
                                    <span className="relative z-10">
                                        {cat.label}
                                    </span>
                                    {activeCategory === cat.key && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Gallery Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-square bg-zinc-800 rounded-xl sm:rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-zinc-400">Bu kategoride henüz fotoğraf bulunmuyor.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map((item, index) => (
                                    <motion.div
                                        key={item.src}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        className="group cursor-pointer"
                                        onClick={() => openLightbox(index, activeCategory)}
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
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && currentCategoryImages.length > 0 && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setLightboxOpen(false)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setLightboxOpen(false)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-zinc-900/80 hover:bg-[#d4af37] text-white hover:text-black rounded-full transition-all"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

                            {/* Previous Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 sm:left-8 z-10 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center bg-zinc-900/80 hover:bg-[#d4af37] text-white hover:text-black rounded-full transition-all"
                            >
                                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 sm:right-8 z-10 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center bg-zinc-900/80 hover:bg-[#d4af37] text-white hover:text-black rounded-full transition-all"
                            >
                                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                            </button>

                            {/* Image */}
                            <motion.img
                                key={currentCategoryImages[currentImageIndex]?.src}
                                src={currentCategoryImages[currentImageIndex]?.src?.replace('w=800', 'w=1200')}
                                alt={currentCategoryImages[currentImageIndex]?.alt}
                                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                onClick={(e) => e.stopPropagation()}
                            />

                            {/* Caption */}
                            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-center">
                                <p className="text-white text-lg sm:text-xl font-bold mb-2">
                                    {currentCategoryImages[currentImageIndex]?.alt}
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    {currentImageIndex + 1} / {currentCategoryImages.length}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            <div className="absolute bottom-4 left-0 right-0 z-20">
                <ScrollDownButton targetId="awards" light={true} />
            </div>
        </section>
    );
}
