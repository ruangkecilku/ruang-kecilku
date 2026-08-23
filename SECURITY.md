# Keamanan Teman Harian V10

Versi ini tetap menggunakan penyimpanan lokal. Tidak ada database cloud dan tidak ada akun pengguna.

## Saat keamanan belum aktif

Teman Harian bekerja seperti versi sebelumnya. Check-in, Trigger, Tidur, dan Journal disimpan sebagai JSON biasa pada localStorage.

## Saat keamanan diaktifkan

Data berikut dipindahkan ke satu vault terenkripsi:

- Check-in
- Trigger
- Tidur
- Journal

Algoritma yang digunakan:

- AES-GCM 256-bit untuk enkripsi dan integritas
- PBKDF2 dengan SHA-256 untuk membentuk kunci dari password
- Salt acak 128-bit
- IV acak 96-bit untuk setiap proses enkripsi
- 310.000 iterasi PBKDF2

Password utama tidak disimpan. Kunci AES hanya berada di memory JavaScript selama aplikasi sedang terbuka dan sudah di-unlock.

## Auto-lock

Vault otomatis terkunci setelah sekitar 10 menit tidak ada aktivitas. Reload browser juga menghapus kunci dari memory sehingga password perlu dimasukkan kembali.

## Backup

Jika keamanan aktif, tombol Export menghasilkan file:

`teman-harian-secure-backup-YYYY-MM-DD.json`

Isi Check-in, Trigger, Tidur, dan Journal tetap terenkripsi dalam file tersebut.

Untuk membuka backup yang diimpor, gunakan password yang berlaku ketika backup tersebut dibuat.

## Kehilangan password

Tidak ada server, database, recovery email, atau salinan kunci. Karena itu tidak ada fitur reset password.

Jika password hilang dan tidak ada backup plaintext lama, data terenkripsi tidak dapat dipulihkan.

## HTTPS

Web Crypto API memerlukan secure context. Gunakan GitHub Pages melalui HTTPS:

`https://temanharian.github.io`

## Batas perlindungan

Enkripsi lokal membantu ketika isi localStorage atau file backup diambil tanpa password. Enkripsi tidak dapat melindungi data ketika aplikasi sudah terbuka dan perangkat/browser sedang dikuasai pihak lain.

Gunakan password perangkat, kunci layar, dan browser yang selalu diperbarui.
