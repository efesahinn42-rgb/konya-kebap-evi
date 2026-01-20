/**
 * Form Validation Utilities
 */

// Email validation
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation (Turkish format)
export function validatePhone(phone) {
    // Remove spaces and special characters
    const cleaned = phone.replace(/\s+/g, '').replace(/[()-]/g, '');
    // Check if it's a valid Turkish phone number
    const re = /^(0|90)?[5][0-9]{9}$/;
    return re.test(cleaned);
}

// URL validation
export function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// YouTube URL validation
export function validateYouTubeURL(url) {
    const patterns = [
        /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
        /^https?:\/\/(www\.)?youtube\.com\/embed\/.+/,
        /^https?:\/\/youtu\.be\/.+/
    ];
    return patterns.some(pattern => pattern.test(url));
}

// Price validation (positive number with 2 decimals)
export function validatePrice(price) {
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0 && /^\d+(\.\d{1,2})?$/.test(price.toString());
}

// Date validation (YYYY-MM-DD or Turkish format)
export function validateDate(dateString) {
    // Accept various formats
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

// Required field validation
export function validateRequired(value) {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
}

// Number validation
export function validateNumber(value, min = null, max = null) {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
}

// Text length validation
export function validateLength(text, min = 0, max = Infinity) {
    if (typeof text !== 'string') return false;
    const length = text.trim().length;
    return length >= min && length <= max;
}

// Color hex validation
export function validateColorHex(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// Form validation helper
export function validateForm(formData, rules) {
    const errors = {};
    
    for (const [field, fieldRules] of Object.entries(rules)) {
        const value = formData[field];
        
        for (const rule of fieldRules) {
            if (rule.required && !validateRequired(value)) {
                errors[field] = rule.message || `${field} zorunludur`;
                break;
            }
            
            if (rule.email && value && !validateEmail(value)) {
                errors[field] = rule.message || 'Geçerli bir e-posta adresi girin';
                break;
            }
            
            if (rule.phone && value && !validatePhone(value)) {
                errors[field] = rule.message || 'Geçerli bir telefon numarası girin';
                break;
            }
            
            if (rule.url && value && !validateURL(value)) {
                errors[field] = rule.message || 'Geçerli bir URL girin';
                break;
            }
            
            if (rule.youtube && value && !validateYouTubeURL(value)) {
                errors[field] = rule.message || 'Geçerli bir YouTube URL\'si girin';
                break;
            }
            
            if (rule.price && value && !validatePrice(value)) {
                errors[field] = rule.message || 'Geçerli bir fiyat girin (örn: 99.99)';
                break;
            }
            
            if (rule.date && value && !validateDate(value)) {
                errors[field] = rule.message || 'Geçerli bir tarih girin';
                break;
            }
            
            if (rule.minLength && value && !validateLength(value, rule.minLength)) {
                errors[field] = rule.message || `En az ${rule.minLength} karakter olmalıdır`;
                break;
            }
            
            if (rule.maxLength && value && !validateLength(value, 0, rule.maxLength)) {
                errors[field] = rule.message || `En fazla ${rule.maxLength} karakter olabilir`;
                break;
            }
            
            if (rule.color && value && !validateColorHex(value)) {
                errors[field] = rule.message || 'Geçerli bir renk kodu girin (#RRGGBB)';
                break;
            }
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
