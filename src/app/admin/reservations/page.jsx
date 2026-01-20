'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, Users, Phone, User, CheckCircle, XCircle,
    AlertCircle, RefreshCw, MessageSquare, TrendingUp, Filter,
    ChevronDown, Eye, Trash2
} from 'lucide-react';

const STATUS_CONFIG = {
    pending: { label: 'Bekliyor', color: 'bg-yellow-500', textColor: 'text-yellow-500', icon: AlertCircle },
    confirmed: { label: 'Onaylandı', color: 'bg-green-500', textColor: 'text-green-500', icon: CheckCircle },
    cancelled: { label: 'İptal', color: 'bg-red-500', textColor: 'text-red-500', icon: XCircle },
    completed: { label: 'Tamamlandı', color: 'bg-blue-500', textColor: 'text-blue-500', icon: CheckCircle },
    no_show: { label: 'Gelmedi', color: 'bg-zinc-500', textColor: 'text-zinc-500', icon: XCircle }
};

export default function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, today: 0 });
    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, [filter, dateFilter]);

    const fetchReservations = async () => {
        if (!supabase) return;
        setLoading(true);

        try {
            let query = supabase
                .from('reservations')
                .select('*')
                .order('date', { ascending: true })
                .order('time', { ascending: true });

            // Status filter
            if (filter !== 'all') {
                query = query.eq('status', filter);
            }

            // Date filter
            const today = new Date().toISOString().split('T')[0];
            if (dateFilter === 'today') {
                query = query.eq('date', today);
            } else if (dateFilter === 'week') {
                const weekLater = new Date();
                weekLater.setDate(weekLater.getDate() + 7);
                query = query.gte('date', today).lte('date', weekLater.toISOString().split('T')[0]);
            } else if (dateFilter === 'past') {
                query = query.lt('date', today);
            }

            const { data, error } = await query;

            if (error) throw error;
            setReservations(data || []);

            // Calculate stats
            const allData = await supabase.from('reservations').select('*');
            if (allData.data) {
                const all = allData.data;
                setStats({
                    total: all.length,
                    pending: all.filter(r => r.status === 'pending').length,
                    confirmed: all.filter(r => r.status === 'confirmed').length,
                    today: all.filter(r => r.date === today).length
                });
            }
        } catch (err) {
            console.error('Error fetching reservations:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        if (!supabase) return;
        setUpdating(true);

        try {
            const updateData = {
                status: newStatus,
                ...(newStatus === 'confirmed' && {
                    confirmed_at: new Date().toISOString(),
                    confirmed_by: 'admin'
                })
            };

            const { error } = await supabase
                .from('reservations')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;

            fetchReservations();
            setSelectedReservation(null);
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Durum güncellenirken hata oluştu');
        } finally {
            setUpdating(false);
        }
    };

    const deleteReservation = async (id) => {
        if (!supabase) return;
        if (!confirm('Bu rezervasyonu silmek istediğinize emin misiniz?')) return;

        try {
            const { error } = await supabase
                .from('reservations')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchReservations();
        } catch (err) {
            console.error('Error deleting reservation:', err);
            alert('Silme işlemi başarısız');
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const formatTime = (timeStr) => {
        return timeStr?.slice(0, 5) || '';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Rezervasyonlar</h1>
                    <p className="text-zinc-400 text-sm">Tüm rezervasyon taleplerini yönetin</p>
                </div>
                <button
                    onClick={fetchReservations}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Yenile
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    className="bg-zinc-900 border border-white/10 rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                            <p className="text-xs text-zinc-500">Toplam</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-zinc-900 border border-white/10 rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.pending}</p>
                            <p className="text-xs text-zinc-500">Bekleyen</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-zinc-900 border border-white/10 rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.confirmed}</p>
                            <p className="text-xs text-zinc-500">Onaylı</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-zinc-900 border border-white/10 rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#d4af37]/20 rounded-lg">
                            <Calendar className="w-5 h-5 text-[#d4af37]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.today}</p>
                            <p className="text-xs text-zinc-500">Bugün</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-lg p-1">
                    {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-[#d4af37] text-black'
                                    : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            {status === 'all' ? 'Tümü' : STATUS_CONFIG[status]?.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-lg p-1">
                    {[
                        { key: 'all', label: 'Tüm Tarihler' },
                        { key: 'today', label: 'Bugün' },
                        { key: 'week', label: 'Bu Hafta' },
                        { key: 'past', label: 'Geçmiş' }
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setDateFilter(key)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${dateFilter === key
                                    ? 'bg-zinc-700 text-white'
                                    : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reservations List */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-zinc-500 animate-spin" />
                    </div>
                ) : reservations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <Calendar className="w-12 h-12 mb-4 opacity-50" />
                        <p>Rezervasyon bulunamadı</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {reservations.map((reservation) => {
                            const statusConfig = STATUS_CONFIG[reservation.status] || STATUS_CONFIG.pending;
                            const StatusIcon = statusConfig.icon;

                            return (
                                <motion.div
                                    key={reservation.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-4 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Date & Time */}
                                        <div className="flex items-center gap-3 lg:w-40">
                                            <div className="p-2 bg-zinc-800 rounded-lg">
                                                <Calendar className="w-5 h-5 text-[#d4af37]" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{formatDate(reservation.date)}</p>
                                                <p className="text-zinc-500 text-sm">{formatTime(reservation.time)}</p>
                                            </div>
                                        </div>

                                        {/* Customer Info */}
                                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-zinc-500" />
                                                <span className="text-white">{reservation.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-zinc-500" />
                                                <a href={`tel:${reservation.phone}`} className="text-zinc-300 hover:text-[#d4af37]">
                                                    {reservation.phone}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-zinc-500" />
                                                <span className="text-zinc-300">{reservation.guests} kişi</span>
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex items-center gap-3">
                                            {/* SMS Status */}
                                            <div className={`p-1.5 rounded-lg ${reservation.sms_sent ? 'bg-green-500/20' : 'bg-zinc-800'}`}>
                                                <MessageSquare className={`w-4 h-4 ${reservation.sms_sent ? 'text-green-500' : 'text-zinc-600'}`} />
                                            </div>

                                            {/* Status Badge */}
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}/20 ${statusConfig.textColor}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig.label}
                                            </span>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setSelectedReservation(reservation)}
                                                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                                    title="Detaylar"
                                                >
                                                    <Eye className="w-4 h-4 text-zinc-400" />
                                                </button>
                                                <button
                                                    onClick={() => deleteReservation(reservation.id)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {reservation.notes && (
                                        <div className="mt-3 pl-14 lg:pl-[11.5rem]">
                                            <p className="text-sm text-zinc-500 italic">"{reservation.notes}"</p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedReservation && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto"
                    >
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white">Rezervasyon Detayı</h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase mb-1">Müşteri</p>
                                    <p className="text-white font-medium">{selectedReservation.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase mb-1">Telefon</p>
                                    <a href={`tel:${selectedReservation.phone}`} className="text-[#d4af37] font-medium">
                                        {selectedReservation.phone}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase mb-1">Tarih</p>
                                    <p className="text-white">{formatDate(selectedReservation.date)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase mb-1">Saat</p>
                                    <p className="text-white">{formatTime(selectedReservation.time)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase mb-1">Kişi Sayısı</p>
                                    <p className="text-white">{selectedReservation.guests}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase mb-1">SMS</p>
                                    <p className={selectedReservation.sms_sent ? 'text-green-500' : 'text-red-500'}>
                                        {selectedReservation.sms_sent ? 'Gönderildi' : 'Gönderilemedi'}
                                    </p>
                                </div>
                            </div>

                            {selectedReservation.notes && (
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase mb-1">Notlar</p>
                                    <p className="text-zinc-300">{selectedReservation.notes}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-xs text-zinc-500 uppercase mb-2">Durum Değiştir</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                        <button
                                            key={key}
                                            onClick={() => updateStatus(selectedReservation.id, key)}
                                            disabled={updating || selectedReservation.status === key}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${selectedReservation.status === key
                                                    ? `${config.color} text-white`
                                                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                                }`}
                                        >
                                            {config.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="text-xs text-zinc-600 mt-4">
                                <p>Oluşturulma: {new Date(selectedReservation.created_at).toLocaleString('tr-TR')}</p>
                                {selectedReservation.confirmed_at && (
                                    <p>Onaylanma: {new Date(selectedReservation.confirmed_at).toLocaleString('tr-TR')}</p>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 flex justify-end">
                            <button
                                onClick={() => setSelectedReservation(null)}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                            >
                                Kapat
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
