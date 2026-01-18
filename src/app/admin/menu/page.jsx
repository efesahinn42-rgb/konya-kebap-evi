'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, X, Edit2, UtensilsCrossed, ChevronRight, ArrowLeft } from 'lucide-react';

const emojiOptions = ['🍜', '🫓', '🍖', '🍰', '🥤', '🍽️', '🥗', '🍕', '🍝', '🥘', '🍳', '☕'];

export default function MenuManagement() {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Modal states
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    // Form states
    const [categoryForm, setCategoryForm] = useState({ title: '', icon: '🍽️' });
    const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', image_url: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchItems(selectedCategory.id);
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('menu_categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (!error) setCategories(data || []);
        setLoading(false);
    };

    const fetchItems = async (categoryId) => {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('category_id', categoryId)
            .order('display_order', { ascending: true });

        if (!error) setItems(data || []);
    };

    // Category CRUD
    const openCategoryModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({ title: category.title, icon: category.icon || '🍽️' });
        } else {
            setEditingCategory(null);
            setCategoryForm({ title: '', icon: '🍽️' });
        }
        setShowCategoryModal(true);
    };

    const saveCategory = async () => {
        if (!categoryForm.title) {
            alert('Lütfen kategori adını girin');
            return;
        }

        setSaving(true);
        try {
            if (editingCategory) {
                const { error } = await supabase
                    .from('menu_categories')
                    .update(categoryForm)
                    .eq('id', editingCategory.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('menu_categories')
                    .insert({
                        ...categoryForm,
                        display_order: categories.length,
                        is_active: true
                    });
                if (error) throw error;
            }
            await fetchCategories();
            setShowCategoryModal(false);
        } catch (err) {
            console.error('Error saving category:', err);
            alert('Kategori kaydedilirken bir hata oluştu');
        }
        setSaving(false);
    };

    const deleteCategory = async (category) => {
        if (!confirm(`"${category.title}" kategorisini ve içindeki tüm yemekleri silmek istediğinize emin misiniz?`)) return;

        try {
            const { error } = await supabase
                .from('menu_categories')
                .delete()
                .eq('id', category.id);
            if (error) throw error;

            if (selectedCategory?.id === category.id) {
                setSelectedCategory(null);
                setItems([]);
            }
            await fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err);
            alert('Kategori silinirken bir hata oluştu');
        }
    };

    const toggleCategoryActive = async (category) => {
        try {
            const { error } = await supabase
                .from('menu_categories')
                .update({ is_active: !category.is_active })
                .eq('id', category.id);
            if (error) throw error;
            await fetchCategories();
        } catch (err) {
            console.error('Error updating category:', err);
        }
    };

    // Item CRUD
    const openItemModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setItemForm({
                name: item.name,
                description: item.description || '',
                price: item.price?.toString() || '',
                image_url: item.image_url || ''
            });
        } else {
            setEditingItem(null);
            setItemForm({ name: '', description: '', price: '', image_url: '' });
        }
        setShowItemModal(true);
    };

    const saveItem = async () => {
        if (!itemForm.name || !itemForm.price) {
            alert('Lütfen yemek adı ve fiyatını girin');
            return;
        }

        setSaving(true);
        try {
            const itemData = {
                ...itemForm,
                price: parseFloat(itemForm.price),
                category_id: selectedCategory.id
            };

            if (editingItem) {
                const { error } = await supabase
                    .from('menu_items')
                    .update(itemData)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('menu_items')
                    .insert({
                        ...itemData,
                        display_order: items.length,
                        is_active: true
                    });
                if (error) throw error;
            }
            await fetchItems(selectedCategory.id);
            setShowItemModal(false);
        } catch (err) {
            console.error('Error saving item:', err);
            alert('Yemek kaydedilirken bir hata oluştu');
        }
        setSaving(false);
    };

    const deleteItem = async (item) => {
        if (!confirm(`"${item.name}" yemeğini silmek istediğinize emin misiniz?`)) return;

        try {
            const { error } = await supabase
                .from('menu_items')
                .delete()
                .eq('id', item.id);
            if (error) throw error;
            await fetchItems(selectedCategory.id);
        } catch (err) {
            console.error('Error deleting item:', err);
            alert('Yemek silinirken bir hata oluştu');
        }
    };

    const toggleItemActive = async (item) => {
        try {
            const { error } = await supabase
                .from('menu_items')
                .update({ is_active: !item.is_active })
                .eq('id', item.id);
            if (error) throw error;
            await fetchItems(selectedCategory.id);
        } catch (err) {
            console.error('Error updating item:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    {selectedCategory && (
                        <button
                            onClick={() => { setSelectedCategory(null); setItems([]); }}
                            className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-3xl font-black text-white mb-2">
                            {selectedCategory ? selectedCategory.title : 'Menü Yönetimi'}
                        </h1>
                        <p className="text-zinc-400">
                            {selectedCategory ? 'Bu kategorideki yemekleri yönetin' : 'Menü kategorileri ve yemekleri yönetin'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => selectedCategory ? openItemModal() : openCategoryModal()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8962e] hover:from-[#e5c349] hover:to-[#d4af37] text-black font-bold rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    {selectedCategory ? 'Yeni Yemek Ekle' : 'Yeni Kategori Ekle'}
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-zinc-900 rounded-2xl h-32 animate-pulse" />
                    ))}
                </div>
            ) : !selectedCategory ? (
                /* Categories View */
                categories.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                        <UtensilsCrossed className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Henüz kategori yok</h3>
                        <p className="text-zinc-400 mb-6">Menü kategorisi ekleyerek başlayın</p>
                        <button
                            onClick={() => openCategoryModal()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl"
                        >
                            <Plus className="w-5 h-5" />
                            İlk Kategoriyi Ekle
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className={`group relative bg-zinc-900 border rounded-2xl p-6 transition-all cursor-pointer hover:border-[#d4af37]/50 ${category.is_active ? 'border-zinc-800' : 'border-red-500/30 opacity-60'
                                    }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl">{category.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white">{category.title}</h3>
                                        <p className="text-zinc-500 text-sm">Tıkla &rarr; yemekleri gör</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[#d4af37] transition-colors" />
                                </div>

                                {!category.is_active && (
                                    <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                        Pasif
                                    </span>
                                )}

                                {/* Actions */}
                                <div
                                    className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => openCategoryModal(category)}
                                        className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => toggleCategoryActive(category)}
                                        className={`p-2 rounded-lg transition-colors ${category.is_active
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                    >
                                        {category.is_active ? '✓' : '○'}
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(category)}
                                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                /* Items View */
                items.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                        <span className="text-6xl mb-4 block">{selectedCategory.icon}</span>
                        <h3 className="text-xl font-bold text-white mb-2">Bu kategoride yemek yok</h3>
                        <p className="text-zinc-400 mb-6">İlk yemeği ekleyerek başlayın</p>
                        <button
                            onClick={() => openItemModal()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl"
                        >
                            <Plus className="w-5 h-5" />
                            İlk Yemeği Ekle
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`group relative bg-zinc-900 border rounded-2xl overflow-hidden transition-all ${item.is_active ? 'border-zinc-800' : 'border-red-500/30 opacity-60'
                                    }`}
                            >
                                {/* Image */}
                                {item.image_url && (
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                        <span className="px-2 py-1 bg-[#d4af37] text-black text-sm font-bold rounded-lg whitespace-nowrap">
                                            {parseFloat(item.price).toFixed(2)} ₺
                                        </span>
                                    </div>
                                    {item.description && (
                                        <p className="text-zinc-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                                    )}
                                </div>

                                {!item.is_active && (
                                    <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                        Pasif
                                    </span>
                                )}

                                {/* Actions */}
                                <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openItemModal(item)}
                                        className="p-2 bg-zinc-800/90 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => toggleItemActive(item)}
                                        className={`p-2 rounded-lg transition-colors ${item.is_active
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-zinc-800/90 text-zinc-400'
                                            }`}
                                    >
                                        {item.is_active ? '✓' : '○'}
                                    </button>
                                    <button
                                        onClick={() => deleteItem(item)}
                                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">
                                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                            </h2>
                            <button
                                onClick={() => setShowCategoryModal(false)}
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">İkon</label>
                                <div className="flex flex-wrap gap-2">
                                    {emojiOptions.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => setCategoryForm({ ...categoryForm, icon: emoji })}
                                            className={`w-12 h-12 text-2xl rounded-xl transition-all ${categoryForm.icon === emoji
                                                    ? 'bg-[#d4af37] scale-110'
                                                    : 'bg-zinc-800 hover:bg-zinc-700'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Kategori Adı *</label>
                                <input
                                    type="text"
                                    value={categoryForm.title}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                                    placeholder="Örn: ÇORBALAR"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                            <button
                                onClick={() => setShowCategoryModal(false)}
                                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={saveCategory}
                                disabled={saving}
                                className="px-6 py-2.5 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#e5c349] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? 'Kaydediliyor...' : <><Save className="w-4 h-4" /> Kaydet</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Item Modal */}
            {showItemModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">
                                {editingItem ? 'Yemek Düzenle' : 'Yeni Yemek Ekle'}
                            </h2>
                            <button
                                onClick={() => setShowItemModal(false)}
                                className="p-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Yemek Adı *</label>
                                <input
                                    type="text"
                                    value={itemForm.name}
                                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                    placeholder="Örn: Kuzu Tandır"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Fiyat (₺) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={itemForm.price}
                                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Açıklama</label>
                                <textarea
                                    value={itemForm.description}
                                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                    placeholder="Yemek hakkında kısa açıklama..."
                                    rows={3}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37] resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Görsel URL</label>
                                <input
                                    type="url"
                                    value={itemForm.image_url}
                                    onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                                />
                                {itemForm.image_url && (
                                    <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-zinc-800">
                                        <img src={itemForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                            <button
                                onClick={() => setShowItemModal(false)}
                                className="px-6 py-2.5 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={saveItem}
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
