import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { useCMS } from "../../context/CMSContext.tsx";
import { DashboardOverviewTab } from "../../components/admin/DashboardOverviewTab.tsx";
import { VisualEditorTab } from "../../components/admin/VisualEditorTab.tsx";
import { SectionManagerTab } from "../../components/admin/SectionManagerTab.tsx";
import { ProductsManagerTab } from "../../components/admin/ProductsManagerTab.tsx";
import { MediaLibraryTab } from "../../components/admin/MediaLibraryTab.tsx";
import { ColorThemeTab } from "../../components/admin/ColorThemeTab.tsx";
import { TypographyTab } from "../../components/admin/TypographyTab.tsx";
import { OutletSettingsTab } from "../../components/admin/OutletSettingsTab.tsx";
import { SEOSettingsTab } from "../../components/admin/SEOSettingsTab.tsx";
import { VersionsHistoryTab } from "../../components/admin/VersionsHistoryTab.tsx";
import { SupabaseSetupTab } from "../../components/admin/SupabaseSetupTab.tsx";
import {
  LayoutDashboard,
  Edit3,
  Layers,
  ShoppingBag,
  Image as ImageIcon,
  Palette,
  Type,
  Store,
  Search,
  History,
  Database,
  LogOut,
  Globe,
  Menu,
  X,
  ShieldCheck,
  Save,
  CheckCircle2,
} from "lucide-react";

interface AdminDashboardLayoutProps {
  onNavigateHome: () => void;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  onNavigateHome,
}) => {
  const { profile, logout } = useAuth();
  const { hasUnsavedChanges, saveDraft, publishDraft, publishedData } = useCMS();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [saveBannerMsg, setSaveBannerMsg] = useState("");

  const navigationTabs = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "editor", label: "Editor Website", icon: Edit3 },
    { id: "sections", label: "Manajemen Section", icon: Layers },
    { id: "products", label: "Manajemen Produk", icon: ShoppingBag },
    { id: "media", label: "Media Library", icon: ImageIcon },
    { id: "colors", label: "Pengaturan Warna", icon: Palette },
    { id: "typography", label: "Tipografi & Font", icon: Type },
    { id: "outlet", label: "Outlet & Maps", icon: Store },
    { id: "seo", label: "SEO & Metadata", icon: Search },
    { id: "versions", label: "Draft & Publikasi", icon: History },
    { id: "supabase_setup", label: "Setup Supabase", icon: Database },
  ];

  const handleQuickSave = async () => {
    const res = await saveDraft();
    if (res.success) {
      if (res.isLocalOnly) {
        setSaveBannerMsg("Draft tersimpan lokal (Supabase belum terhubung)");
      } else {
        setSaveBannerMsg("Draft berhasil tersimpan di server!");
      }
      setTimeout(() => setSaveBannerMsg(""), 4000);
    } else {
      setSaveBannerMsg(`Gagal: ${res.error || "Gagal menyimpan draft"}`);
      setTimeout(() => setSaveBannerMsg(""), 5000);
    }
  };

  const handleQuickPublish = async () => {
    const res = await publishDraft();
    if (res.success) {
      setSaveBannerMsg("Dipublikasikan ke Website Publik!");
      setTimeout(() => setSaveBannerMsg(""), 4000);
    } else {
      setSaveBannerMsg(`Gagal: ${res.error || "Gagal mempublikasikan"}`);
      setTimeout(() => setSaveBannerMsg(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#251A18] flex flex-col font-sans">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8B0A18] text-[#F2B233] flex items-center justify-center font-bold text-sm shadow-xs">
                DC
              </div>
              <div className="hidden sm:block text-left">
                <span className="font-heading font-bold text-base text-gray-900 leading-tight block">
                  Dimsum Cemeal CMS
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  Super Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Center / Status */}
          {hasUnsavedChanges && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Ada perubahan draft belum disimpan</span>
            </div>
          )}

          {saveBannerMsg && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-full font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{saveBannerMsg}</span>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickSave}
              className="hidden sm:inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[#8B0A18]" />
              <span>Simpan Draft</span>
            </button>

            <button
              onClick={handleQuickPublish}
              className="inline-flex items-center gap-1.5 bg-[#8B0A18] hover:bg-[#720712] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#F2B233]" />
              <span className="hidden sm:inline">Publikasikan</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-[#8B0A18] font-semibold px-2.5 py-2 rounded-lg cursor-pointer"
              title="Lihat Website Publik"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden lg:inline">Lihat Web</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Left Sidebar (Desktop + Mobile Drawer) */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-200 transform ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between lg:hidden pb-2 border-b">
              <span className="font-bold text-xs text-gray-700">Menu Navigasi CMS</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1 text-left">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#8B0A18] text-white shadow-xs"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#F2B233]" : "text-gray-500"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Profile & Logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-[#8B0A18] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  SA
                </div>
                <div className="truncate text-left">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {profile?.fullName || "Super Admin"}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {profile?.email || "admin@dimsumcemeal.com"}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-full">
          {activeTab === "overview" && (
            <DashboardOverviewTab onNavigateTab={(t) => setActiveTab(t)} />
          )}
          {activeTab === "editor" && <VisualEditorTab />}
          {activeTab === "sections" && <SectionManagerTab />}
          {activeTab === "products" && <ProductsManagerTab />}
          {activeTab === "media" && <MediaLibraryTab />}
          {activeTab === "colors" && <ColorThemeTab />}
          {activeTab === "typography" && <TypographyTab />}
          {activeTab === "outlet" && <OutletSettingsTab />}
          {activeTab === "seo" && <SEOSettingsTab />}
          {activeTab === "versions" && <VersionsHistoryTab />}
          {activeTab === "supabase_setup" && <SupabaseSetupTab />}
        </main>
      </div>
    </div>
  );
};
