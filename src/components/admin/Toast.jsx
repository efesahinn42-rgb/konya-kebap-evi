'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const toastTypes = {
    success: { icon: CheckCircle, color: 'bg-green-500', textColor: 'text-green-400' },
    error: { icon: XCircle, color: 'bg-red-500', textColor: 'text-red-400' },
    warning: { icon: AlertCircle, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
    info: { icon: Info, color: 'bg-blue-500', textColor: 'text-blue-400' }
};

export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);
    const config = toastTypes[type] || toastTypes.info;
    const Icon = config.icon;

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300); // Wait for animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl min-w-[300px] max-w-md"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.color}/20`}>
                            <Icon className={`w-5 h-5 ${config.textColor}`} />
                        </div>
                        <p className="flex-1 text-white text-sm font-medium">{message}</p>
                        <button
                            onClick={handleClose}
                            className="p-1 text-zinc-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Toast Container Component
export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
}

// Toast Hook
export function useToast() {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        return id;
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const success = (message, duration) => showToast(message, 'success', duration);
    const error = (message, duration) => showToast(message, 'error', duration);
    const warning = (message, duration) => showToast(message, 'warning', duration);
    const info = (message, duration) => showToast(message, 'info', duration);

    return {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
        ToastContainer: () => <ToastContainer toasts={toasts} removeToast={removeToast} />
    };
}
