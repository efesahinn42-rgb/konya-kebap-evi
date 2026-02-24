'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, Briefcase, GraduationCap, Heart, Clock, Award, Send, ChevronUp } from 'lucide-react';
import { useJobPositions } from '@/hooks/useJobPositions';
import { supabase } from '@/lib/supabase';

const benefits = [
    {
        icon: Heart,
        title: 'Sağlık Sigortası',
        description: 'Özel sağlık sigortası ile kendinizi güvende hissedin.'
    },
    {
        icon: GraduationCap,
        title: 'Kariyer Gelişimi',
        description: 'Sürekli eğitim ve gelişim fırsatları sunuyoruz.'
    },
    {
        icon: Clock,
        title: 'Esnek Çalışma',
        description: 'İş-yaşam dengesine önem veriyoruz.'
    },
    {
        icon: Award,
        title: 'Performans Primi',
        description: 'Başarılarınızı ödüllendiriyoruz.'
    },
];

// Fallback positions
const fallbackPositions = [
    {
        id: 'fallback-1',
        title: 'Aşçı',
        type: 'Tam Zamanlı',
        location: 'İstanbul',
        description: 'Geleneksel Türk mutfağında deneyimli aşçı arıyoruz.'
    },
    {
        id: 'fallback-2',
        title: 'Garson',
        type: 'Tam / Yarı Zamanlı',
        location: 'İstanbul',
        description: 'Misafir memnuniyetini ön planda tutan takım arkadaşları arıyoruz.'
    },
    {
        id: 'fallback-3',
        title: 'Komi',
        type: 'Tam Zamanlı',
        location: 'İstanbul',
        description: 'Kariyer hedefleyen genç yeteneklere kapımız açık.'
    },
];

export default function HRSection() {
    const { data: openPositions = fallbackPositions, isLoading: loading } = useJobPositions();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Find selected position
            const selectedPosition = openPositions.find(p => p.id === formData.position || p.title === formData.position);

            const applicationData = {
                position_id: selectedPosition?.id?.startsWith('fallback') ? null : selectedPosition?.id || null,
                position_title: selectedPosition?.title || formData.position || 'Diğer',
                full_name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
                status: 'pending'
            };

            const { error } = await supabase
                .from('job_applications')
                .insert(applicationData);

            if (error) throw error;

            setIsSubmitted(true);
            setFormData({ name: '', email: '', phone: '', position: '', message: '' });
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (err) {
            console.error('Error submitting application:', err);
            setSubmitError('Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        }

        setIsSubmitting(false);
    };

    return (
        <section id="insan-kaynaklari" className="relative bg-[#0a0a0a] overflow-hidden py-16 sm:py-20 lg:py-28">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4af37]/5 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 sm:mb-16 lg:mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[#d4af37]" />
                        <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">
                        İnsan{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f0d675] to-[#d4af37]">
                            Kaynakları
                        </span>
                    </h2>

                    <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Ailemize katılın! Tutkulu, dinamik ve misafirperverliği ilke edinmiş takım arkadaşları arıyoruz.
                    </p>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    className="relative rounded-3xl overflow-hidden mb-12 sm:mb-16 lg:mb-20 aspect-[21/9]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1400"
                        alt="Ekibimiz"
                        fill
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                        <div className="p-8 sm:p-12 lg:p-16 max-w-xl">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                                Birlikte Büyüyelim
                            </h3>
                            <p className="text-zinc-300 text-sm sm:text-base lg:text-lg">
                                30 yılı aşkın tecrübemizle, ekibimize katılacak yeni yetenekleri bekliyoruz.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Benefits */}
                <motion.div
                    className="mb-12 sm:mb-16 lg:mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-8 sm:mb-10">
                        Neden Biz?
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/5 hover:border-[#d4af37]/30 transition-all group"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8962f] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-white mb-2">{benefit.title}</h4>
                                <p className="text-zinc-400 text-xs sm:text-sm">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Open Positions */}
                <motion.div
                    className="mb-12 sm:mb-16 lg:mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-8 sm:mb-10">
                        Açık Pozisyonlar
                    </h3>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-zinc-800/30 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : openPositions.length === 0 ? (
                        <div className="text-center py-12 bg-zinc-900/60 rounded-2xl">
                            <p className="text-zinc-400">Şu anda açık pozisyon bulunmamaktadır.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {openPositions.map((position, index) => (
                                <motion.div
                                    key={position.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                    className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/5 hover:border-[#d4af37]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <h4 className="text-lg sm:text-xl font-bold text-white mb-1">{position.title}</h4>
                                        <p className="text-zinc-400 text-sm mb-2">{position.description}</p>
                                        <div className="flex gap-3 text-xs">
                                            <span className="bg-[#d4af37]/20 text-[#d4af37] px-3 py-1 rounded-full">{position.type}</span>
                                            <span className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full">{position.location}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setFormData({ ...formData, position: position.id || position.title });
                                            document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="bg-gradient-to-r from-[#d4af37] to-[#b8962f] text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
                                    >
                                        Başvur
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Application Form */}
                <motion.div
                    id="application-form"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="bg-gradient-to-r from-zinc-900/80 via-zinc-800/60 to-zinc-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 border border-[#d4af37]/20"
                >
                    <div className="text-center mb-8">
                        <Users className="w-10 h-10 text-[#d4af37] mx-auto mb-4" />
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                            Başvuru Formu
                        </h3>
                        <p className="text-zinc-400 text-sm sm:text-base">Bizimle iletişime geçin, size en kısa sürede dönüş yapalım.</p>
                    </div>

                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Başvurunuz Alındı!</h4>
                            <p className="text-zinc-400">En kısa sürede sizinle iletişime geçeceğiz.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <input
                                type="text"
                                placeholder="Adınız Soyadınız"
                                required
                                className="bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="E-posta Adresiniz"
                                required
                                className="bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input
                                type="tel"
                                placeholder="Telefon Numaranız"
                                required
                                className="bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <select
                                required
                                className="bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4af37]/50 focus:outline-none transition-colors"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            >
                                <option value="" className="bg-zinc-900">Pozisyon Seçin</option>
                                {openPositions.map((pos) => (
                                    <option key={pos.id} value={pos.id || pos.title} className="bg-zinc-900">
                                        {pos.title}
                                    </option>
                                ))}
                                <option value="diger" className="bg-zinc-900">Diğer</option>
                            </select>
                            <textarea
                                placeholder="Mesajınız (opsiyonel)"
                                rows={4}
                                className="sm:col-span-2 bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-[#d4af37]/50 focus:outline-none transition-colors resize-none"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />

                            {submitError && (
                                <div className="sm:col-span-2 text-red-400 text-sm text-center">
                                    {submitError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="sm:col-span-2 bg-gradient-to-r from-[#d4af37] via-[#f0d675] to-[#d4af37] text-black font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Gönderiliyor...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Başvuruyu Gönder
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
            
            {/* Scroll to Top Button */}
            <div className="flex justify-center w-full py-8 mt-auto relative z-20">
                <motion.button
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex flex-col items-center gap-2 text-zinc-500 hover:text-[#d4af37] transition-colors"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    aria-label="Başa dön"
                >
                    <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Başa Dön</span>
                    <ChevronUp className="w-5 h-5" />
                </motion.button>
            </div>
        </section>
    );
}
