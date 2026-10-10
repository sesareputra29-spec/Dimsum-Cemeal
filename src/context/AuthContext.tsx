import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../services/supabase.ts";

export interface UserProfile {
  id: string;
  email: string;
  role: "super_admin" | "editor" | "viewer";
  fullName?: string;
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
   * If profile is not found or DB query fails, access is DENIED.
   */
  const fetchProfile = async (userId: string, userEmail: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, full_name")
        .eq("id", userId)
        .single();

      if (error || !data) {
        console.warn("Profil tidak ditemukan atau database error. Akses administratif ditolak:", error?.message);
        setProfile(null);
        return null;
      }

      if (data.role !== "super_admin") {
        console.warn(`User ${userEmail} memiliki role '${data.role}', bukan 'super_admin'. Akses ditolak.`);
        setProfile(null);
        return null;
      }

      const verifiedProfile: UserProfile = {
        id: data.id,
        email: data.email || userEmail,
        role: data.role as "super_admin",
        fullName: data.full_name || "Super Admin",
      };

      setProfile(verifiedProfile);
      return verifiedProfile;
    } catch (err) {
      console.error("Kesalahan sistem saat pengambilan profil:", err);
      setProfile(null);
      return null;
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
      const verifiedProfile = await fetchProfile(data.user.id, data.user.email ?? "");
      if (!verifiedProfile || verifiedProfile.role !== "super_admin") {
        await supabase.auth.signOut();
        setProfile(null);
        setUser(null);
        setSession(null);
        return {
          success: false,
          error: "Akses ditolak: Akun Anda terautentikasi tetapi tidak memiliki role 'super_admin' di database.",
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
