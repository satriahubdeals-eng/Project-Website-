# Project Website

Website statis untuk tugas DP RPL yang berisi profil, biodata, dan artikel sejarah.
Project ini tidak memakai database, backend, Node.js, atau proses build sehingga dapat
dijalankan di komputer lokal, GitHub Pages, Netlify, shared hosting, maupun VPS.

## Informasi Umum

| Informasi | Keterangan |
| --- | --- |
| Nama project | Project Website |
| Pembuat | Satria Mahadmadani Rafan |
| Tujuan | Menampilkan profil penulis, biodata, dan tulisan sejarah secara online |
| Jenis aplikasi | Website statis berbasis HTML, CSS, dan JavaScript |
| Repository | `https://github.com/satriahubdeals-eng/Project-Website-` |
| Branch produksi | `main` |
| Entry point | `index.html` |
| Bahasa konten | Bahasa Indonesia |

### Tujuan Project

Project ini dibuat sebagai media pembelajaran dan publikasi sederhana untuk:

- memperkenalkan profil dan biodata pembuat;
- menyajikan artikel sejarah Yogyakarta;
- mempraktikkan HTML, CSS, JavaScript, struktur halaman, dan publikasi website;
- menyediakan website yang dapat diakses melalui URL atau domain sendiri.

### Pembuat dan Pengelola

Website ini dibuat oleh **Satria Mahadmadani Rafan**. Pengelolaan isi dilakukan dengan
mengubah file HTML dan aset di repository GitHub. Pastikan informasi pribadi, foto, dan
gambar eksternal memang boleh ditampilkan secara publik.

## Isi Repository

```text
.
├── index.html                     # Halaman masuk, mengarah ke profil
├── profile.html                   # Halaman profil penulis
├── biodata.html                   # Halaman biodata
├── Sejarah.html                   # Halaman artikel sejarah
├── img/                           # Foto dan aset lokal
├── .github/workflows/
│   └── deploy-pages.yml           # Deployment otomatis ke GitHub Pages
└── README.md                      # Dokumentasi project
```

Nama file dan path bersifat case-sensitive pada Linux. `Sejarah.html` berbeda dari
`sejarah.html`, jadi gunakan penulisan yang sama saat membuat tautan.

## Prasyarat

Siapkan Git, VS Code atau editor HTML, Python 3 untuk server lokal, serta repository
GitHub dan branch `main` untuk deployment otomatis. Untuk deployment VPS, siapkan VPS
Ubuntu, akses SSH, domain, dan akses ke panel DNS.

Node.js versi 18 atau lebih baru diperlukan jika ingin menjalankan `server.js`.

## Menjalankan secara lokal

Jalankan server lokal dari folder project:

```bash
python3 -m http.server 8080
```

Kemudian buka `http://localhost:8080`.

Halaman yang tersedia:

- `http://localhost:8080/`
- `http://localhost:8080/profile.html`
- `http://localhost:8080/biodata.html`
- `http://localhost:8080/Sejarah.html`

### Menjalankan dari VS Code

Buka menu **Run and Debug** (`Ctrl+Shift+D`), lalu pilih salah satu konfigurasi:

- **Website: Python + Chrome** untuk menjalankan server Python lokal dan membuka Chrome.
- **Website: Node.js + Chrome** untuk menjalankan `server.js` dan membuka Chrome.
- **Website: PHP + Chrome** jika environment memiliki PHP.
- **Website: Open hosted URL** untuk membuka URL VPS, GitHub Pages, atau hosting lain.
- **Website: Attach to Chrome** untuk menyambungkan debugger ke Chrome yang dijalankan
	dengan remote debugging pada port `9222`.

Konfigurasi berada di `.vscode/launch.json`, sedangkan perintah server berada di
`.vscode/tasks.json`. `launch.json` hanya membantu menjalankan atau membuka website dari
VS Code; VPS dan hosting tetap harus dikonfigurasi dengan Nginx, Apache, cPanel, atau
layanan hosting masing-masing seperti yang dijelaskan di bawah.

### Menjalankan dengan Node.js

```bash
node server.js
```

Kemudian buka `http://localhost:8080`. Port dapat diubah tanpa mengedit file:

```bash
PORT=3000 node server.js
```

Pada Windows PowerShell, gunakan:

```powershell
$env:PORT=3000; node server.js
```

## Alur Perubahan dan Upload

Setelah mengubah file, periksa website lokal lalu jalankan:

```bash
git status
git add .
git commit -m "Perbarui konten website"
git push origin main
```

Jangan memasukkan password, token, file `.env`, atau data rahasia ke repository.

## Opsi A: Deploy ke GitHub Pages

Workflow di `.github/workflows/deploy-pages.yml` menerbitkan website otomatis setiap ada push ke branch `main`.

1. Buka repository di GitHub, lalu masuk ke **Settings > Pages**.
2. Pada **Build and deployment**, pilih **GitHub Actions** sebagai source.
3. Push perubahan ke branch `main` dan tunggu workflow selesai di tab **Actions**.
4. URL default website akan muncul di **Settings > Pages**.

Jika workflow gagal, buka run yang berwarna merah di tab **Actions**, baca langkah yang
gagal, lalu perbaiki file terkait sebelum melakukan push ulang.

## Menggunakan domain sendiri

1. Di penyedia domain, buat DNS record `CNAME` untuk subdomain, misalnya `www`, yang mengarah ke `satriahubdeals-eng.github.io`.
2. Untuk domain utama, gunakan record `A` ke alamat IP GitHub Pages sesuai dokumentasi GitHub.
3. Di **Settings > Pages > Custom domain**, masukkan domain yang digunakan dan simpan.
4. Aktifkan **Enforce HTTPS** setelah DNS selesai diverifikasi.

Jika domain kustom sudah ditetapkan, tambahkan file bernama `CNAME` di root project dengan satu baris berisi domain tersebut, contoh:

```text
www.contohdomain.com
```

Jangan memakai contoh domain di atas sebagai konfigurasi produksi.

## Opsi B: Deploy ke VPS Ubuntu dengan Nginx

Bagian ini menggunakan Ubuntu 22.04/24.04 dan Nginx. Ganti `DOMAIN_ANDA` dengan domain
yang benar.

### 1. Login dan pasang Nginx

```bash
ssh root@IP_VPS
apt update && apt upgrade -y
apt install -y nginx git
systemctl enable --now nginx
```

Sebaiknya gunakan user biasa dengan `sudo` untuk penggunaan harian. Pastikan port 80 dan
443 diizinkan oleh firewall VPS.

### 2. Clone project

```bash
mkdir -p /var/www/project-website
git clone https://github.com/satriahubdeals-eng/Project-Website- \
	/var/www/project-website
```

Untuk update project yang sudah ada:

```bash
cd /var/www/project-website
git pull origin main
```

### 3. Konfigurasi Nginx

Buat file `/etc/nginx/sites-available/project-website`:

```bash
nano /etc/nginx/sites-available/project-website
```

Isi dengan konfigurasi berikut dan ganti `DOMAIN_ANDA`:

```nginx
server {
		listen 80;
		listen [::]:80;
		server_name DOMAIN_ANDA www.DOMAIN_ANDA;

		root /var/www/project-website;
		index index.html;

		location / {
				try_files $uri $uri/ =404;
		}
}
```

Aktifkan konfigurasi:

```bash
ln -s /etc/nginx/sites-available/project-website \
	/etc/nginx/sites-enabled/project-website
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

`nginx -t` harus menampilkan `syntax is ok` dan `test is successful`.

### 4. Atur DNS domain ke VPS

Di panel DNS domain, buat record berikut:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | IP publik VPS |
| A | `www` | IP publik VPS |

Jika `www` memakai CNAME, arahkan ke domain utama. Tunggu propagasi DNS sebelum menguji
domain.

### 5. Aktifkan HTTPS

Setelah domain mengarah ke VPS dan dapat dibuka melalui HTTP:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d DOMAIN_ANDA -d www.DOMAIN_ANDA
certbot renew --dry-run
```

Ikuti prompt email dan persetujuan, lalu pilih pengalihan HTTP ke HTTPS jika ditawarkan.

### 6. Update website di VPS

```bash
cd /var/www/project-website
git pull origin main
nginx -t
systemctl reload nginx
```

Website statis tidak membutuhkan restart aplikasi. Reload Nginx hanya diperlukan bila
konfigurasi Nginx berubah.

### Alternatif VPS: menjalankan `server.js` langsung

Gunakan cara ini hanya jika hosting/VPS memang mendukung Node.js dan port aplikasi dapat
dipublikasikan melalui reverse proxy. Pasang Node.js, clone project, lalu jalankan:

```bash
cd /var/www/project-website
PORT=8080 HOST=127.0.0.1 node server.js
```

Untuk proses produksi, gunakan process manager seperti PM2:

```bash
npm install --global pm2
PORT=8080 HOST=127.0.0.1 pm2 start server.js --name project-website
pm2 save
pm2 startup
```

Nginx tetap diperlukan sebagai reverse proxy HTTPS. Pada konfigurasi Nginx, gunakan:

```nginx
location / {
	proxy_pass http://127.0.0.1:8080;
	proxy_http_version 1.1;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto $scheme;
}
```

Setelah mengubah konfigurasi, jalankan `nginx -t` lalu `systemctl reload nginx`.

## Opsi C: Hosting cPanel atau Shared Hosting

1. Buka **File Manager** dan masuk ke `public_html` atau document root domain.
2. Upload `index.html`, halaman HTML, folder `img`, dan file pendukung lainnya.
3. Pastikan `index.html` berada langsung di document root.
4. Atur document root domain ke folder tersebut.
5. Aktifkan SSL dari menu **SSL/TLS** atau **Let's Encrypt** jika tersedia.

Jangan meng-upload folder `.git` bila tidak diperlukan. Nama file dan folder harus sama,
terutama pada hosting Linux.

## Struktur Pengaturan: Di Mana Mengubah Apa?

| Kebutuhan | Lokasi |
| --- | --- |
| Halaman masuk | `index.html` |
| Profil dan daftar artikel | `profile.html` |
| Biodata | `biodata.html` |
| Artikel sejarah | `Sejarah.html` |
| Foto lokal | `img/` |
| Deployment GitHub Pages | `.github/workflows/deploy-pages.yml` |
| Domain GitHub Pages | GitHub **Settings > Pages > Custom domain** |
| DNS domain | Dashboard penyedia domain/DNS |
| Domain VPS | `/etc/nginx/sites-available/project-website` |
| HTTPS VPS | Dikelola Certbot di server |
| Isi dan tampilan | CSS/HTML di masing-masing halaman |

## Informasi Konten dan Aset

Beberapa halaman memuat font atau gambar dari layanan eksternal. Tampilan dapat berubah
jika layanan tersebut diblokir atau URL aset dihapus. Untuk produksi, pertimbangkan
menyimpan aset penting di folder `img/` sendiri dan gunakan URL lokal.

Sebelum mengubah biodata, periksa ejaan, tanggal, foto, dan data yang akan terlihat publik.
Hindari menampilkan alamat rumah, nomor telepon, kata sandi, token, atau informasi sensitif.

## Troubleshooting

### Halaman menampilkan 404

- Pastikan URL memakai nama file dan ekstensi `.html` yang benar.
- Periksa huruf besar-kecil pada `Sejarah.html` dan folder `img`.
- Pada VPS, jalankan `nginx -t` dan pastikan `root` mengarah ke folder project.

### Foto tidak muncul

- Pastikan file berada di `img/` dan nama pada `src` sama persis.
- Coba buka URL foto secara langsung melalui browser.
- Periksa apakah URL gambar eksternal masih aktif.

### Domain belum dapat dibuka

- Periksa record DNS dengan `dig DOMAIN_ANDA`.
- Pastikan record mengarah ke target deployment yang benar.
- Tunggu propagasi DNS.
- Untuk VPS, izinkan firewall:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### GitHub Pages gagal deploy

- Pastikan source Pages adalah **GitHub Actions**.
- Pastikan workflow berjalan dari branch `main`.
- Buka tab **Actions** untuk membaca pesan error.
- Pastikan `index.html` berada di root repository.

## Checklist Sebelum Publikasi

- [ ] `index.html` dapat dibuka.
- [ ] Semua tautan internal mengarah ke file yang benar.
- [ ] Foto dan aset penting tampil.
- [ ] Tidak ada data rahasia atau informasi pribadi yang tidak perlu.
- [ ] Tampilan sudah diuji di desktop dan mobile.
- [ ] DNS domain sudah mengarah ke target deployment.
- [ ] HTTPS sudah aktif.
- [ ] Perubahan sudah di-commit dan di-push ke branch `main`.
