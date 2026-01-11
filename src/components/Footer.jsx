'use client';
import { motion } from 'framer-motion';

const quickLinks = [
    { name: 'ANA SAYFA', href: '#hero' },
    { name: 'MENÜMÜZ', href: '#menu' },
    { name: 'HAKKIMIZDA', href: '#about' },
    { name: 'İLETİŞİM', href: '#contact' },
];

const socialLinks = [
    { icon: 'instagram', href: 'https://instagram.com', label: 'Instagram' },
    { icon: 'tiktok', href: 'https://tiktok.com', label: 'TikTok' },
    { icon: 'linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
    const scrollToSection = (e, href) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer id="contact" className="bg-black py-[80px] lg:pb-[30px] pt-[60px] text-white border-t border-[#d4af37]/20">
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1.5fr_1fr] gap-[35px] lg:gap-10 mb-[60px] text-center lg:text-left">
                    {/* Logo & About */}
                    <div className="flex flex-col items-center lg:items-start mb-5 lg:mb-0">
                        <div className="flex flex-col mb-5 items-center lg:items-start leading-none">
                            <span className="text-sm font-light tracking-[3px] text-zinc-500 uppercase">Konya</span>
                            <span className="text-[28px] font-black text-[#d4af37] tracking-tighter">Kebap Evi</span>
                        </div>
                        <p className="text-[13px] leading-[1.8] text-zinc-500 max-w-[300px]">
                            Konya'nın kalbinden gelen geleneksel lezzetleri, asırlık tarifler ve usta ellerle sofranıza taşıyoruz.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="text-sm font-bold tracking-[2px] mb-[25px] text-[#d4af37] uppercase">Hızlı Linkler</h3>
                        <ul className="flex flex-col gap-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="text-[13px] text-zinc-400 hover:text-[#d4af37] transition-colors tracking-widest font-medium">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="text-sm font-bold tracking-[2px] mb-[25px] text-[#d4af37] uppercase">İletişim</h3>
                        <div className="flex flex-col gap-[15px]">
                            <p className="text-[13px] leading-[1.7] text-zinc-400">
                                <strong className="text-[#d4af37] font-bold block mb-1 uppercase tracking-wider">Adres:</strong>
                                Konya Meram, Kebap Sokak No:42<br />
                                Selçuklu, Konya
                            </p>
                            <p className="text-[13px] leading-[1.7] text-zinc-400">
                                <strong className="text-[#d4af37] font-bold block mb-1 uppercase tracking-wider">Telefon:</strong>
                                +90 332 555 0100
                            </p>
                            <p className="text-[13px] leading-[1.7] text-zinc-400">
                                <strong className="text-[#d4af37] font-bold block mb-1 uppercase tracking-wider">E-posta:</strong>
                                info@konyakebapevi.com
                            </p>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="text-sm font-bold tracking-[2px] mb-[25px] text-[#d4af37] uppercase">Bizi Takip Edin</h3>
                        <div className="flex gap-[15px] justify-center lg:justify-start">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.icon}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                    className="flex items-center justify-center w-10 h-10 bg-zinc-900 rounded-full text-[#d4af37] border border-[#d4af37]/20 hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-sm"
                                >
                                    {link.icon === 'instagram' && (
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    )}
                                    {link.icon === 'tiktok' && (
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                        </svg>
                                    )}
                                    {link.icon === 'linkedin' && (
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center pt-[30px] border-t border-zinc-800 gap-[15px] lg:gap-0 text-center lg:text-left">
                    <p className="text-xs text-zinc-600 font-medium tracking-widest">© 2024 KONYA KEBAP EVİ. TÜM HAKLARI SAKLIDIR.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {['Gizlilik Politikası', 'Kullanım Şartları', 'KVKK'].map(text => (
                            <a key={text} href="#" className="text-[10px] text-zinc-600 hover:text-[#d4af37] transition-colors font-bold tracking-[0.2em] uppercase">
                                {text}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
