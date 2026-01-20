'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserRole } from '@/lib/auth';
import {
    Image as ImageIcon,
    Video,
    Images,
    Award,
    Newspaper,
    Heart,
    Users,
    FileText,
    TrendingUp,
    Eye,
    CalendarCheck,
    Clock
} from 'lucide-react';
import Link from 'next/link';

// Tüm dashboard kartları
const allDashboardCards = [
    { name: 'Hero Slider', href: '/admin/slider', icon: ImageIcon, color: 'from-blue-500 to-blue-600', table: 'hero_slides', roles: ['admin'] },
    { name: 'Ocakbaşı Videoları', href: '/admin/videos', icon: Video, color: 'from-purple-500 to-purple-600', table: 'ocakbasi_videos', roles: ['admin'] },
    { name: 'Galeri', href: '/admin/gallery', icon: Images, color: 'from-green-500 to-green-600', table: 'gallery_items', roles: ['admin'] },
    { name: 'Ödüllerimiz', href: '/admin/awards', icon: Award, color: 'from-yellow-500 to-yellow-600', table: 'awards', roles: ['admin'] },
    { name: 'Basında Biz', href: '/admin/press', icon: Newspaper, color: 'from-red-500 to-red-600', table: 'press_items', roles: ['admin'] },
    { name: 'Sosyal Sorumluluk', href: '/admin/social', icon: Heart, color: 'from-pink-500 to-pink-600', table: 'social_projects', roles: ['admin'] },
    { name: 'Rezervasyonlar', href: '/admin/reservations', icon: CalendarCheck, color: 'from-emerald-500 to-emerald-600', table: 'reservations', roles: ['admin', 'staff'] },
    { name: 'Açık Pozisyonlar', href: '/admin/hr/positions', icon: Users, color: 'from-cyan-500 to-cyan-600', table: 'job_positions', roles: ['admin'] },
    { name: 'İş Başvuruları', href: '/admin/hr/applications', icon: FileText, color: 'from-orange-500 to-orange-600', table: 'job_applications', roles: ['admin', 'staff'] },
];

// Hızlı erişim linkleri
const allQuickLinks = [
    { name: 'Siteyi Görüntüle', href: '/', icon: Eye, target: '_blank', roles: ['admin', 'staff'] },
    { name: 'Slider Düzenle', href: '/admin/slider', icon: ImageIcon, roles: ['admin'] },
    { name: 'Galeri Ekle', href: '/admin/gallery', icon: Images, roles: ['admin'] },
    { name: 'Rezervasyonlar', href: '/admin/reservations', icon: CalendarCheck, roles: ['admin', 'staff'] },
    { name: 'Başvuruları Gör', href: '/admin/hr/applications', icon: FileText, roles: ['admin', 'staff'] },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('admin');
    const [recentReservations, setRecentReservations] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);

    useEffect(() => {
        const init = async () => {
            let roleData = null; // Erişilebilir hale getir
            
            // Kullanıcı rolünü al
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                roleData = await getUserRole(session.user.id, session.user.email);
                if (roleData) {
                    setUserRole(roleData.role);
                }
            }

            // İstatistikleri çek
            const statsData = {};
            for (const card of allDashboardCards) {
                try {
                    const { count, error } = await supabase
                        .from(card.table)
                        .select('*', { count: 'exact', head: true });

                    if (!error) {
                        statsData[card.table] = count || 0;
                    } else {
                        statsData[card.table] = 0;
                    }
                } catch (err) {
                    statsData[card.table] = 0;
                }
            }

            setStats(statsData);

            // Son aktiviteler (Staff için)
            if (roleData?.role === 'staff' || userRole === 'staff') {
                // Son rezervasyonlar
                const { data: reservations } = await supabase
                    .from('reservations')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);
                setRecentReservations(reservations || []);

                // Son başvurular
                const { data: applications } = await supabase
                    .from('job_applications')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);
                setRecentApplications(applications || []);
            }

            setLoading(false);
        };

        init();
    }, []);

    // Role göre kartları filtrele
    const dashboardCards = allDashboardCards.filter(card => card.roles.includes(userRole));
    const quickLinks = allQuickLinks.filter(link => link.roles.includes(userRole));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Dashboard</h1>
                <p className="text-zinc-400">Konya Kebap Evi içerik yönetim paneline hoş geldiniz.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardCards.map((card) => {
                    const Icon = card.icon;
                    const count = stats[card.table] ?? '-';

                    return (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all overflow-hidden"
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold text-white mb-1">{card.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-black text-white">
                                    {loading ? (
                                        <span className="inline-block w-8 h-8 bg-zinc-800 rounded animate-pulse" />
                                    ) : count}
                                </span>
                                <span className="text-zinc-500 text-sm">kayıt</span>
                            </div>

                            {/* Arrow */}
                            <div className="absolute bottom-6 right-6 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Hızlı Erişim</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                target={link.target || '_self'}
                                className="flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
                            >
                                <Icon className="w-5 h-5 text-[#d4af37]" />
                                <span className="text-white">{link.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Activities for Staff */}
            {userRole === 'staff' && (recentReservations.length > 0 || recentApplications.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Reservations */}
                    {recentReservations.length > 0 && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CalendarCheck className="w-5 h-5 text-[#d4af37]" />
                                <h2 className="text-xl font-bold text-white">Son Rezervasyonlar</h2>
                            </div>
                            <div className="space-y-3">
                                {recentReservations.map((res) => (
                                    <Link
                                        key={res.id}
                                        href="/admin/reservations"
                                        className="block p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">{res.name}</p>
                                                <p className="text-zinc-400 text-sm">{res.date} - {res.time}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                                <Clock className="w-3 h-3" />
                                                {new Date(res.created_at).toLocaleDateString('tr-TR')}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Applications */}
                    {recentApplications.length > 0 && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-[#d4af37]" />
                                <h2 className="text-xl font-bold text-white">Son Başvurular</h2>
                            </div>
                            <div className="space-y-3">
                                {recentApplications.map((app) => (
                                    <Link
                                        key={app.id}
                                        href="/admin/hr/applications"
                                        className="block p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">{app.full_name}</p>
                                                <p className="text-zinc-400 text-sm">{app.position_title || 'Genel Başvuru'}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                                <Clock className="w-3 h-3" />
                                                {new Date(app.created_at).toLocaleDateString('tr-TR')}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#b8962e]/10 border border-[#d4af37]/30 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#d4af37] rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Hoş Geldiniz!</h3>
                        <p className="text-zinc-400 text-sm">
                            {userRole === 'staff'
                                ? 'Bu panel üzerinden rezervasyonları ve iş başvurularını yönetebilirsiniz.'
                                : 'Bu panel üzerinden web sitenizin içeriklerini kolayca yönetebilirsiniz. Sol menüden ilgili bölüme tıklayarak fotoğraf, video ve içerik ekleyebilir veya silebilirsiniz.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

