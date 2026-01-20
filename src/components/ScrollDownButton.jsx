'use client';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ScrollDownButton({ targetId, light = false }) {
    const scrollToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex justify-center w-full py-8 mt-auto relative z-20">
            <motion.button
                onClick={scrollToTarget}
                className={`flex flex-col items-center gap-2 ${light ? 'text-white/70 hover:text-[#d4af37]' : 'text-zinc-500 hover:text-[#d4af37]'} transition-colors`}
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                aria-label={`${targetId} bölümüne git`}
            >
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Devam Et</span>
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
            </motion.button>
        </div>
    );
}
