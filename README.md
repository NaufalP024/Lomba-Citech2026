# 🏛️ SIGAP — Sistem Informasi & Pengawasan Gedung Publik
### *Purwakarta Smart City Digital Twin & Eco-Energy Management Platform*

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 📌 Latar Belakang & Deskripsi Proyek

**SIGAP (Sistem Informasi dan Pengawasan Gedung Publik)** diusulkan sebagai solusi digital integratif bagi Pemerintah Kabupaten Purwakarta untuk mengatasi kesenjangan antara sistem pemantauan keselamatan fisik gedung dan efisiensi konsumsi energi yang selama ini berjalan secara terpisah.

Melalui pendekatan **3D Digital Twin Spatial Visualization**, SIGAP menyatukan pemantauan beban listrik, tingkat emisi jejak karbon, integrasi sumber energi surya terbarukan, serta status keselamatan infrastruktur ke dalam **satu platform dashboard terpadu** yang mudah diakses oleh pengelola gedung dan dinas terkait.

---

## ✨ Fitur-Fitur Unggulan

### 🌐 1. Visualisasi Spatial 3D Digital Twin
- Interactive WebGL/Three.js 3D rendering untuk seluruh aset gedung publik Kabupaten Purwakarta.
- Mode Siang/Malam (*Night Mode*) dinamis dengan pencahayaan lingkungan teratur.
- Fitur *Camera Orbiting*, *Floor Focusing*, dan *3D Model Inspection* (dukungan GLTF/GLB & Sketchfab embed).

### 🤖 2. Dynamic AI Recommendation Engine
- Mesin kecerdasan buatan berbasis aturan telemetri real-time (*Client-Side AI Engine*).
- Secara otomatis memproses tingkat **Emisi Karbon (kg CO₂/hari)** dan **Porsi Energi Surya (%)** untuk menghasilkan rekomendasi efisiensi energi terpersonalisasi pada setiap aset.

### 🛡️ 3. Otorisasi Akses Berbasis Peran (Role-Based Access Control / RBAC)
- **Superadmin (Kepala Dinas Kominfo)**: Memiliki akses penuh untuk mengelola telemetri seluruh gedung, memilih pelapor insiden, dan menyelesaikan laporan di semua lokasi.
- **Koordinator Gedung (Tim Pengelola)**: Memiliki akses terkunci (*Role-Locked*) yang membatasi tindakan pengawasan, pelaporan, serta penyelesaian insiden **hanya pada gedung wewenangnya** (misal: Farhan Ramadhan hanya mengelola Bale Panyawangan).

### 🚨 4. Pengawasan Insiden & Notifikasi Pintar
- Pelaporan anomali dan gangguan fasilitas gedung secara cepat.
- Aksi resolusi cepat dengan penanda status **Ceklis Selesai Ditangani**.
- Stack notifikasi langsung (*Live Smart Notifications*) untuk fluktuasi beban listrik dan peringatan keselamatan.

### 📊 5. Analisis Kota & Peta Jaringan Mikro-Grid
- Visualisasi grafik interaktif menggunakan **Apache ECharts** & **Recharts** untuk analisis tren historis.
- Pemantauan efisiensi HVAC, tingkat okupansi, dan distribusi daya penerangan luar.
- Fitur ekspor laporan resmi berskala profesional dalam format **PDF** (`jsPDF`).

---

## 🛠️ Spesifikasi Teknologi (Tech Stack)

| Kategori | Teknologi | Kegunaan dalam Proyek |
| :--- | :--- | :--- |
| **Bahasa Pemrograman** | TypeScript / JavaScript (ES6+) | Menjamin keamanan tipe data (*Type Safety*) dan logika aplikasi |
| **Framework Front-end** | React 18 + Vite | Component-based UI library & bundler super cepat |
| **Engine 3D & Render** | Three.js, React Three Fiber, Drei, Sketchfab | Rendering 3D Digital Twin, pencahayaan, & inspeksi model |
| **Styling & Desain** | Tailwind CSS + Framer Motion | Design system responsif, animasi glassmorphism, & tema modern |
| **State Management** | Zustand | Pengelolaan state terpusat (auth, telemetri gedung, insiden) |
| **Visualisasi Data** | Apache ECharts & Recharts | Grafik tren konsumsi daya, distribusi beban, & indikator hijau |
| **Dokumen & Ekspor** | jsPDF + jsPDF-AutoTable | Generasi laporan analitik resmi dalam format PDF & CSV |
| **Notifikasi UI** | Sonner | Component pemberitahuan toast interaktif |
| **Version Control** | Git & GitHub | Manajemen kode sumber repositori |
| **Deployment** | Vercel / Netlify | Hosting platform cloud untuk aplikasi web |

---

## 📁 Struktur Direktori Proyek

```text
Lomba_SmartCity/
├── public/
│   ├── models/                # File model 3D GLTF / GLB (Panyawangan, Gedung Kadin, dll.)
│   └── favicon.ico
├── src/
│   ├── assets/                # Aset gambar, logo Purwakarta, & icon
│   ├── components/
│   │   ├── auth/              # Gateway Login & otorisasi RBAC
│   │   ├── building/          # Floating Callout Card 3D
│   │   ├── cards/             # Card Indeks Hijau & AI Recommendation
│   │   ├── minimap/           # Interactive 2D Minimap
│   │   ├── navbar/            # Navigation Header & Tab Selector
│   │   ├── panels/            # Incidents Modal, Manage Asset, Analytics, Users
│   │   └── ui/                # Top Header, Notifications, Onboarding Tour
│   ├── data/                  # Mock data JSON (buildings, incidents, analytics)
│   ├── hooks/                 # Custom React hooks (Shortcuts, Resize listener)
│   ├── scene/                 # Three.js Canvas, Lighting, & City Environment
│   ├── store/                 # Zustand central state management (`useCityStore`)
│   ├── types/                 # TypeScript interface & type definitions
│   └── utils/                 # Rules engine, PDF exporter, & helper functions
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Panduan Instalasi & Pengoperasian Lokal

### 1. Prasyarat Sistem
- **Node.js**: versi 18.x atau 20.x ke atas.
- **npm**: versi 9.x ke atas.

### 2. Langkah-Langkah Running

```bash
# 1. Clone repositori ini
git clone https://github.com/NaufalP024/Lomba-Citech2026.git

# 2. Masuk ke direktori proyek
cd Lomba-Citech2026

# 3. Install seluruh dependensi proyek
npm install

# 4. Jalankan server pengembang lokal (Development Mode)
npm run dev
```

Aplikasi akan berjalan secara lokal di URL: `http://localhost:5173/`

### 3. Build untuk Production

```bash
# Melakukan kompilasi TypeScript dan bundel Vite
npm run build

# Menjalankan preview hasil build production secara lokal
npm run preview
```

---

## 🔑 Kredensial Pengujian Akun (Demo Credentials)

Anda dapat menggunakan akun-akun simulasi berikut untuk menguji fitur otorisasi **Role-Based Access Control (RBAC)**:

| Nama Pengguna | Role / Jabatan | Cakupan Wewenang |
| :--- | :--- | :--- |
| **Budi Santoso** | Kepala Dinas Kominfo (*Superadmin*) | Akses Penuh Seluruh Gedung & Insiden |
| **Farhan Ramadhan** | Koordinator Bale Panyawangan | Terkunci di Gedung Bale Panyawangan (#PWK-01) |
| **Siti Nurhaliza** | Koordinator Kantor Bupati | Terkunci di Gedung Kantor Bupati (#PWK-02) |
| **Ahmad Subagja** | Koordinator Gedung Kadin | Terkunci di Gedung Kadin (#PWK-03) |

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keikutsertaan **Kompetisi Citech 2026 / Smart City Purwakarta**. Hak cipta dilindungi undang-undang di bawah lisensi **MIT License**.
