---
description: Cenuta VDS sunucusuna bağlanma, projeyi güncelleme ve PM2 süreçlerini yönetme talimatları
---
# Sunucu Bağlantı ve Yönetim Talimatları (Konya Kebap Evi)

Bu proje, Cenuta(VDS) üzerinde barındırılmaktadır ve deployment işlemleri GitHub üzerinden çekilerek (pull) yapılmaktadır. Herhangi bir AI asistanı (ben veya başkası) bu projede sunucu işlemi yapacağı zaman aşağıdaki adımları ve bilgileri kullanmalıdır.

## 🔑 Bağlantı Bilgileri

- **Hedef Sunucu IP:** `89.252.153.114`
- **Kullanıcı Adı:** `ubuntu`
- **SSH Portu:** `5522` (Standart 22 portu DEĞİLDİR)
- **Proje Dizini:** `/var/www/konya-kebap-evi`
- **PM2 Süreç Adı:** `kebap-evi`
- **Çalışma Modu:** Standalone (`node .next/standalone/server.js`)

## 🚀 Standart Deployment Komutu
Kodlarda bir değişiklik yapıp GitHub'a pushladıktan sonra, sunucuyu güncellemek için deploy scriptini çalıştırın:

// turbo
```bash
ssh -p 5522 ubuntu@89.252.153.114 "source ~/.nvm/nvm.sh && bash /var/www/konya-kebap-evi/deploy.sh"
```

Bu script otomatik olarak şunları yapar:
1. `git pull origin main`
2. `npm run build`
3. Static + Public + .env dosyalarını standalone dizinine kopyalar
4. PM2'yi restart eder
5. Siteyi doğrular (HTTP 200 kontrolü)

*(Not: Build hatası olursa script durur ve `/tmp/build.log` içeriğini gösterir.)*

## 🛠️ Sunucu Durumunu Kontrol Etme
Sunucunun CPU, RAM veya PM2 durumunu incelemeniz gerekirse şu komutu kullanın:

// turbo
```bash
ssh -p 5522 ubuntu@89.252.153.114 "source ~/.nvm/nvm.sh && pm2 status && free -h && df -h /"
```

## 📋 Sunucu Sağlık Kontrolü
PM2 loglarını, Nginx durumunu ve sistem kaynaklarını incelemek için:

// turbo
```bash
ssh -p 5522 ubuntu@89.252.153.114 "source ~/.nvm/nvm.sh && pm2 logs kebap-evi --lines 50 --nostream 2>&1 && echo '---' && sudo systemctl status nginx --no-pager && echo '---' && uptime && free -h"
```

## ⚠️ Önemli Notlar
1. Proje **standalone modda** çalışıyor. Build sonrası `static`, `public` ve `.env` dosyaları standalone dizinine kopyalanmalıdır — `deploy.sh` bunu otomatik yapar.
2. Nginx ayarları `/etc/nginx/sites-available/default` konumundadır. SSL, Gzip ve Yönlendirmeler aktiftir.
3. Node versiyonunu yönetmek için bash içerisinde her zaman `source ~/.nvm/nvm.sh` komutu kullanılmalıdır, aksi takdirde PM2 veya npm bulunamayabilir.
4. `sharp@0.33.5` kuruludur (görsel optimizasyonu için). Sunucu CPU'su eski mimari olduğu için v0.34+ çalışmaz.
