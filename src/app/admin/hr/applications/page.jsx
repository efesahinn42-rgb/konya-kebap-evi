'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserRole } from '@/lib/auth';
import { FileText, Mail, Phone, User, Calendar, Eye, Check, X, MessageSquare, Download, Zap } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

const statusColors = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Beklemede' },
    reviewed: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'İncelendi' },
    contacted: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'İletişime Geçildi' },
    rejected: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Reddedildi' }
};

export default function ApplicationsManagement() {
    const { success, error: showError, ToastContainer } = useToast();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('admin');
    const [selectedApp, setSelectedApp] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showPriority, setShowPriority] = useState(false);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const roleData = await getUserRole(session.user.id, session.user.email);
                if (roleData) {
                    setUserRole(roleData.role);
                    // Staff için öncelikli görünümü varsayılan aç
                    if (roleData.role === 'staff') {
                        setShowPriority(true);
                    }
                }
            }
        };
        init();
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        const { data, error } = await supabase
            .from('job_applications')
            .select(`
                *,
                job_positions (title)
            `)
            .order('created_at', { ascending: false });

        if (!error) setApplications(data || []);
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('job_applications')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            await fetchApplications();

            if (selectedApp?.id === id) {
                setSelectedApp({ ...selectedApp, status: newStatus });
            }
            success(`Başvuru durumu "${statusColors[newStatus]?.label}" olarak güncellendi`);
        } catch (err) {
            console.error('Error updating status:', err);
            showError('Durum güncellenirken bir hata oluştu');
        }
    };

    const quickUpdateStatus = async (id, newStatus) => {
        await updateStatus(id, newStatus);
    };

    const filteredApplications = (() => {
        let filtered = filterStatus === 'all'
            ? applications
            : applications.filter(app => app.status === filterStatus);
        
        // Staff için öncelikli görünüm: pending başvuruları önce göster
        if (userRole === 'staff' && showPriority) {
            filtered = [...filtered].sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return new Date(b.created_at) - new Date(a.created_at);
            });
        }
        
        return filtered;
    })();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const pendingCount = applications.filter(a => a.status === 'pending').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">İş Başvuruları</h1>
                    <p className="text-zinc-400">
                        Toplam {applications.length} başvuru
                        {pendingCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">
                                {pendingCount} yeni
                            </span>
                        )}
                    </p>
                </div>
                {userRole === 'staff' && (
                    <button
                        onClick={() => setShowPriority(!showPriority)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            showPriority
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Zap className="w-4 h-4" />
                        {showPriority ? 'Öncelikli Görünüm: Açık' : 'Öncelikli Görünüm: Kapalı'}
                    </button>
                )}
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filterStatus === 'all' ? 'bg-[#d4af37] text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                >
                    Tümü ({applications.length})
                </button>
                {Object.entries(statusColors).map(([status, config]) => {
                    const count = applications.filter(a => a.status === status).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filterStatus === status
                                    ? `${config.bg} ${config.text}`
                                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                        >
                            {config.label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Applications List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-zinc-900 rounded-2xl h-24 animate-pulse" />
                    ))}
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <FileText className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                        {filterStatus === 'all' ? 'Henüz başvuru yok' : 'Bu filtreye uygun başvuru yok'}
                    </h3>
                    <p className="text-zinc-400">
                        {filterStatus === 'all'
                            ? 'Başvurular burada görüntülenecek'
                            : 'Farklı bir filtre deneyin'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredApplications.map((app) => {
                        const status = statusColors[app.status] || statusColors.pending;

                        return (
                            <div
                                key={app.id}
                                className={`bg-zinc-900 border rounded-2xl p-6 transition-all ${
                                    app.status === 'pending' && showPriority
                                        ? 'border-yellow-500/30 bg-yellow-500/5'
                                        : 'border-zinc-800 hover:border-zinc-700'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div 
                                        className="flex-1 cursor-pointer"
                                        onClick={() => setSelectedApp(app)}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-white">{app.full_name}</h3>
                                            <span className={`px-2 py-1 ${status.bg} ${status.text} text-xs font-bold rounded`}>
                                                {status.label}
                                            </span>
                                            {app.status === 'pending' && showPriority && (
                                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full flex items-center gap-1">
                                                    <Zap className="w-3 h-3" />
                                                    Öncelikli
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm">
                                            <span className="flex items-center gap-1">
                                                <FileText className="w-4 h-4" />
                                                {app.job_positions?.title || app.position_title || 'Genel Başvuru'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {app.email}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(app.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Quick Actions for Staff */}
                                        {userRole === 'staff' && app.status === 'pending' && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        quickUpdateStatus(app.id, 'reviewed');
                                                    }}
                                                    className="px-2 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs font-medium transition-colors"
                                                    title="Hızlı İncele"
                                                >
                                                    İncele
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        quickUpdateStatus(app.id, 'contacted');
                                                    }}
                                                    className="px-2 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-xs font-medium transition-colors"
                                                    title="Hızlı İletişim"
                                                >
                                                    İletişim
                                                </button>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setSelectedApp(app)}
                                            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-5 h-5 text-zinc-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl my-8">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <div>
                                <h2 className="text-xl font-bold text-white">{selectedApp.full_name}</h2>
                                <p className="text-zinc-400 text-sm">
                                    {selectedApp.job_positions?.title || selectedApp.position_title || 'Genel Başvuru'}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Contact Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-zinc-800/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                                        <Mail className="w-4 h-4" />
                                        E-posta
                                    </div>
                                    <a href={`mailto:${selectedApp.email}`} className="text-white hover:text-[#d4af37]">
                                        {selectedApp.email}
                                    </a>
                                </div>
                                <div className="bg-zinc-800/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                                        <Phone className="w-4 h-4" />
                                        Telefon
                                    </div>
                                    <a href={`tel:${selectedApp.phone}`} className="text-white hover:text-[#d4af37]">
                                        {selectedApp.phone}
                                    </a>
                                </div>
                            </div>

                            {/* Message */}
                            {selectedApp.message && (
                                <div className="bg-zinc-800/50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Mesaj
                                    </div>
                                    <p className="text-white whitespace-pre-wrap">{selectedApp.message}</p>
                                </div>
                            )}

                            {/* CV Link */}
                            {selectedApp.cv_url && (
                                <div className="bg-zinc-800/50 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <FileText className="w-4 h-4" />
                                            CV Dosyası
                                        </div>
                                        <a
                                            href={selectedApp.cv_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#e5c349] transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            İndir
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Date */}
                            <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                <Calendar className="w-4 h-4" />
                                Başvuru Tarihi: {formatDate(selectedApp.created_at)}
                            </div>

                            {/* Status Update */}
                            <div>
                                <p className="text-zinc-400 text-sm mb-3">Durum Güncelle:</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(statusColors).map(([status, config]) => (
                                        <button
                                            key={status}
                                            onClick={() => updateStatus(selectedApp.id, status)}
                                            className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedApp.status === status
                                                    ? `${config.bg} ${config.text} ring-2 ring-offset-2 ring-offset-zinc-900`
                                                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                                }`}
                                            style={{
                                                ringColor: selectedApp.status === status ? config.text.replace('text-', '') : undefined
                                            }}
                                        >
                                            {config.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                            <a
                                href={`mailto:${selectedApp.email}`}
                                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4" />
                                E-posta Gönder
                            </a>
                            <a
                                href={`tel:${selectedApp.phone}`}
                                className="px-6 py-2.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#e5c349] transition-colors flex items-center gap-2"
                            >
                                <Phone className="w-4 h-4" />
                                Ara
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
}
