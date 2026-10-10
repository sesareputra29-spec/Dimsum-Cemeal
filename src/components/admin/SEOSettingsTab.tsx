import React from "react";
import { useCMS } from "../../context/CMSContext.tsx";
import { Globe, Search, Share2 } from "lucide-react";

export const SEOSettingsTab: React.FC = () => {
  const { draftData, updateSEOSettings } = useCMS();

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#8B0A18]" />
            <span>Pengaturan SEO & Metadata Pencarian</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Atur judul pencarian Google, deskripsi meta, kata kunci, dan gambar pratinjau sosial.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Judul Halaman Google (&lt;title&gt;)
          </label>
          <input
            type="text"
            value={draftData.seo.title}
            onChange={(e) => updateSEOSettings({ title: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Deskripsi Meta (&lt;meta name="description"&gt;)
          </label>
          <textarea
            rows={3}
            value={draftData.seo.description}
            onChange={(e) => updateSEOSettings({ description: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Kata Kunci (Keywords)
          </label>
          <input
            type="text"
            value={draftData.seo.keywords}
            onChange={(e) => updateSEOSettings({ keywords: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Gambar Pratinjau Open Graph (og:image)
          </label>
          <input
            type="text"
            value={draftData.seo.ogImage}
            onChange={(e) => updateSEOSettings({ ogImage: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs"
          />
        </div>

        {/* Google Snippet Live Preview */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            Pratinjau Hasil Pencarian Google
          </span>
          <p className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer">
            {draftData.seo.title}
          </p>
          <p className="text-xs text-emerald-700">https://dimsumcemeal.com</p>
          <p className="text-xs text-gray-600 line-clamp-2">{draftData.seo.description}</p>
        </div>
      </div>
    </div>
  );
};
