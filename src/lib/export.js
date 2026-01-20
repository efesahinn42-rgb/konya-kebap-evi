/**
 * Export Utilities for CSV/Excel
 */

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV(data, headers = null) {
    if (!data || data.length === 0) return '';

    // Use provided headers or extract from first object
    const csvHeaders = headers || Object.keys(data[0]);
    
    // Create header row
    const headerRow = csvHeaders.map(header => `"${header}"`).join(',');
    
    // Create data rows
    const dataRows = data.map(row => {
        return csvHeaders.map(header => {
            const value = row[header];
            // Handle null/undefined
            if (value === null || value === undefined) return '""';
            // Escape quotes and wrap in quotes
            return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',');
    });
    
    return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(data, filename, headers = null) {
    const csv = arrayToCSV(data, headers);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

/**
 * Format reservation data for export
 */
export function formatReservationsForExport(reservations) {
    return reservations.map(res => ({
        'ID': res.id,
        'Müşteri Adı': res.name,
        'Telefon': res.phone,
        'Tarih': res.date,
        'Saat': res.time,
        'Kişi Sayısı': res.guests,
        'Durum': getStatusLabel(res.status),
        'Notlar': res.notes || '',
        'SMS Gönderildi': res.sms_sent ? 'Evet' : 'Hayır',
        'Oluşturulma': new Date(res.created_at).toLocaleString('tr-TR'),
        'Onaylanma': res.confirmed_at ? new Date(res.confirmed_at).toLocaleString('tr-TR') : ''
    }));
}

/**
 * Format job applications for export
 */
export function formatApplicationsForExport(applications) {
    return applications.map(app => ({
        'ID': app.id,
        'Ad Soyad': app.full_name,
        'E-posta': app.email,
        'Telefon': app.phone,
        'Pozisyon': app.job_positions?.title || app.position_title || 'Genel Başvuru',
        'Durum': getApplicationStatusLabel(app.status),
        'Mesaj': app.message || '',
        'Başvuru Tarihi': new Date(app.created_at).toLocaleString('tr-TR')
    }));
}

function getStatusLabel(status) {
    const labels = {
        pending: 'Bekliyor',
        confirmed: 'Onaylandı',
        cancelled: 'İptal',
        completed: 'Tamamlandı',
        no_show: 'Gelmedi'
    };
    return labels[status] || status;
}

function getApplicationStatusLabel(status) {
    const labels = {
        pending: 'Beklemede',
        reviewed: 'İncelendi',
        contacted: 'İletişime Geçildi',
        rejected: 'Reddedildi'
    };
    return labels[status] || status;
}
