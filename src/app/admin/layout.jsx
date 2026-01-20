'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase, handleAuthError } from '@/lib/supabase';
import { getUserRole, hasAccess, isMenuVisible } from '@/lib/auth';
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
    ChefHat,
    UtensilsCrossed,
    CalendarCheck,
    UserCog
} from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Rezervasyonlar', href: '/admin/reservations', icon: CalendarCheck },
    { name: 'Hero Slider', href: '/admin/slider', icon: ImageIcon },
    { name: 'Ocakbaşı Videoları', href: '/admin/videos', icon: Video },
    { name: 'Menü Yönetimi', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Galeri', href: '/admin/gallery', icon: Images },
    { name: 'Ödüllerimiz', href: '/admin/awards', icon: Award },
    { name: 'Basında Biz', href: '/admin/press', icon: Newspaper },
    { name: 'Sosyal Sorumluluk', href: '/admin/social', icon: Heart },
    { name: 'Açık Pozisyonlar', href: '/admin/hr/positions', icon: Users },
    { name: 'İş Başvuruları', href: '/admin/hr/applications', icon: FileText },
    { name: 'Kullanıcı Yönetimi', href: '/admin/users', icon: UserCog },
];

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // Skip auth check for login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                // Handle refresh token errors
                if (error) {
                    const isRefreshTokenError = error.message?.includes('Refresh Token') || 
                                                error.message?.includes('refresh_token') ||
                                                error.message?.includes('Invalid Refresh Token');
                    
                    if (isRefreshTokenError) {
                        await handleAuthError(error);
                        router.push('/admin/login');
                        setLoading(false);
                        return;
                    }
                }

                if (!session) {
                    router.push('/admin/login');
                    setLoading(false);
                } else {
                    setUser(session.user);

                    // Kullanıcı rolünü al (user_id ve email ile)
                    const roleData = await getUserRole(session.user.id, session.user.email);
                    if (roleData) {
                        setUserRole(roleData.role);
                        setUserName(roleData.name);
                    } else {
                        // admin_users tablosunda yoksa varsayılan olarak admin yap (ilk kullanıcı için)
                        setUserRole('admin');
                        setUserName(session.user.email?.split('@')[0] || 'Admin');
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error('Auth check error:', err);
                // On any error, clear session and redirect to login
                await handleAuthError(err);
                router.push('/admin/login');
                setLoading(false);
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            try {
                if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
                    if (event === 'SIGNED_OUT') {
                        router.push('/admin/login');
                        setUser(null);
                        setUserRole(null);
                        setUserName(null);
                    } else if (event === 'TOKEN_REFRESHED' && session) {
                        // Token refreshed successfully, update user if needed
                        setUser(session.user);
                    }
                } else if (event === 'SIGNED_IN' && session) {
                    setUser(session.user);
                    const roleData = await getUserRole(session.user.id, session.user.email);
                    if (roleData) {
                        setUserRole(roleData.role);
                        setUserName(roleData.name);
                    } else {
                        // Varsayılan rol
                        setUserRole('admin');
                        setUserName(session.user.email?.split('@')[0] || 'Admin');
                    }
                }
            } catch (err) {
                console.error('Auth state change error:', err);
                // Handle refresh token errors during state change
                if (err?.message?.includes('Refresh Token') || err?.message?.includes('refresh_token')) {
                    await handleAuthError(err);
                    router.push('/admin/login');
                    setUser(null);
                    setUserRole(null);
                    setUserName(null);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [router, isLoginPage]);

    // Sayfa erişim kontrolü
    useEffect(() => {
        if (!loading && userRole && !isLoginPage) {
            if (!hasAccess(userRole, pathname)) {
                // Yetkisiz sayfaya erişim - dashboard'a yönlendir
                router.push('/admin');
            }
        }
    }, [pathname, userRole, loading, isLoginPage, router]);

    const handleLogout = async () => {
        // Prevent multiple clicks
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            // Clear all user state first
            setUser(null);
            setUserRole(null);
            setUserName(null);

            // Sign out from Supabase
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Logout error:', error);
                // Handle refresh token errors during logout
                await handleAuthError(error);
            }

            // Clear localStorage
            if (typeof window !== 'undefined') {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('sb-') || key.includes('supabase')) {
                        localStorage.removeItem(key);
                    }
                });
            }

            // Use window.location for more reliable redirect
            // This ensures the page fully reloads and clears all state
            window.location.href = '/admin/login';
        } catch (err) {
            console.error('Logout failed:', err);
            // Handle auth errors
            await handleAuthError(err);
            // Force redirect even on error
            window.location.href = '/admin/login';
        } finally {
            // This won't execute if window.location redirects, but good practice
            setLoggingOut(false);
        }
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

    // Menüyü role göre filtrele
    const visibleMenuItems = menuItems.filter(item => isMenuVisible(item.href, userRole));

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
                    {visibleMenuItems.map((item) => {
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
                                {userName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{userName || user?.email}</p>
                            <p className="text-xs text-zinc-500 capitalize">
                                {userRole === 'admin' ? '👑 Admin' : '👤 Staff'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loggingOut ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Çıkılıyor...</span>
                            </>
                        ) : (
                            <>
                                <LogOut className="w-4 h-4" />
                                <span>Çıkış Yap</span>
                            </>
                        )}
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

