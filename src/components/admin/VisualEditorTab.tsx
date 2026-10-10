import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext.tsx";
import { RichTextEditor } from "./RichTextEditor.tsx";
import {
  Layers,
  Edit3,
  Undo2,
  Redo2,
  Save,
  Globe,
  Eye,
  Type,
  Palette,
  Image as ImageIcon,
  Sliders,
  CheckCircle2,
  Smartphone,
  Monitor,
} from "lucide-react";

export const VisualEditorTab: React.FC = () => {
  const {
    draftData,
    updateDraftSettings,
    updateDraftSection,
    updateContentElement,
    updateFormattedText,
    saveDraft,
    publishDraft,
    undo,
    redo,
    canUndo,
    canRedo,
    hasUnsavedChanges,
  } = useCMS();

  const [activeSectionId, setActiveSectionId] = useState<string>("hero");
  const [activeElementKey, setActiveElementKey] = useState<string>("hero_headline");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const activeElement = draftData.contentElements[activeElementKey] || {
    id: activeElementKey,
    sectionId: activeSectionId,
    key: activeElementKey,
    label: "Headline " + activeSectionId,
    type: "rich-text",
    textValue: draftData.sections.find((s) => s.id === activeSectionId)?.title || "",
  };

  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    setSaveSuccessMsg("");
    setErrorMessage("");
    const res = await saveDraft();
    if (res.success) {
      setSaveSuccessMsg("Draft berhasil disimpan!");
      setTimeout(() => setSaveSuccessMsg(""), 3000);
    } else {
      setErrorMessage(res.error || "Gagal menyimpan draft.");
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setSaveSuccessMsg("");
    setErrorMessage("");
    const res = await publishDraft();
    setIsPublishing(false);
    if (res.success) {
      setSaveSuccessMsg("Website berhasil dipublikasikan ke publik!");
      setTimeout(() => setSaveSuccessMsg(""), 4000);
    } else {
      setErrorMessage(res.error || "Gagal mempublikasikan website.");
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Editor Top Control Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#8B0A18]/10 text-[#8B0A18]">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-gray-900 leading-tight">
              Visual Editor Website Live
            </h2>
            <p className="text-xs text-gray-500">
              Ubah elemen visual, teks per kata, warna, dan gambar dengan preview langsung
            </p>
          </div>
        </div>

        {/* Action Button Group */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl mr-2">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                previewDevice === "desktop" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                previewDevice === "mobile" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-4 h-4 text-gray-700" />
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-4 h-4 text-gray-700" />
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#F2B233]" />
            <span>Simpan Draft</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#8B0A18] hover:bg-[#720712] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-[#F2B233]" />
            <span>{isPublishing ? "Mempublikasikan..." : "Publikasikan ke Website"}</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3-Panel Visual Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Section & Element Navigation Tree */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#8B0A18]" />
              <span>Struktur Section</span>
            </h3>
            <span className="text-[10px] text-gray-400 font-medium">Pilih untuk edit</span>
          </div>

          <div className="space-y-1">
            {draftData.sections.map((sec) => {
              const isActive = sec.id === activeSectionId;
              return (
                <div key={sec.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      setActiveElementKey(`${sec.id}_headline`);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-[#8B0A18] text-white shadow-xs"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{sec.name}</span>
                    <span className="text-[10px] opacity-75">
                      {sec.visible ? "Aktif" : "Sembunyi"}
                    </span>
                  </button>

                  {/* Element sub-items when section is active */}
                  {isActive && (
                    <div className="pl-3 space-y-1 border-l-2 border-[#8B0A18]/20 my-1">
                      <button
                        onClick={() => setActiveElementKey(`${sec.id}_headline`)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                          activeElementKey === `${sec.id}_headline`
                            ? "bg-[#8B0A18]/10 text-[#8B0A18] font-bold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        • Headline & Formatted Text
                      </button>
                      <button
                        onClick={() => setActiveElementKey(`${sec.id}_sub`)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                          activeElementKey === `${sec.id}_sub`
                            ? "bg-[#8B0A18]/10 text-[#8B0A18] font-bold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        • Subtitle / Kicker
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Panel: Interactive Live Preview Container */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            className={`w-full bg-[#FFF8F0] rounded-3xl border-2 border-gray-300 shadow-xl overflow-hidden transition-all duration-300 ${
              previewDevice === "mobile" ? "max-w-[375px]" : "max-w-full"
            }`}
          >
            <div className="bg-gray-800 text-white px-4 py-2 text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="font-mono text-[10px] text-gray-300">
                Live Preview Draft ({previewDevice})
              </span>
              <span className="text-[10px] text-[#F2B233]">Visual Mode</span>
            </div>

            {/* Simulated Live Viewport Area */}
            <div className="p-6 min-h-[480px] space-y-6 text-left bg-gradient-to-b from-[#FFF8F0] to-white">
              <div className="p-4 rounded-2xl bg-white border border-[#8B0A18]/15 shadow-sm">
                <div className="text-[10px] font-bold tracking-widest text-[#8B0A18] uppercase mb-1">
                  Preview Section: {activeSectionId.toUpperCase()}
                </div>

                <div className="mt-2">
                  <h1
                    className="font-heading font-extrabold text-2xl sm:text-3xl text-[#251A18] leading-snug"
                    style={{
                      fontFamily: draftData.settings.headingFont,
                      color: draftData.settings.darkTextColor,
                    }}
                  >
                    {activeElement.richTextValue ? (
                      activeElement.richTextValue.map((p) => (
                        <span
                          key={p.id}
                          style={{
                            color: p.color,
                            fontFamily: p.font,
                            fontSize: p.fontSize,
                            fontWeight: p.fontWeight,
                            fontStyle: p.italic ? "italic" : "normal",
                            textDecoration: p.underline ? "underline" : "none",
                          }}
                        >
                          {p.text}
                        </span>
                      ))
                    ) : (
                      activeElement.textValue || "Headline Teks Section"
                    )}
                  </h1>
                </div>

                <p className="text-xs text-[#756761] mt-3 leading-relaxed">
                  Pratinjau ini diperbarui secara langsung saat Anda mengubah nilai pada panel kanan.
                </p>
              </div>

              {/* Sample Product Showcase Preview inside Visual Editor */}
              {activeSectionId === "menu" && (
                <div className="grid grid-cols-2 gap-3">
                  {draftData.products.slice(0, 2).map((p) => (
                    <div key={p.id} className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
                      <p className="font-bold text-[#8B0A18]">{p.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Property Inspector & Rich Formatting Controls */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#8B0A18]" />
              <span>Inspector Properti</span>
            </h3>
          </div>

          {/* Section Visibility Toggle */}
          <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-200">
            <span className="text-xs font-bold text-gray-700 block">Visibilitas Section</span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Tampilkan Section Ini</span>
              <input
                type="checkbox"
                checked={draftData.sections.find((s) => s.id === activeSectionId)?.visible ?? true}
                onChange={(e) =>
                  updateDraftSection(activeSectionId, { visible: e.target.checked })
                }
                className="w-4 h-4 accent-[#8B0A18] cursor-pointer"
              />
            </div>
          </div>

          {/* Word-by-Word Rich Text Formatting Control */}
          <RichTextEditor
            label="Format Kata & Teks Headline"
            parts={
              activeElement.richTextValue || [
                {
                  id: "part_1",
                  text: activeElement.textValue || "Teks Headline Utama",
                  color: "#251A18",
                  font: draftData.settings.headingFont,
                  fontWeight: "800",
                },
              ]
            }
            onChange={(newParts) => updateFormattedText(activeElementKey, newParts)}
          />

          {/* Section Background Color Override */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 block">
              Warna Latar Section (Background)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  draftData.sections.find((s) => s.id === activeSectionId)?.bgColor || "#FFF8F0"
                }
                onChange={(e) =>
                  updateDraftSection(activeSectionId, { bgColor: e.target.value })
                }
                className="w-8 h-8 rounded border-0 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={
                  draftData.sections.find((s) => s.id === activeSectionId)?.bgColor || "#FFF8F0"
                }
                onChange={(e) =>
                  updateDraftSection(activeSectionId, { bgColor: e.target.value })
                }
                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
