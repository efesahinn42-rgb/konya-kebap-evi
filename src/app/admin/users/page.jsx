'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
    Users, UserPlus, Shield, User, Trash2,
    RefreshCw, Crown, Mail, Calendar
} from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', name: '', role: 'staff' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        if (!supabase) return;
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!supabase) return;
        setSaving(true);
        setError(null);

        try {
            // Önce Supabase Auth ile kullanıcı davet et
            const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(newUser.email);

            if (authError) {
                // Magic link ile devam et (admin API olmadan)
                const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
                    email: newUser.email,
                    options: {
                        shouldCreateUser: true
                    }
                });

                if (signInError) throw signInError;

                // Kullanıcı oluşturulduktan sonra admin_users'a ekle
                // NOT: Bu, kullanıcı ilk giriş yaptığında yapılmalı
                // Şimdilik sadece email ile kayıt oluştur
                const { error: insertError } = await supabase
                    .from('admin_users')
                    .insert({
                        email: newUser.email,
                        name: newUser.name,
                        role: newUser.role,
                        user_id: null // Kullanıcı giriş yaptığında güncellenecek
                    });

                if (insertError) throw insertError;
            } else if (authData?.user) {
                // Admin API ile davet başarılı
                const { error: insertError } = await supabase
                    .from('admin_users')
                    .insert({
                        user_id: authData.user.id,
                        email: newUser.email,
                        name: newUser.name,
                        role: newUser.role
                    });

                if (insertError) throw insertError;
            }

            setShowAddModal(false);
            setNewUser({ email: '', name: '', role: 'staff' });
            fetchUsers();
            alert('Kullanıcıya davet e-postası gönderildi!');
        } catch (err) {
            console.error('Error adding user:', err);
            setError(err.message || 'Kullanıcı eklenirken hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const updateRole = async (id, newRole) => {
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('admin_users')
                .update({ role: newRole })
                .eq('id', id);

            if (error) throw error;
            fetchUsers();
        } catch (err) {
            console.error('Error updating role:', err);
            alert('Rol güncellenirken hata oluştu');
        }
    };

    const deleteUser = async (id) => {
        if (!supabase) return;
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

        try {
            const { error } = await supabase
                .from('admin_users')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Kullanıcı silinirken hata oluştu');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>
                    <p className="text-zinc-400 text-sm">Admin panel kullanıcılarını yönetin</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Yenile
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] hover:bg-[#e5c349] text-black font-medium rounded-lg transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Kullanıcı Ekle
                    </button>
                </div>
            </div>

            {/* Role Legend */}
            <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2 text-yellow-500">
                    <Crown className="w-4 h-4" />
                    <span>Admin - Tüm yetkiler</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                    <User className="w-4 h-4" />
                    <span>Staff - Rezervasyon + İş Başvuruları</span>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw className="w-8 h-8 text-zinc-500 animate-spin" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <Users className="w-12 h-12 mb-4 opacity-50" />
                        <p>Henüz kullanıcı bulunmuyor</p>
                        <p className="text-sm">Yeni kullanıcı ekleyerek başlayın</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {users.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-yellow-500/20' : 'bg-zinc-800'
                                            }`}>
                                            {user.role === 'admin' ? (
                                                <Crown className="w-5 h-5 text-yellow-500" />
                                            ) : (
                                                <User className="w-5 h-5 text-zinc-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{user.name}</p>
                                            <p className="text-zinc-500 text-sm flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Role & Actions */}
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateRole(user.id, e.target.value)}
                                            className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                        >
                                            <option value="admin">👑 Admin</option>
                                            <option value="staff">👤 Staff</option>
                                        </select>

                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                            title="Kullanıcıyı Sil"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Meta */}
                                <div className="mt-2 pl-15 text-xs text-zinc-600 flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                                    </span>
                                    {!user.user_id && (
                                        <span className="text-orange-500">⚠️ Henüz giriş yapmadı</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md"
                    >
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white">Yeni Kullanıcı Ekle</h3>
                            <p className="text-zinc-500 text-sm mt-1">Kullanıcıya davet e-postası gönderilecek</p>
                        </div>

                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs text-zinc-500 uppercase mb-2">İsim</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    placeholder="Kullanıcı adı"
                                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-zinc-500 uppercase mb-2">E-posta</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                    placeholder="kullanici@example.com"
                                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-zinc-500 uppercase mb-2">Rol</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-white"
                                >
                                    <option value="staff">👤 Staff - Rezervasyon + İş Başvuruları</option>
                                    <option value="admin">👑 Admin - Tüm Yetkiler</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 bg-[#d4af37] hover:bg-[#e5c349] text-black font-medium rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Gönderiliyor...' : 'Davet Gönder'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
