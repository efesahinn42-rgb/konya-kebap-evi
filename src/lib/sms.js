//
// Verimor SMS Service with Simulation Mode
//
export async function sendSMS(phone, message) {
    const isSimulation = process.env.SMS_SIMULATION_MODE === 'true';

    // Log for debugging
    console.log(`📱 SMS Request: ${phone} - Mode: ${isSimulation ? 'SIMULATION' : 'PRODUCTION'}`);

    if (isSimulation) {
        // Simulation mode - don't send real SMS, just log
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📱 [SİMÜLASYON] SMS Gönderildi');
        console.log(`📞 Alıcı: ${phone}`);
        console.log(`📝 Mesaj: ${message}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return {
            success: true,
            simulation: true,
            id: 'SIM-' + Date.now(),
            phone,
            message
        };
    }

    // Production mode - send real SMS via Verimor API
    try {
        const response = await fetch('https://sms.verimor.com.tr/v2/send.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: process.env.VERIMOR_USERNAME,
                password: process.env.VERIMOR_PASSWORD,
                source_addr: process.env.VERIMOR_SENDER || 'KONYAKEBAP',
                datacoding: '1', // Türkçe karakter desteği
                messages: [{
                    msg: message,
                    dest: phone
                }]
            })
        });

        const responseText = await response.text();

        if (!response.ok) {
            console.error('SMS API Error:', response.status, responseText);
            throw new Error(`SMS hatası: ${response.status} - ${responseText}`);
        }

        console.log('✅ SMS başarıyla gönderildi. Kampanya ID:', responseText);

        return {
            success: true,
            simulation: false,
            id: responseText,
            phone
        };
    } catch (error) {
        console.error('SMS gönderim hatası:', error);
        throw error;
    }
}

// Send reservation SMS to customer
export async function sendCustomerSMS(phone, reservationData) {
    const { name, date, time, guests } = reservationData;

    const message = `Sayın ${name}, ${date} tarihinde saat ${time}'de ${guests} kişilik rezervasyonunuz alınmıştır. Konya Kebap Evi - 444 87 42`;

    return sendSMS(phone, message);
}

// Send reservation SMS to business
export async function sendBusinessSMS(reservationData) {
    const businessPhone = process.env.BUSINESS_PHONE;

    if (!businessPhone) {
        console.warn('⚠️ BUSINESS_PHONE env variable not set, skipping business SMS');
        return { success: false, reason: 'no_business_phone' };
    }

    const { name, phone, date, time, guests, notes } = reservationData;

    const message = `Yeni Rezervasyon! ${name} - ${phone} - ${date} ${time} - ${guests} kişi${notes ? ' - Not: ' + notes.substring(0, 50) : ''}`;

    return sendSMS(businessPhone, message);
}
