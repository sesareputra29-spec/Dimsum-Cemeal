import { supabase, isSupabaseConfigured } from "./supabase.ts";
import { defaultCmsData } from "../data/defaultCmsData.ts";
import {
  FullCMSData,
  ChangeLogItem,
  PublishedVersionRecord,
  MediaAsset,
} from "../types/cms.ts";

const DRAFT_STORAGE_KEY = "dimsum_cemeal_cms_draft_v1";
const PUBLISHED_STORAGE_KEY = "dimsum_cemeal_cms_published_v1";
const CHANGE_LOGS_KEY = "dimsum_cemeal_cms_changelogs_v1";
const VERSIONS_KEY = "dimsum_cemeal_cms_versions_v1";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export class CMSService {
  /**
   * Get active published CMS data for public website visitors.
   * Strictly reads published_versions (is_active=true) or site_settings.data.
   * NEVER exposes unpublished draft_data to public visitors.
   */
  static async getPublishedData(): Promise<FullCMSData> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("published_versions")
          .select("data")
          .eq("is_active", true)
          .order("published_at", { ascending: false })
          .limit(1)
          .single();

        if (data && data.data && !error) {
          return data.data as FullCMSData;
        }

        const { data: settingsData, error: settingsError } = await supabase
          .from("site_settings")
          .select("data")
          .eq("id", "main_settings")
          .single();

        if (settingsData && settingsData.data && !settingsError) {
          return settingsData.data as FullCMSData;
        }
      } catch (err) {
        console.warn("Pembacaan data terpublikasi Supabase gagal, menggunakan cache terkonfirmasi:", err);
      }
    }

    try {
      const saved = localStorage.getItem(PUBLISHED_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Error pembacaan localStorage publik:", e);
    }

    return defaultCmsData;
  }

  /**
   * Get active working draft CMS data for Super Admin editor
   */
  static async getDraftData(): Promise<FullCMSData> {
    if (isSupabaseConfigured()) {
      try {
        // Primary: Fetch from secure public.site_drafts table
        const { data: draftRow, error: draftErr } = await supabase
          .from("site_drafts")
          .select("draft_data")
          .eq("id", "main_settings")
          .single();

        if (draftRow && draftRow.draft_data && !draftErr) {
          return draftRow.draft_data as FullCMSData;
        }

        // Fallback: Fetch from site_settings if site_drafts is not yet initialized
        const { data, error } = await supabase
          .from("site_settings")
          .select("data")
          .eq("id", "main_settings")
          .single();

        if (data && data.data && !error) {
          return data.data as FullCMSData;
        }
      } catch (err) {
        console.warn("Pembacaan draft Supabase gagal:", err);
      }
    }

    try {
      const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draft) {
        return JSON.parse(draft);
      }
    } catch (e) {
      console.warn("Error pembacaan draft local:", e);
    }

    return await this.getPublishedData();
  }

  /**
   * Save working draft to database with explicit result validation.
   * NEVER saves draft to site_settings.data and NEVER overwrites published data.
   */
  static async saveDraft(
    cmsData: FullCMSData,
    userEmail: string = "super_admin"
  ): Promise<{ success: boolean; error?: string; isLocalOnly?: boolean }> {
    const updatedData: FullCMSData = {
      ...cmsData,
      lastUpdated: new Date().toISOString(),
      isPublished: false,
    };

    // Update LocalStorage draft cache for editor offline state
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updatedData));
    } catch (e) {
      console.warn("Penyimpanan cache draft lokal gagal:", e);
    }

    if (!isSupabaseConfigured()) {
      return {
        success: true,
        isLocalOnly: true,
        error: "Supabase belum dikonfigurasi. Draft disimpan secara lokal di peramban.",
      };
    }

    try {
      // Upsert EXCLUSIVELY to site_drafts table. DO NOT write to site_settings or overwrite published site data!
      const { error } = await supabase.from("site_drafts").upsert(
        {
          id: "main_settings",
          draft_data: updatedData,
          updated_at: new Date().toISOString(),
          updated_by: userEmail,
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("Gagal menyimpan draft ke database site_drafts:", error.message);
        return {
          success: false,
          error: `Gagal menyimpan draft ke server database: ${error.message}`,
        };
      }
    } catch (err: any) {
      console.error("Kesalahan jaringan saat menyimpan draft:", err);
      return {
        success: false,
        error: `Gagal terhubung ke database: ${err.message || "Network failure"}`,
      };
    }

    this.addChangeLog({
      id: "log_" + Date.now(),
      userEmail,
      action: "SAVE_DRAFT",
      entityType: "FULL_CMS",
      entityId: "draft",
      timestamp: new Date().toISOString(),
      details: "Draft berhasil disimpan oleh " + userEmail,
    });

    return { success: true };
  }

  /**
   * Publish active draft payload to Public Website using Atomic RPC transaction.
   */
  static async publish(
    cmsData: FullCMSData,
    userEmail: string = "super_admin"
  ): Promise<{ success: boolean; error?: string }> {
    if (!cmsData.settings.brandName || !cmsData.sections) {
      return {
        success: false,
        error: "Validasi gagal: Data CMS tidak lengkap atau rusak.",
      };
    }

    const nextVersion = (cmsData.version || 1) + 1;
    let publishedPayload: FullCMSData = {
      ...cmsData,
      lastUpdated: new Date().toISOString(),
      version: nextVersion,
      isPublished: true,
    };

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error:
          "Publikasi server tidak dapat dilakukan karena Supabase belum dikonfigurasi. Harap hubungkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY terlebih dahulu.",
      };
    }

    let serverVerifiedEmail = userEmail;
    let finalVersionNumber = nextVersion;
    let finalPublishedAt = new Date().toISOString();

    try {
      // Execute Atomic RPC publication function on Supabase
      const { data: rpcRes, error: rpcErr } = await supabase.rpc("publish_cms_draft", {
        p_cms_data: publishedPayload,
        p_user_email: userEmail,
      });

      if (rpcErr || !rpcRes) {
        console.error("Gagal mengeksekusi RPC publish_cms_draft:", rpcErr?.message);
        return {
          success: false,
          error: `Gagal mempublikasikan ke Supabase (Publikasi Atomik Gagal): ${rpcErr?.message || "Respons RPC tidak valid"}`,
        };
      }

      if (typeof rpcRes === "object") {
        if (rpcRes.success === false) {
          return {
            success: false,
            error: `Gagal publikasi atomik: ${rpcRes.error || "Gagal di server"}`,
          };
        }
        if (rpcRes.publishedBy) serverVerifiedEmail = rpcRes.publishedBy;
        if (rpcRes.version) finalVersionNumber = rpcRes.version;
        if (rpcRes.publishedAt) finalPublishedAt = rpcRes.publishedAt;
        if (rpcRes.data) publishedPayload = rpcRes.data as FullCMSData;
      }
    } catch (err: any) {
      console.error("Kesalahan jaringan saat publikasi atomik:", err);
      return {
        success: false,
        error: `Publikasi gagal: ${err.message || "Network exception"}`,
      };
    }

    // Synchronize LocalStorage cache for public site ONLY after confirmed successful RPC/save
    try {
      localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(publishedPayload));
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(publishedPayload));
    } catch (e) {
      console.warn("LocalStorage error saat publikasi:", e);
    }

    const versionRecord: PublishedVersionRecord = {
      id: "ver_" + Date.now(),
      versionNumber: finalVersionNumber,
      data: publishedPayload,
      publishedAt: finalPublishedAt,
      publishedBy: serverVerifiedEmail,
      note: `Publikasi Versi ${finalVersionNumber}`,
    };

    this.saveVersionRecord(versionRecord);

    this.addChangeLog({
      id: "log_" + Date.now(),
      userEmail: serverVerifiedEmail,
      action: "PUBLISH",
      entityType: "FULL_CMS",
      entityId: `v${finalVersionNumber}`,
      timestamp: finalPublishedAt,
      details: `Dipublikasikan ke website publik (Versi ${finalVersionNumber})`,
    });

    return { success: true };
  }

  /**
   * Upload image with strict MIME and Size validation
   */
  static async uploadMediaAsset(
    file: File,
    category: 'hero' | 'product' | 'gallery' | 'outlet' | 'logo' | 'general' = 'general'
  ): Promise<{ success: boolean; asset?: MediaAsset; error?: string }> {
    // 1. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return {
        success: false,
        error: `Format berkas '${file.type}' tidak didukung. Harap gunakan JPG, PNG, WebP, GIF, atau SVG.`,
      };
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: `Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas maksimal 5 MB.`,
      };
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "");
    const filename = `${category}_${Date.now()}_${sanitizedName}`;
    let publicUrl = "";

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.storage
          .from("cms-media")
          .upload(filename, file, { cacheControl: "3600", upsert: true });

        if (error) {
          console.error("Gagal mengunggah ke Supabase Storage:", error.message);
          return {
            success: false,
            error: `Unggah gambar gagal: ${error.message}`,
          };
        }

        if (data) {
          const { data: urlData } = supabase.storage
            .from("cms-media")
            .getPublicUrl(filename);
          publicUrl = urlData.publicUrl;
        }
      } catch (err: any) {
        console.error("Kesalahan jaringan saat unggah gambar:", err);
        return {
          success: false,
          error: `Gagal mengunggah gambar: ${err.message || "Network failure"}`,
        };
      }
    }

    // Fallback: Read file as Data URL if Supabase storage is not linked
    if (!publicUrl) {
      publicUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const newAsset: MediaAsset = {
      id: "media_" + Date.now(),
      name: file.name,
      url: publicUrl,
      mimeType: file.type,
      size: file.size,
      altText: file.name.replace(/\.[^/.]+$/, ""),
      category,
      createdAt: new Date().toISOString(),
    };

    return { success: true, asset: newAsset };
  }

  /**
   * Version Records Management
   */
  static getVersionRecords(): PublishedVersionRecord[] {
    try {
      const saved = localStorage.getItem(VERSIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Gagal membaca riwayat versi:", e);
    }
    return [
      {
        id: "ver_default",
        versionNumber: 1,
        data: defaultCmsData,
        publishedAt: defaultCmsData.lastUpdated,
        publishedBy: "sistem",
        note: "Versi Awal Default",
      },
    ];
  }

  private static saveVersionRecord(record: PublishedVersionRecord) {
    const existing = this.getVersionRecords();
    const updated = [record, ...existing].slice(0, 15);
    try {
      localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Gagal menyimpan versi:", e);
    }
  }

  /**
   * Audit Change Logs
   */
  static getChangeLogs(): ChangeLogItem[] {
    try {
      const logs = localStorage.getItem(CHANGE_LOGS_KEY);
      if (logs) return JSON.parse(logs);
    } catch (e) {
      console.warn("Gagal membaca audit log:", e);
    }
    return [
      {
        id: "log_init",
        userEmail: "system",
        action: "INIT",
        entityType: "SYSTEM",
        entityId: "cms_start",
        timestamp: new Date().toISOString(),
        details: "Sistem Super Admin CMS diinisialisasi",
      },
    ];
  }

  static addChangeLog(log: ChangeLogItem) {
    const existing = this.getChangeLogs();
    const updated = [log, ...existing].slice(0, 50);
    try {
      localStorage.setItem(CHANGE_LOGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Gagal menyimpan audit log:", e);
    }
  }
}
