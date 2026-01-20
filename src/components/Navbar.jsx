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
    { label: 'MENÜMÜZ', href: '/menu', isPage: true, icon: UtensilsCrossed },
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
    const [currentHash, setCurrentHash] = useState('');

    // Scroll olduğunda arka plan değiştir
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hash durumunu takip et
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentHash(window.location.hash);
            
            const handleHashChange = () => {
                setCurrentHash(window.location.hash);
            };
            
            window.addEventListener('hashchange', handleHashChange);
            return () => window.removeEventListener('hashchange', handleHashChange);
        }
    }, []);

    // Hash link scroll işlemi ve ana sayfaya gelindiğinde en başa scroll
    useEffect(() => {
        if (pathname === '/') {
            // Hash varsa ilgili bölüme scroll et
            if (window.location.hash) {
                const hash = window.location.hash.substring(1);
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                // Hash yoksa ve scrollToTop flag'i varsa en başa scroll et
                if (sessionStorage.getItem('scrollToTop') === 'true') {
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        sessionStorage.removeItem('scrollToTop');
                    }, 100);
                }
            }
        }
    }, [pathname]);

    const handleLinkClick = (item, e) => {
        if (e) {
            e.preventDefault();
        }
        setMobileMenuOpen(false);

        // Ana sayfa linki ise
        if (item.href === '/') {
            if (pathname === '/') {
                // Zaten ana sayfadaysak en başa scroll et
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Başka sayfadaysak ana sayfaya git ve en başa scroll et
                window.location.href = '/';
            }
            return;
        }

        // Hash link ise
        if (item.href.startsWith('/#')) {
            const hash = item.href.split('#')[1];
            
            // Ana sayfadaysak direkt scroll et
            if (pathname === '/') {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Başka sayfadaysak önce ana sayfaya git, sonra scroll et
                window.location.href = item.href;
            }
        }
    };

    const handleHomePageClick = (e) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        
        if (pathname === '/') {
            // Zaten ana sayfadaysak en başa scroll et
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Başka sayfadaysak ana sayfaya git ve en başa scroll et
            // window.location.href kullanarak sayfa yeniden yüklenecek ve scroll pozisyonu sıfırlanacak
            // Smooth scroll için bir flag ekleyelim
            sessionStorage.setItem('scrollToTop', 'true');
            window.location.href = '/';
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
                                // Hash linkler için aktif durum kontrolü
                                const isActive = item.isPage 
                                    ? pathname === item.href 
                                    : pathname === '/' && currentHash === item.href;
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
                                    // Ana sayfa linki için özel handler
                                    if (item.href === '/') {
                                        return (
                                            <div key={item.label} className="flex items-center">
                                                <a 
                                                    href={item.href}
                                                    onClick={handleHomePageClick}
                                                    className={menuItemClass}
                                                >
                                                    {content}
                                                </a>
                                                {!isLast && <span className="text-[#d4af37]/30 mx-1">•</span>}
                                            </div>
                                        );
                                    }
                                    
                                    // Diğer sayfa linkleri
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
                                            item.href === '/' ? (
                                                <a
                                                    href={item.href}
                                                    onClick={(e) => {
                                                        handleHomePageClick(e);
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    className="text-xl font-bold tracking-[0.2em] text-white hover:text-[#d4af37] transition-colors"
                                                >
                                                    {item.label}
                                                </a>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="text-xl font-bold tracking-[0.2em] text-white hover:text-[#d4af37] transition-colors"
                                                >
                                                    {item.label}
                                                </Link>
                                            )
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
