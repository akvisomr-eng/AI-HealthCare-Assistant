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

test("Admin Center dapat membuka formulir pasien", async () => {
  render(<App />);
  fireEvent.click(await screen.findByText("+ Pasien Baru"));
  expect(screen.getByText("Tambah Pasien")).toBeInTheDocument();
});
