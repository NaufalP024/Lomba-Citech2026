import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import confetti from 'canvas-confetti';
import { BuildingData } from '../types/city';

export function exportCityDataPDF(buildings: BuildingData[]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Header Title Banner
  doc.setFillColor(30, 41, 59); // Slate-900
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PEMERINTAH KABUPATEN PURWAKARTA', 14, 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('SIGAP - Sistem Informasi dan Pengawasan Gedung Publik Kabupaten Purwakarta', 14, 18);

  doc.setFontSize(9);
  doc.text(`Tanggal Cetak: ${currentDate}`, 220, 18);

  // Summary Metrics Section
  const totalPower = buildings.reduce((acc, b) => acc + b.currentConsumption, 0);
  const avgWater = (buildings.reduce((acc, b) => acc + b.waterPressure, 0) / buildings.length).toFixed(2);
  const avgOccupancy = Math.round(buildings.reduce((acc, b) => acc + b.occupancy, 0) / buildings.length);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Ringkasan Telemetri Perkotaan:', 14, 32);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`• Total Aset Terpantau: ${buildings.length} Gedung`, 14, 38);
  doc.text(`• Total Konsumsi Listrik: ${totalPower} kW`, 90, 38);
  doc.text(`• Rata-rata Tekanan Air: ${avgWater} Bar`, 170, 38);
  doc.text(`• Rata-rata Okupansi: ${avgOccupancy}%`, 235, 38);

  // Table Data
  const tableHeaders = [
    [
      'Kode',
      'Nama Gedung / Fasilitas',
      'Kategori Aset',
      'Status Operasional',
      'Okupansi',
      'Luas Area',
      'Beban Daya',
      'Tekanan Air',
      'Efisiensi HVAC',
      'Indeks Emisi',
    ],
  ];

  const tableRows = buildings.map((b) => [
    b.code,
    b.name.replace(/\.\.\./g, ''),
    b.type,
    b.statusLabel,
    `${b.occupancy}%`,
    b.totalArea,
    `${b.currentConsumption} kW`,
    `${b.waterPressure} Bar`,
    `${b.hvacEfficiency}%`,
    b.ecoStatus === 'Green' ? 'Ramah Lingkungan' : b.ecoStatus === 'Warning' ? 'Beban Sedang' : 'Emisi Tinggi',
  ]);

  autoTable(doc, {
    startY: 44,
    head: tableHeaders,
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246], // Blue-500
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'center' },
      9: { halign: 'center' },
    },
  });

  // Footer text
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Dokumen Resmi Smart City Purwakarta - Halaman ${i} dari ${pageCount}`,
      14,
      doc.internal.pageSize.height - 8
    );
  }

  // Save PDF file
  doc.save(`Laporan_SIGAP_Purwakarta_${new Date().toISOString().split('T')[0]}.pdf`);

  // Trigger celebration confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3B82F6', '#60A5FA', '#00D8FF', '#34D399'],
  });
}
