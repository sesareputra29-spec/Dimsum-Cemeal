import React, { useState } from "react";
import { isSupabaseConfigured, supabase } from "../../services/supabase.ts";
import { Database, ShieldCheck, Key, Copy, Check, Terminal, CheckCircle2, AlertTriangle } from "lucide-react";

export const SupabaseSetupTab: React.FC = () => {
  const isConnected = isSupabaseConfigured();
  const [copiedSql, setCopiedSql] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  const sqlSchema = `-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'editor', 'viewer')),
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  data JSONB NOT NULL,
  draft_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.published_versions (
  id TEXT PRIMARY KEY,
  version_number INT NOT NULL,
  data JSONB NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  published_by TEXT,
  is_active BOOLEAN DEFAULT false
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const testDb = async () => {
    setTestingConnection(true);
    setDbStatus(null);
    try {
      const { error } = await supabase.from("site_settings").select("id").limit(1);
      if (error) {
        setDbStatus(`Status: Koneksi Gagal (${error.message}). Jalankan SQL migration di Supabase.`);
      } else {
        setDbStatus("Status: SUKSES! Database PostgreSQL & tabel CMS terhubung dengan sempurna.");
      }
    } catch (e: any) {
      setDbStatus(`Status Exception: ${e.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#8B0A18]" />
            <span>Dokumentasi Setup Supabase & Backend Database</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Panduan menghubungkan database PostgreSQL Supabase dan pembuatan akun Super Admin pertama.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isConnected
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}
          >
            {isConnected ? "Env Variable Terdeteksi" : "Mode Standalone Local"}
          </span>
        </div>
      </div>

      {/* Test Connection Button */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-gray-900">
            Uji Koneksi Database Supabase
          </h3>
          <button
            type="button"
            onClick={testDb}
            disabled={testingConnection}
            className="px-4 py-2 bg-[#8B0A18] hover:bg-[#720712] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            {testingConnection ? "Menguji..." : "Uji Koneksi Sekarang"}
          </button>
        </div>

        {dbStatus && (
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-800">
            {dbStatus}
          </div>
        )}
      </div>

      {/* Step by Step Setup Instructions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-6">
        <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#8B0A18]" />
          <span>Langkah Setup Backend Supabase</span>
        </h3>

        <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <h4 className="font-bold text-sm text-gray-900">1. Konfigurasi Environment Variables</h4>
            <p>
              Tambahkan dua variabel lingkungan berikut pada file <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800">.env</code> di server / Vercel:
            </p>
            <pre className="p-3 rounded-lg bg-gray-900 text-green-400 font-mono text-[11px] overflow-x-auto mt-2">
              VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"{"\n"}
              VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-gray-900">2. DDL SQL Migration Schema</h4>
              <button
                type="button"
                onClick={handleCopySql}
                className="text-[11px] font-semibold text-[#8B0A18] flex items-center gap-1 cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? "Tersalin!" : "Salin SQL Schema"}</span>
              </button>
            </div>
            <p>
              Salin skrip SQL yang tersedia pada folder <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800">supabase/migrations/001_cms_schema.sql</code> dan jalankan pada **Supabase SQL Editor**.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <h4 className="font-bold text-sm text-gray-900">3. Pembuatan Super Admin Pertama</h4>
            <p>
              Buka menu **Supabase Dashboard → Authentication → Users**, klik **Add User** dengan email <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800">admin@dimsumcemeal.com</code>.
            </p>
            <p>
              Kemudian di SQL Editor jalankan perintah berikut untuk mengonfirmasi role Super Admin:
            </p>
            <pre className="p-3 rounded-lg bg-gray-900 text-green-400 font-mono text-[11px] overflow-x-auto mt-2">
              INSERT INTO public.profiles (id, email, role, full_name){"\n"}
              VALUES ('USER_UUID_FROM_AUTH', 'admin@dimsumcemeal.com', 'super_admin', 'Super Admin'){"\n"}
              ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
