import React from "react";
import { useCMS } from "../../context/CMSContext.tsx";
import { Palette, RotateCcw, Sparkles } from "lucide-react";

export const ColorThemeTab: React.FC = () => {
  const { draftData, updateDraftSettings } = useCMS();

  const handleColorChange = (key: string, value: string) => {
    updateDraftSettings({ [key]: value });
  };

  const applyPreset = (preset: {
    primaryColor: string;
    primaryDarkColor: string;
    secondaryColor: string;
    backgroundColor: string;
    darkTextColor: string;
    mutedTextColor: string;
  }) => {
    updateDraftSettings(preset);
  };

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#8B0A18]" />
            <span>Pengaturan Warna & Palet Identitas Brand</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Ubah warna utama, aksen gold, warna latar cream, dan teks pada seluruh website.
          </p>
        </div>
      </div>

      {/* Preset Theme Selection */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Preset Palet Brand
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() =>
              applyPreset({
                primaryColor: "#8B0A18",
                primaryDarkColor: "#58050E",
                secondaryColor: "#F2B233",
                backgroundColor: "#FFF8F0",
                darkTextColor: "#251A18",
                mutedTextColor: "#756761",
              })
            }
            className="p-3 rounded-xl border border-gray-200 hover:border-[#8B0A18] text-left transition-all cursor-pointer bg-[#FFF8F0]"
          >
            <span className="font-bold text-xs text-[#8B0A18] block">Dimsum Cemeal Asli</span>
            <div className="flex gap-1.5 mt-2">
              <span className="w-4 h-4 rounded-full bg-[#8B0A18]" />
              <span className="w-4 h-4 rounded-full bg-[#F2B233]" />
              <span className="w-4 h-4 rounded-full bg-[#FFF8F0] border" />
              <span className="w-4 h-4 rounded-full bg-[#251A18]" />
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset({
                primaryColor: "#9A0F1E",
                primaryDarkColor: "#610710",
                secondaryColor: "#E0A020",
                backgroundColor: "#FAFAFA",
                darkTextColor: "#18181B",
                mutedTextColor: "#71717A",
              })
            }
            className="p-3 rounded-xl border border-gray-200 hover:border-[#8B0A18] text-left transition-all cursor-pointer bg-[#FAFAFA]"
          >
            <span className="font-bold text-xs text-[#9A0F1E] block">Modern Imperial Red</span>
            <div className="flex gap-1.5 mt-2">
              <span className="w-4 h-4 rounded-full bg-[#9A0F1E]" />
              <span className="w-4 h-4 rounded-full bg-[#E0A020]" />
              <span className="w-4 h-4 rounded-full bg-[#FAFAFA] border" />
              <span className="w-4 h-4 rounded-full bg-[#18181B]" />
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              applyPreset({
                primaryColor: "#7A0814",
                primaryDarkColor: "#45030A",
                secondaryColor: "#D49526",
                backgroundColor: "#FFFBF5",
                darkTextColor: "#1C1412",
                mutedTextColor: "#6E5E58",
              })
            }
            className="p-3 rounded-xl border border-gray-200 hover:border-[#8B0A18] text-left transition-all cursor-pointer bg-[#FFFBF5]"
          >
            <span className="font-bold text-xs text-[#7A0814] block">Deep Heritage Crimson</span>
            <div className="flex gap-1.5 mt-2">
              <span className="w-4 h-4 rounded-full bg-[#7A0814]" />
              <span className="w-4 h-4 rounded-full bg-[#D49526]" />
              <span className="w-4 h-4 rounded-full bg-[#FFFBF5] border" />
              <span className="w-4 h-4 rounded-full bg-[#1C1412]" />
            </div>
          </button>
        </div>
      </div>

      {/* Individual Color Controls */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-base text-gray-900">
          Kustomisasi Warna Individu
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Warna Utama Maroon (Primary)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draftData.settings.primaryColor}
                onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={draftData.settings.primaryColor}
                onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Warna Maroon Gelap (Footer & Banner)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draftData.settings.primaryDarkColor}
                onChange={(e) => handleColorChange("primaryDarkColor", e.target.value)}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={draftData.settings.primaryDarkColor}
                onChange={(e) => handleColorChange("primaryDarkColor", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Warna Aksen Gold (Secondary)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draftData.settings.secondaryColor}
                onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={draftData.settings.secondaryColor}
                onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Warna Latar Cream (Background)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draftData.settings.backgroundColor}
                onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={draftData.settings.backgroundColor}
                onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Warna Teks Utama (Dark Text)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draftData.settings.darkTextColor}
                onChange={(e) => handleColorChange("darkTextColor", e.target.value)}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={draftData.settings.darkTextColor}
                onChange={(e) => handleColorChange("darkTextColor", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Warna Teks Muted (Sub-copy)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draftData.settings.mutedTextColor}
                onChange={(e) => handleColorChange("mutedTextColor", e.target.value)}
                className="w-10 h-10 rounded-xl border-0 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={draftData.settings.mutedTextColor}
                onChange={(e) => handleColorChange("mutedTextColor", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
