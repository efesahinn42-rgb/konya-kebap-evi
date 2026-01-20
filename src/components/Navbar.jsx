'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
    Menu, X, Instagram, Facebook,
    Home, Info, UtensilsCrossed, CalendarCheck,
    Images, Award, Newspaper, Heart, Users, Phone
} from 'lucide-react';

const menuItems = [
    { label: 'ANA SAYFA', href: '/', isPage: true, icon: Home },
    { label: 'HAKKIMIZDA', href: '/#about', isPage: false, icon: Info },
    { label: 'MENÜMÜZ', href: '/menu', isModal: true, icon: UtensilsCrossed },
    { label: 'REZERVASYON', href: '/#reservation', isPage: false, icon: CalendarCheck },
    { label: 'MİSAFİRLERİMİZ', href: '/#gallery', isPage: false, icon: Images },
    { label: 'ÖDÜLLERİMİZ', href: '/#awards', isPage: false, icon: Award },
    { label: 'BASINDA BİZ', href: '/#press', isPage: false, icon: Newspaper },
    { label: 'İLETİŞİM', href: '/#contact', isPage: false, icon: Phone },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Scroll olduğunda arka plan değiştir
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = (item) => {
        setMobileMenuOpen(false);

        if (item.isModal) {
            if (typeof window !== 'undefined' && window.openMenuModal) {
                window.openMenuModal();
            }
            return;
        }

        if (item.href.startsWith('/#')) {
            const hash = item.href.split('#')[1];
            if (pathname === '/') {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                window.location.href = item.href;
            }
        }
    };

    return (
        <>
            {/* Navbar */}
            <motion.header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-black/95 backdrop-blur-md shadow-lg'
                    : 'bg-gradient-to-b from-black/80 to-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-16 lg:h-20">

                        {/* Desktop Menu - Centered */}
                        <nav className="hidden lg:flex items-center">
                            {menuItems.map((item, index) => {
                                const isActive = pathname === item.href;
                                const isLast = index === menuItems.length - 1;

                                const menuItemClass = `
                                    relative text-[13px] font-semibold tracking-[0.12em] transition-all duration-300
                                    ${isActive ? 'text-[#d4af37]' : 'text-white/90 hover:text-[#d4af37]'}
                                    group py-2 px-4 whitespace-nowrap
                                `;

                                const underlineClass = `
                                    absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#d4af37] 
                                    transition-all duration-300 
                                    ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
                                `;

                                const IconComponent = item.icon;

                                const content = (
                                    <span className="flex items-center gap-2">
                                        {item.label}
                                        <IconComponent className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#d4af37]" />
                                        <span className={underlineClass} />
                                    </span>
                                );

                                if (item.isPage) {
                                    return (
                                        <div key={item.label} className="flex items-center">
                                            <Link href={item.href} className={menuItemClass}>
                                                {content}
                                            </Link>
                                            {!isLast && <span className="text-[#d4af37]/30 mx-1">•</span>}
                                        </div>
                                    );
                                }

                                return (
                                    <div key={item.label} className="flex items-center">
                                        <button
                                            onClick={() => handleLinkClick(item)}
                                            className={menuItemClass}
                                        >
                                            {content}
                                        </button>
                                        {!isLast && <span className="text-[#d4af37]/30 mx-1">•</span>}
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden absolute right-4 w-10 h-10 flex items-center justify-center text-white"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <div className="relative h-full flex flex-col items-center justify-center">
                            <nav className="flex flex-col items-center gap-6">
                                {menuItems.map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        {item.isPage ? (
                                            <Link
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-xl font-bold tracking-[0.2em] text-white hover:text-[#d4af37] transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleLinkClick(item)}
                                                className="text-xl font-bold tracking-[0.2em] text-white hover:text-[#d4af37] transition-colors"
                                            >
                                                {item.label}
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
