import React, { useState } from "react";
import { FormattedPart } from "../../types/cms.ts";
import { Plus, Trash2, Bold, Italic, Underline, Type, Palette } from "lucide-react";

interface RichTextEditorProps {
  label: string;
  parts: FormattedPart[];
  onChange: (newParts: FormattedPart[]) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  parts,
  onChange,
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string>(parts[0]?.id || "");

  const handleTextChange = (id: string, newText: string) => {
    const updated = parts.map((p) => (p.id === id ? { ...p, text: newText } : p));
    onChange(updated);
  };

  const handleStyleChange = (id: string, styleProperty: keyof FormattedPart, value: any) => {
    const updated = parts.map((p) => (p.id === id ? { ...p, [styleProperty]: value } : p));
    onChange(updated);
  };

  const addSegment = () => {
    const newPart: FormattedPart = {
      id: "part_" + Date.now(),
      text: " Teks Baru",
      color: "#8B0A18",
      font: "Playfair Display",
      fontWeight: "700",
    };
    const updated = [...parts, newPart];
    onChange(updated);
    setSelectedPartId(newPart.id);
  };

  const removeSegment = (id: string) => {
    if (parts.length <= 1) return;
    const updated = parts.filter((p) => p.id !== id);
    onChange(updated);
    if (selectedPartId === id) {
      setSelectedPartId(updated[0]?.id || "");
    }
  };

  const activePart = parts.find((p) => p.id === selectedPartId) || parts[0];

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-xs text-gray-700 uppercase tracking-wider">
          {label} (Editor Kata & Format)
        </label>
        <button
          type="button"
          onClick={addSegment}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B0A18] hover:bg-[#8B0A18]/10 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Bagian Teks</span>
        </button>
      </div>

      {/* Live Preview Box */}
      <div className="p-4 rounded-lg bg-[#FFF8F0] border border-[#8B0A18]/10 min-h-[60px] flex items-center flex-wrap">
        {parts.map((p) => {
          const isSelected = p.id === activePart?.id;
          return (
            <span
              key={p.id}
              onClick={() => setSelectedPartId(p.id)}
              className={`cursor-pointer px-1 py-0.5 rounded transition-all ${
                isSelected ? "ring-2 ring-[#8B0A18] bg-yellow-100" : "hover:bg-black/5"
              }`}
              style={{
                color: p.color || "#251A18",
                fontFamily: p.font || "inherit",
                fontSize: p.fontSize || "inherit",
                fontWeight: p.fontWeight || "normal",
                fontStyle: p.italic ? "italic" : "normal",
                textDecoration: p.underline ? "underline" : "none",
              }}
            >
              {p.text}
            </span>
          );
        })}
      </div>

      {/* Segment Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {parts.map((p, index) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedPartId(p.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
              p.id === activePart?.id
                ? "bg-[#8B0A18] text-white font-semibold"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Bagian {index + 1}: "{p.text.trim().substring(0, 10)}..."
          </button>
        ))}
      </div>

      {/* Active Segment Controls */}
      {activePart && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">
              Pengaturan Bagian Teks Ini
            </span>
            {parts.length > 1 && (
              <button
                type="button"
                onClick={() => removeSegment(activePart.id)}
                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            )}
          </div>

          <div>
            <label className="text-[11px] font-medium text-gray-600 block mb-1">
              Isi Teks
            </label>
            <input
              type="text"
              value={activePart.text}
              onChange={(e) => handleTextChange(activePart.id, e.target.value)}
              className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8B0A18] outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Color */}
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Warna</label>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={activePart.color || "#8B0A18"}
                  onChange={(e) => handleStyleChange(activePart.id, "color", e.target.value)}
                  className="w-7 h-7 p-0 border-0 rounded cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={activePart.color || "#8B0A18"}
                  onChange={(e) => handleStyleChange(activePart.id, "color", e.target.value)}
                  className="w-full px-1.5 py-1 text-[11px] bg-white border border-gray-300 rounded"
                />
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Font</label>
              <select
                value={activePart.font || "Playfair Display"}
                onChange={(e) => handleStyleChange(activePart.id, "font", e.target.value)}
                className="w-full px-1.5 py-1 text-[11px] bg-white border border-gray-300 rounded"
              >
                <option value="Playfair Display">Playfair Display</option>
                <option value="Poppins">Poppins</option>
                <option value="Cinzel">Cinzel</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="Oswald">Oswald</option>
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Ketebalan</label>
              <select
                value={activePart.fontWeight || "700"}
                onChange={(e) => handleStyleChange(activePart.id, "fontWeight", e.target.value)}
                className="w-full px-1.5 py-1 text-[11px] bg-white border border-gray-300 rounded"
              >
                <option value="400">Regular (400)</option>
                <option value="600">SemiBold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">ExtraBold (800)</option>
              </select>
            </div>

            {/* Toggles */}
            <div>
              <label className="text-[10px] text-gray-500 block mb-0.5">Gaya</label>
              <div className="flex items-center gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleStyleChange(activePart.id, "italic", !activePart.italic)}
                  className={`p-1.5 rounded border cursor-pointer ${
                    activePart.italic ? "bg-[#8B0A18] text-white" : "bg-white text-gray-700"
                  }`}
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStyleChange(activePart.id, "underline", !activePart.underline)}
                  className={`p-1.5 rounded border cursor-pointer ${
                    activePart.underline ? "bg-[#8B0A18] text-white" : "bg-white text-gray-700"
                  }`}
                  title="Underline"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
