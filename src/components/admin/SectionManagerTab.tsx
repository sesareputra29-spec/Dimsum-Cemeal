import React from "react";
import { useCMS } from "../../context/CMSContext.tsx";
import { Layers, ArrowUp, ArrowDown, Eye, EyeOff, Monitor, Smartphone } from "lucide-react";
import { SectionSetting } from "../../types/cms.ts";

export const SectionManagerTab: React.FC = () => {
  const { draftData, updateDraftSection, reorderSections } = useCMS();

  const sortedSections = [...draftData.sections].sort((a, b) => a.order - b.order);

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const items = [...sortedSections];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    reorderSections(items);
  };

  const moveDown = (index: number) => {
    if (index >= sortedSections.length - 1) return;
    const items = [...sortedSections];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    reorderSections(items);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#8B0A18]" />
            <span>Manajemen Section & Urutan Halaman</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Ubah urutan tampil section, atur visibilitas pada desktop/mobile, dan kustomisasi latar.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedSections.map((sec, index) => (
          <div
            key={sec.id}
            className={`p-5 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
              sec.visible
                ? "bg-white border-gray-200 shadow-xs"
                : "bg-gray-50 border-gray-200 opacity-60"
            }`}
          >
            {/* Left: Name & Order Badge */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#8B0A18]/10 text-[#8B0A18] font-bold text-xs flex items-center justify-center shrink-0">
                {index + 1}
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{sec.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">ID Anchor: #{sec.id}</p>
              </div>
            </div>

            {/* Middle: Controls for Visibility */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Monitor className="w-3.5 h-3.5 text-gray-500" />
                <span>Desktop:</span>
                <input
                  type="checkbox"
                  checked={sec.desktopVisible}
                  onChange={(e) =>
                    updateDraftSection(sec.id, { desktopVisible: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#8B0A18]"
                />
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <Smartphone className="w-3.5 h-3.5 text-gray-500" />
                <span>Mobile:</span>
                <input
                  type="checkbox"
                  checked={sec.mobileVisible}
                  onChange={(e) =>
                    updateDraftSection(sec.id, { mobileVisible: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#8B0A18]"
                />
              </label>

              <button
                type="button"
                onClick={() => updateDraftSection(sec.id, { visible: !sec.visible })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  sec.visible
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{sec.visible ? "Tampil" : "Disembunyikan"}</span>
              </button>
            </div>

            {/* Right: Reorder Up / Down Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                title="Pindah ke Atas"
              >
                <ArrowUp className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === sortedSections.length - 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                title="Pindah ke Bawah"
              >
                <ArrowDown className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
