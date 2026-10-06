# Memori AI SehatKita — Literasi Triase dan Panduan Tindakan

Versi: 2.0.0
Status: basis pengetahuan awal untuk prototipe, bukan protokol klinis mandiri.

## Tujuan

Basis pengetahuan ini menjadi memori terstruktur untuk mesin analisa keluhan SehatKita. Sistem harus membantu pengguna mengenali tingkat tindakan yang masuk akal dari bahasa sehari-hari, tanpa menyimpulkan diagnosis.

## Hirarki keputusan

1. **Darurat** — tanda bahaya mengalahkan semua sinyal lain. Pengguna diarahkan mencari pertolongan segera.
2. **Periksa segera** — tidak ada tanda darurat eksplisit, tetapi ada keluhan yang cukup mengkhawatirkan, berat, memburuk, atau membutuhkan penilaian cepat.
3. **Perlu diperiksa** — terdapat beberapa keluhan, durasi/rekurensi, atau pola yang layak dibawa ke tenaga kesehatan.
4. **Pantau dan konsultasikan** — belum ditemukan tanda bahaya dari teks. Sistem tetap menyatakan keterbatasan informasi dan memberi kondisi kapan harus mencari pertolongan.

## Tanda bahaya prioritas tinggi

- Sangat sulit bernapas, tidak bisa bernapas, atau sesak berat.
- Nyeri/tekanan dada yang hebat atau sangat berat.
- Pingsan, kehilangan kesadaran, atau tidak sadar.
- Kejang.
- Perdarahan banyak atau perdarahan yang tidak berhenti.
- Tanda gangguan saraf yang muncul mendadak, misalnya wajah mencong, bicara pelo/sulit bicara, atau kelemahan satu sisi tubuh.
- Pembengkakan bibir/lidah/tenggorokan disertai gangguan bernapas.
- Kondisi memburuk dengan cepat atau kelemahan ekstrem.

Jika salah satu tanda ini terdeteksi, jangan menurunkan prioritas hanya karena ada gejala lain yang tampak ringan.

## Kelompok keluhan yang dikenali

Demam/meriang; batuk; pilek/hidung tersumbat; nyeri tenggorokan; sesak; nyeri dada; sakit kepala; pusing/berkunang/berputar; mual; muntah; diare; nyeri perut/kram; kembung; lemas; nyeri otot/pegal; nyeri sendi; ruam/gatal/bentol; nyeri saat berkemih; sering berkemih; nyeri pinggang/punggung; mata merah/nyeri; gangguan tidur; cemas/gelisah.

Daftar ini adalah kosakata untuk memahami masukan, bukan daftar diagnosis.

## Konteks yang menaikkan perhatian

- Keluhan semakin parah atau semakin berat.
- Keluhan muncul mendadak.
- Keluhan berlangsung lama atau tidak kunjung membaik.
- Keluhan berulang/kambuh.
- Kombinasi beberapa keluhan sekaligus.
- Sesak atau nyeri dada harus diperlakukan lebih hati-hati daripada gejala ringan yang berdiri sendiri.

## Panduan tindakan

### Darurat

- Hentikan aktivitas dan cari bantuan.
- Hubungi PSC 119 atau layanan darurat setempat.
- Jelaskan keluhan utama, kesadaran, kemampuan bernapas, dan lokasi kepada petugas.
- Jangan menunda pertolongan demi mencoba fitur aplikasi lain.
- Jangan mengemudi sendiri bila kondisi berat atau kesadaran terganggu.

### Periksa segera

- Cari penilaian tenaga kesehatan sesegera mungkin.
- Jika muncul tanda bahaya, naikkan prioritas menjadi darurat.
- Siapkan daftar obat yang sedang digunakan jika tersedia.
- Catat perubahan gejala agar mudah dijelaskan kepada tenaga kesehatan.

### Perlu diperiksa

- Pertimbangkan membuat janji dengan tenaga kesehatan.
- Catat waktu mulai, perkembangan, pola berulang, serta faktor yang memperberat/meringankan.
- Siapkan daftar obat dan suplemen yang digunakan.
- Jangan memulai, menghentikan, atau mengubah obat resep hanya berdasarkan hasil aplikasi.

### Pantau dan konsultasikan

- Pantau perubahan kondisi.
- Istirahat dan pertahankan asupan cairan yang sesuai kondisi.
- Cari pertolongan bila muncul tanda bahaya, keluhan memburuk, menetap, atau mengganggu aktivitas.
- Bila pengguna tetap khawatir, konsultasi tetap merupakan pilihan yang tepat meskipun sistem tidak menemukan tanda bahaya.

## Data yang layak ditanyakan pada analisa lanjutan

Jika diperlukan untuk memperbaiki triase, sistem dapat meminta secara minimal: kapan mulai, apakah memburuk, seberapa berat menurut pengguna, gejala penyerta, apakah berulang, obat yang sedang digunakan, serta faktor risiko yang relevan. Data sensitif tidak boleh diminta tanpa alasan yang jelas dan persetujuan pengguna.

Untuk versi klinis yang lebih maju, usia/kelompok usia, kehamilan, penyakit kronis, imunosupresi, dan obat tertentu dapat menjadi faktor risiko. Jangan membuat keputusan klinis hanya dari satu faktor tersebut tanpa konteks.

## Aturan keselamatan AI

- Jangan mengatakan “Anda terkena X” atau “pasti X”.
- Gunakan bahasa “dapat”, “mungkin”, “perlu dinilai”, atau “informasi belum cukup”.
- Jangan memberi dosis obat atau instruksi perubahan terapi sebagai respons otomatis umum.
- Jangan menenangkan pengguna secara berlebihan ketika informasi tidak lengkap.
- Jangan menganggap tidak adanya kata tanda bahaya sebagai bukti bahwa keadaan aman.
- Tanda bahaya yang terdeteksi dari teks harus diprioritaskan.
- Aplikasi tidak boleh menjadi pengganti dokter, IGD, ambulans, atau layanan darurat.
- Setiap perluasan aturan harus memiliki contoh uji positif, negatif, dan ambiguitas.

## Rujukan layanan Indonesia

Kementerian Kesehatan RI menjelaskan PSC 119 sebagai layanan cepat tanggap darurat kesehatan. Regulasi SPGDT juga menempatkan PSC pada fungsi triase, panduan pertolongan pertama, evakuasi, dan koordinasi dengan fasilitas kesehatan. Karena layanan dan ketersediaan daerah dapat berubah, aplikasi harus menampilkan 119 sebagai rujukan darurat nasional dan tetap menyebut layanan darurat setempat.

## Sumber resmi yang menjadi literasi awal

- Kementerian Kesehatan RI — PSC 119: https://kemkes.go.id/id/layanan/psc-119
- Kementerian Kesehatan RI — Permenkes No. 19 Tahun 2016 tentang SPGDT: https://jdih.kemkes.go.id/storage/documents/pdfs/2016permenkes019.pdf
- Kementerian Kesehatan RI — Akses Darurat Medis 119 melalui SATUSEHAT Mobile: https://www.kemkes.go.id/id/akses-darurat-medis-119-kini-bisa-melalui-satusehat-mobile

## Batasan

Basis pengetahuan ini bukan clinical decision support yang tervalidasi. Sebelum digunakan untuk keputusan medis nyata, aturan perlu ditinjau tenaga kesehatan, diuji dengan dataset yang sesuai, diaudit untuk bias dan false negative, serta memiliki mekanisme pembaruan sumber.
