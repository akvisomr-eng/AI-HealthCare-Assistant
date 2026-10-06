// Basis pengetahuan SehatKita — panduan triase awal berbahasa Indonesia.
// Tujuan: membantu pengenalan pola keluhan dan menentukan tingkat tindakan,
// bukan mendiagnosis penyakit. Pengetahuan ini sengaja konservatif: tanda bahaya
// mengalahkan jumlah gejala biasa.

export const PENGETAHUAN_KESEHATAN = {
  versi: "2.0.0",
  prinsip: [
    "Tidak memberikan diagnosis atau kepastian penyakit.",
    "Jika ada tanda bahaya, arahkan ke pertolongan darurat tanpa menunggu analisis lain.",
    "Jika informasi kurang, katakan informasi kurang; jangan mengarang kesimpulan.",
    "Anjuran umum tidak menggantikan pemeriksaan tenaga kesehatan.",
    "Jangan meminta atau menyimpan data kesehatan sensitif pada demo publik.",
    "Untuk keadaan gawat di Indonesia, pengguna dapat menghubungi PSC 119 atau layanan darurat setempat."
  ],
  tingkatTindakan: [
    { kode: "DARURAT", label: "Darurat", warna: "merah", tindakan: "Cari pertolongan medis segera. Hubungi PSC 119 atau layanan darurat setempat dan jangan mengemudi sendiri bila kondisi berat." },
    { kode: "SEGERA", label: "Periksa segera", warna: "merah", tindakan: "Cari penilaian tenaga kesehatan sesegera mungkin, terutama bila keluhan memburuk, berat, atau disertai kondisi berisiko." },
    { kode: "KONSULTASI", label: "Perlu diperiksa", warna: "kuning", tindakan: "Jadwalkan konsultasi dengan tenaga kesehatan. Siapkan kapan mulai, perubahan keluhan, obat yang digunakan, dan faktor yang memperberat/meringankan." },
    { kode: "PANTAU", label: "Pantau dan konsultasikan", warna: "hijau", tindakan: "Pantau perubahan kondisi, istirahat dan cukup cairan bila sesuai kondisi, lalu konsultasikan bila menetap, memburuk, atau menimbulkan kekhawatiran." }
  ],
  tandaBahaya: [
    { nama: "gangguan napas berat", pola: ["sesak berat", "sangat sulit bernapas", "tidak bisa bernapas", "napas sangat berat", "nafas sangat berat", "sulit bernapas sekali", "susah bernapas sekali"] },
    { nama: "nyeri/tekanan dada berat", pola: ["nyeri dada hebat", "sakit dada hebat", "dada terasa sangat tertekan", "tekanan dada hebat", "dada seperti tertindih berat"] },
    { nama: "gangguan kesadaran", pola: ["pingsan", "hilang kesadaran", "tidak sadarkan diri", "tidak sadar"] },
    { nama: "kejang", pola: ["kejang", "kejang-kejang", "kejang kejang"] },
    { nama: "perdarahan banyak", pola: ["perdarahan hebat", "pendarahan hebat", "darah keluar banyak", "pendarahan banyak", "pendarahan tidak berhenti"] },
    { nama: "tanda stroke yang mendadak", pola: ["wajah mencong mendadak", "bicara pelo mendadak", "sulit bicara mendadak", "lengan lemah mendadak", "kaki lemah mendadak", "satu sisi tubuh lemah mendadak"] },
    { nama: "reaksi alergi berat", pola: ["bibir bengkak dan sesak", "lidah bengkak dan sesak", "tenggorokan bengkak dan sulit bernapas", "alergi berat dan sesak"] },
    { nama: "kondisi sangat memburuk", pola: ["kondisi memburuk dengan cepat", "semakin tidak sadar", "sangat lemah sampai tidak mampu berdiri"] }
  ],
  kelompokGejala: [
    { nama: "demam", pola: ["demam", "badan panas", "badan terasa panas", "suhu tubuh naik", "suhu badan naik", "panas tinggi", "meriang"] },
    { nama: "batuk", pola: ["batuk", "batuk-batuk", "batuk batuk"] },
    { nama: "pilek/hidung tersumbat", pola: ["pilek", "hidung tersumbat", "hidung mampet", "hidung berair"] },
    { nama: "nyeri tenggorokan", pola: ["sakit tenggorokan", "nyeri tenggorokan", "tenggorokan sakit", "tenggorokan perih", "sulit menelan"] },
    { nama: "sesak", pola: ["sesak", "sulit bernapas", "susah bernapas", "sulit bernafas", "susah bernafas", "napas terasa berat", "nafas terasa berat", "napas berat", "nafas berat"] },
    { nama: "nyeri dada", pola: ["nyeri dada", "sakit dada", "dada sakit", "dada terasa sakit", "dada terasa ditekan", "tekanan di dada"] },
    { nama: "sakit kepala", pola: ["sakit kepala", "kepala sakit", "kepala terasa sakit", "pusing di kepala", "kepala berdenyut"] },
    { nama: "pusing", pola: ["pusing", "kepala berkunang", "berkunang-kunang", "berkunang kunang", "terasa berputar", "melayang"] },
    { nama: "mual", pola: ["mual", "ingin muntah", "rasa mual"] },
    { nama: "muntah", pola: ["muntah", "muntah-muntah", "muntah muntah"] },
    { nama: "diare", pola: ["diare", "mencret", "buang air besar cair", "bab cair", "berak cair"] },
    { nama: "nyeri perut", pola: ["sakit perut", "nyeri perut", "perut sakit", "perut terasa sakit", "kram perut"] },
    { nama: "kembung", pola: ["kembung", "perut begah", "perut penuh gas"] },
    { nama: "lemas", pola: ["lemas", "badan lemas", "tidak bertenaga", "kurang tenaga", "badan terasa lemah"] },
    { nama: "nyeri otot", pola: ["pegal", "nyeri otot", "otot sakit", "badan pegal", "badan sakit-sakit"] },
    { nama: "nyeri sendi", pola: ["nyeri sendi", "sendi sakit", "persendian sakit"] },
    { nama: "ruam/gatal", pola: ["ruam", "gatal", "kulit gatal", "bentol", "bintik merah"] },
    { nama: "nyeri saat berkemih", pola: ["sakit saat kencing", "nyeri saat kencing", "perih saat kencing", "sakit saat buang air kecil", "anyang-anyangan"] },
    { nama: "frekuensi berkemih meningkat", pola: ["sering kencing", "sering buang air kecil", "kencing terus"] },
    { nama: "nyeri pinggang/punggung", pola: ["sakit pinggang", "nyeri pinggang", "sakit punggung", "nyeri punggung"] },
    { nama: "mata merah/nyeri", pola: ["mata merah", "mata sakit", "nyeri mata", "mata perih"] },
    { nama: "gangguan tidur", pola: ["sulit tidur", "susah tidur", "tidak bisa tidur", "insomnia"] },
    { nama: "cemas/gelisah", pola: ["cemas", "gelisah", "panik", "khawatir berlebihan"] }
  ],
  faktorPerhatian: [
    { nama: "keluhan makin berat", pola: ["semakin parah", "makin parah", "semakin berat", "makin berat", "memburuk"] },
    { nama: "muncul mendadak", pola: ["tiba-tiba", "mendadak", "secara tiba tiba"] },
    { nama: "durasi lama", pola: ["berhari-hari", "berminggu-minggu", "sudah lama", "tidak kunjung membaik", "menetap"] },
    { nama: "berulang", pola: ["sering kambuh", "berulang kali", "kambuh lagi", "sering terjadi"] }
  ],
  tindakanUmum: {
    DARURAT: [
      "Hentikan aktivitas dan cari bantuan.",
      "Hubungi PSC 119 atau layanan darurat setempat.",
      "Sampaikan keluhan utama, kondisi kesadaran, kemampuan bernapas, dan lokasi.",
      "Jangan mengandalkan aplikasi untuk menunda pertolongan."
    ],
    SEGERA: [
      "Cari penilaian tenaga kesehatan sesegera mungkin.",
      "Jika kondisi memburuk atau muncul tanda bahaya, naikkan menjadi darurat.",
      "Bawa daftar obat yang sedang digunakan bila tersedia."
    ],
    KONSULTASI: [
      "Pertimbangkan membuat janji dengan tenaga kesehatan.",
      "Catat kapan keluhan mulai dan apakah semakin berat atau berulang.",
      "Catat obat/suplemen yang digunakan dan riwayat kondisi penting yang relevan.",
      "Jangan memulai, menghentikan, atau mengubah obat resep hanya berdasarkan aplikasi."
    ],
    PANTAU: [
      "Pantau perubahan keluhan.",
      "Jaga istirahat dan asupan cairan yang sesuai kondisi.",
      "Cari pertolongan bila muncul tanda bahaya, keluhan memburuk, menetap, atau mengganggu aktivitas."
    ]
  }
};

export const normalisasi = (nilai = "") => nilai
  .toLowerCase()
  .replace(/[.,!?;:()]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const cocokkan = (teks, daftar) => daftar
  .filter(item => item.pola.some(frasa => teks.includes(frasa)))
  .map(item => item.nama);

const deteksiDurasi = (teks) => {
  if (/\b(baru|sejak|selama|sudah)\b/.test(teks) || /\b\d+\s*(jam|hari|minggu|bulan|tahun)\b/.test(teks)) return true;
  return false;
};

export const analisisKeluhan = (nilai) => {
  const teks = normalisasi(nilai);
  if (!teks) return null;

  const bahaya = cocokkan(teks, PENGETAHUAN_KESEHATAN.tandaBahaya);
  const gejala = cocokkan(teks, PENGETAHUAN_KESEHATAN.kelompokGejala);
  const perhatian = cocokkan(teks, PENGETAHUAN_KESEHATAN.faktorPerhatian);
  const punyaDurasi = deteksiDurasi(teks);

  let kode = "PANTAU";
  if (bahaya.length > 0) kode = "DARURAT";
  else if (perhatian.includes("keluhan makin berat") || (gejala.includes("sesak") && gejala.length > 0) || (gejala.includes("nyeri dada") && gejala.length > 0)) kode = "SEGERA";
  else if (gejala.length >= 2 || perhatian.length > 0 || punyaDurasi) kode = "KONSULTASI";

  const tingkat = PENGETAHUAN_KESEHATAN.tingkatTindakan.find(item => item.kode === kode);
  return {
    versiPengetahuan: PENGETAHUAN_KESEHATAN.versi,
    level: tingkat.label,
    kode,
    warna: tingkat.warna,
    gejala,
    tandaBahaya: bahaya,
    faktorPerhatian: perhatian,
    adaDurasi: punyaDurasi,
    teks: kode === "DARURAT"
      ? "Terdapat tanda yang dapat menunjukkan keadaan gawat. Jangan menunggu analisis aplikasi; cari pertolongan medis segera."
      : kode === "SEGERA"
        ? "Keluhan memiliki karakteristik yang sebaiknya dinilai tenaga kesehatan sesegera mungkin, terutama jika memburuk atau terasa berat."
        : kode === "KONSULTASI"
          ? "Beberapa informasi menunjukkan bahwa konsultasi dengan tenaga kesehatan layak dipertimbangkan. Aplikasi tidak dapat menentukan diagnosis."
          : "Belum ditemukan tanda bahaya dari teks yang diberikan. Informasi ini tidak cukup untuk memastikan penyebab; pantau kondisi dan konsultasikan bila menetap atau memburuk.",
    tindakan: tingkat.tindakan,
    literasi: PENGETAHUAN_KESEHATAN.tindakanUmum[kode]
  };
};

export const pertanyaanAdaptif = (hasil) => {
  if (!hasil) return [];
  const pertanyaan = [];
  if (!hasil.adaDurasi) pertanyaan.push("Sejak kapan keluhan ini mulai dirasakan?");
  if (!hasil.faktorPerhatian.includes("keluhan makin berat")) pertanyaan.push("Apakah keluhan semakin berat, tetap, atau mulai membaik?");
  if (hasil.gejala.length > 0 && hasil.gejala.length < 2) pertanyaan.push("Apakah ada keluhan lain yang muncul bersamaan?");
  if (hasil.kode === "SEGERA" || hasil.kode === "DARURAT") pertanyaan.push("Seberapa berat keluhannya saat ini, dan apakah mengganggu bernapas, kesadaran, atau aktivitas utama?");
  if (hasil.kode === "KONSULTASI") pertanyaan.push("Apakah keluhan pernah terjadi sebelumnya atau sering kambuh?");
  return [...new Set(pertanyaan)].slice(0, 4);
};
