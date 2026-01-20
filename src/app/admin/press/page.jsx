'use client';
import { useEffect, useState } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { Plus, Trash2, Newspaper, Save, X, Edit2, Upload, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { validateDate } from '@/lib/validations';

export default function PressManagement() {
    const { success, error: showError, ToastContainer } = useToast();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [uploadType, setUploadType] = useState('url');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [dateError, setDateError] = useState('');
    const [formData, setFormData] = useState({
        outlet: '',
        title: '',
        date: '',
        quote: '',
        image_url: '',
        external_url: '',
        color: '#d4af37'
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const { data, error } = await supabase
            .from('press_items')
            .select('*')
            .order('display_order', { ascending: true });

        if (!error) setItems(data || []);
        setLoading(false);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                outlet: item.outlet,
                title: item.title,
                date: item.date,
                quote: item.quote || '',
                image_url: item.image_url,
                external_url: item.external_url || '',
                color: item.color || '#d4af37'
            });
            setPreviewUrl(item.image_url);
        } else {
            setEditingItem(null);
            resetForm();
        }
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ outlet: '', title: '', date: '', quote: '', image_url: '', external_url: '', color: '#d4af37' });
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleSave = async () => {
        // Validate date
        if (formData.date && !validateDate(formData.date)) {
            setDateError('Geçerli bir tarih girin');
            return;
        }
        setDateError('');

        if (!formData.outlet || !formData.title || !formData.date) {
            showError('Lütfen zorunlu alanları doldurun');
            return;
        }

        setSaving(true);
        try {
            let imageUrl = formData.image_url;

            if (uploadType === 'file' && selectedFile) {
                const fileName = `press-${Date.now()}-${selectedFile.name}`;
                imageUrl = await uploadFile('press', fileName, selectedFile);
            }

            if (!imageUrl) {
                alert('Lütfen bir görsel ekleyin');
                setSaving(false);
                return;
            }

            const saveData = { ...formData, image_url: imageUrl };

            if (editingItem) {
                const { error } = await supabase
                    .from('press_items')
                    .update(saveData)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('press_items')
                    .insert({
                        ...saveData,
                        display_order: items.length,
                        is_active: true
                    });
                if (error) throw error;
            }
            await fetchItems();
            setShowModal(false);
            resetForm();
            success(editingItem ? 'İçerik güncellendi' : 'İçerik eklendi');
        } catch (err) {
            console.error('Error saving item:', err);
            showError('Kaydetme sırasında bir hata oluştu');
        }
        setSaving(false);
    };

    const handleDelete = async (item) => {
        setDeleteConfirm(item);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            const { error } = await supabase
                .from('press_items')
                .delete()
                .eq('id', deleteConfirm.id);

            if (error) throw error;
            await fetchItems();
            success('İçerik başarıyla silindi');
        } catch (err) {
            console.error('Error deleting item:', err);
            showError('Silme işlemi başarısız');
        } finally {
            setDeleteConfirm(null);
        }
    };

    const handleToggleActive = async (item) => {
        try {
            const { error } = await supabase
                .from('press_items')
                .update({ is_active: !item.is_active })
                .eq('id', item.id);
            if (error) throw error;
            await fetchItems();
        } catch (err) {
            console.error('Error updating item:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Basında Biz</h1>
                    <p className="text-zinc-400">Basın ve medya içeriklerini yönetin</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8962e] hover:from-[#e5c349] hover:to-[#d4af37] text-black font-bold rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Yeni İçerik Ekle
                </button>
            </div>

            {/* Press Items Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-zinc-900 rounded-2xl h-64 animate-pulse" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <Newspaper className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Henüz içerik yok</h3>
                    <p className="text-zinc-400 mb-6">Basın içeriği ekleyerek başlayın</p>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl"
                    >
                        <Plus className="w-5 h-5" />
                        İlk İçeriği Ekle
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`group relative bg-zinc-900 border rounded-2xl overflow-hidden transition-all ${item.is_active ? 'border-zinc-800' : 'border-red-500/30 opacity-60'
                                }`}
                        >
                            {/* Image */}
                            <div className="aspect-video relative">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                                {/* Outlet Badge */}
                                <div
                                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold"
                                    style={{ backgroundColor: item.color }}
                                >
                                    {item.outlet}
                                </div>

                                {!item.is_active && (
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                            Pasif
                                        </span>
                                    </div>
                                )}

                                {/* Title on Image */}
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                                    <p className="text-zinc-300 text-sm">{item.date}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {item.quote && (
                                    <p className="text-zinc-400 text-sm italic line-clamp-2">"{item.quote}"</p>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
                                    {item.external_url && (
                                        <a
                                            href={item.external_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#d4af37] text-sm flex items-center gap-1 hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Habere Git
                                        </a>
                                    )}
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button
                                            onClick={() => openModal(item)}
                                            className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(item)}
                                            className={`p-2 rounded-lg transition-colors ${item.is_active
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-zinc-800 text-zinc-400'
                                                }`}
                                        >
                                            {item.is_active ? '✓' : '○'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg my-8">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">
                                {editingItem ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
                            </h2>
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Yayın Kuruluşu *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.outlet}
                                        onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                                        placeholder="TRT Haber"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Renk
                                    </label>
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full h-12 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Başlık *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Konya'nın Lezzet Elçisi"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Tarih *
                                </label>
                                <input
                                    type="text"
                                    value={formData.date}
                                    onChange={(e) => {
                                        setFormData({ ...formData, date: e.target.value });
                                        setDateError('');
                                    }}
                                    onBlur={() => {
                                        if (formData.date && !validateDate(formData.date)) {
                                            setDateError('Geçerli bir tarih formatı girin (örn: Ocak 2024)');
                                        } else {
                                            setDateError('');
                                        }
                                    }}
                                    placeholder="Ocak 2024"
                                    className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none ${
                                        dateError ? 'border-red-500' : 'border-zinc-700 focus:border-[#d4af37]'
                                    }`}
                                />
                                {dateError && (
                                    <p className="text-red-400 text-xs mt-1">{dateError}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Alıntı
                                </label>
                                <textarea
                                    value={formData.quote}
                                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                    placeholder="Haberden bir alıntı..."
                                    rows={2}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37] resize-none"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Görsel *
                                </label>
                                <div className="flex bg-zinc-800 p-1 rounded-xl mb-2">
                                    <button
                                        onClick={() => setUploadType('url')}
                                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${uploadType === 'url' ? 'bg-[#d4af37] text-black' : 'text-zinc-400'
                                            }`}
                                    >
                                        URL
                                    </button>
                                    <button
                                        onClick={() => setUploadType('file')}
                                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${uploadType === 'file' ? 'bg-[#d4af37] text-black' : 'text-zinc-400'
                                            }`}
                                    >
                                        Dosya
                                    </button>
                                </div>

                                {uploadType === 'url' ? (
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => { setFormData({ ...formData, image_url: e.target.value }); setPreviewUrl(e.target.value); }}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                    />
                                ) : (
                                    <>
                                        <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="press-upload" />
                                        <label htmlFor="press-upload" className="flex flex-col items-center justify-center w-full h-32 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-[#d4af37]">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="h-full object-contain rounded-xl" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-zinc-500 mb-1" />
                                                    <span className="text-zinc-400 text-sm">Dosya seç</span>
                                                </>
                                            )}
                                        </label>
                                    </>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Haber Linki (Opsiyonel)
                                </label>
                                <input
                                    type="url"
                                    value={formData.external_url}
                                    onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                                    placeholder="https://habersitesi.com/haber"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
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

            {/* Toast Container */}
            <ToastContainer />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={confirmDelete}
                title="İçeriği Sil"
                message={`"${deleteConfirm?.title}" adlı basın içeriğini silmek istediğinize emin misiniz?`}
                confirmText="Evet, Sil"
                cancelText="İptal"
                type="danger"
            />
        </div>
    );
}
