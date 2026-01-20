//
// Auth Helper - Role-based Access Control
//
import { supabase } from './supabase';

// Roller ve izin verilen sayfalar
export const ROLE_PERMISSIONS = {
    admin: [
        '/admin',
        '/admin/reservations',
        '/admin/slider',
        '/admin/videos',
        '/admin/menu',
        '/admin/gallery',
        '/admin/awards',
        '/admin/press',
        '/admin/social',
        '/admin/hr/positions',
        '/admin/hr/applications',
        '/admin/users'
    ],
    staff: [
        '/admin',
        '/admin/reservations',
        '/admin/hr/applications'
    ]
};

// Menü öğeleri ve hangi rollerin göreceği
export const MENU_VISIBILITY = {
    '/admin': ['admin', 'staff'],
    '/admin/reservations': ['admin', 'staff'],
    '/admin/slider': ['admin'],
    '/admin/videos': ['admin'],
    '/admin/menu': ['admin'],
    '/admin/gallery': ['admin'],
    '/admin/awards': ['admin'],
    '/admin/press': ['admin'],
    '/admin/social': ['admin'],
    '/admin/hr/positions': ['admin'],
    '/admin/hr/applications': ['admin', 'staff'],
    '/admin/users': ['admin']
};

/**
 * Kullanıcının rolünü getirir
 * @param {string} userId - Supabase Auth user ID
 * @param {string} email - Kullanıcı email (fallback için)
 * @returns {Promise<{role: string, name: string} | null>}
 */
export async function getUserRole(userId, email = null) {
    if (!supabase) {
        console.log('getUserRole: supabase client yok');
        return null;
    }

    try {
        // Önce user_id ile dene
        if (userId) {
            const { data, error } = await supabase
                .from('admin_users')
                .select('role, name, email')
                .eq('user_id', userId)
                .single();

            if (!error && data) {
                console.log('getUserRole: Kullanıcı bulundu (user_id):', data);
                return data;
            }
            console.log('getUserRole: user_id ile bulunamadı, email deneniyor...');
        }

        // user_id ile bulunamazsa email ile dene
        if (email) {
            const { data, error } = await supabase
                .from('admin_users')
                .select('role, name, email')
                .eq('email', email)
                .single();

            if (!error && data) {
                console.log('getUserRole: Kullanıcı bulundu (email):', data);
                return data;
            }
        }

        console.log('getUserRole: Kullanıcı bulunamadı');
        return null;
    } catch (err) {
        console.error('getUserRole error:', err);
        return null;
    }
}

/**
 * Kullanıcının belirli bir sayfaya erişim yetkisi var mı kontrol eder
 * @param {string} role - Kullanıcı rolü (admin | staff)
 * @param {string} path - Kontrol edilecek sayfa yolu
 * @returns {boolean}
 */
export function hasAccess(role, path) {
    if (!role) return false;

    const permissions = ROLE_PERMISSIONS[role];
    if (!permissions) return false;

    // Tam eşleşme veya alt sayfa kontrolü
    return permissions.some(p => path === p || path.startsWith(p + '/'));
}

/**
 * Menü öğesinin belirli bir role görünür olup olmadığını kontrol eder
 * @param {string} href - Menü öğesinin href'i
 * @param {string} role - Kullanıcı rolü
 * @returns {boolean}
 */
export function isMenuVisible(href, role) {
    if (!role) return false;

    const allowedRoles = MENU_VISIBILITY[href];
    if (!allowedRoles) return role === 'admin'; // Tanımsız sayfalar sadece admin görebilir

    return allowedRoles.includes(role);
}
