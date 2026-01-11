'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuSidebar from './MenuSidebar';

const slides = [
    {
        image: '/images/slide-etliekmek.png',
        title: 'Etliekmek',
        subtitle: 'efsanesi',
    },
    {
        image: '/images/slide-adana.png',
        title: 'Gerçek Kebap',
        subtitle: 'kömür ateşinde',
    },
    {
        image: '/images/slide-mixed.png',
        title: 'Zengin',
        subtitle: 'sofralar',
    },
    {
        image: '/images/slide-meze.png',
        title: 'Taze',
        subtitle: 'başlangıçlar',
    },
    {
        image: '/images/slide-baklava.png',
        title: 'Tatlı',
        subtitle: 'son',
    },
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    return (
        <section id="hero" className="w-full min-h-screen bg-black flex items-center justify-center py-6 lg:py-12">
            <div className="max-w-[1600px] w-full mx-auto px-4 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-[75%_25%] gap-8 lg:gap-12 items-center">

                    {/* Slider Card */}
                    <div className="relative w-full h-[65vh] lg:h-[80vh] rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(212,175,55,0.2)] border border-[#d4af37]/20 bg-zinc-900">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                className="absolute inset-0 bg-cover bg-center z-0"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url(${slides[currentSlide].image})`,
                                }}
                            />
                        </AnimatePresence>

                        <div className="relative h-full z-10 p-10 lg:p-20 flex flex-col justify-center text-white">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <h1 className="text-5xl lg:text-8xl font-black leading-none mb-3 tracking-tighter drop-shadow-2xl">
                                        {slides[currentSlide].title}
                                    </h1>
                                    <h2 className="text-4xl lg:text-6xl font-light italic leading-none text-[#d4af37] drop-shadow-xl font-['Brush_Script_MT']">
                                        {slides[currentSlide].subtitle}
                                    </h2>
                                    <motion.button
                                        className="mt-10 px-10 py-4 bg-[#d4af37] text-black font-bold text-sm tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Hemen Keşfet
                                    </motion.button>
                                </motion.div>
                            </AnimatePresence>

                            {/* Slider Navigation Internal */}
                            <div className="absolute bottom-12 right-12 translate-x-0 flex gap-5 z-20 hidden lg:flex">
                                <button
                                    onClick={prevSlide}
                                    className="w-16 h-16 flex items-center justify-center bg-black/40 backdrop-blur-2xl border border-[#d4af37]/30 text-[#d4af37] rounded-full hover:bg-[#d4af37] hover:text-black transition-all duration-500 group"
                                >
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-16 h-16 flex items-center justify-center bg-black/40 backdrop-blur-2xl border border-[#d4af37]/30 text-[#d4af37] rounded-full hover:bg-[#d4af37] hover:text-black transition-all duration-500 group"
                                >
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:scale-110 transition-transform">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Menu Column */}
                    <div className="h-full flex items-center justify-center lg:justify-start">
                        <MenuSidebar />
                    </div>
                </div>
            </div>
        </section>
    );
}
