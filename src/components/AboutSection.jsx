'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutSection() {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    // High quality food/cooking background video (Pexels Direct MP4)
    const backgroundVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-chef-cutting-vegetables-in-a-kitchen-40546-large.mp4";
    // YouTube test video for modal
    const modalVideoUrl = "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&rel=0";

    return (
        <section className="relative bg-[#0a0a0a] overflow-hidden w-full">
            {/* Page 1: Introduction Text */}
            <div className="min-h-screen flex items-center justify-center py-20 px-6 lg:px-12 border-b border-white/5">
                <motion.div
                    className="relative max-w-[1000px] w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-10 lg:p-20 rounded-[3rem] text-center shadow-3xl group overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Corner Plates Decorations - Inside Card */}
                    <motion.img
                        src="/images/slide-etliekmek.png"
                        alt="Etliekmek"
                        className="absolute -top-6 -left-6 w-24 h-24 lg:w-32 lg:h-32 object-contain rounded-full drop-shadow-2xl z-20 cursor-pointer"
                        initial={{ opacity: 0, x: -60, y: -60, rotate: -30 }}
                        whileInView={{ opacity: 0.8, x: 0, y: 0, rotate: 0 }}
                        whileHover={{ scale: 1.15, rotate: -8, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.img
                        src="/images/slide-adana.png"
                        alt="Adana Kebap"
                        className="absolute -top-6 -right-6 w-24 h-24 lg:w-32 lg:h-32 object-contain rounded-full drop-shadow-2xl z-20 cursor-pointer"
                        initial={{ opacity: 0, x: 60, y: -60, rotate: 30 }}
                        whileInView={{ opacity: 0.8, x: 0, y: 0, rotate: 0 }}
                        whileHover={{ scale: 1.15, rotate: 8, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    />
                    <motion.img
                        src="/images/slide-meze.png"
                        alt="Meze"
                        className="absolute -bottom-6 -left-6 w-24 h-24 lg:w-32 lg:h-32 object-contain rounded-full drop-shadow-2xl z-20 cursor-pointer"
                        initial={{ opacity: 0, x: -60, y: 60, rotate: -30 }}
                        whileInView={{ opacity: 0.8, x: 0, y: 0, rotate: 0 }}
                        whileHover={{ scale: 1.15, rotate: -8, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    />
                    <motion.img
                        src="/images/slide-baklava.png"
                        alt="Baklava"
                        className="absolute -bottom-6 -right-6 w-24 h-24 lg:w-32 lg:h-32 object-contain rounded-full drop-shadow-2xl z-20 cursor-pointer"
                        initial={{ opacity: 0, x: 60, y: 60, rotate: 30 }}
                        whileInView={{ opacity: 0.8, x: 0, y: 0, rotate: 0 }}
                        whileHover={{ scale: 1.15, rotate: 8, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    />

                    <div className="mb-10">
                        <motion.h3
                            className="text-[#d2a574] text-sm lg:text-base font-bold tracking-[0.4em] uppercase mb-6"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Lezzet Serüveni
                        </motion.h3>
                        <h2 className="text-4xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                            Konya'nın Kalbinden Gelen <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
                                Lezzet Mirası
                            </span>
                        </h2>
                    </div>

                    <div className="space-y-8 text-zinc-400 text-lg lg:text-xl leading-relaxed font-light max-w-[800px] mx-auto">
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

                    <div className="mt-16 flex justify-center gap-12 lg:gap-24">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl lg:text-6xl font-black text-white">20+</span>
                            <span className="text-xs lg:text-sm text-zinc-500 uppercase tracking-[0.3em] mt-2 font-bold">Yıllık Tecrübe</span>
                        </div>
                        <div className="w-[1px] h-16 bg-zinc-800"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl lg:text-6xl font-black text-white">50+</span>
                            <span className="text-xs lg:text-sm text-zinc-500 uppercase tracking-[0.3em] mt-2 font-bold">Geleneksel Tarif</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Page 2: Cinematic Video Teaser */}
            <div className="min-h-screen flex items-center justify-center py-20 px-4 lg:px-20">
                <motion.div
                    className="relative w-full max-w-[1600px] h-[70vh] lg:h-[85vh] rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 group bg-black"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Background Silent Video (YouTube Embed) */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none scale-125">
                        <iframe
                            src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&controls=0&loop=1&playlist=ScMzIvxBSi4&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1"
                            className="w-full h-full object-cover opacity-60"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            title="Background Video"
                        />
                    </div>

                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-80"></div>

                    <div className="absolute bottom-16 lg:bottom-24 left-10 lg:left-24 z-10 max-w-[600px]">
                        <motion.div
                            className="flex items-center gap-4 mb-6"
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="w-12 h-[2px] bg-[#d4af37]"></span>
                            <span className="text-[#d4af37] text-sm font-black tracking-[0.5em] uppercase text-shadow">Mutfak Sanatı</span>
                        </motion.div>

                        <h4 className="text-4xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-none drop-shadow-2xl">
                            Ocakbaşı <br /> Hikayeleri
                        </h4>

                        <p className="text-zinc-300 text-lg lg:text-xl font-light mb-10 leading-relaxed drop-shadow-lg">
                            Ateşin, dumanın ve yüzyıllık ustalığın hikayesi. Her dokunuşta Konya'nın ruhunu sofranıza taşıyoruz.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <motion.button
                                onClick={() => setIsVideoOpen(true)}
                                className="px-10 py-5 bg-[#d4af37] text-black hover:bg-white font-black rounded-full flex items-center gap-3 transition-all shadow-2xl tracking-widest text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                <span>TANITIMI İZLE</span>
                            </motion.button>

                            <motion.button
                                className="px-10 py-5 bg-zinc-800/80 backdrop-blur-md text-white hover:bg-zinc-700 font-bold rounded-full flex items-center gap-3 transition-all border border-white/10 tracking-widest text-sm"
                                whileHover={{ scale: 1.05 }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                                <span>LİSTEME EKLE</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Cinematic Badges */}
                    <div className="absolute top-12 right-12 flex flex-col items-end gap-3">
                        <div className="px-4 py-1.5 bg-[#d4af37] text-black text-[10px] font-black tracking-[0.3em] rounded-sm uppercase shadow-xl">
                            Orijinal Yapım
                        </div>
                        <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-sm text-[10px] font-black text-white/80 tracking-[0.3em] uppercase">
                            4K Ultra HD
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Video Modal Overlay */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10"
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
                            className="absolute top-10 right-10 z-[110] w-16 h-16 flex items-center justify-center bg-white/10 hover:bg-[#d4af37] text-white hover:text-black rounded-full transition-all group backdrop-blur-md border border-white/10"
                        >
                            <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>

                        {/* Video Container */}
                        <motion.div
                            className="relative w-full max-w-[1200px] aspect-video bg-black rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.2)] border border-white/10 z-[105]"
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <iframe
                                src={modalVideoUrl}
                                className="w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                title="Konya Kebap Evi Tanıtım"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
