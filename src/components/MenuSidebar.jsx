'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Facebook, X } from 'lucide-react';

const menuItems = [
    { label: 'ANA SAYFA', href: '/', isPage: true },
    { label: 'HAKKIMIZDA', href: '/#about', isPage: false },
    { label: 'MENÜMÜZ', href: '/menu', isModal: true },
    { label: 'REZERVASYON', href: '/#reservation', isPage: false },
    { label: 'GALERİ', href: '/#gallery', isPage: false },
    { label: 'ÖDÜLLERİMİZ', href: '/#awards', isPage: false },
    { label: 'BASINDA BİZ', href: '/#press', isPage: false },
    { label: 'SOSYAL SORUMLULUK', href: '/#sosyal-sorumluluk', isPage: false },
    { label: 'İNSAN KAYNAKLARI', href: '/#insan-kaynaklari', isPage: false },
    { label: 'İLETİŞİM', href: '/#contact', isPage: false },
];

export default function MenuSidebar() {
    const pathname = usePathname();

    const handleLinkClick = (href) => {
        if (href.startsWith('/#')) {
            const hash = href.split('#')[1];
            if (pathname === '/') {
                // Ana sayfadaysak direkt scroll et
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Başka sayfadaysak ana sayfaya git ve scroll et
                window.location.href = href;
            }
        }
    };

    return (
        <div className="flex flex-col w-full py-6 sm:py-8 lg:py-0 bg-black">

            <nav className="flex flex-col gap-3 sm:gap-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href === '/' && pathname === '/');

                    if (item.isPage) {
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                target={item.openInNewTab ? '_blank' : undefined}
                                rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                            >
                                <motion.span
                                    className={`block text-xs sm:text-sm lg:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-left py-2 sm:py-2.5 lg:py-3 transition-colors cursor-pointer ${isActive ? 'text-[#d4af37]' : 'text-zinc-400 hover:text-[#d4af37]'
                                        }`}
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {item.label}
                                </motion.span>
                            </Link>
                        );
                    } else if (item.isModal) {
                        return (
                            <motion.span
                                key={item.label}
                                onClick={() => {
                                    if (typeof window !== 'undefined' && window.openMenuModal) {
                                        window.openMenuModal();
                                    }
                                }}
                                className="block text-xs sm:text-sm lg:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-left py-2 sm:py-2.5 lg:py-3 transition-colors text-zinc-400 hover:text-[#d4af37] cursor-pointer"
                                whileHover={{ x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {item.label}
                            </motion.span>
                        );
                    } else {
                        return (
                            <motion.span
                                key={item.label}
                                onClick={() => handleLinkClick(item.href)}
                                className="block text-xs sm:text-sm lg:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-left py-2 sm:py-2.5 lg:py-3 transition-colors text-zinc-400 hover:text-[#d4af37] cursor-pointer"
                                whileHover={{ x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {item.label}
                            </motion.span>
                        );
                    }
                })}
            </nav>

            <div className="mt-10 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 lg:pt-10 border-t border-zinc-800">
                <p className="text-[10px] sm:text-[11px] text-zinc-500 tracking-[0.3em] sm:tracking-[0.4em] font-black mb-4 sm:mb-6 uppercase">Sosyal Medya</p>
                <div className="flex gap-3 sm:gap-4 lg:gap-5">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer border border-[#d4af37]/20 shadow-sm">
                        <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer border border-[#d4af37]/20 shadow-sm">
                        <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer border border-[#d4af37]/20 shadow-sm">
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
