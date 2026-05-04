#!/bin/bash

SERVER_IP="89.252.153.114"
PORT="5522"

echo "========================================================="
echo "Konya Kebap Evi Proje Aktifleştirme İşlemi Başlıyor"
echo "Sunucu: $SERVER_IP (Port: $PORT)"
echo "========================================================="

ssh -p $PORT ubuntu@$SERVER_IP << 'EOF'
echo "--> Sunucuya bağlanıldı. Yönlendirme kaldırılıyor..."
# Nginx ayarından bakım yönlendirmesini temizle
sudo sed -i '/error_page 503 @maintenance;/d' /etc/nginx/sites-available/default
sudo sed -i '/return 503;/d' /etc/nginx/sites-available/default
sudo sed -i '/location @maintenance {/,/}/d' /etc/nginx/sites-available/default

echo "--> PM2 yeniden başlatılıyor ve Nginx aktif ediliyor..."
source ~/.nvm/nvm.sh
pm2 start kebap-evi || true
pm2 save
sudo systemctl reload nginx

echo "✅ Tüm işlemler başarıyla tamamlandı!"
EOF

echo "========================================================="
echo "İşlem tamamlandı. Lütfen tarayıcıdan konyakebapevi.com adresini kontrol edin."
echo "========================================================="
