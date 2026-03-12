'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import MenuPage from '@/components/MenuPage';

export default function MenuModal({ isOpen, onClose }) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with blur */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] rounded-[2rem] border border-[#d4af37]/20 shadow-2xl pointer-events-auto"
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-zinc-900/80 hover:bg-[#d4af37] text-[#d4af37] hover:text-black rounded-full border border-[#d4af37]/30 transition-all"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>

                            {/* Menu Content */}
                            <MenuPage />
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
