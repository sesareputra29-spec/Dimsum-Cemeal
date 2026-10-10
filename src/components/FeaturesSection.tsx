import React from "react";
import { Flame, Sparkles, Smartphone, MapPin } from "lucide-react";
import { useCMS } from "../context/CMSContext.tsx";

export const FeaturesSection: React.FC = () => {
  const { publishedData } = useCMS();
  const { settings, sections } = publishedData;

  const featSec = sections.find((s) => s.id === "keunggulan");
  if (featSec && !featSec.visible) return null;

  const features = [
    {
      icon: Flame,
      title: "Pilihan Rasa",
      description: "Pilihan rasa untuk menemani berbagai selera.",
      accent: "from-[#8B0A18]/15 to-[#8B0A18]/5",
    },
    {
      icon: Sparkles,
      title: "Sajikan Menggugah Selera",
      description: "Tampilan dimsum yang menarik untuk dinikmati.",
      accent: "from-[#F2B233]/25 to-[#F2B233]/5",
    },
    {
      icon: Smartphone,
      title: "Pemesanan Online",
      description: "Akses layanan pemesanan dengan lebih praktis.",
      accent: "from-[#8B0A18]/15 to-[#8B0A18]/5",
    },
    {
      icon: MapPin,
      title: "Praktis dan Mudah",
      description: "Temukan menu dan lokasi outlet dalam satu tempat.",
      accent: "from-[#F2B233]/25 to-[#F2B233]/5",
    },
  ];

  return (
    <section
      id="keunggulan"
      className="py-20 md:py-28 relative"
      style={{ backgroundColor: featSec?.bgColor || "#FFF3E6" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: settings.primaryColor }}
          >
            Nilai Keutamaan
          </span>
          <h2
            className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#251A18] mt-2 tracking-tight"
            style={{ fontFamily: settings.headingFont }}
          >
            {featSec?.title || `Kenapa ${settings.brandName}?`}
          </h2>
          <p className="text-sm sm:text-base text-[#756761] mt-3">
            Komitmen kami menghadirkan pengalaman menikmati dimsum yang berkesan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#8B0A18]/10 flex flex-col items-start text-left group hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  style={{ color: settings.primaryColor }}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <h3
                  className="font-bold text-lg mb-2 leading-snug"
                  style={{
                    color: settings.primaryColor,
                    fontFamily: settings.headingFont,
                  }}
                >
                  {item.title}
                </h3>

                <p className="text-sm text-[#756761] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
