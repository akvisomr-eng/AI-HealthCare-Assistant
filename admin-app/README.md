# SehatKita Clinic Management

Aplikasi back-office profesional untuk manajemen klinik. Admin Center berdiri terpisah secara aplikasi dari website publik SehatKita.

## Cakupan
Clinic Operations, Patient & CRM, RME, Appointment, Queue, Pharmacy, Inventory, Procurement, Billing, Finance, HRD, Payroll, Documents, Quality & Audit, Reporting/BI, Security/RBAC dan AI Clinic Copilot.

## Status
UI modular dan workflow demo sedang dibangun bertahap. Data yang tampil adalah ilustrasi dan tidak boleh diganti dengan data kesehatan nyata sebelum backend, autentikasi, RBAC, audit, backup, privacy dan compliance selesai.

## Prinsip
- Bahasa Indonesia.
- Tidak ada diagnosis otomatis.
- Tidak ada secret/data medis nyata di repository.
- Domain model dan API akan dipisahkan dari UI.
- Target biaya awal Rp0; provider tidak dikunci.

## Target arsitektur
`AI-HealthCare-Assistant-Admin` menjadi repository Admin mandiri ketika repository tujuan tersedia; saat ini `admin-app/` dipelihara terisolasi agar migrasi dapat dilakukan tanpa membongkar domain UI.
