'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Users, Save, X, Edit2, MapPin, Briefcase } from 'lucide-react';

export default function PositionsManagement() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Tam Zamanlı',
        location: 'İstanbul',
        description: ''
    });

    useEffect(() => {
        fetchPositions();
    }, []);

    const fetchPositions = async () => {
        const { data, error } = await supabase
            .from('job_positions')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setPositions(data || []);
        setLoading(false);
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                type: item.type,
                location: item.location,
                description: item.description || ''
            });
        } else {
            setEditingItem(null);
            setFormData({ title: '', type: 'Tam Zamanlı', location: 'İstanbul', description: '' });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.title) {
            alert('Lütfen pozisyon adı girin');
            return;
        }

        setSaving(true);
        try {
            if (editingItem) {
                const { error } = await supabase
                    .from('job_positions')
                    .update(formData)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('job_positions')
                    .insert({ ...formData, is_active: true });
                if (error) throw error;
            }
            await fetchPositions();
            setShowModal(false);
        } catch (err) {
            console.error('Error saving position:', err);
            alert('Kaydetme sırasında bir hata oluştu');
        }
        setSaving(false);
    };

    const handleDelete = async (item) => {
        if (!confirm('Bu pozisyonu silmek istediğinize emin misiniz?')) return;
        try {
            const { error } = await supabase.from('job_positions').delete().eq('id', item.id);
            if (error) throw error;
            await fetchPositions();
        } catch (err) {
            console.error('Error deleting position:', err);
        }
    };

    const handleToggleActive = async (item) => {
        try {
            const { error } = await supabase
                .from('job_positions')
                .update({ is_active: !item.is_active })
                .eq('id', item.id);
            if (error) throw error;
            await fetchPositions();
        } catch (err) {
            console.error('Error updating position:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Açık Pozisyonlar</h1>
                    <p className="text-zinc-400">İş ilanlarını yönetin</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8962e] hover:from-[#e5c349] hover:to-[#d4af37] text-black font-bold rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Pozisyon Ekle
                </button>
            </div>

            {/* Positions List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-zinc-900 rounded-2xl h-24 animate-pulse" />
                    ))}
                </div>
            ) : positions.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <Users className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Henüz pozisyon yok</h3>
                    <p className="text-zinc-400 mb-6">İş ilanı ekleyerek başlayın</p>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl"
                    >
                        <Plus className="w-5 h-5" />
                        İlk Pozisyonu Ekle
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {positions.map((position) => (
                        <div
                            key={position.id}
                            className={`group bg-zinc-900 border rounded-2xl p-6 transition-all ${position.is_active ? 'border-zinc-800' : 'border-red-500/30 opacity-60'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-white">{position.title}</h3>
                                        {!position.is_active && (
                                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                                Pasif
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-zinc-400 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="w-4 h-4" />
                                            {position.type}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {position.location}
                                        </span>
                                    </div>
                                    {position.description && (
                                        <p className="text-zinc-500 text-sm mt-2 line-clamp-1">{position.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(position)}
                                        className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(position)}
                                        className={`p-2 rounded-lg transition-colors ${position.is_active
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                    >
                                        {position.is_active ? '✓' : '○'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(position)}
                                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">
                                {editingItem ? 'Pozisyon Düzenle' : 'Yeni Pozisyon Ekle'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Pozisyon Adı *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Kebap Ustası"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Çalışma Şekli
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                                    >
                                        <option value="Tam Zamanlı">Tam Zamanlı</option>
                                        <option value="Yarı Zamanlı">Yarı Zamanlı</option>
                                        <option value="Stajyer">Stajyer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Lokasyon
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="İstanbul"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Açıklama
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Pozisyon hakkında kısa açıklama..."
                                    rows={3}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37] resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#e5c349] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? 'Kaydediliyor...' : <><Save className="w-4 h-4" /> Kaydet</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
