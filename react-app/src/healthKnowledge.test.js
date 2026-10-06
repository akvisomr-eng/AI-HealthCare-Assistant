import { analisisKeluhan, pertanyaanAdaptif } from "./healthKnowledge";

describe("mesin triase SehatKita", () => {
  test("mengenali tanda bahaya dan memprioritaskannya", () => {
    const hasil = analisisKeluhan("Saya demam dan sekarang sesak berat.");
    expect(hasil.kode).toBe("DARURAT");
    expect(hasil.tandaBahaya.length).toBeGreaterThan(0);
  });

  test("mengenali beberapa keluhan dan mengarahkan konsultasi", () => {
    const hasil = analisisKeluhan("Sejak kemarin saya demam dan batuk.");
    expect(hasil.kode).toBe("KONSULTASI");
    expect(hasil.gejala).toEqual(expect.arrayContaining(["demam", "batuk"]));
  });

  test("keluhan tunggal ringan tetap konservatif", () => {
    const hasil = analisisKeluhan("Saya agak pusing.");
    expect(hasil.kode).toBe("PANTAU");
  });

  test("wawancara adaptif meminta konteks yang belum ada", () => {
    const hasil = analisisKeluhan("Saya batuk.");
    const pertanyaan = pertanyaanAdaptif(hasil);
    expect(pertanyaan.length).toBeGreaterThan(0);
    expect(pertanyaan.join(" ")).toMatch(/kapan|mulai|berat|membaik/i);
  });

  test("input kosong tidak menghasilkan diagnosis", () => {
    expect(analisisKeluhan("")).toBeNull();
  });
});
