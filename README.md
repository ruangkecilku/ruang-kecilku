# Teman Harian V10 Security

Versi ini menambahkan keamanan localStorage tanpa database.

## Fitur keamanan
- Encrypted localStorage vault
- AES-GCM 256-bit
- PBKDF2-SHA256
- Password utama tidak disimpan
- Kunci enkripsi hanya berada di memory
- Auto-lock 10 menit
- Lock setiap reload
- Ganti password utama
- Encrypted JSON backup
- Import backup terenkripsi
- Content Security Policy
- HTTPS-compatible
- Tidak menggunakan Firebase, Supabase, atau database lain

## Migrasi data V9

Data lama tidak langsung dihapus.

Setelah website diperbarui:
1. Buka menu tiga titik.
2. Pilih `Aktifkan keamanan`.
3. Buat password utama minimal 10 karakter.
4. Teman Harian mengenkripsi data V9 yang sedang ada.
5. Setelah vault berhasil dibuat, salinan plaintext Check-in, Trigger, Tidur, dan Journal dihapus dari localStorage.

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

Dokumentasi tambahan:
- README.md
- SECURITY.md

## Sangat penting
Tidak ada fitur lupa password karena tidak ada server atau database yang menyimpan recovery key.

Simpan password utama dengan aman.
