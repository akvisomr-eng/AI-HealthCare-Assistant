import React, { useMemo, useState } from "react";
import "./index.css";
import { analisisKeluhan, pertanyaanAdaptif } from "./healthKnowledge";

function App() {
  const [tab, setTab] = useState("beranda");
  const [keluhan, setKeluhan] = useState("");
  const [hasil, setHasil] = useState(null);
  const [janji, setJanji] = useState({ tenaga: "", tanggal: "", waktu: "", tujuan: "", catatan: "" });
  const [janjiTersimpan, setJanjiTersimpan] = useState(null);
  const [catatan, setCatatan] = useState({ judul: "", isi: "", tanggal: new Date().toISOString().slice(0, 10) });
  const [daftarCatatan, setDaftarCatatan] = useState([]);

  const saran = useMemo(() => analisisKeluhan(keluhan), [keluhan]);

  const buka = (nama) => {
    setTab(nama);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const simpanJanji = (e) => { e.preventDefault(); if (!janji.tanggal || !janji.waktu || !janji.tujuan) return; setJanjiTersimpan({ ...janji }); };

  const tambahCatatan = (e) => { e.preventDefault(); if (!catatan.isi.trim()) return; setDaftarCatatan(prev => [{ ...catatan, id: Date.now() }, ...prev]); setCatatan({ judul: "", isi: "", tanggal: new Date().toISOString().slice(0, 10) }); };

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
          <button type="button" onClick={() => buka("layanan")}>Layanan</button>
          <button type="button" onClick={() => buka("janji")}>Janji Temu</button>
          <button type="button" onClick={() => buka("catatan")}>Catatan</button>
          <button type="button" onClick={() => menujuBagian("tentang")}>Tentang</button>
        </nav>
        <button type="button" className="header-action" onClick={() => buka("cek")}>Mulai Sekarang →</button>
      </header>

      ) : tab === "janji" ? (
        <main className="feature-page"><section className="feature-card">
          <span className="eyebrow">PERENCANAAN KONSULTASI</span><h1>Janji Temu</h1>
          <p>Siapkan rencana konsultasi dan informasi yang ingin Anda sampaikan kepada tenaga kesehatan.</p>
          <form onSubmit={simpanJanji} className="feature-form">
            <label>Tenaga kesehatan / layanan<input value={janji.tenaga} onChange={e => setJanji({...janji, tenaga:e.target.value})} placeholder="Contoh: Dokter umum / Klinik" /></label>
            <div className="form-row"><label>Tanggal<input type="date" value={janji.tanggal} min={new Date().toISOString().slice(0,10)} onChange={e => setJanji({...janji, tanggal:e.target.value})} required /></label><label>Waktu<input type="time" value={janji.waktu} onChange={e => setJanji({...janji, waktu:e.target.value})} required /></label></div>
            <label>Tujuan konsultasi<textarea value={janji.tujuan} onChange={e => setJanji({...janji, tujuan:e.target.value})} placeholder="Keluhan atau alasan utama konsultasi..." required /></label>
            <label>Informasi yang ingin disampaikan<textarea value={janji.catatan} onChange={e => setJanji({...janji, catatan:e.target.value})} placeholder="Kapan mulai, perubahan keluhan, obat yang digunakan, pertanyaan untuk tenaga kesehatan..." /></label>
            <button className="primary large" type="submit">Simpan Rencana Konsultasi</button>
          </form>
          {janjiTersimpan && <div className="saved-card"><strong>Rencana konsultasi tersimpan</strong><p><b>{janjiTersimpan.tanggal} · {janjiTersimpan.waktu}</b>{janjiTersimpan.tenaga ? ` · ${janjiTersimpan.tenaga}` : ""}</p><p>{janjiTersimpan.tujuan}</p>{janjiTersimpan.catatan && <p><b>Catatan:</b> {janjiTersimpan.catatan}</p>}</div>}
          <div className="privacy-note">Privasi: data fitur demo ini hanya berada di memori sesi browser dan tidak dikirim atau disimpan ke server.</div>
          <button type="button" className="back" onClick={() => buka("beranda")}>← Kembali ke beranda</button>
        </section></main>
      ) : tab === "catatan" ? (
        <main className="feature-page"><section className="feature-card">
          <span className="eyebrow">CATATAN PRIBADI SEMENTARA</span><h1>Catatan Kesehatan</h1>
          <p>Catat informasi yang ingin Anda bawa saat berkonsultasi. Jangan memasukkan data identitas atau informasi sangat sensitif pada versi demo.</p>
          <form onSubmit={tambahCatatan} className="feature-form">
            <div className="form-row"><label>Judul catatan<input value={catatan.judul} onChange={e => setCatatan({...catatan, judul:e.target.value})} placeholder="Contoh: Keluhan minggu ini" /></label><label>Tanggal<input type="date" value={catatan.tanggal} onChange={e => setCatatan({...catatan, tanggal:e.target.value})} /></label></div>
            <label>Isi catatan<textarea className="note-editor" value={catatan.isi} onChange={e => setCatatan({...catatan, isi:e.target.value})} placeholder="Tulis keluhan, perubahan kondisi, pertanyaan untuk dokter, atau informasi lain yang relevan..." required /></label>
            <button className="primary large" type="submit">Tambahkan Catatan</button>
          </form>
          <div className="notes-list">{daftarCatatan.length === 0 ? <div className="empty-state">Belum ada catatan pada sesi ini. Tambahkan catatan pertama Anda di atas.</div> : daftarCatatan.map(item => <article className="note-card" key={item.id}><div><span>{item.tanggal}</span><h3>{item.judul || "Catatan kesehatan"}</h3></div><p>{item.isi}</p></article>)}</div>
          <div className="privacy-note">Privasi: catatan tidak memakai localStorage, database, atau pengiriman jaringan. Catatan akan hilang saat sesi aplikasi ditutup atau dimuat ulang.</div>
          <button type="button" className="back" onClick={() => buka("beranda")}>← Kembali ke beranda</button>
        </section></main>
      ) : tab === "cek" ? (
        <main className="check-page">
          <section className="check-card">
            <span className="eyebrow">PANDUAN KESEHATAN AWAL</span>
            <h1>Ceritakan keluhan Anda</h1>
            <p>Masukkan gejala secara singkat. Sistem ini hanya memberikan panduan awal dan bukan diagnosis medis.</p>
            <textarea value={keluhan} onChange={e => setKeluhan(e.target.value)} placeholder="Contoh: sejak kemarin saya demam dan batuk..." />
            <button type="button" className="primary large" onClick={() => setHasil(saran)}>Analisis Panduan</button>
            {hasil && <div className={"result " + hasil.warna}><strong>{hasil.level}</strong><p>{hasil.teks}</p>{hasil.gejala?.length > 0 && <p><strong>Keluhan terdeteksi:</strong> {hasil.gejala.join(", ")}.</p>}{hasil.faktorPerhatian?.length > 0 && <p><strong>Hal yang perlu diperhatikan:</strong> {hasil.faktorPerhatian.join(", ")}.</p>}<div className="action-guide"><strong>Panduan tindakan</strong><ul>{hasil.literasi?.map(item => <li key={item}>{item}</li>)}</ul></div><div className="follow-up"><strong>Pertanyaan lanjutan</strong><ul>{pertanyaanAdaptif(hasil).map(item => <li key={item}>{item}</li>)}</ul></div><small>SehatKita adalah alat informasi awal, bukan alat diagnosis. Bila kondisi mengancam nyawa, jangan menunggu hasil aplikasi; hubungi PSC 119 atau layanan darurat setempat.</small></div>}
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
                <article className="service"><div className="icon green">◷</div><h3>Janji Temu</h3><p>Rencanakan kebutuhan konsultasi dan siapkan informasi yang ingin Anda sampaikan kepada tenaga kesehatan.</p><button type="button" onClick={() => buka("janji")}>Buka Janji Temu →</button></article>
                <article className="service"><div className="icon purple">▣</div><h3>Catatan Kesehatan</h3><p>Tempat terstruktur untuk mengelola informasi kesehatan pribadi secara bertahap dan bertanggung jawab.</p><button type="button" onClick={() => buka("catatan")}>Buka Catatan →</button></article>
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
