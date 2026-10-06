import React, { useMemo, useState } from "react";
import "./index.css";

const gejala = ["demam", "batuk", "sesak", "nyeri dada", "sakit kepala", "mual", "muntah", "diare", "pusing", "lemas"];

function App() {
  const [tab, setTab] = useState("beranda");
  const [keluhan, setKeluhan] = useState("");
  const [hasil, setHasil] = useState(null);

  const saran = useMemo(() => {
    const teks = keluhan.toLowerCase();
    const darurat = ["sesak berat", "nyeri dada", "pingsan", "kejang", "perdarahan hebat"].some(x => teks.includes(x));
    if (darurat) return { level: "Darurat", warna: "merah", teks: "Keluhan yang Anda masukkan dapat memerlukan pertolongan segera. Hubungi layanan darurat setempat atau pergi ke fasilitas kesehatan terdekat." };
    if (!keluhan.trim()) return null;
    const cocok = gejala.filter(x => teks.includes(x));
    return { level: cocok.length >= 2 ? "Perlu diperiksa" : "Pantau dan konsultasikan", warna: cocok.length >= 2 ? "kuning" : "hijau", teks: cocok.length >= 2 ? "Beberapa gejala terdeteksi. Pertimbangkan berkonsultasi dengan tenaga kesehatan, terutama bila keluhan memburuk atau menetap." : "Informasi belum cukup untuk menilai keluhan. Pantau kondisi dan konsultasikan dengan tenaga kesehatan bila Anda khawatir." };
  }, [keluhan]);

  const buka = (nama) => { setTab(nama); window.scrollTo({top:0, behavior:"smooth"}); };

  return (
    <div className="app">
      <header className="header">
        <button className="logo" onClick={() => buka("beranda")} aria-label="Beranda">
          <span className="logo-mark">✚</span><span>Sehat<span className="logo-accent">Kita</span></span>
        </button>
        <nav>
          <button className={tab==="beranda"?"active":""} onClick={() => buka("beranda")}>Beranda</button>
          <button className={tab==="cek"?"active":""} onClick={() => buka("cek")}>Cek Keluhan</button>
          <button onClick={() => document.getElementById("layanan")?.scrollIntoView({behavior:"smooth"})}>Layanan</button>
          <button onClick={() => document.getElementById("tentang")?.scrollIntoView({behavior:"smooth"})}>Tentang</button>
        </nav>
        <button className="header-action" onClick={() => buka("cek")}>Mulai Sekarang →</button>
      </header>

      {tab === "cek" ? (
        <main className="check-page">
          <section className="check-card">
            <span className="eyebrow">PANDUAN KESEHATAN AWAL</span>
            <h1>Ceritakan keluhan Anda</h1>
            <p>Masukkan gejala secara singkat. Sistem ini hanya memberikan panduan awal dan bukan diagnosis medis.</p>
            <textarea value={keluhan} onChange={e=>setKeluhan(e.target.value)} placeholder="Contoh: sejak kemarin saya demam dan batuk..." />
            <button className="primary large" onClick={() => setHasil(saran)}>Analisis Panduan</button>
            {hasil && <div className={"result "+hasil.warna}><strong>{hasil.level}</strong><p>{hasil.teks}</p><small>Jika kondisi terasa mengancam nyawa, jangan menunggu hasil aplikasi. Cari pertolongan medis segera.</small></div>}
            <button className="back" onClick={() => buka("beranda")}>← Kembali ke beranda</button>
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
                  <button className="primary" onClick={() => buka("cek")}>Cek Keluhan Gratis →</button>
                  <button className="secondary" onClick={() => document.getElementById("layanan")?.scrollIntoView({behavior:"smooth"})}>Jelajahi Layanan</button>
                </div>
                <div className="trust"><span>✓</span> Privasi diutamakan <span>✓</span> Tanpa diagnosis otomatis</div>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="orb">✚</div><div className="float-card card-a">❤ <b>Jaga kesehatan</b><small>Setiap hari</small></div><div className="float-card card-b">✓ <b>Panduan terarah</b><small>Berbasis informasi</small></div>
              </div>
            </section>

            <section className="stats"><div><b>01</b><span>Pahami keluhan</span></div><div><b>02</b><span>Siapkan konsultasi</span></div><div><b>03</b><span>Jaga catatan kesehatan</span></div><div><b>04</b><span>Ambil langkah tepat</span></div></section>

            <section id="layanan" className="section">
              <div className="section-heading"><span className="eyebrow">LAYANAN UTAMA</span><h2>Satu tempat untuk kebutuhan kesehatan Anda.</h2><p>Kita membangun platform ini bertahap dengan prinsip aman, transparan, dan berpusat pada pengguna.</p></div>
              <div className="grid">
                <article className="service"><div className="icon blue">⌕</div><h3>Panduan Keluhan</h3><p>Jelaskan gejala dengan bahasa sehari-hari dan dapatkan panduan awal yang tidak menggantikan dokter.</p><button onClick={()=>buka("cek")}>Coba sekarang →</button></article>
                <article className="service"><div className="icon green">◷</div><h3>Janji Temu</h3><p>Rencanakan kebutuhan konsultasi dan siapkan informasi yang ingin Anda sampaikan kepada tenaga kesehatan.</p><button onClick={()=>alert("Fitur janji temu sedang kami bangun.")}>Segera hadir →</button></article>
                <article className="service"><div className="icon purple">▣</div><h3>Catatan Kesehatan</h3><p>Tempat terstruktur untuk mengelola informasi kesehatan pribadi secara bertahap dan bertanggung jawab.</p><button onClick={()=>alert("Fitur catatan kesehatan sedang kami bangun.")}>Segera hadir →</button></article>
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
