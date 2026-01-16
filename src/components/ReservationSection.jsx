'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, Users, Phone, User, CheckCircle, Utensils } from 'lucide-react';

export default function ReservationSection() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        notes: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        setIsSubmitted(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            date: '',
            time: '',
            guests: '2',
            notes: ''
        });
        setIsSubmitted(false);
    };

    return (
        <section id="reservation" className="relative bg-[#0a0a0a] overflow-hidden w-full">
            <div className="min-h-screen flex items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
                <motion.div
                    className="relative max-w-[900px] w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 sm:p-8 md:p-10 lg:p-16 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] shadow-3xl overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    {/* Background Logo */}
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: 'url(/logo.png)',
                            backgroundSize: '40%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />

                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative z-10"
                            >
                                {/* Header */}
                                <div className="text-center mb-8 sm:mb-12">
                                    <motion.div
                                        className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6"
                                        initial={{ x: -20, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                                        <span className="text-[#d4af37] text-xs sm:text-sm font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">
                                            Masa Ayırtın
                                        </span>
                                        <span className="w-8 sm:w-12 h-[2px] bg-[#d4af37]"></span>
                                    </motion.div>

                                    <motion.h2
                                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter mb-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
                                            Rezervasyon
                                        </span>
                                    </motion.h2>

                                    <motion.p
                                        className="text-zinc-400 max-w-md mx-auto text-sm sm:text-base"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        Özel anlarınızı bizimle paylaşın. Hemen masa ayırtın.
                                    </motion.p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Name */}
                                        <div className="relative">
                                            <label className="block text-xs text-zinc-500 font-bold tracking-wider uppercase mb-2">
                                                Ad Soyad
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Adınız Soyadınız"
                                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-600 focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="relative">
                                            <label className="block text-xs text-zinc-500 font-bold tracking-wider uppercase mb-2">
                                                Telefon
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="0532 XXX XX XX"
                                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-600 focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="relative">
                                            <label className="block text-xs text-zinc-500 font-bold tracking-wider uppercase mb-2">
                                                Tarih
                                            </label>
                                            <div className="relative">
                                                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Time */}
                                        <div className="relative">
                                            <label className="block text-xs text-zinc-500 font-bold tracking-wider uppercase mb-2">
                                                Saat
                                            </label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                                <select
                                                    name="time"
                                                    value={formData.time}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="">Saat Seçin</option>
                                                    <option value="12:00">12:00</option>
                                                    <option value="13:00">13:00</option>
                                                    <option value="14:00">14:00</option>
                                                    <option value="18:00">18:00</option>
                                                    <option value="19:00">19:00</option>
                                                    <option value="20:00">20:00</option>
                                                    <option value="21:00">21:00</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Guests */}
                                        <div className="relative sm:col-span-2">
                                            <label className="block text-xs text-zinc-500 font-bold tracking-wider uppercase mb-2">
                                                Kişi Sayısı
                                            </label>
                                            <div className="relative">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                                <select
                                                    name="guests"
                                                    value={formData.guests}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all appearance-none cursor-pointer"
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                        <option key={num} value={num}>{num} Kişi</option>
                                                    ))}
                                                    <option value="10+">10+ Kişi</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="relative sm:col-span-2">
                                            <label className="block text-xs text-zinc-500 font-bold tracking-wider uppercase mb-2">
                                                Özel Notlar (Opsiyonel)
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                placeholder="Özel isteklerinizi belirtin..."
                                                rows={3}
                                                className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Buttons Row */}
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        {/* Submit Button */}
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 py-4 sm:py-5 bg-[#d4af37] hover:bg-[#e5c349] text-black font-black text-sm sm:text-base tracking-wider rounded-xl transition-all shadow-lg shadow-[#d4af37]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                    İşleniyor...
                                                </>
                                            ) : (
                                                <>
                                                    <Utensils className="w-5 h-5" />
                                                    REZERVASYON YAP
                                                </>
                                            )}
                                        </motion.button>

                                        {/* Call Button */}
                                        <motion.a
                                            href="tel:4448742"
                                            className="sm:w-auto py-4 sm:py-5 px-6 sm:px-8 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-sm sm:text-base tracking-wider rounded-xl transition-all border border-white/10 flex items-center justify-center gap-3"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Phone className="w-5 h-5 text-[#d4af37]" />
                                            <span>444 87 42</span>
                                        </motion.a>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="relative z-10 text-center py-10 sm:py-16"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 15, delay: 0.2 }}
                                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
                                >
                                    <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
                                </motion.div>

                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4">
                                    Tebrikler!
                                </h3>
                                <p className="text-lg sm:text-xl text-[#d4af37] font-bold mb-2">
                                    Rezervasyonunuz Alındı
                                </p>
                                <p className="text-zinc-400 max-w-md mx-auto mb-8">
                                    Sayın <span className="text-white font-semibold">{formData.name}</span>,
                                    {' '}<span className="text-[#d4af37]">{formData.date}</span> tarihinde
                                    {' '}<span className="text-[#d4af37]">{formData.time}</span> saatinde
                                    {' '}<span className="text-[#d4af37]">{formData.guests} kişilik</span> masanız hazırlanacaktır.
                                </p>
                                <p className="text-zinc-500 text-sm mb-8">
                                    Onay için kısa süre içinde sizinle iletişime geçeceğiz.
                                </p>

                                <motion.button
                                    onClick={resetForm}
                                    className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all border border-white/10"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Yeni Rezervasyon
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
