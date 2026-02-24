'use client';
import { useEffect, useState } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { Plus, Trash2, Video, Save, X, Link as LinkIcon, Play, Upload } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { validateYouTubeURL } from '@/lib/validations';

export default function VideosManagement() {
    const { success, error: showError, ToastContainer } = useToast();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [uploadType, setUploadType] = useState('url'); // 'url' or 'file'
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [urlError, setUrlError] = useState('');
    const [newVideo, setNewVideo] = useState({
        title: '',
        video_url: '',
        thumbnail_url: '',
        is_background: false,
        is_modal: false
    });

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        const { data, error } = await supabase
            .from('ocakbasi_videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setVideos(data || []);
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

    const handleAddVideo = async () => {
        // Validate YouTube URL if URL type
        if (uploadType === 'url' && newVideo.video_url) {
            if (!validateYouTubeURL(newVideo.video_url)) {
                setUrlError('Geçerli bir YouTube URL\'si girin (örn: https://www.youtube.com/embed/xxxx veya https://youtu.be/xxxx)');
                return;
            }
            setUrlError('');
        }

        setSaving(true);
        try {
            let videoUrl = newVideo.video_url;

            // Upload file if selected
            if (uploadType === 'file' && selectedFile) {
                const fileName = `video-${Date.now()}-${selectedFile.name}`;
                videoUrl = await uploadFile('ocakbasi-videos', fileName, selectedFile);
            }

            if (!newVideo.title || !videoUrl) {
                showError('Lütfen başlık ve video URL\'si girin veya dosya yükleyin');
                setSaving(false);
                return;
            }

            const { data, error } = await supabase
            .from('ocakbasi_videos')
            .insert({
                title: newVideo.title,
                video_url: videoUrl,
                thumbnail_url: newVideo.thumbnail_url || null,
                is_background: newVideo.is_background,
                is_modal: newVideo.is_modal,
                is_active: true
            })
            .select()
            .single();

            if (error) throw error;
            if (data) setVideos(prev => [data, ...prev]);
            setShowModal(false);
            resetForm();
            success('Video başarıyla eklendi');
        } catch (err) {
            console.error('Error adding video:', err);
            const errorMsg = err?.message || 'Bilinmeyen hata';
            if (errorMsg.includes('Bucket not found')) {
                showError('Supabase Storage bucket "ocakbasi-videos" bulunamadı. Lütfen Supabase Dashboard\'dan bucket oluşturun.');
            } else {
                showError(`Video eklenirken hata oluştu: ${errorMsg}`);
            }
        }
        setSaving(false);
    };

    const resetForm = () => {
        setNewVideo({ title: '', video_url: '', thumbnail_url: '', is_background: false, is_modal: false });
        setSelectedFile(null);
        setPreviewUrl('');
        setUploadType('url');
        setUrlError('');
    };

    const handleDeleteVideo = async (video) => {
        setDeleteConfirm(video);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            const { error } = await supabase
                .from('ocakbasi_videos')
                .delete()
                .eq('id', deleteConfirm.id);

            if (error) throw error;
            setVideos(prev => prev.filter(v => v.id !== deleteConfirm.id));
            success('Video başarıyla silindi');
        } catch (err) {
            console.error('Error deleting video:', err);
            showError('Video silinirken bir hata oluştu');
            fetchVideos();
        } finally {
            setDeleteConfirm(null);
        }
    };

    const handleToggleActive = async (video) => {
        setVideos(prev => prev.map(v => v.id === video.id ? { ...v, is_active: !v.is_active } : v));
        try {
            const { error } = await supabase
                .from('ocakbasi_videos')
                .update({ is_active: !video.is_active })
                .eq('id', video.id);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating video:', err);
            setVideos(prev => prev.map(v => v.id === video.id ? { ...v, is_active: video.is_active } : v));
        }
    };

    // Extract YouTube video ID for thumbnail
    const getYouTubeThumbnail = (url) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (match) {
            return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Ocakbaşı Videoları</h1>
                    <p className="text-zinc-400">Hakkımızda bölümündeki videoları yönetin</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8962e] hover:from-[#e5c349] hover:to-[#d4af37] text-black font-bold rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Video Ekle
                </button>
            </div>

            {/* Videos Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-zinc-900 rounded-2xl h-64 animate-pulse" />
                    ))}
                </div>
            ) : videos.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                    <Video className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Henüz video yok</h3>
                    <p className="text-zinc-400 mb-6">Video ekleyerek başlayın</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl"
                    >
                        <Plus className="w-5 h-5" />
                        İlk Videoyu Ekle
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videos.map((video) => {
                        const thumbnail = video.thumbnail_url || getYouTubeThumbnail(video.video_url);
                        const isLocalVideo = video.video_url?.includes('supabase');

                        return (
                            <div
                                key={video.id}
                                className={`group relative bg-zinc-900 border rounded-2xl overflow-hidden transition-all ${video.is_active ? 'border-zinc-800' : 'border-red-500/30 opacity-60'
                                    }`}
                            >
                                {/* Thumbnail / Video Preview */}
                                <div className="aspect-video relative bg-zinc-800">
                                    {isLocalVideo ? (
                                        <video
                                            src={video.video_url}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                        />
                                    ) : thumbnail ? (
                                        <img
                                            src={thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Video className="w-16 h-16 text-zinc-600" />
                                        </div>
                                    )}

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={video.video_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                        >
                                            <Play className="w-8 h-8 text-white fill-white" />
                                        </a>
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        {isLocalVideo && (
                                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                                                Yüklendi
                                            </span>
                                        )}
                                        {video.is_background && (
                                            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
                                                Arka Plan
                                            </span>
                                        )}
                                        {video.is_modal && (
                                            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">
                                                Modal
                                            </span>
                                        )}
                                    </div>

                                    {!video.is_active && (
                                        <div className="absolute top-3 right-3">
                                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                                Pasif
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">{video.title}</p>
                                            <p className="text-zinc-500 text-sm truncate">{video.video_url}</p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => handleToggleActive(video)}
                                                className={`p-2 rounded-lg transition-colors ${video.is_active
                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                                    }`}
                                            >
                                                {video.is_active ? '✓' : '○'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteVideo(video)}
                                                className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Yeni Video Ekle</h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Video Başlığı
                                </label>
                                <input
                                    type="text"
                                    value={newVideo.title}
                                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                    placeholder="Ocakbaşı Hikayeleri"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>

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
                                    YouTube URL
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
                                        Video URL (YouTube) *
                                    </label>
                                    <input
                                        type="url"
                                        value={newVideo.video_url}
                                        onChange={(e) => {
                                            setNewVideo({ ...newVideo, video_url: e.target.value });
                                            setUrlError('');
                                        }}
                                        onBlur={() => {
                                            if (newVideo.video_url && !validateYouTubeURL(newVideo.video_url)) {
                                                setUrlError('Geçerli bir YouTube URL\'si girin');
                                            } else {
                                                setUrlError('');
                                            }
                                        }}
                                        placeholder="https://www.youtube.com/embed/xxxx veya https://youtu.be/xxxx"
                                        className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none ${
                                            urlError ? 'border-red-500' : 'border-zinc-700 focus:border-[#d4af37]'
                                        }`}
                                    />
                                    {urlError && (
                                        <p className="text-red-400 text-xs mt-1">{urlError}</p>
                                    )}
                                    <p className="text-zinc-500 text-xs mt-1">YouTube embed URL'si veya youtu.be linki kullanın</p>
                                </div>
                            )}

                            {/* File Upload */}
                            {uploadType === 'file' && (
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Video Dosyası
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="video-upload"
                                        />
                                        <label
                                            htmlFor="video-upload"
                                            className="flex flex-col items-center justify-center w-full h-40 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-[#d4af37] transition-colors"
                                        >
                                            {previewUrl ? (
                                                <video src={previewUrl} className="h-full w-full object-contain rounded-xl" muted />
                                            ) : (
                                                <>
                                                    <Upload className="w-10 h-10 text-zinc-500 mb-2" />
                                                    <span className="text-zinc-400">Dosya seçmek için tıklayın</span>
                                                    <span className="text-zinc-500 text-sm">MP4, WEBM (max 50MB)</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Thumbnail URL (optional) */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">
                                    Thumbnail URL (Opsiyonel)
                                </label>
                                <input
                                    type="url"
                                    value={newVideo.thumbnail_url}
                                    onChange={(e) => setNewVideo({ ...newVideo, thumbnail_url: e.target.value })}
                                    placeholder="https://example.com/thumbnail.jpg"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>

                            {/* Checkboxes */}
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newVideo.is_background}
                                        onChange={(e) => setNewVideo({ ...newVideo, is_background: e.target.checked })}
                                        className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-[#d4af37] focus:ring-[#d4af37]"
                                    />
                                    <span className="text-zinc-300 text-sm">Arka Plan Video</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newVideo.is_modal}
                                        onChange={(e) => setNewVideo({ ...newVideo, is_modal: e.target.checked })}
                                        className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-[#d4af37] focus:ring-[#d4af37]"
                                    />
                                    <span className="text-zinc-300 text-sm">Modal Video</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleAddVideo}
                                disabled={saving || !newVideo.title || (uploadType === 'url' && (!newVideo.video_url || urlError)) || (uploadType === 'file' && !selectedFile)}
                                className="px-6 py-2.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#e5c349] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Yükleniyor...
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

            {/* Toast Container */}
            <ToastContainer />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={confirmDelete}
                title="Videoyu Sil"
                message={`"${deleteConfirm?.title}" adlı videoyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
                confirmText="Evet, Sil"
                cancelText="İptal"
                type="danger"
            />
        </div>
    );
}
