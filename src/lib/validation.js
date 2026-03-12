//
// Zod Validation Schemas for Reservation Form
//
import { z } from 'zod';

// Restoran çalışma saatleri
export const WORKING_HOURS = {
    start: 12, // 12:00
    end: 22    // 22:00
};

// Geçerli saatler listesi
export const VALID_TIMES = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
];

// Bugünün tarihini YYYY-MM-DD formatında al
export function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Maksimum rezervasyon tarihi (30 gün sonra)
export function getMaxDate() {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
}

// Tarihin geçerli olup olmadığını kontrol et
function isValidDate(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);

    // Geçmiş tarih kontrolü
    if (selectedDate < today) {
        return false;
    }

    // 30 günden fazla ileri tarih kontrolü
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    maxDate.setHours(0, 0, 0, 0);

    if (selectedDate > maxDate) {
        return false;
    }

    return true;
}

// Saat kontrolü (çalışma saatleri içinde mi)
function isValidTime(timeStr) {
    return VALID_TIMES.includes(timeStr);
}

// Bugün için geçmiş saat kontrolü
function isTimeAvailableForToday(dateStr, timeStr) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Bugün değilse sorun yok
    if (dateStr !== todayStr) {
        return true;
    }

    // Bugün ise, seçilen saat geçmiş mi kontrol et
    const [hours, minutes] = timeStr.split(':').map(Number);
    const selectedTime = hours * 60 + minutes;
    const currentTime = today.getHours() * 60 + today.getMinutes();

    // En az 1 saat önceden rezervasyon yapılmalı
    return selectedTime > currentTime + 60;
}

export const reservationSchema = z.object({
    name: z.string()
        .min(2, 'İsim en az 2 karakter olmalı')
        .max(50, 'İsim en fazla 50 karakter olabilir')
        .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Sadece harf ve boşluk kullanılabilir'),

    phone: z.string()
        .transform(val => val.replace(/\s/g, '')) // Boşlukları kaldır
        .refine(val => /^(05\d{9}|5\d{9})$/.test(val), {
            message: 'Geçerli bir telefon numarası girin (05XX XXX XX XX)'
        }),

    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Geçerli bir tarih seçin')
        .refine(isValidDate, {
            message: 'Geçmiş tarihe veya 30 günden fazla ileriye rezervasyon yapılamaz'
        }),

    time: z.string()
        .refine(isValidTime, {
            message: 'Lütfen çalışma saatlerinden birini seçin (12:00-22:00)'
        }),

    guests: z.string()
        .regex(/^(\d+|\d+\+)$/, 'Geçerli kişi sayısı girin'),

    notes: z.string()
        .max(200, 'Notlar en fazla 200 karakter olabilir')
        .optional()
        .default('')
}).refine(
    (data) => isTimeAvailableForToday(data.date, data.time),
    {
        message: 'Bugün için en az 1 saat sonrasına rezervasyon yapabilirsiniz',
        path: ['time']
    }
);

// Helper function to format phone number for SMS API (905XXXXXXXXX format)
export function formatPhoneForSMS(phone) {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // If starts with 0, replace with 90
    if (digits.startsWith('0')) {
        return '9' + digits;
    }
    // If starts with 5, add 90
    if (digits.startsWith('5')) {
        return '90' + digits;
    }
    return digits;
}

// Helper function to format phone for display (05XX XXX XX XX)
export function formatPhoneDisplay(value) {
    // Sadece rakamları al
    const digits = value.replace(/\D/g, '');

    // Maksimum 11 karakter (05XXXXXXXXX)
    const limited = digits.slice(0, 11);

    // Format: 05XX XXX XX XX
    if (limited.length <= 4) {
        return limited;
    } else if (limited.length <= 7) {
        return `${limited.slice(0, 4)} ${limited.slice(4)}`;
    } else if (limited.length <= 9) {
        return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(7)}`;
    } else {
        return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(7, 9)} ${limited.slice(9)}`;
    }
}
