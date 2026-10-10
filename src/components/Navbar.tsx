import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, ShoppingBag } from "lucide-react";
import { useCMS } from "../context/CMSContext.tsx";

interface NavbarProps {
  onOpenOrderModal: () => void;
  onNavigateAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrderModal, onNavigateAdmin }) => {
  const { publishedData } = useCMS();
  const { settings, navigationLinks } = publishedData;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ["hero", "tentang", "menu", "keunggulan", "galeri", "lokasi"];
      const scrollPos = window.scrollY + 140;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleLinks = navigationLinks
    ? navigationLinks.filter((l) => l.visible).sort((a, b) => a.order - b.order)
    : [
        { id: "hero", label: "Beranda", href: "#hero" },
        { id: "tentang", label: "Tentang Kami", href: "#tentang" },
        { id: "menu", label: "Menu", href: "#menu" },
        { id: "keunggulan", label: "Keunggulan", href: "#keunggulan" },
        { id: "galeri", label: "Galeri", href: "#galeri" },
        { id: "lokasi", label: "Lokasi", href: "#lokasi" },
      ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FFF8F0]/95 backdrop-blur-md shadow-md py-3.5 border-b border-[#8B0A18]/10"
          : "bg-[#FFF8F0] py-5 border-b border-[#8B0A18]/5"
      }`}
      style={{ backgroundColor: isScrolled ? `${settings.backgroundColor}FA` : settings.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Brand Wordmark (Display Font) */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0"
            aria-label={`${settings.brandName} Beranda`}
          >
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border group-hover:scale-105 transition-transform"
              style={{
                backgroundColor: settings.primaryColor,
                color: settings.secondaryColor,
                borderColor: `${settings.secondaryColor}60`,
              }}
            >
              <span>DC</span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-xl sm:text-2xl tracking-tight leading-tight"
                style={{
                  fontFamily: settings.headingFont,
                  color: settings.primaryColor,
                }}
              >
                {settings.brandName}
              </span>
              <span className="text-[10px] sm:text-xs text-[#756761] font-medium tracking-wider uppercase">
                Serang · Banten
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Navigasi Utama"
            className="hidden lg:flex items-center gap-7 text-sm font-medium"
            style={{ fontFamily: settings.bodyFont }}
          >
            {visibleLinks.map((link) => {
              const isActive = activeSection === link.id || activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`transition-colors whitespace-nowrap py-1 relative ${
                    isActive ? "font-semibold" : "opacity-80 hover:opacity-100"
                  }`}
                  style={{
                    color: isActive ? settings.primaryColor : settings.darkTextColor,
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Primary CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenOrderModal}
              className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap cursor-pointer active:scale-95"
              style={{
                backgroundColor: settings.secondaryColor,
                color: settings.primaryDarkColor,
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pesan Sekarang</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              onClick={onOpenOrderModal}
              className="inline-flex items-center gap-1.5 font-semibold text-xs px-3.5 py-2 rounded-lg shadow-sm active:scale-95 whitespace-nowrap"
              style={{
                backgroundColor: settings.secondaryColor,
                color: settings.primaryDarkColor,
              }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Pesan</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{ color: settings.primaryColor }}
              aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden border-t shadow-xl px-4 pt-3 pb-6"
          style={{ backgroundColor: settings.backgroundColor }}
        >
          <nav className="flex flex-col gap-1">
            {visibleLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-3 rounded-md text-base font-medium transition-colors"
                style={{ color: settings.darkTextColor }}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-[#8B0A18]/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenOrderModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm shadow cursor-pointer"
                style={{
                  backgroundColor: settings.primaryColor,
                  color: "#FFFFFF",
                }}
              >
                <ShoppingBag className="w-4 h-4" style={{ color: settings.secondaryColor }} />
                <span>Pilih Layanan Pemesanan</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
