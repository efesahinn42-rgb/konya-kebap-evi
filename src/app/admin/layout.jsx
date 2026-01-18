'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
    LayoutDashboard,
    Image as ImageIcon,
    Video,
    Images,
    Award,
    Newspaper,
    Heart,
    Users,
    FileText,
    LogOut,
    Menu,
    X,
    ChefHat
} from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Hero Slider', href: '/admin/slider', icon: ImageIcon },
    { name: 'Ocakbaşı Videoları', href: '/admin/videos', icon: Video },
    { name: 'Galeri', href: '/admin/gallery', icon: Images },
    { name: 'Ödüllerimiz', href: '/admin/awards', icon: Award },
    { name: 'Basında Biz', href: '/admin/press', icon: Newspaper },
    { name: 'Sosyal Sorumluluk', href: '/admin/social', icon: Heart },
    { name: 'Açık Pozisyonlar', href: '/admin/hr/positions', icon: Users },
    { name: 'İş Başvuruları', href: '/admin/hr/applications', icon: FileText },
];

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Skip auth check for login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/admin/login');
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/admin/login');
            } else if (session) {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [router, isLoginPage]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    // Show login page without layout
    if (isLoginPage) {
        return children;
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-xl flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-bold text-white">Admin Panel</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-zinc-400 hover:text-white"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-72 bg-zinc-900 border-r border-zinc-800 z-50
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="h-20 flex items-center gap-3 px-6 border-b border-zinc-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-xl flex items-center justify-center shadow-lg">
                        <ChefHat className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white">Konya Kebap</h1>
                        <p className="text-xs text-zinc-500">Admin Panel</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-5rem-4rem)]">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                    ${isActive
                                        ? 'bg-[#d4af37] text-black font-semibold'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                {user?.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{user?.email}</p>
                            <p className="text-xs text-zinc-500">Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
