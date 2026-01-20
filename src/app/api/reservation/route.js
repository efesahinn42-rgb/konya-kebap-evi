//
// Reservation API Route
// POST /api/reservation
//
import { NextResponse } from 'next/server';
import { reservationSchema, formatPhoneForSMS } from '@/lib/validation';
import { sendBusinessSMS } from '@/lib/sms';
import { checkRateLimit } from '@/lib/rateLimit';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
    try {
        // 1. Get client IP and User-Agent
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // 2. Check rate limit
        const rateLimitResult = await checkRateLimit(ip);
        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Çok fazla istek gönderdiniz. Lütfen 5 dakika sonra tekrar deneyin.',
                    code: 'RATE_LIMIT_EXCEEDED'
                },
                { status: 429 }
            );
        }

        // 3. Parse and validate request body
        const body = await request.json();

        const validationResult = reservationSchema.safeParse(body);
        if (!validationResult.success) {
            const errors = validationResult.error.errors.map(e => e.message);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Geçersiz form verisi',
                    details: errors,
                    code: 'VALIDATION_ERROR'
                },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // 4. Format phone number for SMS
        const formattedPhone = formatPhoneForSMS(data.phone);

        // 5. Send SMS to business (restaurant)
        let businessSmsResult = null;
        let smsError = null;
        try {
            businessSmsResult = await sendBusinessSMS({
                ...data,
                phone: formattedPhone
            });
        } catch (err) {
            console.error('Business SMS failed:', err);
            smsError = err.message;
            // Continue to save reservation even if SMS fails
        }

        // 6. Save to database
        let reservationId = null;
        if (supabase) {
            try {
                const { data: insertedData, error } = await supabase
                    .from('reservations')
                    .insert({
                        name: data.name,
                        phone: data.phone,
                        date: data.date,
                        time: data.time,
                        guests: data.guests,
                        notes: data.notes || '',
                        sms_sent: businessSmsResult?.success || false,
                        sms_campaign_id: businessSmsResult?.id || null,
                        sms_sent_at: businessSmsResult?.success ? new Date().toISOString() : null,
                        status: 'pending',
                        ip_address: ip,
                        user_agent: userAgent
                    })
                    .select('id')
                    .single();

                if (error) {
                    console.warn('DB insert failed:', error.message);
                } else {
                    reservationId = insertedData?.id;
                    console.log('✅ Reservation saved:', reservationId);
                }
            } catch (dbError) {
                console.warn('DB operation failed:', dbError);
            }
        }

        // 7. Return success response
        return NextResponse.json({
            success: true,
            message: 'Rezervasyon talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
            data: {
                name: data.name,
                date: data.date,
                time: data.time,
                guests: data.guests
            },
            sms: {
                sent: businessSmsResult?.success || false,
                simulation: businessSmsResult?.simulation || false,
                error: smsError
            },
            reservation_id: reservationId
        });

    } catch (error) {
        console.error('Reservation API error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
                code: 'SERVER_ERROR'
            },
            { status: 500 }
        );
    }
}
