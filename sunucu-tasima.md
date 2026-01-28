# 🚀 Konya Kebap Evi - Vercel → Cenuta Sunucu Taşıma Checklist

> **Proje Analizi Sonucu:**
> - Next.js 16.1.1 (App Router)
> - Supabase (PostgreSQL + Auth + Storage)
> - Upstash Redis (Rate Limiting)
> - Verimor SMS API (Sabit IP gerekli!)
> - GSAP + Framer Motion animasyonlar
> - **Hosting:** Cenuta.com (Ubuntu VPS)

---

## 📋 AŞAMA 1: Kod ve Hazırlık (Local Bilgisayar)

### Next.js Konfigürasyonu
- [x] `next.config.mjs` dosyasına `output: 'standalone'` eklendi ✓

### Package.json Kontrolü
- [x] `"start": "next start"` script mevcut ✓

### Ortam Değişkenleri (.env) - Hazır Değerler
Sunucuda oluşturulacak `.env` dosyası:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lavvxcrrxnwtovtwqgai.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdnZ4Y3JyeG53dG92dHdxZ2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MjY0NDMsImV4cCI6MjA4NDMwMjQ0M30.oHDp58rETW3-iNAEKKVxipsOpbFCG99-vIL75N1VrRA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdnZ4Y3JyeG53dG92dHdxZ2FpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODcyNjQ0MywiZXhwIjoyMDg0MzAyNDQzfQ.F3tgaLfm3_R_NlK1c7e5PqN4QX6Xy6XlP91eIUy8ex4

# === Verimor SMS API ===
VERIMOR_USERNAME=908502428742
VERIMOR_PASSWORD=LUK=697fsm
VERIMOR_SENDER=KONYAKEBAP

# SMS simülasyon modu (true = gerçek SMS gönderilmez)
# ⚠️ Canlıya aldıktan sonra false yapın!
SMS_SIMULATION_MODE=true

# İşyeri telefon numarası
BUSINESS_PHONE=905330769471

# === Upstash Redis (Rate Limiting için) ===
UPSTASH_REDIS_REST_URL=https://heroic-kit-19527.upstash.io
UPSTASH_REDIS_REST_TOKEN=AUxHAAIncDJiZmJmMGFkNTZjYTU0YTc5Yjg2MzI5ZWNmYmFkZWFhZHAyMTk1Mjc
```

### GitHub Actions CI/CD
- [x] `.github/workflows/deploy.yml` oluşturuldu ✓
- [ ] GitHub'a push yap

---

## 🖥️ AŞAMA 2: Cenuta Sunucu Kurulumu

### Sunucu Satın Alma (Cenuta.com)
- [ ] Cenuta.com'a giriş yap
- [ ] **Ubuntu 22.04 LTS** veya **24.04 LTS** seç
- [ ] **Minimum 1GB RAM** (Build için 2GB önerilir)
- [ ] Sunucu IP adresini not al: `_______________`
- [ ] SSH bilgilerini not al (kullanıcı adı, şifre veya key)

### SSH ile Bağlanma
```bash
ssh root@SUNUCU_IP_ADRESI
```

### Sistem Güncellemesi
- [ ] Güncelleme yap:
  ```bash
  apt update && apt upgrade -y
  ```

### Güvenlik Duvarı (UFW)
- [ ] UFW'yi aktifleştir:
  ```bash
  ufw allow OpenSSH
  ufw allow 80
  ufw allow 443
  ufw enable
  ```

### Nginx Kurulumu
- [ ] Nginx yükle:
  ```bash
  apt install nginx -y
  systemctl enable nginx
  ```

### Node.js Kurulumu (NVM ile)
- [ ] NVM yükle:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  source ~/.bashrc
  ```
- [ ] Node.js 20.x yükle:
  ```bash
  nvm install 20
  nvm use 20
  nvm alias default 20
  ```
- [ ] Kontrol et: `node -v` → v20.x.x

### PM2 Kurulumu
- [ ] PM2 yükle:
  ```bash
  npm install -g pm2
  ```

### Git Kurulumu
- [ ] Git yükle:
  ```bash
  apt install git -y
  ```

---

## 📦 AŞAMA 3: Projeyi Sunucuya Taşıma

### SSH Key Oluşturma (GitHub için)
- [ ] Sunucuda SSH key oluştur:
  ```bash
  ssh-keygen -t ed25519 -C "cenuta-kebapevi"
  cat ~/.ssh/id_ed25519.pub
  ```
- [ ] Çıkan public key'i GitHub → Settings → SSH Keys'e ekle

### Proje Klonlama
- [ ] www klasörü oluştur:
  ```bash
  mkdir -p /var/www
  cd /var/www
  ```
- [ ] Projeyi klonla:
  ```bash
  git clone git@github.com:efesahinn42-rgb/konya-kebap-evi.git
  cd konya-kebap-evi
  ```

### Ortam Değişkenlerini Oluşturma
- [ ] `.env` dosyası oluştur:
  ```bash
  nano .env
  ```
- [ ] Yukarıdaki `.env` içeriğini yapıştır ve kaydet (Ctrl+X, Y, Enter)

### Bağımlılıkları Yükleme ve Build
- [ ] NPM paketleri yükle:
  ```bash
  npm ci
  ```
- [ ] Projeyi derle:
  ```bash
  npm run build
  ```
- [ ] ⚠️ **RAM yetersizliği hatası alırsan:** Swap oluştur:
  ```bash
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
  # Sonra tekrar: npm run build
  ```

### PM2 ile Başlatma
- [ ] Uygulamayı başlat:
  ```bash
  pm2 start npm --name "kebap-evi" -- start
  pm2 save
  pm2 startup
  ```
- [ ] Çalıştığını kontrol et: `pm2 status`

### İlk Test
- [ ] Tarayıcıda test et: `http://SUNUCU_IP:3000`

---

## 🔄 AŞAMA 4: GitHub Actions Kurulumu (Otomatik Deploy)

### Sunucuda Deploy Kullanıcısı Oluşturma
```bash
# Yeni deploy kullanıcısı oluştur
adduser deploy
usermod -aG sudo deploy

# SSH key oluştur
su - deploy
ssh-keygen -t ed25519 -C "github-actions"
cat ~/.ssh/id_ed25519

# id_ed25519 (PRIVATE KEY) içeriğini not al - GitHub'a eklenecek
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Proje Klasörü İzinleri
```bash
# root olarak çalıştır
chown -R deploy:deploy /var/www/konya-kebap-evi
```

### GitHub Secrets Ekleme
GitHub reponuzda: **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|-------------|-------|
| `SERVER_HOST` | Cenuta sunucu IP adresi |
| `SERVER_USERNAME` | `deploy` |
| `SERVER_SSH_KEY` | Sunucudaki `id_ed25519` private key içeriği |
| `SERVER_PORT` | `22` (veya Cenuta'nın belirlediği port) |

### Test Push
- [ ] Local'de herhangi bir değişiklik yap
- [ ] `git push origin main`
- [ ] GitHub Actions sekmesinden deploy durumunu kontrol et

---

## 🌐 AŞAMA 5: Domain ve DNS Yönlendirmesi

### DNS Ayarları
- [ ] Domain paneline git
- [ ] **Mevcut A kaydını** (Vercel IP) sil veya güncelle
- [ ] **Yeni A kayıtları** oluştur:

| Host | Type | Value |
|------|------|-------|
| @ | A | SUNUCU_IP |
| www | A | SUNUCU_IP |

- [ ] DNS propagasyonunu bekle (1-24 saat)
- [ ] Kontrol et: `nslookup konyakebapevi.com`

---

## ⚙️ AŞAMA 6: Nginx ve SSL Ayarları

### Nginx Konfigürasyonu
- [ ] Config dosyasını düzenle:
  ```bash
  nano /etc/nginx/sites-available/default
  ```
- [ ] İçeriği şu şekilde değiştir:
  ```nginx
  server {
      listen 80;
      listen [::]:80;
      server_name konyakebapevi.com www.konyakebapevi.com;

      gzip on;
      gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
      gzip_min_length 256;

      location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_cache_bypass $http_upgrade;
          
          proxy_connect_timeout 60s;
          proxy_send_timeout 60s;
          proxy_read_timeout 60s;
      }

      location /_next/static {
          proxy_pass http://localhost:3000;
          add_header Cache-Control "public, max-age=31536000, immutable";
      }
  }
  ```
- [ ] Nginx test et: `nginx -t`
- [ ] Nginx yeniden başlat: `systemctl restart nginx`

### SSL Sertifikası (Let's Encrypt)
- [ ] Certbot yükle:
  ```bash
  apt install certbot python3-certbot-nginx -y
  ```
- [ ] Sertifika al:
  ```bash
  certbot --nginx -d konyakebapevi.com -d www.konyakebapevi.com
  ```
- [ ] "Redirect (2)" seçeneğini seç
- [ ] Kontrol et: `https://konyakebapevi.com`

---

## 📱 AŞAMA 7: SMS Entegrasyonu (Verimor)

> ⚠️ **ŞU AN SMS SİMÜLASYON MODUNDA!** Gerçek SMS gönderilmiyor.

### Simülasyon Modundan Çıkış (Canlıya Aldıktan Sonra)
- [ ] Verimor paneline giriş yap
- [ ] **API Güvenlik Ayarları** → Cenuta sunucu IP adresini ekle
- [ ] Sunucuda `.env` dosyasını düzenle:
  ```bash
  nano /var/www/konya-kebap-evi/.env
  # SMS_SIMULATION_MODE=true → SMS_SIMULATION_MODE=false yap
  ```
- [ ] Uygulamayı yeniden başlat:
  ```bash
  pm2 restart kebap-evi
  ```

### SMS Testi
- [ ] Admin panelden test rezervasyonu oluştur
- [ ] SMS'in gelip gelmediğini kontrol et

---

## ✅ AŞAMA 8: Final Kontroller

### Fonksiyonel Testler
- [ ] Ana sayfa yükleniyor mu?
- [ ] Hero slider çalışıyor mu?
- [ ] Menü sayfası yükleniyor mu?
- [ ] Rezervasyon formu çalışıyor mu?
- [ ] Admin panel girişi çalışıyor mu?
- [ ] Supabase bağlantısı OK?

### GitHub Actions Testi
- [ ] Küçük bir değişiklik yap ve push et
- [ ] Actions sekmesinden deploy'un çalıştığını kontrol et
- [ ] Site güncellenmiş mi?

---

## 🔥 EK ADIMLAR (Opsiyonel)

### PM2 Monitoring
```bash
pm2 logs kebap-evi
pm2 monit
```

### Fail2Ban (Brute Force Koruması)
```bash
apt install fail2ban -y
systemctl enable fail2ban
```

### Otomatik Backup Script
```bash
nano /root/backup.sh
```
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
mkdir -p /root/backups
tar -czf /root/backups/kebapevi_$DATE.tar.gz /var/www/konya-kebap-evi/.env
find /root/backups -mtime +7 -delete
```
```bash
chmod +x /root/backup.sh
crontab -e
# Ekle: 0 3 * * * /root/backup.sh
```

---

## 📝 Bilgi Tablosu

| Bilgi | Değer |
|-------|-------|
| Hosting | Cenuta.com |
| Sunucu IP | _______________ |
| Domain | konyakebapevi.com |
| SSH Bağlantı | `ssh deploy@SUNUCU_IP` |
| Proje Dizini | `/var/www/konya-kebap-evi` |
| PM2 App Adı | kebap-evi |
| Node.js Sürümü | v20.x |
| SMS Modu | **SİMÜLASYON** (canlı için false yap) |

---

## 🆘 Sorun Giderme

### Build hatası: "JavaScript heap out of memory"
```bash
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build
```

### PM2 çökerse:
```bash
pm2 restart kebap-evi
pm2 logs kebap-evi --lines 100
```

### Nginx 502 Bad Gateway:
```bash
pm2 status
pm2 logs kebap-evi
pm2 restart kebap-evi
```

### GitHub Actions çalışmıyor:
1. Secrets'ların doğru eklendiğinden emin ol
2. SSH key formatını kontrol et (-----BEGIN ... -----END)
3. Sunucuda `/var/www/konya-kebap-evi` klasör izinlerini kontrol et

### DNS güncellemesi yansımadı:
```bash
# Mac: sudo dscacheutil -flushcache
# Kontrol: https://dnschecker.org
```
