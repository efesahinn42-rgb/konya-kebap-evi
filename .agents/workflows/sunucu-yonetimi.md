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

## 🚀 Standart Deployment Komutu
Kodlarda bir değişiklik yapıp GitHub'a pushladıktan sonra, sunucuyu güncellemek için tek satırlık şu komutu çalıştırın (NVM ortam değişkenlerini de yükler):

// turbo
```bash
ssh -p 5522 ubuntu@89.252.153.114 "source ~/.nvm/nvm.sh && cd /var/www/konya-kebap-evi && git pull origin main && npm run build > /tmp/build.log 2>&1 && pm2 restart kebap-evi && echo 'DEPLOY_SUCCESS'"
```

*(Not: Eğer build hatası alırsanız, logları okumak için ssh üzerinden `/tmp/build.log` dosyasına bakabilirsiniz.)*

## 🛠️ Sunucu Durumunu Kontrol Etme
Sunucunun CPU, RAM veya PM2 durumunu incelemeniz gerekirse şu komutu kullanın:

// turbo
```bash
ssh -p 5522 ubuntu@89.252.153.114 "source ~/.nvm/nvm.sh && pm2 monit" # Veya anlık liste için: pm2 list
```

## ⚠️ Önemli Notlar
1. Projede **1200MB RAM Restart Limiti** vardır. Next.js aşırı bellek tüketirse otomatik yeniden başlar.
2. Nginx ayarları `/etc/nginx/sites-available/default` konumundadır. SSL, Gzip ve Yönlendirmeler aktiftir.
3. Node versiyonunu yönetmek için bash içerisinde her zaman `source ~/.nvm/nvm.sh` komutu kullanılmalıdır, aksi takdirde PM2 veya npm bulunamayabilir.
