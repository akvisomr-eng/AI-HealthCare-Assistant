import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("Admin Center menampilkan modul klinik", () => {
  render(<App />);
  expect(screen.getByText("Dashboard Klinik")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /^Pasien$/ }));
  expect(screen.getByText("Manajemen Pasien")).toBeInTheDocument();
});

test("Admin Center dapat membuka formulir pasien", () => {
  render(<App />);
  fireEvent.click(screen.getByText("+ Pasien Baru"));
  expect(screen.getByText("Tambah Pasien")).toBeInTheDocument();
});
