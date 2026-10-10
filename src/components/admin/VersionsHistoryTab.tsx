import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext.tsx";
import { CMSService } from "../../services/cmsService.ts";
import { History, RotateCcw, Clock, ShieldCheck, FileCheck } from "lucide-react";
import { PublishedVersionRecord, ChangeLogItem } from "../../types/cms.ts";

export const VersionsHistoryTab: React.FC = () => {
  const { restoreVersion, publishedData } = useCMS();
  const versions = CMSService.getVersionRecords();
  const logs = CMSService.getChangeLogs();
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const handleRestore = async (v: PublishedVersionRecord) => {
    if (window.confirm(`Apakah Anda yakin ingin memulihkan Versi ${v.versionNumber}?`)) {
      setRestoringId(v.id);
      const res = await restoreVersion(v.data);
      setRestoringId(null);
      if (res.success) {
        alert(`Berhasil memulihkan ke Versi ${v.versionNumber}`);
      } else {
        alert(`Gagal memulihkan versi: ${res.error || "Terjadi kesalahan"}`);
      }
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-[#8B0A18]" />
            <span>Riwayat Versi Publikasi & Audit Log</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Lihat versi publikasi sebelumnya, pulihkan data lama, dan pantau log aktivitas perubahan.
          </p>
        </div>
      </div>

      {/* Published Versions List */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#8B0A18]" />
          <span>Versi Publikasi Terimpan</span>
        </h3>

        <div className="space-y-3">
          {versions.map((v) => {
            const isCurrent = publishedData.version === v.versionNumber;
            return (
              <div
                key={v.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                  isCurrent
                    ? "bg-[#FFF8F0] border-[#8B0A18]/30 shadow-xs"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#8B0A18]">
                      Versi {v.versionNumber}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-[#58050E] bg-[#F2B233] px-2 py-0.5 rounded uppercase">
                        Sedang Aktif di Website
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Dipublikasikan pada: {new Date(v.publishedAt).toLocaleString("id-ID")} oleh{" "}
                    <strong className="text-gray-700">{v.publishedBy}</strong>
                  </p>
                </div>

                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRestore(v)}
                    disabled={restoringId === v.id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg border border-gray-300 transition-colors cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#8B0A18]" />
                    <span>Pulihkan Versi Ini</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Change Logs */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#8B0A18]" />
          <span>Aktivitas Perubahan Terakhir (Audit Log)</span>
        </h3>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-[#8B0A18] uppercase tracking-wider text-[10px] mr-2">
                  [{log.action}]
                </span>
                <span className="text-gray-800 font-medium">{log.details}</span>
              </div>
              <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                {new Date(log.timestamp).toLocaleTimeString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
