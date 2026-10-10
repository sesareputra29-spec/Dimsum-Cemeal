import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { isSupabaseConfigured } from "../../services/supabase.ts";
import { Lock, Mail, Key, AlertCircle, ShieldAlert, Terminal } from "lucide-react";

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const { login } = useAuth();
  const isConfigured = isSupabaseConfigured();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setErrorMsg(
        "Koneksi Supabase belum dikonfigurasi. Harap tentukan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di environment variables Vercel atau server."
      );
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMsg(res.error || "Gagal login. Periksa email dan kata sandi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#380308] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#8B0A18] rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F2B233]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-[#F2B233]/30 relative z-10 text-left">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#8B0A18] text-[#F2B233] flex items-center justify-center font-heading font-bold text-2xl mx-auto mb-3 shadow-md border border-[#F2B233]/40">
            DC
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-[#251A18]">
            Super Admin CMS
          </h1>
          <p className="text-xs text-[#756761] mt-1">
            Dasbor Otentikasi Resmi Dimsum Cemeal
          </p>
        </div>

        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Konfigurasi Supabase Auth Belum Terdeteksi</span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-800">
              Sistem autentikasi CMS membutuhkan variabel lingkungan <code className="bg-amber-200/60 px-1 py-0.5 rounded text-amber-950 font-mono">VITE_SUPABASE_URL</code> dan <code className="bg-amber-200/60 px-1 py-0.5 rounded text-amber-950 font-mono">VITE_SUPABASE_ANON_KEY</code>.
            </p>
            <div className="pt-2 border-t border-amber-200 flex items-center gap-1.5 text-[10px] text-amber-800 font-mono">
              <Terminal className="w-3.5 h-3.5" />
              <span>Tambahkan env vars di Vercel atau .env</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Super Admin
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isConfigured || loading}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0A18] focus:bg-white outline-hidden disabled:opacity-60"
                placeholder="nama@dimsumcemeal.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!isConfigured || loading}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0A18] focus:bg-white outline-hidden disabled:opacity-60"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isConfigured || loading}
            className="w-full py-3 px-4 bg-[#8B0A18] hover:bg-[#720712] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="w-4 h-4 text-[#F2B233]" />
            <span>{loading ? "Memverifikasi..." : "Masuk dengan Supabase Auth"}</span>
          </button>
        </form>

        {/* Back to Public Site */}
        <div className="mt-8 text-center pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs text-[#756761] hover:text-[#8B0A18] font-medium cursor-pointer"
          >
            ← Kembali ke Website Publik Dimsum Cemeal
          </button>
        </div>
      </div>
    </div>
  );
};
