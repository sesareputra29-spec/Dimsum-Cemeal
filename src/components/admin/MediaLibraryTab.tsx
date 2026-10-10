import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext.tsx";
import { CMSService } from "../../services/cmsService.ts";
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Filter } from "lucide-react";

export const MediaLibraryTab: React.FC = () => {
  const { draftData, addMediaAsset, deleteMediaAsset } = useCMS();
  const [filterCategory, setFilterCategory] = useState<string>("semua");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAssets =
    filterCategory === "semua"
      ? draftData.mediaAssets
      : draftData.mediaAssets.filter((a) => a.category === filterCategory);

  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await CMSService.uploadMediaAsset(file, "general");
      if (res.success && res.asset) {
        addMediaAsset(res.asset);
      } else {
        setUploadError(res.error || "Gagal mengunggah gambar.");
      }
    }
    setUploading(false);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#8B0A18]" />
            <span>Media Library & Aset Gambar ({draftData.mediaAssets.length})</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Unggah dan kelola foto produk asli, hero banner, dan outlet Dimsum Cemeal.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 bg-[#8B0A18] hover:bg-[#720712] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer">
          <Upload className="w-4 h-4 text-[#F2B233]" />
          <span>{uploading ? "Mengunggah..." : "Unggah Gambar Baru"}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["semua", "hero", "product", "gallery", "outlet", "logo"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl capitalize cursor-pointer transition-colors ${
              filterCategory === cat
                ? "bg-[#8B0A18] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs group flex flex-col justify-between"
          >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <img
                src={asset.url}
                alt={asset.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                {asset.category}
              </span>
            </div>

            <div className="p-3">
              <p className="font-bold text-xs text-gray-900 truncate" title={asset.name}>
                {asset.name}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {(asset.size / 1024).toFixed(0)} KB
              </p>

              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(asset.url, asset.id)}
                  className="text-[11px] font-semibold text-[#8B0A18] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => deleteMediaAsset(asset.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
