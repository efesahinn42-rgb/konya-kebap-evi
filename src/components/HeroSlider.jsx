'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function HeroSlider() {
    const { data: slides = [], isLoading: loading } = useHeroSlides();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide every 6 seconds
    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const scrollToContent = () => {
        const statsSection = document.getElementById('stats');
        if (statsSection) {
            // Navbar yüksekliğini hesaba katarak scroll yap (yaklaşık 80px)
            const navbarHeight = 80;
            const elementPosition = statsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Default slide if no data
    const defaultSlide = {
        image_url: '/images/slide-one.png',
        alt_text: 'Konya Kebap Evi'
    };

    const currentSlide = slides.length > 0 ? slides[currentIndex] : defaultSlide;

    // Reset index when slides change
    useEffect(() => {
        if (slides.length > 0 && currentIndex >= slides.length) {
            setCurrentIndex(0);
        }
    }, [slides.length, currentIndex]);

    return (
        <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">

            {/* Fullscreen Background with Zoom Animation */}
            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="w-16 h-16 border-4 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            scale: [1, 1.03, 1]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            opacity: { duration: 1 },
                            scale: { duration: 10, ease: 'easeInOut', times: [0, 0.5, 1] }
                        }}
                        className="absolute inset-0"
                        style={{
                            transformOrigin: 'left center',
                            willChange: 'transform, opacity'
                        }}
                    >
                        <Image
                            src={currentSlide.image_url}
                            alt={currentSlide.alt_text || 'Konya Kebap Evi'}
                            fill
                            priority={currentIndex === 0}
                            className="object-cover object-center"
                            sizes="100vw"
                            quality={90}
                        />
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />



            {/* Navigation Arrows - Only show if more than 1 slide */}
            {slides.length > 1 && !loading && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-[#d4af37] w-8'
                                    : 'bg-white/40 w-2 hover:bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Scroll Down Indicator */}
            <motion.button
                onClick={scrollToContent}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/70 hover:text-[#d4af37] transition-colors"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <span className="text-xs tracking-[0.3em] uppercase">Keşfet</span>
                <ChevronDown className="w-6 h-6" />
            </motion.button>
        </section>
    );
}

