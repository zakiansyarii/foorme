# FORME — Gym member dashboard

Aplikasi gym statis yang siap dipasang di Vercel. Anggota dapat membuat akun dengan username dan password, melihat dashboard personal, mencatat latihan dan asupan, mendaftar kelas, serta mengubah profil. Data anggota dan aktivitas disimpan di Google Sheets lewat Google Apps Script.

## 1. Siapkan Google Sheets API

1. Buka [script.google.com](https://script.google.com/) dan buat proyek Apps Script.
2. Salin isi [`apps-script/Code.gs`](./apps-script/Code.gs) ke file `Code.gs`.
3. Pilih fungsi `setup` dari daftar fungsi, lalu klik **Run** dan berikan izin yang diminta. Fungsi ini otomatis membuat spreadsheet dan sheet `Users`, `Activities`, serta `SiteContent`; tautan spreadsheet terlihat di **Execution log**.
4. Pilih **Deploy → New deployment → Web app**.
5. Atur **Execute as: Me** dan **Who has access: Anyone**, lalu deploy dan salin URL Web App yang berakhiran `/exec`.

`setup()` aman dijalankan ulang: teks yang sudah diedit dan data pengguna tidak ditimpa. Data spreadsheet tidak perlu dibagikan secara publik.

## 2. Atur admin pertama

1. Buat akun biasa melalui website, lalu catat username yang dipilih.
2. Di Apps Script, buka **Project Settings → Script Properties**, lalu tambahkan:
   - Property: `ADMIN_USERNAMES`
   - Value: username admin, misalnya `zakiadmin` (pisahkan beberapa username dengan koma).
3. Jalankan `setup()` lagi agar sheet konten dan kolom status siap. Fungsi ini mempertahankan data serta teks yang sudah ada.
4. Buka **Deploy → Manage deployments**, edit deployment Web App, pilih **New version**, lalu deploy.
5. Masuk kembali dengan akun admin. Menu **Admin** akan muncul di navigasi.

Admin dapat mengubah teks utama halaman masuk, navigasi, dashboard, halaman, program, dan kelas; mengedit profil anggota; serta menonaktifkan atau mengaktifkan akun. Akun nonaktif tidak bisa masuk. Hak admin ditentukan di Apps Script, bukan dari browser.

## 3. Deploy ke Vercel

1. Impor folder/repository proyek ini ke Vercel.
2. Di **Project Settings → Environment Variables**, tambahkan:
   - Name: `APPS_SCRIPT_URL`
   - Value: URL Web App Apps Script yang berakhiran `/exec`
3. Redeploy project setelah menyimpan environment variable.

Frontend mengirim permintaan ke `/api/gym`; fungsi serverless Vercel meneruskannya ke Apps Script sehingga URL Google tidak perlu ditaruh di browser. Situs disajikan sebagai file statis, tanpa build step atau dependency tambahan.

## Data dan sesi

- `Users`: profil anggota, username, status akun, dan hash password dengan salt unik.
- `Activities`: catatan latihan, reservasi kelas, dan asupan; setiap baris terikat pada ID akun.
- `SiteContent`: teks website yang dapat diedit admin.
- Token sesi disimpan sementara di cache Apps Script (maksimal 6 jam) dan di `sessionStorage` browser.
- Pendaftaran memerlukan password minimal 10 karakter. Jangan menaruh URL Apps Script di repository atau membagikan sheet database.

## Pengembangan lokal

Untuk mencoba autentikasi secara lokal, gunakan Vercel CLI (`vercel dev`) setelah mengatur `APPS_SCRIPT_URL` di environment lokal. Membuka `index.html` langsung dapat menampilkan antarmuka, tetapi endpoint `/api/gym` hanya tersedia melalui Vercel.
