import React from "react";
import { useCMS } from "../../context/CMSContext.tsx";
import { isSupabaseConfigured } from "../../services/supabase.ts";
import {
  LayoutDashboard,
  Database,
  Globe,
  ShoppingBag,
  Image as ImageIcon,
  Layers,
  FileCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface DashboardOverviewTabProps {
  onNavigateTab: (tabId: string) => void;
}

export const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({
  onNavigateTab,
}) => {
  const { publishedData, draftData, hasUnsavedChanges } = useCMS();

  const isConnected = isSupabaseConfigured();

  const stats = [
    {
      title: "Status Database",
      value: isConnected ? "Supabase Terhubung" : "Mode Standalone Local",
      sub: isConnected ? "PostgreSQL & Auth Active" : "Tersimpan di Storage Lokal",
      icon: Database,
      color: isConnected ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50",
    },
    {
      title: "Status Publikasi",
      value: `Versi ${publishedData.version || 1} Publik`,
      sub: hasUnsavedChanges ? "Ada Draft Belum Dipublikasi" : "Seluruh Perubahan Terpublikasi",
      icon: Globe,
      color: hasUnsavedChanges ? "text-amber-600 bg-amber-50" : "text-blue-600 bg-blue-50",
    },
    {
      title: "Jumlah Produk",
      value: `${draftData.products.length} Menu`,
      sub: `${draftData.products.filter((p) => p.photoVerified).length} Foto Asli Terverifikasi`,
      icon: ShoppingBag,
      color: "text-[#8B0A18] bg-[#8B0A18]/10",
    },
    {
      title: "Aset Gambar",
      value: `${draftData.mediaAssets.length} Berkas`,
      sub: "Media Library Terorganisasi",
      icon: ImageIcon,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#58050E] to-[#8B0A18] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2B233]/20 text-[#F2B233] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#F2B233]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Super Admin Dasbor CMS</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Selamat Datang di CMS Dimsum Cemeal
          </h1>

          <p className="text-sm text-white/80 mt-2 leading-relaxed">
            Kelola seluruh konten, menu produk, galeri, lokasi, warna, dan tampilan visual website publik secara langsung tanpa mengedit kode manual.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("editor")}
              className="inline-flex items-center gap-2 bg-[#F2B233] hover:bg-[#e2a427] text-[#58050E] font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Buka Editor Visual Website</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab("products")}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer border border-white/20"
            >
              <ShoppingBag className="w-4 h-4 text-[#F2B233]" />
              <span>Kelola Menu Produk ({draftData.products.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex items-start gap-4"
            >
              <div className={`p-3 rounded-xl ${s.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{s.title}</p>
                <h3 className="font-bold text-base text-gray-900 mt-0.5">{s.value}</h3>
                <p className="text-[11px] text-gray-400 mt-1">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Hub */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
        <h2 className="font-heading font-bold text-xl text-gray-900 mb-4">
          Pusat Pengelolaan Cepat
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateTab("editor")}
            className="p-4 rounded-2xl bg-[#FFF8F0] hover:bg-[#FFF3E6] border border-[#8B0A18]/10 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-[#8B0A18]">
                Editor Visual Live
              </span>
              <ArrowRight className="w-4 h-4 text-[#8B0A18] group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ubah teks, kata demi kata, warna, dan tata letak dengan preview langsung.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab("sections")}
            className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">
                Urutan Section Website
              </span>
              <Layers className="w-4 h-4 text-gray-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Atur urutan Hero, Tentang Kami, Menu, Galeri, dan visibilitas per perangkat.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab("colors")}
            className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">
                Pengaturan Warna Brand
              </span>
              <span className="w-4 h-4 rounded-full bg-[#8B0A18] border border-[#F2B233]" />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ubah palet warna Maroon, Gold, Cream, dan tombol secara menyeluruh.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab("media")}
            className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">
                Media Library
              </span>
              <ImageIcon className="w-4 h-4 text-gray-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Unggah, ganti, dan pilih foto asli Dimsum Cemeal untuk semua bagian.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab("outlet")}
            className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">
                Outlet & Google Maps
              </span>
              <ShieldCheck className="w-4 h-4 text-gray-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Perbarui alamat Alfamart Bhayangkara, jam operasional, dan embed peta.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab("versions")}
            className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">
                Draft & Publikasi
              </span>
              <FileCheck className="w-4 h-4 text-gray-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Simpan draft, lihat preview publik, dan pulihkan versi riwayat lama.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
