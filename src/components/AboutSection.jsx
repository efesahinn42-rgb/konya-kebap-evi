'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Star, TrendingUp, Users, Award, Clock, Heart, Utensils, MapPin } from 'lucide-react';
import ScrollDownButton from './ScrollDownButton';

// Kayar istatistikler
const statsData = [
    { value: '4.8', label: 'Google Puanı', icon: Star },
    { value: '5.0', label: 'Tripadvisor', icon: Star },
    { value: '132K', label: 'Takipçi', icon: TrendingUp },
    { value: '98%', label: 'Memnuniyet', icon: Heart },
    { value: '20+', label: 'Yıl Tecrübe', icon: Clock },
    { value: '50+', label: 'Tarif', icon: Utensils },
    { value: '1M+', label: 'Mutlu Misafir', icon: Users },
    { value: '3', label: 'Şube', icon: MapPin },
    { value: '25+', label: 'Ödül', icon: Award },
];

// Fallback video URLs
const fallbackBackgroundVideo = "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&controls=0&loop=1&playlist=ScMzIvxBSi4&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1";
const fallbackModalVideo = "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&rel=0";

// Marquee Stats Component
function MarqueeStats() {
    return (
        <div id="stats" className="relative overflow-hidden bg-gradient-to-r from-black via-zinc-900 to-black py-6 border-b border-[#d4af37]/20">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />

            <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 30,
                        ease: 'linear',
                    },
                }}
            >
                {/* Duplicate stats for seamless loop */}
                {[...statsData, ...statsData].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="flex items-center gap-3 px-4">
                            <Icon className="w-5 h-5 text-[#d4af37]" fill={stat.icon === Star ? '#d4af37' : 'none'} />
                            <span className="text-2xl sm:text-3xl font-black text-white">{stat.value}</span>
                            <span className="text-sm text-zinc-400 font-medium">{stat.label}</span>
                            <span className="text-[#d4af37]/30 ml-8">•</span>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}

export default function AboutSection() {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('');
    const [modalVideoUrl, setModalVideoUrl] = useState('');
    const [isYouTubeBackground, setIsYouTubeBackground] = useState(true);
    const [isYouTubeModal, setIsYouTubeModal] = useState(true);

    // Fetch videos from Supabase
    useEffect(() => {
        const fetchVideos = async () => {
            const { data, error } = await supabase
                .from('ocakbasi_videos')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
                // Find background video
                const bgVideo = data.find(v => v.is_background);
                if (bgVideo) {
                    const isYT = bgVideo.video_url.includes('youtube');
                    setIsYouTubeBackground(isYT);
                    if (isYT) {
                        // Convert to embed URL with autoplay and mute
                        const videoId = extractYouTubeId(bgVideo.video_url);
                        setBackgroundVideoUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0`);
                    } else {
                        setBackgroundVideoUrl(bgVideo.video_url);
                    }
                } else {
                    setBackgroundVideoUrl(fallbackBackgroundVideo);
                }

                // Find modal video
                const mdlVideo = data.find(v => v.is_modal);
                if (mdlVideo) {
                    const isYT = mdlVideo.video_url.includes('youtube');
                    setIsYouTubeModal(isYT);
                    if (isYT) {
                        const videoId = extractYouTubeId(mdlVideo.video_url);
                        setModalVideoUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
                    } else {
                        setModalVideoUrl(mdlVideo.video_url);
                    }
                } else if (data.length > 0) {
                    // Use first video as modal if no modal-specific video
                    const firstVideo = data[0];
                    const isYT = firstVideo.video_url.includes('youtube');
                    setIsYouTubeModal(isYT);
                    if (isYT) {
                        const videoId = extractYouTubeId(firstVideo.video_url);
                        setModalVideoUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
                    } else {
                        setModalVideoUrl(firstVideo.video_url);
                    }
                } else {
                    setModalVideoUrl(fallbackModalVideo);
                }
            } else {
                // Use fallback
                setBackgroundVideoUrl(fallbackBackgroundVideo);
                setModalVideoUrl(fallbackModalVideo);
            }
        };

        fetchVideos();
    }, []);

    // Extract YouTube video ID
    const extractYouTubeId = (url) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : '';
    };

    return (
        <section id="about" className="relative bg-[#0a0a0a] overflow-hidden w-full">
            {/* Marquee Stats Banner */}
            <MarqueeStats />

            {/* Page 1: Introduction Text */}
            <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 border-b border-white/5">
                <motion.div
                    className="relative max-w-[900px] w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 sm:p-8 md:p-10 lg:p-14 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] text-center shadow-3xl group overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Corner Plates Decorations */}
                    <motion.img
                        src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=200"
                        alt="Etliekmek"
                        className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 lg:-top-6 lg:-left-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 object-cover rounded-full drop-shadow-2xl z-20 cursor-pointer hidden sm:block border-2 border-[#d4af37]/30"
                        initial={{ opacity: 0, x: -60, y: -60, rotate: -30 }}
                        whileInView={{ opacity: 0.9, x: 0, y: 0, rotate: 0 }}
                        whileHover={{ scale: 1.15, rotate: -8, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.img
                        src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=200"
                        alt="Adana Kebap"
                        className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 lg:-top-6 lg:-right-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 object-cover rounded-full drop-shadow-2xl z-20 cursor-pointer hidden sm:block border-2 border-[#d4af37]/30"
                        initial={{ opacity: 0, x: 60, y: -60, rotate: 30 }}
                        whileInView={{ opacity: 0.9, x: 0, y: 0, rotate: 0 }}
                        whileHover={{ scale: 1.15, rotate: 8, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    />
                    <motion.img
                        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=200"
                        alt="Meze"
                        className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 lg:-bottom-6 lg:-left-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 object-cover rounded-full drop-shadow-2xl z-20 cursor-pointer hidden sm:block border-2 border-[#d4af37]/30"
                        initial={{ opacity: 0, x: -60, y: 60, rotate: -30 }}
                        whileInView={{ opacity: 0.9, x: 0, y: 0, rotate: 0 }}
                        whileHover={{ scale: 1.15, rotate: -8, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    />
                    <motion.img
                        src="https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=200"
                        alt="Baklava"
                        className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 lg:-bottom-6 lg:-right-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 object-cover rounded-full drop-shadow-2xl z-20 cursor-pointer hidden sm:block border-2 border-[#d4af37]/30"
                        initial={{ opacity: 0, x: 60, y: 60, rotate: 30 }}
                        whileInView={{ opacity: 0.9, x: 0, y: 0, rotate: 0 }}
                        whileHover={{ scale: 1.15, rotate: 8, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    />

                    <div className="mb-6 sm:mb-8 lg:mb-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8 flex justify-center"
                        >
                            <Image
                                src="/logo.png"
                                alt="Konya Kebap Evi Logo"
                                width={300}
                                height={300}
                                className="w-32 sm:w-48 lg:w-64 h-auto object-contain drop-shadow-2xl brightness-110"
                            />
                        </motion.div>
                        <motion.h3
                            className="text-[#d2a574] text-xs sm:text-sm lg:text-base font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-4 sm:mb-6"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Lezzet Serüveni
                        </motion.h3>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter px-2">
                            Konya'nın Kalbinden Gelen <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
                                Lezzet Mirası
                            </span>
                        </h2>
                    </div>

                    <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-zinc-400 text-sm sm:text-base lg:text-xl leading-relaxed font-light max-w-[800px] mx-auto px-2">
                        <p>
                            Konya Kebap Evi olarak, asırlık tariflerimizi en taze malzemelerle birleştiriyor,
                            misafirlerimize sadece bir yemek değil, bir kültür mirası sunuyoruz.
                            Anadolu'nun misafirperverliğini ve gerçek Konya lezzetini her lokmada hissetmeniz için çalışıyoruz.
                        </p>
                        <p>
                            Etliekmekten bıçak arasına, fırın kebabından bamya çorbasına kadar her tarifimiz,
                            ustalarımızın ellerinde birer sanat eserine dönüşüyor. Geleneksel yöntemlere bağlı kalarak,
                            modern sunumlarla lezzet yolculuğunuzda size rehberlik etmekten onur duyuyoruz.
                        </p>
                    </div>

                    <div className="mt-10 sm:mt-12 lg:mt-16 flex justify-center gap-6 sm:gap-8 lg:gap-24">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl sm:text-4xl lg:text-6xl font-black text-white">20+</span>
                            <span className="text-[10px] sm:text-xs lg:text-sm text-zinc-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1 sm:mt-2 font-bold text-center">Yıllık Tecrübe</span>
                        </div>
                        <div className="w-[1px] h-12 sm:h-16 bg-zinc-800"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl sm:text-4xl lg:text-6xl font-black text-white">50+</span>
                            <span className="text-[10px] sm:text-xs lg:text-sm text-zinc-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1 sm:mt-2 font-bold text-center">Geleneksel Tarif</span>
                        </div>
                    </div>
                    
                    {/* First Scroll Down Button - to Video Section */}
                    <div className="mt-8 sm:mt-10 lg:mt-12">
                        <ScrollDownButton targetId="ocakbasi-hikayeleri" light={true} />
                    </div>
                </motion.div>
            </div>

            {/* Page 2: Cinematic Video Teaser */}
            <div id="ocakbasi-hikayeleri" className="min-h-screen flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-20">
                <motion.div
                    className="relative w-full max-w-[1600px] h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[85vh] rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 group bg-black"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Background Video */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none scale-125">
                        {backgroundVideoUrl && (
                            isYouTubeBackground ? (
                                <iframe
                                    src={backgroundVideoUrl}
                                    className="w-full h-full object-cover opacity-60"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    title="Background Video"
                                />
                            ) : (
                                <video
                                    src={backgroundVideoUrl}
                                    className="w-full h-full object-cover opacity-60"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            )
                        )}
                    </div>

                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-80"></div>

                    <div className="absolute bottom-6 left-4 sm:bottom-8 sm:left-6 md:bottom-12 md:left-10 lg:bottom-24 lg:left-24 z-10 max-w-[90%] sm:max-w-[600px]">
                        <motion.div
                            className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6"
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                            <span className="text-[#d4af37] text-xs sm:text-sm font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase text-shadow">Mutfak Sanatı</span>
                        </motion.div>

                        <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-8xl font-black text-white mb-4 sm:mb-6 lg:mb-8 tracking-tighter leading-none drop-shadow-2xl">
                            Ocakbaşı <br /> Hikayeleri
                        </h4>

                        <p className="text-zinc-300 text-sm sm:text-base lg:text-xl font-light mb-6 sm:mb-8 lg:mb-10 leading-relaxed drop-shadow-lg">
                            Ateşin, dumanın ve yüzyıllık ustalığın hikayesi. Her dokunuşta Konya'nın ruhunu sofranıza taşıyoruz.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-6">
                            <motion.button
                                onClick={() => setIsVideoOpen(true)}
                                className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-[#d4af37] text-black hover:bg-white font-black rounded-full flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-2xl tracking-widest text-xs sm:text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                <span>TANITIMI İZLE</span>
                            </motion.button>

                            <motion.button
                                className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-zinc-800/80 backdrop-blur-md text-white hover:bg-zinc-700 font-bold rounded-full flex items-center justify-center gap-2 sm:gap-3 transition-all border border-white/10 tracking-widest text-xs sm:text-sm"
                                whileHover={{ scale: 1.05 }}
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                                <span>LİSTEME EKLE</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Cinematic Badges */}
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-12 lg:right-12 flex flex-col items-end gap-2 sm:gap-3">
                        <div className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 bg-[#d4af37] text-black text-[8px] sm:text-[9px] lg:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] rounded-sm uppercase shadow-xl">
                            Orijinal Yapım
                        </div>
                        <div className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-sm text-[8px] sm:text-[9px] lg:text-[10px] font-black text-white/80 tracking-[0.2em] sm:tracking-[0.3em] uppercase">
                            4K Ultra HD
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Video Modal Overlay */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Blur Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                            onClick={() => setIsVideoOpen(false)}
                        />

                        {/* Close Button */}
                        <motion.button
                            onClick={() => setIsVideoOpen(false)}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-10 lg:right-10 z-[110] w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-white/10 hover:bg-[#d4af37] text-white hover:text-black rounded-full transition-all group backdrop-blur-md border border-white/10"
                            aria-label="Kapat"
                        >
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>

                        {/* Video Container */}
                        <motion.div
                            className="relative w-full max-w-[1200px] aspect-video bg-black rounded-[1rem] sm:rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.2)] border border-white/10 z-[105]"
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            {modalVideoUrl && (
                                isYouTubeModal ? (
                                    <iframe
                                        src={modalVideoUrl}
                                        className="w-full h-full border-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        title="Konya Kebap Evi Tanıtım"
                                    />
                                ) : (
                                    <video
                                        src={modalVideoUrl}
                                        className="w-full h-full object-contain"
                                        controls
                                        autoPlay
                                    />
                                )
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-4 left-0 right-0 z-20">
                <ScrollDownButton targetId="reservation" light={true} />
            </div>
        </section>
    );
}
