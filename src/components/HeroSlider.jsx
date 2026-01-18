'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MenuSidebar from './MenuSidebar';

export default function HeroSlider() {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch slides from Supabase
    useEffect(() => {
        const fetchSlides = async () => {
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (!error && data && data.length > 0) {
                setSlides(data);
            }
            setLoading(false);
        };

        fetchSlides();
    }, []);

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Default slide if no data
    const defaultSlide = {
        image_url: '/images/slide-one.png',
        alt_text: 'Konya Kebap Evi'
    };

    const currentSlide = slides.length > 0 ? slides[currentIndex] : defaultSlide;

    return (
        <section id="hero" className="w-full min-h-screen bg-black flex items-center justify-center py-4 sm:py-6 lg:py-8">
            <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[80%_20%] gap-4 sm:gap-6 lg:gap-8 items-center">

                    {/* Hero Image Card */}
                    <motion.div
                        className="relative w-full rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(212,175,55,0.2)] border border-[#d4af37]/20 bg-zinc-900"
                        style={{ aspectRatio: '16 / 10' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                                <div className="w-12 h-12 border-4 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    {currentSlide.image_url.startsWith('/') ? (
                                        <Image
                                            src={currentSlide.image_url}
                                            alt={currentSlide.alt_text || 'Konya Kebap Evi'}
                                            fill
                                            priority
                                            className="object-contain object-center"
                                            sizes="(max-width: 1024px) 100vw, 80vw"
                                        />
                                    ) : (
                                        <img
                                            src={currentSlide.image_url}
                                            alt={currentSlide.alt_text || 'Konya Kebap Evi'}
                                            className="w-full h-full object-contain object-center"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        )}

                        {/* Navigation Arrows - Only show if more than 1 slide */}
                        {slides.length > 1 && !loading && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#d4af37] hover:text-black transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#d4af37] hover:text-black transition-all"
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>

                                {/* Dots Indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${index === currentIndex
                                                    ? 'bg-[#d4af37] w-6 sm:w-8'
                                                    : 'bg-white/40 hover:bg-white/60'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Menu Column */}
                    <div className="h-full flex items-center justify-center lg:justify-start">
                        <MenuSidebar />
                    </div>
                </div>
            </div>
        </section>
    );
}
