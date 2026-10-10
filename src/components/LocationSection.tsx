import React from "react";
import { MapPin, Clock, ExternalLink, Navigation, Store } from "lucide-react";
import { useCMS } from "../context/CMSContext.tsx";

export const LocationSection: React.FC = () => {
  const { publishedData } = useCMS();
  const { settings, outlet, sections } = publishedData;

  const locSec = sections.find((s) => s.id === "lokasi");
  if (locSec && !locSec.visible) return null;

  return (
    <section
      id="lokasi"
      className="py-20 md:py-28 relative"
      style={{ backgroundColor: locSec?.bgColor || settings.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0A18]/10 text-[#8B0A18] text-xs font-semibold tracking-wider uppercase mb-3">
            <Store className="w-3.5 h-3.5 text-[#F2B233]" />
            <span>Lokasi Outlet</span>
          </div>

          <h2
            className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#251A18] tracking-tight"
            style={{ fontFamily: settings.headingFont }}
          >
            {locSec?.title || "Kunjungi Outlet Kami"}
          </h2>

          <p className="text-sm sm:text-base text-[#756761] mt-3">
            Nikmati sajian dimsum hangat langsung dari gerai kami di {outlet.city}, {outlet.province}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 border border-[#8B0A18]/10 shadow-sm">
            <div>
              <div className="relative rounded-2xl overflow-hidden aspect-16/10 mb-6 bg-[#FFF3E6] border border-[#8B0A18]/10">
                <img
                  src="/images/outlet/outlet-bhayangkara.png"
                  alt={`Gerai fisik ${settings.brandName}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-white flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#F2B233]" />
                  <span>{outlet.name}</span>
                </div>
              </div>

              <h3
                className="font-bold text-2xl mb-3"
                style={{
                  color: settings.primaryColor,
                  fontFamily: settings.headingFont,
                }}
              >
                {outlet.name}
              </h3>

              <div className="space-y-4 text-sm text-[#251A18]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#8B0A18]/10 flex items-center justify-center text-[#8B0A18] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#756761] uppercase tracking-wider">
                      Alamat Outlet
                    </p>
                    <p className="font-medium text-sm text-[#251A18] mt-0.5">
                      {outlet.address}
                    </p>
                    <p className="text-xs text-[#756761] mt-1 italic">
                      {outlet.note}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F2B233]/20 flex items-center justify-center text-[#8B0A18] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#756761] uppercase tracking-wider">
                      Jam Operasional
                    </p>
                    <p className="font-medium text-sm text-[#251A18] mt-0.5">
                      {outlet.operatingHours}
                    </p>
                    <p className="text-xs text-[#756761] mt-0.5">
                      Hari Minggu tutup untuk persiapan stok harian
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#8B0A18]/10">
              <a
                href={outlet.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 font-semibold text-sm py-3.5 px-6 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer group"
                style={{
                  backgroundColor: settings.primaryColor,
                  color: "#FFFFFF",
                }}
              >
                <Navigation className="w-4 h-4 text-[#F2B233] group-hover:rotate-12 transition-transform" />
                <span>Buka Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-[#8B0A18]/10 shadow-sm flex flex-col">
            <div className="p-4 bg-[#FFF0E0] border-b border-[#8B0A18]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8B0A18]" />
                <span className="text-xs font-semibold text-[#8B0A18]">
                  Peta Lokasi Interaktif
                </span>
              </div>
              <span className="text-[11px] text-[#756761]">
                {outlet.city}, {outlet.province}
              </span>
            </div>

            <div className="relative flex-1 w-full min-h-[380px] sm:min-h-[440px]">
              <iframe
                title={`Peta Lokasi ${settings.brandName}`}
                src={outlet.mapsEmbedUrl}
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
