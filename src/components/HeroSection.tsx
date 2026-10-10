import React from "react";
import { ArrowRight, UtensilsCrossed, Clock, MapPin, Sparkles } from "lucide-react";
import { useCMS } from "../context/CMSContext.tsx";
import { RichTextRenderer } from "./RichTextRenderer.tsx";

interface HeroSectionProps {
  onOpenOrderModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenOrderModal }) => {
  const { publishedData } = useCMS();
  const { settings, contentElements, outlet, sections } = publishedData;

  const heroSec = sections.find((s) => s.id === "hero");
  if (heroSec && !heroSec.visible) return null;

  const headlineElement = contentElements["hero_headline"];

  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FFF8F0] via-[#FFF3E6] to-[#FFF8F0]"
      style={{ backgroundColor: heroSec?.bgColor || settings.backgroundColor }}
    >
      <div
        className="absolute top-12 right-0 w-96 h-96 bg-[#8B0A18]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B0A18]/10 text-[#8B0A18] text-xs font-semibold tracking-wider uppercase mb-5 border border-[#8B0A18]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#F2B233]" />
              <span>{settings.eyebrow}</span>
            </div>

            <h1
              className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#251A18] tracking-tight leading-[1.15] mb-6 text-balance"
              style={{ fontFamily: settings.headingFont }}
            >
              {headlineElement?.richTextValue ? (
                <RichTextRenderer
                  parts={headlineElement.richTextValue}
                  defaultColor={settings.darkTextColor}
                />
              ) : (
                <span>
                  {headlineElement?.textValue || settings.tagline}{" "}
                  <span className="text-[#8B0A18]">Hari Ini!</span>
                </span>
              )}
            </h1>

            <p
              className="text-base sm:text-lg text-[#756761] leading-relaxed max-w-2xl mb-8"
              style={{ fontFamily: settings.bodyFont }}
            >
              {settings.heroDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href="#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#8B0A18] hover:bg-[#720712] text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <UtensilsCrossed className="w-5 h-5 text-[#F2B233]" />
                <span>Lihat Menu</span>
              </a>

              <button
                onClick={onOpenOrderModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F2B233] hover:bg-[#e2a427] text-[#49030A] font-semibold text-base px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                style={{
                  backgroundColor: settings.secondaryColor,
                  color: settings.primaryDarkColor,
                }}
              >
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Proof Badges */}
            <div className="pt-6 border-t border-[#8B0A18]/15 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#251A18]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8B0A18]/10 flex items-center justify-center text-[#8B0A18] shrink-0">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-[#251A18]">Resep Autentik</p>
                  <p className="text-[#756761] text-[11px]">Siap santap & hangat</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F2B233]/20 flex items-center justify-center text-[#8B0A18] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-[#251A18]">Jam Operasional</p>
                  <p className="text-[#756761] text-[11px]">{outlet.operatingHours}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8B0A18]/10 flex items-center justify-center text-[#8B0A18] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-[#251A18]">Lokasi Outlet</p>
                  <p className="text-[#756761] text-[11px]">{outlet.city}, {outlet.province}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#8B0A18] to-[#F2B233] rounded-3xl transform rotate-3 scale-95 opacity-20 blur-lg" />

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <img
                  src="/images/hero/hero-dimsum-main.png"
                  alt={`Sajian ${settings.brandName} autentik`}
                  className="w-full h-[360px] sm:h-[440px] lg:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-white/60 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shrink-0 shadow-sm"
                      style={{
                        backgroundColor: settings.primaryColor,
                        color: settings.secondaryColor,
                      }}
                    >
                      DC
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-[#8B0A18]">
                        {settings.brandName} Asli
                      </p>
                      <p className="text-sm font-semibold text-[#251A18]">
                        Pilihan Rasa Favorit {outlet.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
