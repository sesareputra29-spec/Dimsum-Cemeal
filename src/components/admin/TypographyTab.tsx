import React from "react";
import { useCMS } from "../../context/CMSContext.tsx";
import { Type } from "lucide-react";

export const TypographyTab: React.FC = () => {
  const { draftData, updateDraftSettings } = useCMS();

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
            <Type className="w-5 h-5 text-[#8B0A18]" />
            <span>Pengaturan Tipografi Global & Font</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Pilih font heading dan body prose yang digunakan di seluruh komponen website.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Font Heading & Judul
          </label>
          <select
            value={draftData.settings.headingFont}
            onChange={(e) => updateDraftSettings({ headingFont: e.target.value })}
            className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl"
          >
            <option value="Playfair Display">Playfair Display (Serif Elegan Classic)</option>
            <option value="Cinzel">Cinzel (Serif Imperial Lux)</option>
            <option value="Cormorant Garamond">Cormorant Garamond (Editorial Serif)</option>
            <option value="Poppins">Poppins (Sans-Serif Clean Modern)</option>
            <option value="Plus Jakarta Sans">Plus Jakarta Sans (Geometric Sans)</option>
            <option value="Oswald">Oswald (Condensed Bold)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Font Teks Isi (Body Prose)
          </label>
          <select
            value={draftData.settings.bodyFont}
            onChange={(e) => updateDraftSettings({ bodyFont: e.target.value })}
            className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl"
          >
            <option value="Poppins">Poppins (Sangat Jelas & Responsif)</option>
            <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
            <option value="DM Sans">DM Sans</option>
            <option value="Manrope">Manrope</option>
            <option value="Public Sans">Public Sans</option>
          </select>
        </div>

        {/* Live Font Sample */}
        <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#8B0A18]/15 space-y-2">
          <span className="text-[10px] font-bold text-[#8B0A18] uppercase tracking-wider block">
            Pratinjau Kombinasi Font
          </span>
          <h3
            className="text-2xl font-bold text-[#251A18]"
            style={{ fontFamily: draftData.settings.headingFont }}
          >
            Cemeal-in Mood Kamu Hari Ini! (Judul)
          </h3>
          <p
            className="text-xs text-[#756761] leading-relaxed"
            style={{ fontFamily: draftData.settings.bodyFont }}
          >
            Nikmati kelezatan dimsum dengan pilihan rasa yang menggugah selera. Teman sempurna untuk menemani waktu santai, berkumpul, dan berbagi kebahagiaan. (Teks Isi Body)
          </p>
        </div>
      </div>
    </div>
  );
};
