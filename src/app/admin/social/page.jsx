'use client';
import { useEffect, useState } from 'react';
import { supabase, uploadFile } from '@/lib/supabase';
import { Plus, Trash2, Heart, Save, X, Edit2, Upload, Link as LinkIcon } from 'lucide-react';

export default function SocialManagement() {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [uploadType, setUploadType] = useState('url');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [formData, setFormData] = useState({ title: '', description: '', image_url: '' });
    const [statFormData, setStatFormData] = useState({ number: '', label: '' });
    const [editingStat, setEditingStat] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [projectsRes, statsRes] = await Promise.all([
            supabase.from('social_projects').select('*').order('display_order'),
            supabase.from('impact_stats').select('*').order('display_order')
        ]);

        if (!projectsRes.error) setProjects(projectsRes.data || []);
        if (!statsRes.error) setStats(statsRes.data || []);
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
            setFormData({ title: item.title, description: item.description, image_url: item.image_url });
            setPreviewUrl(item.image_url);
        } else {
            setEditingItem(null);
            setFormData({ title: '', description: '', image_url: '' });
            setPreviewUrl('');
        }
        setShowModal(true);
    };

    const openStatsModal = (stat = null) => {
        if (stat) {
            setEditingStat(stat);
            setStatFormData({ number: stat.number, label: stat.label });
        } else {
            setEditingStat(null);
            setStatFormData({ number: '', label: '' });
        }
        setShowStatsModal(true);
    };

    const handleSaveProject = async () => {
        if (!formData.title || !formData.description) {
            alert('Lütfen başlık ve açıklama girin');
            return;
        }

        setSaving(true);
        try {
            let imageUrl = formData.image_url;

            if (uploadType === 'file' && selectedFile) {
                const fileName = `social-${Date.now()}-${selectedFile.name}`;
                imageUrl = await uploadFile('social-projects', fileName, selectedFile);
            }

            if (!imageUrl) {
                alert('Lütfen bir görsel ekleyin');
                setSaving(false);
                return;
            }

            const saveData = { ...formData, image_url: imageUrl };

            if (editingItem) {
                const { error } = await supabase.from('social_projects').update(saveData).eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('social_projects').insert({ ...saveData, display_order: projects.length, is_active: true });
                if (error) throw error;
            }
            await fetchData();
            setShowModal(false);
            setSelectedFile(null);
            setPreviewUrl('');
        } catch (err) {
            console.error('Error saving project:', err);
            alert('Kaydetme sırasında bir hata oluştu');
        }
        setSaving(false);
    };

    const handleSaveStat = async () => {
        if (!statFormData.number || !statFormData.label) {
            alert('Lütfen tüm alanları doldurun');
            return;
        }

        setSaving(true);
        try {
            if (editingStat) {
                const { error } = await supabase.from('impact_stats').update(statFormData).eq('id', editingStat.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('impact_stats').insert({ ...statFormData, display_order: stats.length, is_active: true });
                if (error) throw error;
            }
            await fetchData();
            setShowStatsModal(false);
        } catch (err) {
            console.error('Error saving stat:', err);
            alert('Kaydetme sırasında bir hata oluştu');
        }
        setSaving(false);
    };

    const handleDeleteProject = async (item) => {
        if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
        try {
            const { error } = await supabase.from('social_projects').delete().eq('id', item.id);
            if (error) throw error;
            await fetchData();
        } catch (err) {
            console.error('Error deleting project:', err);
        }
    };

    const handleDeleteStat = async (stat) => {
        if (!confirm('Bu istatistiği silmek istediğinize emin misiniz?')) return;
        try {
            const { error } = await supabase.from('impact_stats').delete().eq('id', stat.id);
            if (error) throw error;
            await fetchData();
        } catch (err) {
            console.error('Error deleting stat:', err);
        }
    };

    const handleToggleActive = async (item, table) => {
        try {
            const { error } = await supabase.from(table).update({ is_active: !item.is_active }).eq('id', item.id);
            if (error) throw error;
            await fetchData();
        } catch (err) {
            console.error('Error updating item:', err);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Sosyal Sorumluluk</h1>
                <p className="text-zinc-400">Sosyal sorumluluk projelerini ve istatistikleri yönetin</p>
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Projeler</h2>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-black font-bold rounded-xl"
                    >
                        <Plus className="w-4 h-4" />
                        Proje Ekle
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => <div key={i} className="bg-zinc-900 rounded-2xl h-48 animate-pulse" />)}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                        <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-400">Henüz proje eklenmemiş</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className={`group relative bg-zinc-900 border rounded-2xl overflow-hidden ${project.is_active ? 'border-zinc-800' : 'border-red-500/30 opacity-60'
                                    }`}
                            >
                                <div className="aspect-video relative">
                                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h3 className="text-white font-bold">{project.title}</h3>
                                        <p className="text-zinc-300 text-sm line-clamp-1">{project.description}</p>
                                    </div>
                                    {!project.is_active && (
                                        <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">Pasif</span>
                                    )}
                                </div>
                                <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(project)} className="p-2 bg-zinc-800/80 text-white rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleToggleActive(project, 'social_projects')} className={`p-2 rounded-lg ${project.is_active ? 'bg-green-500/80 text-white' : 'bg-zinc-800/80 text-zinc-400'}`}>{project.is_active ? '✓' : '○'}</button>
                                    <button onClick={() => handleDeleteProject(project)} className="p-2 bg-red-500/80 text-white rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">İstatistikler (Topluma Katkımız)</h2>
                    <button
                        onClick={() => openStatsModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-black font-bold rounded-xl"
                    >
                        <Plus className="w-4 h-4" />
                        İstatistik Ekle
                    </button>
                </div>

                {stats.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                        <p className="text-zinc-400">Henüz istatistik eklenmemiş</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.id}
                                className={`group relative bg-zinc-900 border rounded-xl p-4 text-center ${stat.is_active ? 'border-zinc-800' : 'border-red-500/30 opacity-60'
                                    }`}
                            >
                                <div className="text-2xl font-black text-[#d4af37]">{stat.number}</div>
                                <div className="text-zinc-400 text-sm">{stat.label}</div>
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openStatsModal(stat)} className="p-1 bg-zinc-800 text-zinc-400 rounded"><Edit2 className="w-3 h-3" /></button>
                                    <button onClick={() => handleDeleteStat(stat)} className="p-1 bg-red-500/80 text-white rounded"><Trash2 className="w-3 h-3" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">{editingItem ? 'Proje Düzenle' : 'Yeni Proje Ekle'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Proje Adı *</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Gıda Yardımı" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Açıklama *</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Proje açıklaması..." rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37] resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Görsel *</label>
                                <div className="flex bg-zinc-800 p-1 rounded-xl mb-2">
                                    <button onClick={() => setUploadType('url')} className={`flex-1 py-2 rounded-lg font-medium ${uploadType === 'url' ? 'bg-[#d4af37] text-black' : 'text-zinc-400'}`}>URL</button>
                                    <button onClick={() => setUploadType('file')} className={`flex-1 py-2 rounded-lg font-medium ${uploadType === 'file' ? 'bg-[#d4af37] text-black' : 'text-zinc-400'}`}>Dosya</button>
                                </div>
                                {uploadType === 'url' ? (
                                    <input type="url" value={formData.image_url} onChange={(e) => { setFormData({ ...formData, image_url: e.target.value }); setPreviewUrl(e.target.value); }} placeholder="https://example.com/image.jpg" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]" />
                                ) : (
                                    <>
                                        <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="social-upload" />
                                        <label htmlFor="social-upload" className="flex flex-col items-center justify-center w-full h-32 bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-[#d4af37]">
                                            {previewUrl ? <img src={previewUrl} alt="Preview" className="h-full object-contain rounded-xl" /> : <><Upload className="w-8 h-8 text-zinc-500 mb-1" /><span className="text-zinc-400 text-sm">Dosya seç</span></>}
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl">İptal</button>
                            <button onClick={handleSaveProject} disabled={saving} className="px-6 py-2.5 bg-[#d4af37] text-black font-bold rounded-xl disabled:opacity-50 flex items-center gap-2">
                                {saving ? 'Kaydediliyor...' : <><Save className="w-4 h-4" /> Kaydet</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Modal */}
            {showStatsModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">{editingStat ? 'İstatistik Düzenle' : 'Yeni İstatistik Ekle'}</h2>
                            <button onClick={() => setShowStatsModal(false)} className="p-2 text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Sayı *</label>
                                <input type="text" value={statFormData.number} onChange={(e) => setStatFormData({ ...statFormData, number: e.target.value })} placeholder="10K+" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Etiket *</label>
                                <input type="text" value={statFormData.label} onChange={(e) => setStatFormData({ ...statFormData, label: e.target.value })} placeholder="Dağıtılan Porsiyon" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                            <button onClick={() => setShowStatsModal(false)} className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl">İptal</button>
                            <button onClick={handleSaveStat} disabled={saving} className="px-6 py-2.5 bg-[#d4af37] text-black font-bold rounded-xl disabled:opacity-50 flex items-center gap-2">
                                {saving ? 'Kaydediliyor...' : <><Save className="w-4 h-4" /> Kaydet</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
