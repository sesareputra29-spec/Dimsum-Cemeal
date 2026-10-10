import React, { createContext, useContext, useEffect, useState } from "react";
import { FullCMSData, FormattedPart, ProductItem, SectionSetting, MediaAsset } from "../types/cms.ts";
import { defaultCmsData } from "../data/defaultCmsData.ts";
import { CMSService } from "../services/cmsService.ts";
import { useAuth } from "./AuthContext.tsx";

interface CMSContextType {
  publishedData: FullCMSData;
  draftData: FullCMSData;
  loading: boolean;
  hasUnsavedChanges: boolean;
  historyStack: FullCMSData[];
  historyIndex: number;
  updateDraftSettings: (settings: Partial<FullCMSData["settings"]>) => void;
  updateDraftSection: (sectionId: string, updates: Partial<SectionSetting>) => void;
  reorderSections: (newSections: SectionSetting[]) => void;
  updateContentElement: (key: string, updates: Partial<FullCMSData["contentElements"][string]>) => void;
  updateFormattedText: (key: string, parts: FormattedPart[]) => void;
  updateProducts: (products: ProductItem[]) => void;
  addProduct: (product: Omit<ProductItem, "id">) => void;
  deleteProduct: (id: string) => void;
  updateOutletSettings: (outlet: Partial<FullCMSData["outlet"]>) => void;
  updateSEOSettings: (seo: Partial<FullCMSData["seo"]>) => void;
  addMediaAsset: (asset: MediaAsset) => void;
  deleteMediaAsset: (id: string) => void;
  saveDraft: () => Promise<{ success: boolean; error?: string; isLocalOnly?: boolean }>;
  publishDraft: () => Promise<{ success: boolean; error?: string }>;
  restoreVersion: (versionRecordData: FullCMSData) => Promise<{ success: boolean; error?: string }>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, isSuperAdmin, loading: authLoading } = useAuth();
  const [publishedData, setPublishedData] = useState<FullCMSData>(defaultCmsData);
  const [draftData, setDraftData] = useState<FullCMSData>(defaultCmsData);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // History stack for Undo/Redo in Visual Editor
  const [historyStack, setHistoryStack] = useState<FullCMSData[]>([defaultCmsData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // 1. Initial load of strictly published data for public rendering
  useEffect(() => {
    let isMounted = true;
    const loadPublished = async () => {
      setLoading(true);
      const pub = await CMSService.getPublishedData();
      if (isMounted) {
        setPublishedData(pub);
        if (!isSuperAdmin) {
          setDraftData(pub);
          setHistoryStack([pub]);
          setHistoryIndex(0);
        }
        setLoading(false);
      }
    };

    loadPublished();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch draft ONLY after auth status is resolved AND user is verified Super Admin
  useEffect(() => {
    if (authLoading) return;

    let isMounted = true;
    if (isSuperAdmin) {
      const loadDraft = async () => {
        const drf = await CMSService.getDraftData();
        if (isMounted) {
          setDraftData(drf);
          setHistoryStack([drf]);
          setHistoryIndex(0);
        }
      };
      loadDraft();
    } else {
      // Clear draft data from active React state when not Super Admin (prevents draft state leakage to public view)
      setDraftData(publishedData);
      setHistoryStack([publishedData]);
      setHistoryIndex(0);
      setHasUnsavedChanges(false);
    }

    return () => {
      isMounted = false;
    };
  }, [authLoading, isSuperAdmin, publishedData]);

  const pushToHistory = (newData: FullCMSData) => {
    const newStack = historyStack.slice(0, historyIndex + 1);
    setHistoryStack([...newStack, newData]);
    setHistoryIndex(newStack.length);
    setDraftData(newData);
    setHasUnsavedChanges(true);
  };

  const updateDraftSettings = (settings: Partial<FullCMSData["settings"]>) => {
    const updated: FullCMSData = {
      ...draftData,
      settings: { ...draftData.settings, ...settings },
    };
    pushToHistory(updated);
  };

  const updateDraftSection = (sectionId: string, updates: Partial<SectionSetting>) => {
    const updatedSections = draftData.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, ...updates } : sec
    );
    const updated: FullCMSData = { ...draftData, sections: updatedSections };
    pushToHistory(updated);
  };

  const reorderSections = (newSections: SectionSetting[]) => {
    const ordered = newSections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    const updated: FullCMSData = { ...draftData, sections: ordered };
    pushToHistory(updated);
  };

  const updateContentElement = (
    key: string,
    updates: Partial<FullCMSData["contentElements"][string]>
  ) => {
    const existing = draftData.contentElements[key] || {
      id: key,
      sectionId: "general",
      key,
      label: key,
      type: "text",
    };

    const updatedElements = {
      ...draftData.contentElements,
      [key]: { ...existing, ...updates },
    };

    const updated: FullCMSData = { ...draftData, contentElements: updatedElements };
    pushToHistory(updated);
  };

  const updateFormattedText = (key: string, parts: FormattedPart[]) => {
    const fullText = parts.map((p) => p.text).join("");
    updateContentElement(key, {
      richTextValue: parts,
      textValue: fullText,
    });
  };

  const updateProducts = (products: ProductItem[]) => {
    const updated: FullCMSData = { ...draftData, products };
    pushToHistory(updated);
  };

  const addProduct = (product: Omit<ProductItem, "id">) => {
    const newId = "product_" + Date.now();
    const newProduct: ProductItem = {
      ...product,
      id: newId,
      orderIndex: draftData.products.length + 1,
    };
    updateProducts([...draftData.products, newProduct]);
  };

  const deleteProduct = (id: string) => {
    const filtered = draftData.products.filter((p) => p.id !== id);
    updateProducts(filtered);
  };

  const updateOutletSettings = (outlet: Partial<FullCMSData["outlet"]>) => {
    const updated: FullCMSData = {
      ...draftData,
      outlet: { ...draftData.outlet, ...outlet },
    };
    pushToHistory(updated);
  };

  const updateSEOSettings = (seo: Partial<FullCMSData["seo"]>) => {
    const updated: FullCMSData = {
      ...draftData,
      seo: { ...draftData.seo, ...seo },
    };
    pushToHistory(updated);
  };

  const addMediaAsset = (asset: MediaAsset) => {
    const updated: FullCMSData = {
      ...draftData,
      mediaAssets: [asset, ...draftData.mediaAssets],
    };
    pushToHistory(updated);
  };

  const deleteMediaAsset = (id: string) => {
    const updated: FullCMSData = {
      ...draftData,
      mediaAssets: draftData.mediaAssets.filter((a) => a.id !== id),
    };
    pushToHistory(updated);
  };

  const saveDraft = async (): Promise<{ success: boolean; error?: string }> => {
    const res = await CMSService.saveDraft(draftData, profile?.email || "super_admin");
    if (res.success) {
      setHasUnsavedChanges(false);
    }
    return res;
  };

  const publishDraft = async (): Promise<{ success: boolean; error?: string }> => {
    const res = await CMSService.publish(draftData, profile?.email || "super_admin");
    if (res.success) {
      setPublishedData(draftData);
      setHasUnsavedChanges(false);
    }
    return res;
  };

  const restoreVersion = async (versionData: FullCMSData): Promise<{ success: boolean; error?: string }> => {
    pushToHistory(versionData);
    const res = await CMSService.publish(versionData, profile?.email || "super_admin");
    if (res.success) {
      setPublishedData(versionData);
      setHasUnsavedChanges(false);
    }
    return res;
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prev = historyStack[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setDraftData(prev);
    }
  };

  const redo = () => {
    if (historyIndex < historyStack.length - 1) {
      const next = historyStack[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setDraftData(next);
    }
  };

  return (
    <CMSContext.Provider
      value={{
        publishedData,
        draftData,
        loading,
        hasUnsavedChanges,
        historyStack,
        historyIndex,
        updateDraftSettings,
        updateDraftSection,
        reorderSections,
        updateContentElement,
        updateFormattedText,
        updateProducts,
        addProduct,
        deleteProduct,
        updateOutletSettings,
        updateSEOSettings,
        addMediaAsset,
        deleteMediaAsset,
        saveDraft,
        publishDraft,
        restoreVersion,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < historyStack.length - 1,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
};
