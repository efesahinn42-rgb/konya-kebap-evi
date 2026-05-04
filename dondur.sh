#!/bin/bash

SERVER_IP="89.252.153.114"
PORT="5522"

echo "========================================================="
echo "Konya Kebap Evi Proje Dondurma İşlemi Başlıyor"
echo "Sunucu: $SERVER_IP (Port: $PORT)"
echo "========================================================="

ssh -p $PORT ubuntu@$SERVER_IP << 'EOF'
echo "--> Sunucuya bağlanıldı. Bakım sayfası oluşturuluyor..."
sudo bash -c 'cat << "INNER_EOF" > /var/www/html/maintenance.html
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-width=1.0">
    <title>Sistem Bakımda</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; background-color: #f9fafb; color: #111827; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
        .container { max-width: 600px; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        h1 { color: #d4af37; margin-bottom: 1rem; }
        p { color: #4b5563; line-height: 1.5; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Sistem Bakımda</h1>
        <p>Web sitemizde şu anda planlı bir altyapı çalışması gerçekleştirilmektedir.<br>Anlayışınız için teşekkür ederiz.</p>
    </div>
</body>
</html>
INNER_EOF'

echo "--> Nginx yönlendirmesi ekleniyor..."
sudo sed -i '/error_page 503 @maintenance;/d' /etc/nginx/sites-available/default
sudo sed -i '/return 503;/d' /etc/nginx/sites-available/default
sudo sed -i '/location @maintenance {/,/}/d' /etc/nginx/sites-available/default

sudo sed -i '/location \/ {/i \
    error_page 503 @maintenance;\n    return 503;\n\n    location @maintenance {\n        root /var/www/html;\n        rewrite ^(.*)$ /maintenance.html break;\n    }\n' /etc/nginx/sites-available/default

echo "--> PM2 durduruluyor ve Nginx yeniden başlatılıyor..."
source ~/.nvm/nvm.sh
pm2 stop kebap-evi || true
pm2 save
sudo systemctl reload nginx

echo "✅ Tüm işlemler başarıyla tamamlandı!"
EOF

echo "========================================================="
echo "İşlem tamamlandı. Lütfen tarayıcıdan konyakebapevi.com adresini kontrol edin."
echo "========================================================="
