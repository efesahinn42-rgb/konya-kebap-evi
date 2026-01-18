'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Award, Trophy, Star, Medal, Save, X, Edit2 } from 'lucide-react';

const iconOptions = [
    { value: 'trophy', label: 'Kupa', Icon: Trophy },
    { value: 'award', label: 'Ödül', Icon: Award },
    { value: 'star', label: 'Yıldız', Icon: Star },
    { value: 'medal', label: 'Madalya', Icon: Medal },
];

const getIcon = (iconName) => {
    const found = iconOptions.find(i => i.value === iconName);
    return found ? found.Icon : Trophy;
};

export default function AwardsManagement() {
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingAward, setEditingAward] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        year: '',
        organization: '',
        description: '',
        icon: 'trophy'
    });

    useEffect(() => {
        fetchAwards();
    }, []);

    const fetchAwards = async () => {
        const { data, error } = await supabase
            .from('awards')
            .select('*')
            .order('display_order', { ascending: true });

        if (!error) setAwards(data || []);
        setLoading(false);
    };

    const openModal = (award = null) => {
        if (award) {
            setEditingAward(award);
            setFormData({
                title: award.title,
                year: award.year,
                organization: award.organization,
                description: award.description || '',
                icon: award.icon || 'trophy'
            });
        } else {
            setEditingAward(null);
            setFormData({ title: '', year: '', organization: '', description: '', icon: 'trophy' });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.year || !formData.organization) {
            alert('Lütfen zorunlu alanları doldurun');
            return;
        }

        setSaving(true);
        try {
            if (editingAward) {
                const { error } = await supabase
                    .from('awards')
                    .update(formData)
                    .eq('id', editingAward.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('awards')
                    .insert({
                        ...formData,
                        display_order: awards.length,
                        is_active: true
                    });
                if (error) throw error;
            }
            await fetchAwards();
            setShowModal(false);
        } catch (err) {
            console.error('Error saving award:', err);
            alert('Ödül kaydedilirken bir hata oluştu');
        }
        setSaving(false);
    };

    const handleDelete = async (award) => {
        if (!confirm('Bu ödülü silmek istediğinize emin misiniz?')) return;

        try {
            const { error } = await supabase
                .from('awards')
                .delete()
                .eq('id', award.id);
            if (error) throw error;
            await fetchAwards();
        } catch (err) {
            console.error('Error deleting award:', err);
            alert('Ödül silinirken bir hata oluştu');
        }
    };

    const handleToggleActive = async (award) => {
        try {
            const { error } = await supabase
                .from('awards')
                .update({ is_active: !award.is_active })
                .eq('id', award.id);
            if (error) throw error;
            await fetchAwards();
        } catch (err) {
            console.error('Error updating award:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Ödüllerimiz</h1>
                    <p className="text-zinc-400">Ödül ve başarılarınızı yönetin</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8962e] hover:from-[#e5c349] hover:to-[#d4af37] text-black font-bold rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Ödül Ekle
                </button>
            </div>

            {/* Awards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-zinc-900 rounded-2xl h-48 animate-pulse" />
                    ))}
                </div>
            ) : awards.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <Trophy className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Henüz ödül yok</h3>
                    <p className="text-zinc-400 mb-6">Ödül ekleyerek başlayın</p>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl"
                    >
                        <Plus className="w-5 h-5" />
                        İlk Ödülü Ekle
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {awards.map((award) => {
                        const IconComponent = getIcon(award.icon);

                        return (
                            <div
                                key={award.id}
                                className={`group relative bg-zinc-900 border rounded-2xl p-6 transition-all ${award.is_active ? 'border-zinc-800' : 'border-red-500/30 opacity-60'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <IconComponent className="w-7 h-7 text-black" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{award.title}</h3>
                                                <p className="text-[#d4af37] font-medium">{award.year}</p>
                                            </div>
                                            {!award.is_active && (
                                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                                    Pasif
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-zinc-400 text-sm mt-1">{award.organization}</p>
                                        {award.description && (
                                            <p className="text-zinc-500 text-sm mt-2 line-clamp-2">{award.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(award)}
                                        className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(award)}
                                        className={`p-2 rounded-lg transition-colors ${award.is_active
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                    >
                                        {award.is_active ? '✓' : '○'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(award)}
                                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">
                                {editingAward ? 'Ödül Düzenle' : 'Yeni Ödül Ekle'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Icon Selection */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    İkon
                                </label>
                                <div className="flex gap-2">
                                    {iconOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setFormData({ ...formData, icon: opt.value })}
                                            className={`p-3 rounded-xl transition-all ${formData.icon === opt.value
                                                    ? 'bg-[#d4af37] text-black'
                                                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                                }`}
                                        >
                                            <opt.Icon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Ödül Adı *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Yılın En İyi Kebapçısı"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Yıl *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        placeholder="2024"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Kuruluş *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                        placeholder="Gastronomi Derneği"
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
                                    placeholder="Ödül hakkında kısa açıklama..."
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
