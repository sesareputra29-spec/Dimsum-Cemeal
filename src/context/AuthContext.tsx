import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../services/supabase.ts";

export interface UserProfile {
  id: string;
  email: string;
  role: "super_admin" | "editor" | "viewer";
  fullName?: string;
}

export interface FetchProfileResult {
  success: boolean;
  profile?: UserProfile;
  errorType?: "PROFILE_NOT_FOUND" | "DATABASE_ACCESS_DENIED" | "ROLE_NOT_SUPER_ADMIN" | "UNKNOWN_ERROR";
  errorMessage?: string;
  roleFound?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isSuperAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      return;
    }

    // Initialize Supabase Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email ?? "");
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email ?? "");
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Fetch User Profile from Supabase with DENY BY DEFAULT policy.
   * Distinguishes profile missing, DB access denied (RLS), and invalid role errors.
   */
  const fetchProfile = async (
    userId: string,
    userEmail: string
  ): Promise<FetchProfileResult> => {
    const cleanEmail = userEmail.trim().toLowerCase();

    try {
      // Step 1: Query by user UUID in public.profiles
      let { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, full_name")
        .eq("id", userId)
        .maybeSingle();

      // Step 2: Fallback query by verified email if not found by UUID
      if (!data && !error && cleanEmail) {
        const emailQuery = await supabase
          .from("profiles")
          .select("id, email, role, full_name")
          .ilike("email", cleanEmail)
          .maybeSingle();

        data = emailQuery.data;
        error = emailQuery.error;

        // If found by email, sync the profile's ID with the Auth user ID
        if (data && data.id !== userId) {
          try {
            await supabase
              .from("profiles")
              .update({ id: userId, updated_at: new Date().toISOString() })
              .eq("email", data.email);
          } catch (syncErr) {
            console.warn("Gagal melakukan penyelarasan profile ID:", syncErr);
          }
        }
      }

      // Step 3: Handle Database Access / RLS Permission Errors
      if (error) {
        console.error("Akses database ditolak saat membaca profiles:", error.message);
        setProfile(null);
        return {
          success: false,
          errorType: "DATABASE_ACCESS_DENIED",
          errorMessage: `Akses database ditolak saat membaca profil (${error.message}). Periksa hak akses RLS pada tabel profiles.`,
        };
      }

      // Step 4: Handle Profile Not Found
      if (!data) {
        console.warn(`Profil tidak ditemukan di database untuk email '${userEmail}' (ID: ${userId}).`);
        setProfile(null);
        return {
          success: false,
          errorType: "PROFILE_NOT_FOUND",
          errorMessage: `Profil pengguna dengan email '${userEmail}' tidak terdaftar di tabel database public.profiles. Silakan daftarkan akun di tabel profiles terlebih dahulu.`,
        };
      }

      // Step 5: Handle Role Check Validation
      if (data.role !== "super_admin") {
        console.warn(`User ${userEmail} memiliki role '${data.role}', bukan 'super_admin'. Akses ditolak.`);
        setProfile(null);
        return {
          success: false,
          errorType: "ROLE_NOT_SUPER_ADMIN",
          roleFound: data.role,
          errorMessage: `Akses ditolak: Akun Anda terautentikasi tetapi memiliki role '${data.role}', bukan 'super_admin' di database.`,
        };
      }

      // Step 6: Success - Profile Verified as Super Admin
      const verifiedProfile: UserProfile = {
        id: data.id || userId,
        email: data.email || userEmail,
        role: "super_admin",
        fullName: data.full_name || "Super Admin",
      };

      setProfile(verifiedProfile);
      return { success: true, profile: verifiedProfile };
    } catch (err: any) {
      console.error("Kesalahan sistem saat verifikasi profil:", err);
      setProfile(null);
      return {
        success: false,
        errorType: "UNKNOWN_ERROR",
        errorMessage: `Terjadi kesalahan sistem saat memverifikasi profil: ${err?.message || "Kesalahan tidak diketahui"}`,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Authenticate Super Admin exclusively through Supabase Auth
   */
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error:
          "Konfigurasi Supabase Authentication belum terhubung. Harap atur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di environment variables Vercel/server.",
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error || !data.user) {
        return {
          success: false,
          error: error?.message || "Email atau kata sandi tidak valid.",
        };
      }

      // Verify user profile role in Database
      const profileResult = await fetchProfile(data.user.id, data.user.email ?? email);
      
      if (!profileResult.success || !profileResult.profile) {
        await supabase.auth.signOut();
        setProfile(null);
        setUser(null);
        setSession(null);
        return {
          success: false,
          error: profileResult.errorMessage || "Gagal memverifikasi profil Super Admin.",
        };
      }

      return { success: true };
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || "Terjadi kesalahan sistem saat proses login.",
      };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("SignOut error:", e);
      }
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  // Strictly check that user is authenticated and verified as super_admin
  const isSuperAdmin = Boolean(user && profile && profile.role === "super_admin");

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isSuperAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
