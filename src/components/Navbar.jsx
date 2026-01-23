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

const leftMenuItems = [
    { label: 'ANA SAYFA', href: '/', isPage: true, icon: Home },
    { label: 'HAKKIMIZDA', href: '/#about', isPage: false, icon: Info },
    { label: 'MENÜMÜZ', href: '/menu', isPage: true, icon: UtensilsCrossed },
    { label: 'REZERVASYON', href: '/#reservation', isPage: false, icon: CalendarCheck },
];

const rightMenuItems = [
    { label: 'MİSAFİRLERİMİZ', href: '/#gallery', isPage: false, icon: Images },
    { label: 'ÖDÜLLERİMİZ', href: '/#awards', isPage: false, icon: Award },
    { label: 'BASINDA BİZ', href: '/#press', isPage: false, icon: Newspaper },
    { label: 'İLETİŞİM', href: '/#contact', isPage: false, icon: Phone },
];

const menuItems = [...leftMenuItems, ...rightMenuItems];

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentHash, setCurrentHash] = useState('');
    const [activeSection, setActiveSection] = useState('');
    const [scrollY, setScrollY] = useState(0);

    // Scroll olduğunda arka plan değiştir ve scroll pozisyonunu takip et
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 50);
            setScrollY(currentScrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        // İlk yüklemede scroll pozisyonunu al
        if (typeof window !== 'undefined') {
            setScrollY(window.scrollY);
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer ile aktif section'ı tespit et
    useEffect(() => {
        if (pathname !== '/') {
            setActiveSection('');
            return;
        }

        const sections = ['about', 'reservation', 'gallery', 'awards', 'press', 'contact', 'stats'];
        const observers = [];
        const sectionVisibility = {};

        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                const sectionId = entry.target.id;
                sectionVisibility[sectionId] = entry.isIntersecting;
            });

            // En üstteyken (scrollY < 100) aktif section yok
            const currentScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
            if (currentScrollY < 100) {
                setActiveSection('');
                return;
            }

            // Görünür section'ları bul ve en üstteki olanı seç
            const visibleSections = sections.filter(id => {
                const element = document.getElementById(id);
                if (!element) return false;

                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.3 && rect.bottom > 0;
                return isVisible;
            });

            if (visibleSections.length > 0) {
                // En üstteki section'ı bul
                let topSection = visibleSections[0];
                let topPosition = document.getElementById(topSection)?.getBoundingClientRect().top || Infinity;

                visibleSections.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        if (rect.top < topPosition && rect.top >= 0) {
                            topPosition = rect.top;
                            topSection = id;
                        }
                    }
                });

                // stats section'ı about içinde olduğu için about'a map et
                const mappedSection = topSection === 'stats' ? 'about' : topSection;
                setActiveSection(mappedSection);
            } else {
                // Hiç section görünmüyorsa, scroll pozisyonuna göre belirle
                const scrollY = window.scrollY;
                if (scrollY < 100) {
                    setActiveSection('');
                } else {
                    // Scroll pozisyonuna göre en yakın section'ı bul
                    let closestSection = '';
                    let closestDistance = Infinity;

                    sections.forEach(id => {
                        const element = document.getElementById(id);
                        if (element) {
                            const rect = element.getBoundingClientRect();
                            const distance = Math.abs(rect.top);
                            if (distance < closestDistance && rect.top < window.innerHeight) {
                                closestDistance = distance;
                                closestSection = id;
                            }
                        }
                    });

                    if (closestSection) {
                        const mappedSection = closestSection === 'stats' ? 'about' : closestSection;
                        setActiveSection(mappedSection);
                    }
                }
            }
        };

        // Her section için observer oluştur
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                const observer = new IntersectionObserver(handleIntersection, {
                    rootMargin: '-20% 0px -70% 0px',
                    threshold: 0.1
                });
                observer.observe(element);
                observers.push(observer);
            }
        });

        // Scroll event listener ekle (daha hassas kontrol için)
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 100) {
                setActiveSection('');
                return;
            }

            const sections = ['about', 'reservation', 'gallery', 'awards', 'press', 'contact', 'stats'];
            let activeId = '';
            let minDistance = Infinity;

            sections.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const distance = Math.abs(rect.top - 100); // Navbar yüksekliği + offset

                    // Section görünür alanda ve en yakınsa
                    if (rect.top <= window.innerHeight * 0.3 && rect.bottom > 0 && distance < minDistance) {
                        minDistance = distance;
                        activeId = id;
                    }
                }
            });

            if (activeId) {
                const mappedSection = activeId === 'stats' ? 'about' : activeId;
                setActiveSection(mappedSection);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            observers.forEach(observer => observer.disconnect());
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pathname]);

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
            {/* Navbar - Hero içinde serbest konumda, scroll sonrası sticky */}
            <motion.header
                className={`fixed z-50 transition-all duration-500 ${isScrolled
                    ? 'top-0 left-0 right-0 bg-black/95 backdrop-blur-md shadow-lg'
                    : 'top-[72%] left-0 right-0 -translate-y-1/2 bg-transparent'
                    }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ willChange: 'transform, top' }}
            >
                <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isScrolled ? 'max-w-7xl' : 'w-full'}`}>
                    <div className={`relative ${isScrolled ? 'flex items-center justify-center h-16 lg:h-20' : 'h-auto'}`}>

                        {/* Desktop Menu */}
                        <div className="hidden lg:block w-full">
                            {isScrolled ? (
                                /* Scrolled: Unified Horizontal Menu */
                                <nav className="flex flex-row items-center justify-center gap-6">
                                    {menuItems.map((item, index) => {
                                        let isActive = false;
                                        if (item.isPage) {
                                            isActive = item.href === '/' ? (pathname === '/' && activeSection === '') : (pathname === item.href);
                                        } else {
                                            const hashName = item.href.split('#')[1];
                                            isActive = pathname === '/' && activeSection === hashName;
                                        }

                                        const menuItemClass = `relative text-[16px] font-semibold tracking-[0.12em] transition-all duration-300 ${isActive ? 'text-[#d4af37]' : 'text-white/90 hover:text-[#d4af37]'} group py-2 px-4 whitespace-nowrap`;
                                        const underlineClass = `absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#d4af37] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`;
                                        const IconComponent = item.icon;
                                        const content = (
                                            <span className="flex items-center gap-2">
                                                {item.label}
                                                <IconComponent className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#d4af37]" />
                                                <span className={underlineClass} />
                                            </span>
                                        );

                                        if (item.isPage && item.href === '/') {
                                            return <a key={item.label} href={item.href} onClick={handleHomePageClick} className={menuItemClass}>{content}</a>;
                                        } else if (item.isPage) {
                                            return <Link key={item.label} href={item.href} className={menuItemClass}>{content}</Link>;
                                        }
                                        return <button key={item.label} onClick={() => handleLinkClick(item)} className={menuItemClass}>{content}</button>;
                                    })}
                                </nav>
                            ) : (
                                /* Not Scrolled: Split Vertical Menus */
                                <>
                                    {/* Left Menu */}
                                    <nav className="absolute left-[380px] top-1/2 -translate-y-1/2 flex flex-col items-start gap-2">
                                        {leftMenuItems.map((item) => {
                                            let isActive = false;
                                            if (item.isPage) {
                                                isActive = item.href === '/' ? (pathname === '/' && activeSection === '') : (pathname === item.href);
                                            } else {
                                                const hashName = item.href.split('#')[1];
                                                isActive = pathname === '/' && activeSection === hashName;
                                            }

                                            const menuItemClass = `relative text-[16px] font-semibold tracking-[0.12em] transition-all duration-300 ${isActive ? 'text-[#d4af37]' : 'text-white/90 hover:text-[#d4af37]'} group py-2 px-4 whitespace-nowrap`;
                                            const underlineClass = `absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#d4af37] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`;
                                            const IconComponent = item.icon;
                                            const content = (
                                                <span className="flex items-center gap-2">
                                                    {item.label}
                                                    <IconComponent className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#d4af37]" />
                                                    <span className={underlineClass} />
                                                </span>
                                            );

                                            if (item.isPage && item.href === '/') {
                                                return <a key={item.label} href={item.href} onClick={handleHomePageClick} className={menuItemClass}>{content}</a>;
                                            } else if (item.isPage) {
                                                return <Link key={item.label} href={item.href} className={menuItemClass}>{content}</Link>;
                                            }
                                            return <button key={item.label} onClick={() => handleLinkClick(item)} className={menuItemClass}>{content}</button>;
                                        })}
                                    </nav>

                                    {/* Right Menu */}
                                    <nav className="absolute right-[300px] top-1/2 -translate-y-1/2 flex flex-col items-start gap-2">
                                        {rightMenuItems.map((item) => {
                                            let isActive = false;
                                            if (item.isPage) {
                                                isActive = item.href === '/' ? (pathname === '/' && activeSection === '') : (pathname === item.href);
                                            } else {
                                                const hashName = item.href.split('#')[1];
                                                isActive = pathname === '/' && activeSection === hashName;
                                            }

                                            const menuItemClass = `relative text-[16px] font-semibold tracking-[0.12em] transition-all duration-300 ${isActive ? 'text-[#d4af37]' : 'text-white/90 hover:text-[#d4af37]'} group py-2 px-4 whitespace-nowrap`;
                                            const underlineClass = `absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#d4af37] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`;
                                            const IconComponent = item.icon;
                                            const content = (
                                                <span className="flex items-center gap-2">
                                                    {item.label}
                                                    <IconComponent className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#d4af37]" />
                                                    <span className={underlineClass} />
                                                </span>
                                            );

                                            if (item.isPage && item.href === '/') {
                                                return <a key={item.label} href={item.href} onClick={handleHomePageClick} className={menuItemClass}>{content}</a>;
                                            } else if (item.isPage) {
                                                return <Link key={item.label} href={item.href} className={menuItemClass}>{content}</Link>;
                                            }
                                            return <button key={item.label} onClick={() => handleLinkClick(item)} className={menuItemClass}>{content}</button>;
                                        })}
                                    </nav>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button - Kept same */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden absolute right-4 w-10 h-10 flex items-center justify-center text-white"
                            aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                            aria-expanded={mobileMenuOpen}
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
                                {menuItems.map((item, index) => {
                                    // Mobile menu için aktif durum kontrolü
                                    let isActive = false;

                                    if (item.isPage) {
                                        if (item.href === '/') {
                                            isActive = pathname === '/' && (activeSection === '' || scrollY < 100);
                                        } else {
                                            isActive = pathname === item.href;
                                        }
                                    } else {
                                        if (pathname === '/') {
                                            const hashName = item.href.split('#')[1];
                                            isActive = activeSection === hashName;
                                        } else {
                                            isActive = false;
                                        }
                                    }

                                    return (
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
                                                        className={`text-xl font-bold tracking-[0.2em] transition-colors ${isActive
                                                            ? 'text-[#d4af37] underline decoration-2 underline-offset-4'
                                                            : 'text-white hover:text-[#d4af37]'
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`text-xl font-bold tracking-[0.2em] transition-colors ${isActive
                                                            ? 'text-[#d4af37] underline decoration-2 underline-offset-4'
                                                            : 'text-white hover:text-[#d4af37]'
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                )
                                            ) : (
                                                <button
                                                    onClick={() => handleLinkClick(item)}
                                                    className={`text-xl font-bold tracking-[0.2em] transition-colors ${isActive
                                                        ? 'text-[#d4af37] underline decoration-2 underline-offset-4'
                                                        : 'text-white hover:text-[#d4af37]'
                                                        }`}
                                                >
                                                    {item.label}
                                                </button>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
