# SehatKita Clinic Management — Backend API Contract v0.1

## Status
Fondasi staging sudah ditambahkan ke repository utama. UI Admin tetap dapat berjalan dengan data demo; API belum dihubungkan ke data pasien nyata.

## Arsitektur
SehatKita Public Website → GitHub Pages
Admin Center → GitHub Pages /admin
Clinic API → Cloudflare Workers
Database → Cloudflare D1
Audit → D1 hash-chain SHA-256

## Endpoint
GET /api/health
GET /api/admin/patients?q=
POST /api/admin/patients
GET /api/admin/appointments?date=
POST /api/admin/appointments
GET /api/admin/audit

## Autentikasi
Staging memakai Bearer token pada secret ADMIN_API_TOKEN. Ini sengaja sementara. Production wajib mengganti dengan identity provider, RBAC, MFA, session management, tenant isolation, consent dan policy akses.

## Domain pertama
Patient:
id, medical_record_number, full_name, gender, birth_date, phone, status, timestamps.

Appointment:
id, patient_id, doctor_name, service, appointment_date, appointment_time, status, notes, timestamps.

Audit:
actor_id, action, entity_type, entity_id, payload_json, previous_hash, event_hash, created_at.

## Keamanan
Tidak ada secret atau data pasien nyata di repository. Audit hash-chain bersifat tamper-evident, bukan pengganti sistem audit/compliance yang lengkap.

## Target biaya
Cloudflare Workers/D1 dipilih karena memiliki Free tier. Limit harian harus dipantau; melampaui limit dapat menghentikan operasi gratis sampai reset. Jangan mengaktifkan paket berbayar tanpa persetujuan eksplisit pemilik proyek.

## Tahap berikutnya
1. Buat database D1 staging.
2. Isi secret API token.
3. Deploy Worker.
4. Tambahkan login/RBAC Admin.
5. Tambahkan client API Admin.
6. Migrasikan Pasien dan Janji Temu dari state demo.
7. Tambahkan domain lain satu per satu.
8. Security, privacy dan clinical validation sebelum produksi.
