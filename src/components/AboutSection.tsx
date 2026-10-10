import React from "react";
import { Heart, Users, Sparkles } from "lucide-react";
import { useCMS } from "../context/CMSContext.tsx";

export const AboutSection: React.FC = () => {
  const { publishedData } = useCMS();
  const { settings, sections, outlet } = publishedData;

  const aboutSec = sections.find((s) => s.id === "tentang");
  if (aboutSec && !aboutSec.visible) return null;

  return (
    <section
      id="tentang"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ backgroundColor: aboutSec?.bgColor || settings.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Side */}
          <div className="lg:col-span-5 order-2 lg:order-1 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-4 bg-[#F2B233]/20 rounded-3xl transform -rotate-2" />

              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <img
                  src="/images/gallery/dimsum-craftsmanship.png"
                  alt={`Proses pembuatan ${settings.brandName}`}
                  className="w-full h-[360px] sm:h-[420px] object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                <div className="p-5 bg-white border-t border-[#8B0A18]/10">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#8B0A18]/10 text-[#8B0A18] shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5 text-[#8B0A18]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#251A18]">
                        Komitmen Rasa Autentik
                      </h4>
                      <p className="text-xs text-[#756761] mt-0.5 leading-relaxed">
                        Diproduksi dengan bahan pilihan serta teknik pengukusan yang menjaga kelembutan setiap varian.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="lg:col-span-7 order-1 lg:order-2 text-left">
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: settings.primaryColor }}
            >
              Tentang {settings.brandName}
            </span>

            <h2
              className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#251A18] mt-2 mb-6 tracking-tight leading-tight"
              style={{ fontFamily: settings.headingFont }}
            >
              {settings.aboutTitle}
            </h2>

            <p
              className="text-base sm:text-lg text-[#756761] leading-relaxed mb-6"
              style={{ fontFamily: settings.bodyFont }}
            >
              {settings.aboutDescription}
            </p>

            <p className="text-sm sm:text-base text-[#756761] leading-relaxed mb-8">
              Berlokasi di kawasan strategis {outlet.city}, {outlet.province}, {settings.brandName} berfokus pada kualitas penyajian makanan siap santap yang menggugah selera. Setiap porsi disajikan hangat untuk memastikan tekstur lembut, gurih, dan kepuasan rasa saat dinikmati.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#8B0A18]/10">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white shadow-xs border border-[#8B0A18]/5">
                <Heart className="w-5 h-5 text-[#8B0A18] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#251A18]">Diramu Penuh Dedikasi</h4>
                  <p className="text-xs text-[#756761] mt-0.5">
                    Mengutamakan kesegaran dan kebersihan dalam setiap sajian.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white shadow-xs border border-[#8B0A18]/5">
                <Users className="w-5 h-5 text-[#8B0A18] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#251A18]">Teman Berbagi Momen</h4>
                  <p className="text-xs text-[#756761] mt-0.5">
                    Pilihan tepat untuk camilan keluarga dan teman kumpul.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
