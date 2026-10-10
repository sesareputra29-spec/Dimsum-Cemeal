import React from "react";
import { useCMS } from "../../context/CMSContext.tsx";
import { Store, MapPin, Clock, ExternalLink } from "lucide-react";

export const OutletSettingsTab: React.FC = () => {
  const { draftData, updateOutletSettings } = useCMS();

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-[#8B0A18]" />
            <span>Pengaturan Informasi Outlet & Google Maps</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Perbarui nama outlet, alamat lengkap, patokan lokasi, jam operasional, dan tautan peta.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nama Outlet
          </label>
          <input
            type="text"
            value={draftData.outlet.name}
            onChange={(e) => updateOutletSettings({ name: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Alamat Lengkap
          </label>
          <input
            type="text"
            value={draftData.outlet.address}
            onChange={(e) => updateOutletSettings({ address: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Catatan Patokan
          </label>
          <input
            type="text"
            value={draftData.outlet.note}
            onChange={(e) => updateOutletSettings({ note: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Jam Operasional
            </label>
            <input
              type="text"
              value={draftData.outlet.operatingHours}
              onChange={(e) => updateOutletSettings({ operatingHours: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Kota & Provinsi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={draftData.outlet.city}
                onChange={(e) => updateOutletSettings({ city: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
                placeholder="Serang"
              />
              <input
                type="text"
                value={draftData.outlet.province}
                onChange={(e) => updateOutletSettings({ province: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
                placeholder="Banten"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Tautan Google Maps Resmi
          </label>
          <input
            type="url"
            value={draftData.outlet.mapsUrl}
            onChange={(e) => updateOutletSettings({ mapsUrl: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Tautan Google Maps Embed (Iframe URL)
          </label>
          <input
            type="url"
            value={draftData.outlet.mapsEmbedUrl}
            onChange={(e) => updateOutletSettings({ mapsEmbedUrl: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
};
