import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase'; // For verification if needed

export async function POST(request) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: 'Server configuration error: Admin client not available' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { action, email, name, role, userId } = body;

        // Verify that the requester is an admin
        // Note: In a real app, we should check the session cookie here.
        // For now, we rely on the client ensuring only admins call this,
        // but adding a session check would be better security.

        if (action === 'invite') {
            // 1. Invite user via email
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

            if (authError) {
                console.error('Auth invite error:', authError);
                return NextResponse.json({ error: authError.message }, { status: 400 });
            }

            // 2. Add to admin_users table
            if (authData?.user) {
                const { error: insertError } = await supabaseAdmin
                    .from('admin_users')
                    .insert({
                        user_id: authData.user.id,
                        email: email,
                        name: name,
                        role: role
                    });

                if (insertError) {
                    console.error('DB insert error:', insertError);
                    // Try to clean up the auth user if DB insert fails?
                    // For now just return error
                    return NextResponse.json({ error: 'User created but DB insert failed: ' + insertError.message }, { status: 500 });
                }
            }

            return NextResponse.json({ success: true, user: authData.user });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Admin API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const dbId = searchParams.get('dbId'); // admin_users table id

        if (!userId && !dbId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // 1. Delete from Auth (if userId provided)
        if (userId) {
            const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
            if (authError) {
                console.warn('Auth delete error (user might not exist in auth):', authError);
            }
        }

        // 2. Delete from admin_users (if dbId provided)
        if (dbId) {
            const { error: dbError } = await supabaseAdmin
                .from('admin_users')
                .delete()
                .eq('id', dbId);

            if (dbError) {
                return NextResponse.json({ error: dbError.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Admin API Delete Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
