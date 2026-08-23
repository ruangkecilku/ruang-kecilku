# Teman Harian V9

Versi ini memperbaiki fondasi data dan menambah fitur yang tetap ringan.

## Perubahan penting

### Check-in cepat
Beranda memiliki tombol **Check-in hari ini** untuk mencatat:
- mood utama
- mood kedua opsional
- intensitas perasaan
- energi yang diisi langsung oleh pengguna
- kondisi pikiran 1–10
- konteks harian opsional
- catatan kecil

Energi tidak lagi diperkirakan dari data tidur.

### Trigger
Ditambahkan refleksi opsional **Coba lihat dari sisi lain**.

### Journal
- prompt refleksi opsional
- pencarian journal
- kalender Jejak Harian
- kalender menampilkan keberadaan check-in, trigger, tidur, dan journal

### Insight
- mood berasal dari check-in
- pikiran ramai berasal dari check-in
- tidur berasal dari data tidur
- trigger tetap memakai ranking
- hubungan data hanya dibandingkan jika jumlah data memadai
- tersedia indikator kematangan data

### Data
- export/import backup versi 2
- backup lama tetap dapat diimpor
- pengingat backup jika catatan cukup banyak
- dark mode yang hangat

### PWA
Teman Harian dapat dipasang ke Home Screen setelah GitHub Pages melakukan deployment.

## File GitHub
Upload semua file berikut ke root repository:
- index.html
- style.css
- app.js
- logo.svg
- manifest.webmanifest
- sw.js
- icon-192.png
- icon-512.png

Data lama Trigger, Tidur, dan Journal tetap tersimpan.
