import React from "react";
import { ArrowUpRight, Bike, ShieldCheck, Heart } from "lucide-react";
import { useCMS } from "../context/CMSContext.tsx";

export const OrderSection: React.FC = () => {
  const { publishedData } = useCMS();
  const { settings, sections, outlet } = publishedData;

  const orderSec = sections.find((s) => s.id === "pemesanan");
  if (orderSec && !orderSec.visible) return null;

  return (
    <section
      id="pemesanan"
      className="py-20 md:py-24 text-white relative overflow-hidden"
      style={{ backgroundColor: settings.primaryDarkColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#420309] rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#F2B233]/30 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2B233]/15 text-[#F2B233] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#F2B233]/30">
              <Bike className="w-4 h-4 text-[#F2B233]" />
              <span>Layanan Antar Cepat & Hangat</span>
            </div>

            <h2
              className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-5 leading-tight"
              style={{ fontFamily: settings.headingFont }}
            >
              {orderSec?.title || "Lagi Ingin Dimsum?"}
            </h2>

            <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-10 max-w-2xl mx-auto">
              Pilih menu favoritmu dan nikmati {settings.brandName} dengan cara pemesanan yang praktis.
              Cukup pesan melalui platform resmi pilihanmu di bawah ini:
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
              <a
                href="https://gofood.co.id/serang/restaurant/dimsum-cemeal-alfamart-bhayangkara-843af7ca-5e01-4044-8fff-daddfad62706"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#EE2737] hover:bg-[#d51d2c] text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all active:scale-98 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#EE2737] font-bold text-xs">
                  GF
                </div>
                <span>Pesan via GoFood</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="https://r.grab.com/g/2-1-6-C6MJAYUYV6DKJA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#00B14F] hover:bg-[#009643] text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all active:scale-98 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#00B14F] font-bold text-xs">
                  Gr
                </div>
                <span>Pesan via GrabFood</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/70 pt-6 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F2B233]" />
                Tautan Resmi Terverifikasi
              </span>
              <span aria-hidden="true" className="text-white/30 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#F2B233]" />
                Kualitas Kemasan Terjaga
              </span>
              <span aria-hidden="true" className="text-white/30 hidden sm:inline">·</span>
              <span>Melayani Area {outlet.city} & Sekitarnya</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
