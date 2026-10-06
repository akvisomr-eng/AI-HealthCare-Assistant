import React, { useMemo, useState } from "react";
import "./index.css";

const kelompokGejala = [
  { nama: "demam", pola: ["demam", "badan panas", "badan terasa panas", "suhu tubuh naik", "suhu badan naik", "panas tinggi"] },
  { nama: "batuk", pola: ["batuk", "batuk-batuk", "batuk batuk"] },
  { nama: "sesak", pola: ["sesak", "sulit bernapas", "susah bernapas", "sulit bernafas", "susah bernafas", "napas terasa berat", "nafas terasa berat", "napas berat", "nafas berat"] },
  { nama: "nyeri dada", pola: ["nyeri dada", "sakit dada", "dada sakit", "dada terasa sakit", "dada terasa ditekan", "tekanan di dada"] },
  { nama: "sakit kepala", pola: ["sakit kepala", "kepala sakit", "kepala terasa sakit", "pusing di kepala"] },
  { nama: "mual", pola: ["mual", "ingin muntah", "rasa mual"] },
  { nama: "muntah", pola: ["muntah", "muntah-muntah", "muntah muntah"] },
  { nama: "diare", pola: ["diare", "mencret", "buang air besar cair", "bab cair", "berak cair"] },
  { nama: "pusing", pola: ["pusing", "kepala berkunang", "berkunang-kunang", "berkunang kunang", "terasa berputar"] },
  { nama: "lemas", pola: ["lemas", "badan lemas", "tidak bertenaga", "kurang tenaga", "badan terasa lemah"] }
];

const tandaBahaya = [
  "sesak berat", "sangat sulit bernapas", "tidak bisa bernapas", "napas sangat berat",
  "nafas sangat berat", "nyeri dada hebat", "sakit dada hebat", "dada terasa sangat tertekan",
  "pingsan", "hilang kesadaran", "tidak sadarkan diri", "kejang", "perdarahan hebat",
  "darah keluar banyak", "pendarahan hebat"
];

const normalisasi = (nilai) => nilai
  .toLowerCase()
  .replace(/[.,!?;:()]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const analisisKeluhan = (nilai) => {
  const teks = normalisasi(nilai);
  if (!teks) return null;

  const darurat = tandaBahaya.some(frasa => teks.includes(frasa));
  const cocok = kelompokGejala
    .filter(kelompok => kelompok.pola.some(frasa => teks.includes(frasa)))
    .map(kelompok => kelompok.nama);

  if (darurat) {
    return {
      level: "Darurat",
      warna: "merah",
      teks: "Keluhan yang Anda masukkan memiliki tanda bahaya yang dapat memerlukan pertolongan segera. Hubungi layanan darurat setempat atau pergi ke fasilitas kesehatan terdekat.",
      gejala: cocok
    };
  }

  return {
    level: cocok.length >= 2 ? "Perlu diperiksa" : "Pantau dan konsultasikan",
    warna: cocok.length >= 2 ? "kuning" : "hijau",
    teks: cocok.length >= 2
      ? "Beberapa keluhan terdeteksi. Pertimbangkan berkonsultasi dengan tenaga kesehatan, terutama bila keluhan memburuk atau menetap."
      : "Informasi belum cukup untuk menilai keluhan. Pantau kondisi dan konsultasikan dengan tenaga kesehatan bila Anda khawatir.",
    gejala: cocok
  };
};

function App() {
  const [tab, setTab] = useState("beranda");
  const [keluhan, setKeluhan] = useState("");
  const [hasil, setHasil] = useState(null);

  const saran = useMemo(() => analisisKeluhan(keluhan), [keluhan]);

  const buka = (nama) => {
    setTab(nama);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const menujuBagian = (id) => {
    if (tab !== "beranda") {
      setTab("beranda");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));
      });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app">
      <header className="header">
        <button className="logo" type="button" onClick={() => buka("beranda")} aria-label="Beranda">
          <span className="logo-mark">✚</span><span>Sehat<span className="logo-accent">Kita</span></span>
        </button>
        <nav aria-label="Navigasi utama">
          <button type="button" className={tab === "beranda" ? "active" : ""} onClick={() => buka("beranda")}>Beranda</button>
          <button type="button" className={tab === "cek" ? "active" : ""} onClick={() => buka("cek")}>Cek Keluhan</button>
          <button type="button" onClick={() => menujuBagian("layanan")}>Layanan</button>
          <button type="button" onClick={() => menujuBagian("tentang")}>Tentang</button>
        </nav>
        <button type="button" className="header-action" onClick={() => buka("cek")}>Mulai Sekarang →</button>
      </header>

      {tab === "cek" ? (
        <main className="check-page">
          <section className="check-card">
            <span className="eyebrow">PANDUAN KESEHATAN AWAL</span>
            <h1>Ceritakan keluhan Anda</h1>
            <p>Masukkan gejala secara singkat. Sistem ini hanya memberikan panduan awal dan bukan diagnosis medis.</p>
            <textarea value={keluhan} onChange={e => setKeluhan(e.target.value)} placeholder="Contoh: sejak kemarin saya demam dan batuk..." />
            <button type="button" className="primary large" onClick={() => setHasil(saran)}>Analisis Panduan</button>
            {hasil && <div className={"result " + hasil.warna}><strong>{hasil.level}</strong><p>{hasil.teks}</p>{hasil.gejala?.length > 0 && <p><strong>Keluhan terdeteksi:</strong> {hasil.gejala.join(", ")}.</p>}<small>Jika kondisi terasa mengancam nyawa, jangan menunggu hasil aplikasi. Cari pertolongan medis segera.</small></div>}
            <button type="button" className="back" onClick={() => buka("beranda")}>← Kembali ke beranda</button>
          </section>
        </main>
      ) : (
        <>
          <main>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">ASISTEN KESEHATAN DIGITAL</span>
                <h1>Teman tepercaya untuk <span>kesehatan Anda.</span></h1>
                <p>SehatKita membantu Anda memahami informasi kesehatan, menyiapkan konsultasi, dan mengelola perjalanan kesehatan dengan lebih terarah.</p>
                <div className="hero-actions">
                  <button type="button" className="primary" onClick={() => buka("cek")}>Cek Keluhan Gratis →</button>
                  <button type="button" className="secondary" onClick={() => menujuBagian("layanan")}>Jelajahi Layanan</button>
                </div>
                <div className="trust"><span>✓</span> Privasi diutamakan <span>✓</span> Tanpa diagnosis otomatis</div>
              </div>
              <div className="hero-art">
                <img className="hero-image" src={`${process.env.PUBLIC_URL}/hero-health.svg`} alt="Ilustrasi pendamping kesehatan digital SehatKita" />
              </div>
            </section>

            <section className="stats"><div><b>01</b><span>Pahami keluhan</span></div><div><b>02</b><span>Siapkan konsultasi</span></div><div><b>03</b><span>Jaga catatan kesehatan</span></div><div><b>04</b><span>Ambil langkah tepat</span></div></section>

            <section id="layanan" className="section">
              <div className="section-heading"><span className="eyebrow">LAYANAN UTAMA</span><h2>Satu tempat untuk kebutuhan kesehatan Anda.</h2><p>Kita membangun platform ini bertahap dengan prinsip aman, transparan, dan berpusat pada pengguna.</p></div>
              <div className="grid">
                <article className="service"><div className="icon blue">⌕</div><h3>Panduan Keluhan</h3><p>Jelaskan gejala dengan bahasa sehari-hari dan dapatkan panduan awal yang tidak menggantikan dokter.</p><button type="button" onClick={() => buka("cek")}>Coba sekarang →</button></article>
                <article className="service"><div className="icon green">◷</div><h3>Janji Temu</h3><p>Rencanakan kebutuhan konsultasi dan siapkan informasi yang ingin Anda sampaikan kepada tenaga kesehatan.</p><button type="button" onClick={() => alert("Fitur janji temu sedang kami bangun.")}>Segera hadir →</button></article>
                <article className="service"><div className="icon purple">▣</div><h3>Catatan Kesehatan</h3><p>Tempat terstruktur untuk mengelola informasi kesehatan pribadi secara bertahap dan bertanggung jawab.</p><button type="button" onClick={() => alert("Fitur catatan kesehatan sedang kami bangun.")}>Segera hadir →</button></article>
              </div>
            </section>

            <section id="tentang" className="safety">
              <div><span className="eyebrow">PRINSIP KAMI</span><h2>Teknologi membantu. Tenaga kesehatan tetap menjadi pengambil keputusan klinis.</h2></div>
              <div className="safety-points"><p>✓ Tidak mengklaim diagnosis</p><p>✓ Tidak menggantikan dokter</p><p>✓ Tidak meminta data sensitif pada versi demo</p><p>✓ Fitur medis dibangun bertahap dengan pengujian</p></div>
            </section>
          </main>
          <footer><div className="logo"><span className="logo-mark">✚</span><span>Sehat<span className="logo-accent">Kita</span></span></div><p>AI HealthCare Assistant · Versi awal</p><span>© 2026</span></footer>
        </>
      )}
    </div>
  );
}

export default App;
