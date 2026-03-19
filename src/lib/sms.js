//
// Verimor SMS Service with Simulation Mode
// Improved version with proper error handling, timeout, and retry mechanism
//

// Environment variable validation
function validateSMSConfig() {
    const isSimulation = process.env.SMS_SIMULATION_MODE === 'true';
    
    if (isSimulation) {
        return { valid: true, mode: 'simulation' };
    }

    const username = process.env.VERIMOR_USERNAME;
    const password = process.env.VERIMOR_PASSWORD;
    const sender = process.env.VERIMOR_SENDER;

    if (!username || !password) {
        console.warn('⚠️ VERIMOR_USERNAME or VERIMOR_PASSWORD not set. SMS will not work.');
        return { valid: false, mode: 'production', missing: !username ? 'username' : 'password' };
    }

    if (!sender) {
        console.warn('⚠️ VERIMOR_SENDER not set. Using default: KONYAKEBAP');
    }

    return { valid: true, mode: 'production' };
}

// Validate and normalize phone number
function normalizePhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') {
        throw new Error('Telefon numarası geçersiz');
    }

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Turkish phone number validation
    if (digits.length < 10 || digits.length > 13) {
        throw new Error('Telefon numarası formatı geçersiz');
    }

    // Normalize to 905XXXXXXXXX format
    let normalized;
    if (digits.startsWith('0')) {
        // 05XX format -> 905XX
        normalized = '9' + digits;
    } else if (digits.startsWith('5')) {
        // 5XX format -> 905XX
        normalized = '90' + digits;
    } else if (digits.startsWith('90')) {
        // Already in 90 format
        normalized = digits;
    } else if (digits.startsWith('9')) {
        // Already in 9 format
        normalized = digits;
    } else {
        throw new Error('Telefon numarası formatı geçersiz');
    }

    // Final validation: should be 12 digits (905XXXXXXXXX)
    if (normalized.length !== 12 || !normalized.startsWith('905')) {
        throw new Error('Telefon numarası Türkiye formatında olmalıdır (05XX XXX XX XX)');
    }

    return normalized;
}

// Send SMS with retry mechanism
async function sendSMSWithRetry(phone, message, maxRetries = 3) {
    const config = validateSMSConfig();
    const isSimulation = config.mode === 'simulation';

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone);

    // Log (without sensitive data)
    console.log(`📱 SMS Request: ${normalizedPhone.substring(0, 5)}**** - Mode: ${isSimulation ? 'SIMULATION' : 'PRODUCTION'}`);

    if (isSimulation) {
        // Simulation mode - don't send real SMS, just log
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📱 [SİMÜLASYON] SMS Gönderildi');
        console.log(`📞 Alıcı: ${normalizedPhone}`);
        console.log(`📝 Mesaj: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return {
            success: true,
            simulation: true,
            id: 'SIM-' + Date.now(),
            phone: normalizedPhone,
            message: message.substring(0, 100) // Limit message in response
        };
    }

    // Production mode - validate config
    if (!config.valid) {
        throw new Error(`SMS yapılandırması eksik: ${config.missing}`);
    }

    const username = process.env.VERIMOR_USERNAME;
    const password = process.env.VERIMOR_PASSWORD;
    const sourceAddr = process.env.VERIMOR_SENDER || 'KONYAKEBAP';

    // Prepare request body according to Verimor API documentation
    const requestBody = {
        username: username,
        password: password,
        source_addr: sourceAddr,
        datacoding: '1', // Turkish character support (UTF-8)
        messages: [{
            msg: message,
            dest: normalizedPhone // Single phone or comma-separated for multiple
        }]
    };

    // Retry mechanism
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

            const response = await fetch('https://sms.verimor.com.tr/v2/send.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const responseText = await response.text();

            // Handle different HTTP status codes
            if (response.ok) {
                // Success - response is campaign ID (string)
                const campaignId = responseText.trim();
                
                console.log(`✅ SMS başarıyla gönderildi. Kampanya ID: ${campaignId.substring(0, 20)}...`);

                return {
                    success: true,
                    simulation: false,
                    id: campaignId,
                    phone: normalizedPhone,
                    attempt: attempt
                };
            }

            // Handle specific error codes
            let errorMessage = 'SMS gönderilemedi';
            switch (response.status) {
                case 400:
                    errorMessage = 'Hatalı istek. Başlık onaylanmamış veya mesaj formatı hatalı olabilir.';
                    break;
                case 401:
                    errorMessage = 'Kimlik doğrulama hatası. Kullanıcı adı veya şifre hatalı.';
                    break;
                case 413:
                    errorMessage = 'İstek çok büyük. Mesaj veya telefon numarası listesi çok uzun.';
                    break;
                case 429:
                    errorMessage = 'Rate limit aşıldı. Lütfen daha sonra tekrar deneyin.';
                    break;
                default:
                    errorMessage = `SMS API hatası: ${response.status}`;
            }

            // Log error (without sensitive data)
            console.error(`❌ SMS API Error (Attempt ${attempt}/${maxRetries}):`, {
                status: response.status,
                message: errorMessage,
                response: responseText.substring(0, 200) // Limit response length
            });

            lastError = new Error(errorMessage);

            // Don't retry on client errors (4xx) except 429
            if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                throw lastError;
            }

            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
                const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Max 5 seconds
                console.log(`⏳ ${waitTime}ms sonra tekrar denenecek...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                lastError = new Error('SMS gönderimi zaman aşımına uğradı (30 saniye)');
                console.error('⏱️ SMS Timeout:', lastError.message);
            } else if (error.message) {
                lastError = error;
            } else {
                lastError = new Error('SMS gönderiminde bilinmeyen bir hata oluştu');
                console.error('❌ SMS Network Error:', error);
            }

            // Don't retry on timeout or validation errors
            if (error.name === 'AbortError' || error.message.includes('formatı')) {
                throw lastError;
            }

            // Wait before retry
            if (attempt < maxRetries) {
                const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                console.log(`⏳ ${waitTime}ms sonra tekrar denenecek...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }

    // All retries failed
    throw lastError || new Error('SMS gönderilemedi. Tüm denemeler başarısız oldu.');
}

// Main sendSMS function (backward compatible)
export async function sendSMS(phone, message) {
    return sendSMSWithRetry(phone, message);
}

// Send reservation SMS to customer
export async function sendCustomerSMS(phone, reservationData) {
    const { name, date, time, guests } = reservationData;

    const message = `Sayın ${name}, ${date} tarihinde saat ${time}'de ${guests} kişilik rezervasyonunuz alınmıştır. Konya Kebap Evi - 0332 249 99 89`;

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

    // Format message for business (concise)
    const message = `Yeni Rezervasyon! ${name} - ${phone} - ${date} ${time} - ${guests} kişi${notes ? ' - Not: ' + notes.substring(0, 50) : ''}`;

    return sendSMS(businessPhone, message);
}
