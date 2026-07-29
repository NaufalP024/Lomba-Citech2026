import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { AlertTriangle, ShieldAlert, Clock, Plus, CheckCircle, X, Send, Edit3, Trash2 } from 'lucide-react';
import analyticsData from '../../data/analytics.json';
import { toast } from 'sonner';
import { IncidentItem } from '../../types/city';

export const IncidentsViewModal: React.FC = () => {
  const activeTab = useCityStore((state) => state.activeTab);
  const selectBuilding = useCityStore((state) => state.selectBuilding);
  const setActiveTab = useCityStore((state) => state.setActiveTab);
  const buildings = useCityStore((state) => state.buildings);
  const incidents = useCityStore((state) => state.incidents);
  const addIncident = useCityStore((state) => state.addIncident);
  const updateIncident = useCityStore((state) => state.updateIncident);
  const deleteIncident = useCityStore((state) => state.deleteIncident);
  const resolveIncident = useCityStore((state) => state.resolveIncident);
  const currentUser = useCityStore((state) => state.currentUser);

  const teamCoordinators = analyticsData.users;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncidentId, setEditingIncidentId] = useState<string | null>(null);

  const [selectedBuildingId, setSelectedBuildingId] = useState(buildings[0]?.id || 'b-42');
  const [reporter, setReporter] = useState('');
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium'>('high');
  const [description, setDescription] = useState('');

  if (activeTab !== 'Incidents') return null;

  const handleOpenCreateForm = () => {
    setEditingIncidentId(null);
    setSelectedBuildingId(currentUser?.assignedBuildingId !== 'all' ? (currentUser?.assignedBuildingId || buildings[0]?.id) : (buildings[0]?.id || 'b-42'));
    setReporter(currentUser ? `${currentUser.name} (${currentUser.role})` : `${teamCoordinators[0].name} (${teamCoordinators[0].role})`);
    setTitle('');
    setSeverity('high');
    setDescription('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (inc: IncidentItem) => {
    setEditingIncidentId(inc.id);
    setSelectedBuildingId(inc.buildingId);
    setReporter(inc.reporter || `${teamCoordinators[0].name} (${teamCoordinators[0].role})`);
    setTitle(inc.title);
    setSeverity(inc.severity === 'low' ? 'medium' : inc.severity);
    setDescription(inc.description);
    setIsFormOpen(true);
  };

  const handleInspect = (buildingId: string) => {
    selectBuilding(buildingId);
    setActiveTab('Dashboard');
  };

  const handleBuildingChange = (bId: string) => {
    setSelectedBuildingId(bId);
    const bld = buildings.find((b) => b.id === bId);
    if (!bld) return;

    // Try to auto-match coordinator from team personnel list
    const matchedUser = teamCoordinators.find(
      (u) => u.role.toLowerCase().includes(bld.name.toLowerCase()) || u.role.toLowerCase().includes(bld.type.toLowerCase())
    );

    if (matchedUser) {
      setReporter(`${matchedUser.name} (${matchedUser.role})`);
    } else if (bld.coordinator) {
      setReporter(bld.coordinator);
    } else {
      setReporter(`${teamCoordinators[0].name} (${teamCoordinators[0].role})`);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Mohon isi judul dan deskripsi insiden!');
      return;
    }

    const bld = buildings.find((b) => b.id === selectedBuildingId) || buildings[0];

    if (editingIncidentId) {
      // Edit Mode
      updateIncident(editingIncidentId, {
        buildingId: bld.id,
        buildingName: bld.name,
        severity,
        title,
        description,
        reporter,
      });
      toast.success('Pembaruan data insiden berhasil disimpan!', {
        description: `Insiden "${title}" diperbarui oleh ${reporter}.`,
      });
    } else {
      // Create Mode
      addIncident({
        buildingId: bld.id,
        buildingName: bld.name,
        severity,
        title,
        description,
        reporter,
      });
      toast.success('Laporan insiden baru berhasil dikirim!', {
        description: `Insiden "${title}" dilaporkan untuk ${bld.name} oleh ${reporter}.`,
      });
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string, incTitle: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus laporan insiden "${incTitle}"?`)) {
      deleteIncident(id);
      toast.success(`Insiden "${incTitle}" berhasil dihapus.`);
    }
  };

  const handleResolve = (id: string, incTitle: string) => {
    resolveIncident(id);
    toast.success(`Insiden "${incTitle}" telah ditandai Selesai.`);
  };

  const activeIncidentsCount = incidents.filter((i) => i.status !== 'Resolved').length;

  return (
    <>
      {/* Main Panel List Container */}
      <div className="fixed top-16 sm:top-20 left-3 sm:left-6 right-3 lg:right-[410px] bottom-3 sm:bottom-6 z-30 bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Insiden Infrastruktur Perkotaan</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                {activeIncidentsCount} Aktif
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pelaporan anomali dan tindak lanjut oleh Tim Pengelola & Koordinator Gedung.
            </p>
          </div>

          <button
            onClick={handleOpenCreateForm}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-md shadow-blue-500/30 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Laporkan Insiden Baru</span>
          </button>
        </div>

        {/* Incidents List */}
        <div className="space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                inc.status === 'Resolved'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-blue-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 shrink-0">
                  {inc.status === 'Resolved' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : inc.severity === 'critical' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                  ) : inc.severity === 'high' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-500" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h3 className={`font-bold text-xs sm:text-sm ${inc.status === 'Resolved' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                      {inc.title}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        inc.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : inc.severity === 'critical'
                          ? 'bg-rose-100 text-rose-600'
                          : inc.severity === 'high'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {inc.status === 'Resolved' ? 'Selesai Ditangani' : inc.severity === 'critical' ? 'Kritis' : inc.severity === 'high' ? 'Tinggi' : 'Sedang'}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                    Gedung: {inc.buildingName} ({inc.buildingId.toUpperCase()})
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {inc.description}
                  </p>

                  <div className="text-[11px] text-slate-400 mt-2 font-mono flex items-center space-x-3 flex-wrap gap-y-1">
                    <span>Dilaporkan: {inc.time}</span>
                    {inc.reporter && (
                      <>
                        <span>•</span>
                        <span>Koordinator: <strong className="text-slate-700 dark:text-slate-200 font-sans">{inc.reporter}</strong></span>
                      </>
                    )}
                    <span>•</span>
                    <span>Status: <strong className="text-slate-700 dark:text-slate-200">{inc.status === 'Resolved' ? 'Telah Diperbaiki' : 'Aktif'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit, Delete, Resolve, Inspect 3D */}
              <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200/50 dark:border-slate-800">
                <button
                  onClick={() => handleOpenEditForm(inc)}
                  title="Edit Laporan Insiden"
                  className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(inc.id, inc.title)}
                  title="Hapus Laporan Insiden"
                  className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/30 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {inc.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolve(inc.id, inc.title)}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    Selesai
                  </button>
                )}
                <button
                  onClick={() => handleInspect(inc.buildingId)}
                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm text-center"
                >
                  Lacak 3D
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Backdrop & Frame Modal (z-50 Fullscreen Backdrop) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-500 text-white shadow-md shadow-blue-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {editingIncidentId ? 'Edit Laporan Insiden' : 'Form Pelaporan Insiden Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">Tim Pengelola & Koordinator Fasilitas Perkotaan</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gedung / Fasilitas
                  </label>
                  <select
                    value={selectedBuildingId}
                    onChange={(e) => handleBuildingChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tingkat Keparahan
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="critical">Kritis (Bahaya / Darurat)</option>
                    <option value="high">Tinggi (Perlu Penanganan Cepat)</option>
                    <option value="medium">Sedang (Perbaikan Rutin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Koordinator Pelapor (Tim Pengelola)
                </label>
                <select
                  value={reporter}
                  onChange={(e) => setReporter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {teamCoordinators.map((user) => (
                    <option key={user.id} value={`${user.name} (${user.role})`}>
                      {user.name} — {user.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Insiden
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Gangguan Katup Utama Sirkulasi Air Bersih"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Detail Laporan
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan detail kendala, lokasi persis, dan tindakan penanganan sementara..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-blue-500/30"
                >
                  <Send className="w-4 h-4" />
                  <span>{editingIncidentId ? 'Simpan Pembaruan' : 'Kirim Laporan Insiden'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
