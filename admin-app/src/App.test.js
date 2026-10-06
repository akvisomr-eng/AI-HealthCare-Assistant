import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

jest.mock("./api",()=>({isApiConfigured:()=>false,apiGet:jest.fn(),apiPost:jest.fn()}));
jest.mock("./supabase",()=>({supabase:{auth:{getSession:()=>Promise.resolve({data:{session:{user:{id:"test-user"}}}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe:()=>{}}}}),signOut:jest.fn().mockResolvedValue({})}},getMyOrganization:jest.fn()}));

test("Admin Center menampilkan modul klinik", async () => {
  render(<App />);
  expect(await screen.findByText("Dashboard Klinik")).toBeInTheDocument();
  const tombolPasien = screen.getAllByRole("button",{name:/Pasien/}).find(button=>button.classList.contains("nav"));
  expect(tombolPasien).toBeDefined();
  fireEvent.click(tombolPasien);
  expect(screen.getByText("Manajemen Pasien")).toBeInTheDocument();
});

test("RME membuka workflow Encounter dan dapat kembali", async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole("button",{name:/RME/}));
  expect(screen.getByText("Rekam Medis Elektronik")).toBeInTheDocument();
  const encounterHeading=screen.getAllByRole("heading",{name:"Encounter",level:3})[0];
  const encounterCard=encounterHeading.closest("section");
  expect(encounterCard).toBeTruthy();
  fireEvent.click(encounterCard.querySelector("button"));
  expect(screen.getByText("Encounter").closest("h3")).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"+ Encounter Baru"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"+ Encounter Baru"}));
  expect(screen.getByText("Encounter Baru")).toBeInTheDocument();
  expect(screen.queryByRole("button",{name:"+ Buat data"})).not.toBeInTheDocument();
  expect(screen.queryByText("Status workflow")).not.toBeInTheDocument();
  expect(screen.queryByRole("button",{name:"Filter"})).not.toBeInTheDocument();
  expect(screen.queryByRole("button",{name:"Export"})).not.toBeInTheDocument();
  expect(screen.queryByText("Belum ada transaksi nyata")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Batal"}));
  fireEvent.click(screen.getByRole("button",{name:/Kembali ke Rekam Medis Elektronik/}));
  expect(screen.getByText("Rekam Medis Elektronik")).toBeInTheDocument();
});

test("Admin Center dapat membuka formulir pasien", async () => {
  render(<App />);
  fireEvent.click(await screen.findByText("+ Pasien Baru"));
  expect(screen.getByText("Tambah Pasien")).toBeInTheDocument();
});


test("Workspace modul ditutup saat berpindah ke modul bisnis", async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole("button",{name:/RME/}));
  const encounterHeading=screen.getAllByRole("heading",{name:"Encounter",level:3})[0];
  const encounterCard=encounterHeading.closest("section");
  fireEvent.click(encounterCard.querySelector("button"));
  expect(screen.getByRole("button",{name:"+ Encounter Baru"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:/HRD/}));
  expect(screen.getByRole("heading",{name:"HRD",level:1})).toBeInTheDocument();
  expect(screen.queryByText("Ruang kerja modul")).not.toBeInTheDocument();
});