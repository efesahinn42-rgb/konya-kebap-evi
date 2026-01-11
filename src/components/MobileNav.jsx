'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { label: 'ANA SAYFA', href: '/', isPage: true },
    { label: 'MENÜMÜZ', href: '/menu', isPage: true, openInNewTab: true },
    { label: 'HAKKIMIZDA', href: '/#about', isPage: false },
    { label: 'İLETİŞİM', href: '/#contact', isPage: false },
];

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLinkClick = (href) => {
        setIsOpen(false);
        if (href.startsWith('/#')) {
            setTimeout(() => {
                const hash = href.split('#')[1];
                if (pathname === '/') {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    window.location.href = href;
                }
            }, 300);
        }
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 z-50 w-12 h-12 flex items-center justify-center bg-black/80 backdrop-blur-md border border-[#d4af37]/30 rounded-full text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 shadow-lg lg:hidden"
                aria-label="Menü"
            >
                <motion.div
                    animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        </svg>
                    )}
                </motion.div>
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black border-l border-[#d4af37]/20 z-40 overflow-y-auto lg:hidden"
                        >
                            <div className="p-6 sm:p-8">
                                {/* Logo */}
                                <Link href="/" onClick={() => setIsOpen(false)} className="mb-8">
                                    <div className="flex flex-col items-start leading-none gap-1">
                                        <span className="text-lg font-light text-zinc-500 tracking-[0.2em] uppercase">Konya</span>
                                        <span className="text-4xl font-black text-[#d4af37] tracking-tighter">Kebap Evi</span>
                                    </div>
                                    <div className="w-16 h-1.5 bg-[#d4af37] mt-4 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
                                </Link>

                                {/* Navigation */}
                                <nav className="flex flex-col gap-4 mb-8">
                                    {menuItems.map((item, index) => {
                                        const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
                                        
                                        if (item.isPage) {
                                            return (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    target={item.openInNewTab ? '_blank' : undefined}
                                                    rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className={`text-base font-bold tracking-[0.25em] py-3 transition-colors ${
                                                            isActive ? 'text-[#d4af37]' : 'text-zinc-400 hover:text-[#d4af37]'
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </motion.div>
                                                </Link>
                                            );
                                        } else {
                                            return (
                                                <motion.div
                                                    key={item.label}
                                                    onClick={() => handleLinkClick(item.href)}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="text-base font-bold tracking-[0.25em] py-3 transition-colors text-zinc-400 hover:text-[#d4af37] cursor-pointer"
                                                >
                                                    {item.label}
                                                </motion.div>
                                            );
                                        }
                                    })}
                                </nav>

                                {/* Social Media */}
                                <div className="pt-8 border-t border-zinc-800">
                                    <p className="text-xs text-zinc-500 tracking-[0.4em] font-black mb-6 uppercase">Sosyal Medya</p>
                                    <div className="flex gap-4">
                                        {['IG', 'FB', 'TW'].map(social => (
                                            <div
                                                key={social}
                                                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-xs font-bold text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer border border-[#d4af37]/20 shadow-sm"
                                            >
                                                {social}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
