'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import MenuSidebar from './MenuSidebar';

export default function HeroSlider() {
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
                        <Image
                            src="/images/slide-one.png"
                            alt="Konya Kebap Evi"
                            fill
                            priority
                            className="object-contain object-center"
                            sizes="(max-width: 1024px) 100vw, 80vw"
                        />
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
