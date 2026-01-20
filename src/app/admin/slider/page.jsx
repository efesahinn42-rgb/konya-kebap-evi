'use client';
import { useEffect, useState } from 'react';
import { supabase, uploadFile, deleteFile } from '@/lib/supabase';
import { Plus, Trash2, GripVertical, Image as ImageIcon, Save, X, Upload, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function SliderManagement() {
    const { success, error: showError, ToastContainer } = useToast();
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'
    const [newSlide, setNewSlide] = useState({ image_url: '', alt_text: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // Fetch slides
    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching slides:', error);
        } else {
            setSlides(data || []);
        }
        setLoading(false);
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Add new slide
    const handleAddSlide = async () => {
        setSaving(true);
        try {
            let imageUrl = newSlide.image_url;

            // Upload file if selected
            if (uploadType === 'file' && selectedFile) {
                const fileName = `slide-${Date.now()}-${selectedFile.name}`;
                imageUrl = await uploadFile('hero-slides', fileName, selectedFile);
            }

            if (!imageUrl) {
                showError('Lütfen bir görsel URL\'si girin veya dosya yükleyin');
                setSaving(false);
                return;
            }

            const { error } = await supabase
                .from('hero_slides')
                .insert({
                    image_url: imageUrl,
                    alt_text: newSlide.alt_text || 'Konya Kebap Evi',
                    display_order: slides.length,
                    is_active: true
                });

            if (error) throw error;

            await fetchSlides();
            setShowModal(false);
            setNewSlide({ image_url: '', alt_text: '' });
            setSelectedFile(null);
            setPreviewUrl('');
            success('Görsel başarıyla eklendi');
        } catch (err) {
            console.error('Error adding slide:', err);
            const errorMsg = err?.message || 'Bilinmeyen hata';
            if (errorMsg.includes('Bucket not found')) {
                showError('Supabase Storage bucket "hero-slides" bulunamadı. Lütfen Supabase Dashboard\'dan bucket oluşturun.');
            } else if (errorMsg.includes('new row violates row-level security')) {
                showError('Storage izinleri eksik. Lütfen RLS policy ayarlarını kontrol edin.');
            } else if (errorMsg.includes('Payload too large')) {
                showError('Dosya boyutu çok büyük. Lütfen daha küçük bir dosya seçin (max 50MB).');
            } else {
                showError(`Görsel eklenirken hata oluştu: ${errorMsg}`);
            }
        }
        setSaving(false);
    };

    // Delete slide
    const handleDeleteSlide = async (slide) => {
        setDeleteConfirm(slide);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            // Delete from storage if it's a Supabase URL
            if (deleteConfirm.image_url.includes('supabase')) {
                const path = deleteConfirm.image_url.split('/').pop();
                await deleteFile('hero-slides', path);
            }

            const { error } = await supabase
                .from('hero_slides')
                .delete()
                .eq('id', deleteConfirm.id);

            if (error) throw error;
            await fetchSlides();
            success('Görsel başarıyla silindi');
        } catch (err) {
            console.error('Error deleting slide:', err);
            showError('Görsel silinirken bir hata oluştu');
        } finally {
            setDeleteConfirm(null);
        }
    };

    // Toggle active status
    const handleToggleActive = async (slide) => {
        try {
            const { error } = await supabase
                .from('hero_slides')
                .update({ is_active: !slide.is_active })
                .eq('id', slide.id);

            if (error) throw error;
            await fetchSlides();
        } catch (err) {
            console.error('Error updating slide:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Hero Slider</h1>
                    <p className="text-zinc-400">Ana sayfadaki slider görsellerini yönetin</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8962e] hover:from-[#e5c349] hover:to-[#d4af37] text-black font-bold rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Görsel Ekle
                </button>
            </div>

            {/* Slides Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-zinc-900 rounded-2xl h-64 animate-pulse" />
                    ))}
                </div>
            ) : slides.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <ImageIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Henüz görsel yok</h3>
                    <p className="text-zinc-400 mb-6">Slider'a görsel ekleyerek başlayın</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl"
                    >
                        <Plus className="w-5 h-5" />
                        İlk Görseli Ekle
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`group relative bg-zinc-900 border rounded-2xl overflow-hidden transition-all ${slide.is_active ? 'border-zinc-800' : 'border-red-500/30 opacity-60'
                                }`}
                        >
                            {/* Image */}
                            <div className="aspect-video relative">
                                <img
                                    src={slide.image_url}
                                    alt={slide.alt_text}
                                    className="w-full h-full object-cover"
                                />
                                {!slide.is_active && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                                            Pasif
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">{slide.alt_text || 'Görsel ' + (index + 1)}</p>
                                        <p className="text-zinc-500 text-sm">Sıra: {index + 1}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleActive(slide)}
                                            className={`p-2 rounded-lg transition-colors ${slide.is_active
                                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                                }`}
                                            title={slide.is_active ? 'Pasif Yap' : 'Aktif Yap'}
                                        >
                                            {slide.is_active ? '✓' : '○'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSlide(slide)}
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

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Yeni Görsel Ekle</h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setNewSlide({ image_url: '', alt_text: '' });
                                    setSelectedFile(null);
                                    setPreviewUrl('');
                                }}
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Upload Type Toggle */}
                            <div className="flex bg-zinc-800 p-1 rounded-xl">
                                <button
                                    onClick={() => setUploadType('url')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${uploadType === 'url'
                                        ? 'bg-[#d4af37] text-black'
                                        : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    URL
                                </button>
                                <button
                                    onClick={() => setUploadType('file')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${uploadType === 'file'
                                        ? 'bg-[#d4af37] text-black'
                                        : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    <Upload className="w-4 h-4" />
                                    Dosya Yükle
                                </button>
                            </div>

                            {/* URL Input */}
                            {uploadType === 'url' && (
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Görsel URL'si
                                    </label>
                                    <input
                                        type="url"
                                        value={newSlide.image_url}
                                        onChange={(e) => setNewSlide({ ...newSlide, image_url: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                    />
                                </div>
                            )}

                            {/* File Upload */}
                            {uploadType === 'file' && (
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Görsel Dosyası
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex flex-col items-center justify-center w-full h-40 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-[#d4af37] transition-colors"
                                        >
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                                            ) : (
                                                <>
                                                    <Upload className="w-10 h-10 text-zinc-500 mb-2" />
                                                    <span className="text-zinc-400">Dosya seçmek için tıklayın</span>
                                                    <span className="text-zinc-500 text-sm">PNG, JPG, WEBP (max 5MB)</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Alt Text */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Açıklama (Alt Text)
                                </label>
                                <input
                                    type="text"
                                    value={newSlide.alt_text}
                                    onChange={(e) => setNewSlide({ ...newSlide, alt_text: e.target.value })}
                                    placeholder="Konya Kebap Evi"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setNewSlide({ image_url: '', alt_text: '' });
                                    setSelectedFile(null);
                                    setPreviewUrl('');
                                }}
                                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleAddSlide}
                                disabled={saving || (uploadType === 'url' && !newSlide.image_url) || (uploadType === 'file' && !selectedFile)}
                                className="px-6 py-2.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#e5c349] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Ekleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Kaydet
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
