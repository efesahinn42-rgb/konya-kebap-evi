'use client';
import { useEffect, useState } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { Plus, Trash2, Images, Save, X, Upload, Link as LinkIcon, Filter } from 'lucide-react';

export default function GalleryManagement() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [uploadType, setUploadType] = useState('url');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [newItem, setNewItem] = useState({
        category: 'misafir',
        image_url: '',
        alt_text: ''
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const { data, error } = await supabase
            .from('gallery_items')
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

    const handleAddItem = async () => {
        setSaving(true);
        try {
            let imageUrl = newItem.image_url;

            if (uploadType === 'file' && selectedFile) {
                const fileName = `gallery-${Date.now()}-${selectedFile.name}`;
                imageUrl = await uploadFile('gallery', fileName, selectedFile);
            }

            if (!imageUrl) {
                alert('Lütfen bir görsel URL\'si girin veya dosya yükleyin');
                setSaving(false);
                return;
            }

            const { error } = await supabase
                .from('gallery_items')
                .insert({
                    category: newItem.category,
                    image_url: imageUrl,
                    alt_text: newItem.alt_text || (newItem.category === 'misafir' ? 'Misafirlerimiz' : 'İmza Lezzet'),
                    display_order: items.length,
                    is_active: true
                });

            if (error) throw error;
            await fetchItems();
            setShowModal(false);
            resetForm();
        } catch (err) {
            console.error('Error adding item:', err);
            alert('Görsel eklenirken bir hata oluştu');
        }
        setSaving(false);
    };

    const resetForm = () => {
        setNewItem({ category: 'misafir', image_url: '', alt_text: '' });
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleDeleteItem = async (item) => {
        if (!confirm('Bu görseli silmek istediğinize emin misiniz?')) return;

        try {
            const { error } = await supabase
                .from('gallery_items')
                .delete()
                .eq('id', item.id);

            if (error) throw error;
            await fetchItems();
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Görsel silinirken bir hata oluştu');
        }
    };

    const handleToggleActive = async (item) => {
        try {
            const { error } = await supabase
                .from('gallery_items')
                .update({ is_active: !item.is_active })
                .eq('id', item.id);

            if (error) throw error;
            await fetchItems();
        } catch (err) {
            console.error('Error updating item:', err);
        }
    };

    const filteredItems = activeCategory === 'all'
        ? items
        : items.filter(item => item.category === activeCategory);

    const misafirCount = items.filter(i => i.category === 'misafir').length;
    const imzaCount = items.filter(i => i.category === 'imza').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Galeri</h1>
                    <p className="text-zinc-400">Misafirlerimiz ve İmza Lezzetleri görsellerini yönetin</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8962e] hover:from-[#e5c349] hover:to-[#d4af37] text-black font-bold rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Görsel Ekle
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${activeCategory === 'all'
                            ? 'bg-[#d4af37] text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                >
                    Tümü ({items.length})
                </button>
                <button
                    onClick={() => setActiveCategory('misafir')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${activeCategory === 'misafir'
                            ? 'bg-blue-500 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                >
                    Misafirlerimiz ({misafirCount})
                </button>
                <button
                    onClick={() => setActiveCategory('imza')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${activeCategory === 'imza'
                            ? 'bg-green-500 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                >
                    İmza Lezzetleri ({imzaCount})
                </button>
            </div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-zinc-900 rounded-xl aspect-square animate-pulse" />
                    ))}
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <Images className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                        {activeCategory === 'all' ? 'Henüz görsel yok' : `Bu kategoride görsel yok`}
                    </h3>
                    <p className="text-zinc-400 mb-6">Galeri'ye görsel ekleyerek başlayın</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl"
                    >
                        <Plus className="w-5 h-5" />
                        Görsel Ekle
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className={`group relative bg-zinc-900 border rounded-xl overflow-hidden transition-all ${item.is_active ? 'border-zinc-800' : 'border-red-500/30 opacity-60'
                                }`}
                        >
                            <div className="aspect-square relative">
                                <img
                                    src={item.image_url}
                                    alt={item.alt_text}
                                    className="w-full h-full object-cover"
                                />

                                {/* Category Badge */}
                                <div className="absolute top-2 left-2">
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${item.category === 'misafir'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-green-500 text-white'
                                        }`}>
                                        {item.category === 'misafir' ? 'Misafir' : 'İmza'}
                                    </span>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                                        onClick={() => handleDeleteItem(item)}
                                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {!item.is_active && (
                                    <div className="absolute top-2 right-2">
                                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                            Pasif
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Yeni Görsel Ekle</h2>
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Kategori
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setNewItem({ ...newItem, category: 'misafir' })}
                                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${newItem.category === 'misafir'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                    >
                                        Misafirlerimiz
                                    </button>
                                    <button
                                        onClick={() => setNewItem({ ...newItem, category: 'imza' })}
                                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${newItem.category === 'imza'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                    >
                                        İmza Lezzetleri
                                    </button>
                                </div>
                            </div>

                            {/* Upload Type Toggle */}
                            <div className="flex bg-zinc-800 p-1 rounded-xl">
                                <button
                                    onClick={() => setUploadType('url')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${uploadType === 'url' ? 'bg-[#d4af37] text-black' : 'text-zinc-400'
                                        }`}
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    URL
                                </button>
                                <button
                                    onClick={() => setUploadType('file')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${uploadType === 'file' ? 'bg-[#d4af37] text-black' : 'text-zinc-400'
                                        }`}
                                >
                                    <Upload className="w-4 h-4" />
                                    Dosya
                                </button>
                            </div>

                            {uploadType === 'url' ? (
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Görsel URL'si
                                    </label>
                                    <input
                                        type="url"
                                        value={newItem.image_url}
                                        onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Görsel Dosyası
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="gallery-upload"
                                    />
                                    <label
                                        htmlFor="gallery-upload"
                                        className="flex flex-col items-center justify-center w-full h-40 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-[#d4af37] transition-colors"
                                    >
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                                        ) : (
                                            <>
                                                <Upload className="w-10 h-10 text-zinc-500 mb-2" />
                                                <span className="text-zinc-400">Dosya seçmek için tıklayın</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Açıklama (Alt Text)
                                </label>
                                <input
                                    type="text"
                                    value={newItem.alt_text}
                                    onChange={(e) => setNewItem({ ...newItem, alt_text: e.target.value })}
                                    placeholder="Görsel açıklaması"
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
                                onClick={handleAddItem}
                                disabled={saving || (uploadType === 'url' && !newItem.image_url) || (uploadType === 'file' && !selectedFile)}
                                className="px-6 py-2.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#e5c349] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? 'Ekleniyor...' : <><Save className="w-4 h-4" /> Kaydet</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
