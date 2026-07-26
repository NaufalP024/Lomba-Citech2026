# 🏛️ CityOS - Purwakarta Smart City Digital Twin
## Dokumentasi Tujuan Sistem & Panduan Indikator Status Gedung

---

## 🎯 1. TUJUAN UTAMA WEBSITE & SISTEM DIGITAL TWIN

**CityOS (Purwakarta Smart City Digital Twin)** adalah platform *Central Command & Spatial Analytics* berbasis visualisasi **3D Digital Twin interaktif** yang merepresentasikan tata kota dan aset infrastruktur krusial Kabupaten Purwakarta secara *real-time*.

### 🚀 Tujuan & Manfaat Utama Sistem:
1. **Pemantauan Terpadu 3D (*Centralized 3D Monitoring*)**:
   Menyajikan gambaran spasial 3D kota Purwakarta secara imersif untuk memantau performa gedung perkantoran, fasilitas publik, pusat layanan kesehatan, serta pusat transportasi dalam satu layar *dashboard*.
2. **Efisiensi Energi & Manajemen Utilitas (*Resource Optimization*)**:
   Melacak konsumsi daya listrik (kW), penggunaan air bersih (L/m), efisiensi sistem pendingin (HVAC), serta pemanfaatan energi terbarukan (Solar Panel) untuk menekan pemborosan energi dan emisi karbon.
3. **Deteksi Dini & Respon Cepat Insiden (*Early Warning System*)**:
   Mendeteksi secara otomatis apabila terjadi lonjakan beban listrik ekstrem, kebocoran air, gangguan jaringan internet, atau potensi insiden kebakaran pada setiap gedung sehingga tim teknis dapat merespon secara presisi.
4. **Perencanaan & Pengambilan Keputusan Berbasis Data (*Data-Driven Decision Making*)**:
   Membantu pemerintah daerah dan pengelola kota dalam merencanakan pemeliharaan aset, alokasi anggaran infrastruktur, serta optimalisasi tingkat okupansi bangunan secara akurat.

---

## 🏷️ 2. PENJELASAN STATUS & LABEL INDIKATOR PADA GEBUNG

Setiap gedung pada peta 3D dilengkapi dengan **Indikator Lampu Beacon (Lampu Pendar)** dan **Label Status Telemetri** yang mencerminkan kondisi operasional gedung secara *real-time*:

### 🟢 1. SYSTEM NOMINAL (Status Normal)
* **Warna Indikator**: **Hijau Emerald / Cyan Pendar (`#34D399`)**
* **Arti & Kondisi**:
  * Seluruh sistem utilitas gedung (Listrik, Air, HVAC, Fire Safety) beroperasi dalam kondisi **optimal dan aman**.
  * Beban konsumsi energi berada pada rentang batas normal (di bawah 75% dari batas beban puncak).
  * Tidak ditemukan insiden, kebocoran, atau gangguan teknis pada jaringan infrastruktur gedung.
* **Tindakan Sistem**: Pemantauan rutin otomatis tanpa memerlukan intervensi operator.

---

### 🟡 2. HIGH LOAD WARNING (Status Peringatan Beban Tinggi)
* **Warna Indikator**: **Kuning / Amber Pendar (`#F59E0B`)**
* **Arti & Kondisi**:
  * Gedung mengalami **lonjakan beban energi/utilitas mendekati kapasitas maksimal** (75% – 90% dari *peak threshold*).
  * Terjadi kenaikan suhu HVAC di atas normal atau tingkat okupansi pengunjung yang sangat padat.
  * Memerlukan perhatian khusus dari sistem agar tidak berkembang menjadi kondisi kritis (*overload*).
* **Tindakan Sistem**: Notifikasi peringatan dini (*warning alert*) dikirimkan ke operator untuk melakukan efisiensi atau penyesuaian beban listrik.

---

### 🔴 3. CRITICAL ALERT (Status Darurat / Insiden Kritis)
* **Warna Indikator**: **Merah Crimson Pendar (`#EF4444`)**
* **Arti & Kondisi**:
  * Terjadi **gangguan kritis atau bahaya ekstrem** pada gedung, seperti:
    * *Overload* daya listrik melebihi batas aman (potensi korsleting).
    * Kebocoran atau penurunan tekanan air drastis.
    * Kegagalan fungsi *Fire Safety* atau deteksi potensi insiden kebakaran.
  * Mengancam keselamatan operasional dan membutuhkan penanganan secepatnya.
* **Tindakan Sistem**: Sistem mengaktifkan alarm darurat (*critical alert toast*), memicu sinyal visual merah pendar pada 3D twin, dan mengarahkan kamera fokus langsung ke gedung terkait.

---

### 🔵 4. MAINTENANCE REQUIRED (Status Perawatan / Servis Berkala)
* **Warna Indikator**: **Biru Royal Pendar (`#3B82F6`)**
* **Arti & Kondisi**:
  * Gedung sedang berada dalam masa **pemeliharaan rutin (*scheduled maintenance*)**, perbaikan teknis, atau pengujian fasilitas utilitas oleh tim teknisi.
  * Beberapa utilitas mungkin dinonaktifkan sementara untuk pengujian keselamatan.
* **Tindakan Sistem**: Menampilkan status servis pada panel analisis agar tidak dikategorikan sebagai kegagalan sistem tak terduga.

---

## 🌐 3. RINGKASAN FITUR UTAMA DASHBOARD

1. **Model 3D GLTF Landmark Purwakarta**:
   Visual realitis 3D untuk Stasiun Purwakarta, Harper Hotel, Polres, Pasar Rebo, STIE Wikara, Indorama Complex, Universitas Kartamulia, Masjid Agung, Keramik Anjun, Kantor Bupati, RSUD Bayu Asih, PLTA Cirata, dll.
2. **Layer Infrastruktur Tematik 3D**:
   * **Listrik**: Jaringan kabel pendar 3D antar atap gedung.
   * **Air**: Lingkaran pipa suplai air di bawah tanah.
   * **HVAC**: Indikator ventilasi termal pendingin udara.
   * **Okupansi**: *Heatmap* tingkat kepadatan pengunjung.
   * **Fire Safety**: *Beacon* kondisi sistem pemadam kebakaran.
   * **Solar Panel**: Peta panel surya energi terbarukan.
   * **Internet**: Jaringan *mesh cyber 3D* antar gedung.
3. **Simulasi Mode Siang & Malam (*Day/Night Dynamic Simulation*)**:
   Pencahayaan realistis dengan lampu jendela kuning pendar saat malam hari.
4. **Pencarian Interaktif & Kamera Fokus Auto**:
   Memudahkan navigasi cepat ke gedung spesifik lengkap dengan panel data analitik komprehensif.
