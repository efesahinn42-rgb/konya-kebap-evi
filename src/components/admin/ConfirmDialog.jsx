'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Evet, Sil', cancelText = 'İptal', type = 'danger' }) {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            button: 'bg-red-500 hover:bg-red-600 text-white',
            icon: 'text-red-500'
        },
        warning: {
            button: 'bg-yellow-500 hover:bg-yellow-600 text-black',
            icon: 'text-yellow-500'
        },
        info: {
            button: 'bg-blue-500 hover:bg-blue-600 text-white',
            icon: 'text-blue-500'
        }
    };

    const styles = typeStyles[type] || typeStyles.danger;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    >
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${styles.icon.replace('text-', 'bg-')}/20 flex-shrink-0`}>
                                        <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                                        <p className="text-zinc-400 text-sm">{message}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`px-6 py-2.5 font-bold rounded-xl transition-colors ${styles.button}`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
