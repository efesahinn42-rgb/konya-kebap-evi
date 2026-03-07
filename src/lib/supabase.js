import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only if we have the required env vars
// This prevents build errors during static page generation
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
    })
    : null;

// Helper function to handle auth errors and clear invalid sessions
export const handleAuthError = async (error) => {
    if (!supabase) return;

    // Check if it's a refresh token error
    if (error?.message?.includes('Refresh Token') || error?.message?.includes('refresh_token')) {
        try {
            // Clear the invalid session
            await supabase.auth.signOut();
            
            // Clear localStorage
            if (typeof window !== 'undefined') {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('sb-') || key.includes('supabase')) {
                        localStorage.removeItem(key);
                    }
                });
            }
        } catch (signOutError) {
            console.error('Error clearing invalid session:', signOutError);
        }
    }
};

// Helper function to get public URL for storage files
export const getPublicUrl = (bucket, path) => {
    if (!supabase) return '';
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
};

// Helper function to upload file to storage
export const uploadFile = async (bucket, path, file) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) throw error;
    return getPublicUrl(bucket, data.path);
};

// Helper function to delete file from storage
export const deleteFile = async (bucket, path) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) throw error;
    return true;
};
