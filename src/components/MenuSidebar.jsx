'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const menuItems = [
    { label: 'ANA SAYFA', href: '#hero', isExternal: false },
    { label: 'MENÜMÜZ', href: '/menu', isExternal: true },
    { label: 'HAKKIMIZDA', href: '#about', isExternal: false },
    { label: 'İLETİŞİM', href: '#footer', isExternal: false },
];

export default function MenuSidebar() {
    return (
        <div className="flex flex-col w-full py-10 lg:py-0 bg-black">
            <div className="mb-12">
                <div className="flex flex-col items-start leading-none gap-1">
                    <span className="text-xl font-light text-zinc-500 tracking-[0.2em] uppercase">Konya</span>
                    <span className="text-4xl lg:text-5xl font-black text-[#d4af37] tracking-tighter">Kebap Evi</span>
                </div>
                <div className="w-16 h-1.5 bg-[#d4af37] mt-5 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
            </div>

            <nav className="flex flex-col gap-4">
                {menuItems.map((item) => (
                    item.isExternal ? (
                        <Link
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.span
                                className="block text-sm lg:text-base font-bold tracking-[0.25em] text-left py-3 transition-colors text-[#d4af37] cursor-pointer"
                                whileHover={{ x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {item.label}
                            </motion.span>
                        </Link>
                    ) : (
                        <motion.a
                            key={item.label}
                            href={item.href}
                            className="text-sm lg:text-base font-bold tracking-[0.25em] text-left py-3 transition-colors text-zinc-400 hover:text-[#d4af37]"
                            whileHover={{ x: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {item.label}
                        </motion.a>
                    )
                ))}
            </nav>

            <div className="mt-16 pt-10 border-t border-zinc-800 hidden lg:block">
                <p className="text-[11px] text-zinc-500 tracking-[0.4em] font-black mb-6 uppercase">Sosyal Medya</p>
                <div className="flex gap-5">
                    {['IG', 'FB', 'TW'].map(social => (
                        <div key={social} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-xs font-bold text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all cursor-pointer border border-[#d4af37]/20 shadow-sm">
                            {social}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
