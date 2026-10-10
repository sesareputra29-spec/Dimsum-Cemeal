/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import { CMSProvider, useCMS } from "./context/CMSContext.tsx";
import { Navbar } from "./components/Navbar.tsx";
import { HeroSection } from "./components/HeroSection.tsx";
import { AboutSection } from "./components/AboutSection.tsx";
import { MenuSection } from "./components/MenuSection.tsx";
import { FeaturesSection } from "./components/FeaturesSection.tsx";
import { GallerySection } from "./components/GallerySection.tsx";
import { OrderSection } from "./components/OrderSection.tsx";
import { LocationSection } from "./components/LocationSection.tsx";
import { Footer } from "./components/Footer.tsx";
import { OrderModal } from "./components/OrderModal.tsx";
import { ProductItem } from "./types/cms.ts";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage.tsx";
import { AdminDashboardLayout } from "./pages/admin/AdminDashboardLayout.tsx";

function AppContent() {
  const { isSuperAdmin, loading: authLoading } = useAuth();
  const { publishedData } = useCMS();
  const [currentView, setCurrentView] = useState<"public" | "login" | "admin">(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      return "admin";
    }
    return "public";
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Sync window URL path
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/admin")) {
        setCurrentView("admin");
      } else {
        setCurrentView("public");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (view: "public" | "login" | "admin") => {
    setCurrentView(view);
    if (view === "admin" || view === "login") {
      window.history.pushState({}, "", "/admin");
    } else {
      window.history.pushState({}, "", "/");
    }
  };

  const handleOpenOrderModal = () => {
    setSelectedProduct(null);
    setIsOrderModalOpen(true);
  };

  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedProduct(null);
  };

  // Render Admin Area
  if (currentView === "admin") {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#380308] flex items-center justify-center p-4">
          <div className="text-center text-amber-200 space-y-3">
            <div className="w-10 h-10 border-4 border-[#F2B233] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium">Memverifikasi Otentikasi Super Admin...</p>
          </div>
        </div>
      );
    }

    if (!isSuperAdmin) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => setCurrentView("admin")}
          onNavigateHome={() => navigateTo("public")}
        />
      );
    }
    return (
      <AdminDashboardLayout
        onNavigateHome={() => navigateTo("public")}
      />
    );
  }

  // Render Public Website
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#251A18] flex flex-col font-sans selection:bg-[#8B0A18] selection:text-white relative">
      {/* Public Navbar */}
      <Navbar
        onOpenOrderModal={handleOpenOrderModal}
        onNavigateAdmin={() => navigateTo("admin")}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection onOpenOrderModal={handleOpenOrderModal} />
        <AboutSection />
        <MenuSection onSelectProduct={handleSelectProduct} />
        <FeaturesSection />
        <GallerySection />
        <OrderSection />
        <LocationSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Order Options Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        selectedProduct={selectedProduct}
      />

      {/* Discrete Super Admin Entry Shortcut Floating Button for Owner */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => navigateTo("admin")}
          className="bg-black/70 hover:bg-black/90 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-md shadow-md transition-all opacity-40 hover:opacity-100 cursor-pointer"
          title="Buka Super Admin CMS Dashboard"
        >
          🔐 Admin CMS
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <AppContent />
      </CMSProvider>
    </AuthProvider>
  );
}
