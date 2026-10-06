# SehatKita Clinic API

Fondasi backend serverless untuk Clinic Management SehatKita.

Target awal: Cloudflare Workers + D1, dengan target biaya Rp0 pada batas Free.
Endpoint awal:
- GET /api/health
- GET/POST /api/admin/patients
- GET/POST /api/admin/appointments
- GET /api/admin/audit

Semua /api/admin/* memerlukan Authorization: Bearer <ADMIN_API_TOKEN>.
Audit memakai hash-chain SHA-256 sebagai mekanisme tamper-evident.

Ini fondasi staging, bukan sertifikasi keamanan/klinis. Sebelum data kesehatan nyata:
1. ganti token sederhana dengan identity/RBAC kuat;
2. tambahkan MFA, session, tenant isolation dan consent;
3. gunakan secrets manager;
4. lakukan encryption, retention/deletion policy dan security testing;
5. validasi PDP, rekam medis dan regulasi kesehatan;
6. lakukan clinical safety review.

Jangan commit token, private key, data pasien atau data kesehatan nyata.

Backend Express lama tidak dihapus otomatis; migrasi dilakukan bertahap.