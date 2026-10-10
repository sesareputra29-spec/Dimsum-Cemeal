import React from "react";
import { Instagram, MapPin, Clock, ArrowUpRight, ExternalLink } from "lucide-react";
import { useCMS } from "../context/CMSContext.tsx";

export const Footer: React.FC = () => {
  const { publishedData } = useCMS();
  const { settings, outlet } = publishedData;
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="text-white pt-16 pb-12 border-t"
      style={{
        backgroundColor: settings.primaryDarkColor,
        borderColor: `${settings.secondaryColor}30`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Column 1 */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border"
                style={{
                  backgroundColor: settings.primaryColor,
                  color: settings.secondaryColor,
                  borderColor: `${settings.secondaryColor}60`,
                }}
              >
                <span>DC</span>
              </div>
              <span
                className="font-bold text-2xl text-white tracking-tight"
                style={{ fontFamily: settings.headingFont }}
              >
                {settings.brandName}
              </span>
            </div>

            <p className="text-sm text-white/75 leading-relaxed mb-6 max-w-sm">
              {settings.tagline} Sajian aneka varian dimsum siap santap lezat, hangat, dan menggugah selera untuk setiap momen berharga di {outlet.city}, {outlet.province}.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/dimsum.cemeal/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#8B0A18] flex items-center justify-center text-white transition-all border border-white/10"
                aria-label={`Instagram Resmi ${settings.brandName}`}
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href={outlet.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#8B0A18] flex items-center justify-center text-white transition-all border border-white/10"
                aria-label="Google Maps Outlet"
              >
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="lg:col-span-2">
            <h4
              className="font-bold text-base mb-4 uppercase tracking-wider text-xs"
              style={{ color: settings.secondaryColor }}
            >
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <a href="#hero" className="hover:text-[#F2B233] transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-[#F2B233] transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#F2B233] transition-colors">
                  Menu Favorit
                </a>
              </li>
              <li>
                <a href="#keunggulan" className="hover:text-[#F2B233] transition-colors">
                  Keunggulan
                </a>
              </li>
              <li>
                <a href="#galeri" className="hover:text-[#F2B233] transition-colors">
                  Galeri Foto
                </a>
              </li>
              <li>
                <a href="#lokasi" className="hover:text-[#F2B233] transition-colors">
                  Lokasi Outlet
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="lg:col-span-3">
            <h4
              className="font-bold text-base mb-4 uppercase tracking-wider text-xs"
              style={{ color: settings.secondaryColor }}
            >
              Jam Operasional
            </h4>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 shrink-0 mt-1" style={{ color: settings.secondaryColor }} />
                <div>
                  <p className="font-semibold text-white">Senin – Sabtu</p>
                  <p className="text-white/70">{outlet.operatingHours}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="font-semibold text-white/90 text-xs">Hari Minggu</p>
                <p className="text-xs text-white/60">Tutup</p>
              </div>
            </div>
          </div>

          {/* Column 4 */}
          <div className="lg:col-span-3">
            <h4
              className="font-bold text-base mb-4 uppercase tracking-wider text-xs"
              style={{ color: settings.secondaryColor }}
            >
              Kanal Resmi & Lokasi
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a
                  href="https://gofood.co.id/serang/restaurant/dimsum-cemeal-alfamart-bhayangkara-843af7ca-5e01-4044-8fff-daddfad62706"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                >
                  <span className="font-medium text-xs">Pesan di GoFood</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F2B233]" />
                </a>
              </li>
              <li>
                <a
                  href="https://r.grab.com/g/2-1-6-C6MJAYUYV6DKJA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                >
                  <span className="font-medium text-xs">Pesan di GrabFood</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F2B233]" />
                </a>
              </li>
              <li>
                <a
                  href={outlet.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                >
                  <span className="font-medium text-xs">Google Maps Outlet</span>
                  <ExternalLink className="w-4 h-4 text-[#F2B233]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>
            © {currentYear} {settings.brandName}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{outlet.city}, {outlet.province}, Indonesia</span>
            <span aria-hidden="true">·</span>
            <span>{outlet.name}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
