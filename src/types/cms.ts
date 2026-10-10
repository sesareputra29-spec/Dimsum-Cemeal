/**
 * Dimsum Cemeal - Super Admin CMS Data Models & Types
 */

export interface FormattedPart {
  id: string;
  text: string;
  color?: string;
  font?: string;
  fontSize?: string;
  fontWeight?: string;
  italic?: boolean;
  underline?: boolean;
}

export interface RichTextPart {
  id: string;
  fullText: string;
  parts: FormattedPart[];
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  eyebrow: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  primaryColor: string; // Default #8B0A18
  primaryDarkColor: string; // Default #58050E
  secondaryColor: string; // Default #F2B233
  backgroundColor: string; // Default #FFF8F0
  whiteColor: string; // Default #FFFFFF
  darkTextColor: string; // Default #251A18
  mutedTextColor: string; // Default #756761
  headingFont: string; // 'Playfair Display'
  bodyFont: string; // 'Poppins'
  logoUrl?: string;
  faviconUrl?: string;
}

export interface SectionSetting {
  id: string; // 'hero' | 'tentang' | 'menu' | 'keunggulan' | 'galeri' | 'pemesanan' | 'lokasi' | 'footer'
  name: string;
  title: string;
  subtitle?: string;
  visible: boolean;
  order: number;
  desktopVisible: boolean;
  mobileVisible: boolean;
  bgColor?: string;
  paddingY?: string; // e.g. 'py-20'
}

export interface ContentElement {
  id: string;
  sectionId: string;
  key: string; // e.g., 'hero_title', 'about_body', 'footer_copyright'
  label: string;
  type: 'text' | 'rich-text' | 'image' | 'button' | 'color';
  textValue?: string;
  richTextValue?: FormattedPart[];
  imageUrl?: string;
  imageAlt?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  styles?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    marginTop?: string;
    marginBottom?: string;
    backgroundColor?: string;
    borderRadius?: string;
  };
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number | null; // null if unverified
  image: string | null;
  category: 'Favorit' | 'Spesial' | 'Klasik' | string;
  available: boolean;
  badge?: string;
  orderUrl: string;
  orderIndex: number;
  photoVerified: boolean;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  altText: string;
  category: 'hero' | 'product' | 'gallery' | 'outlet' | 'logo' | 'general';
  createdAt: string;
  dimensions?: { width: number; height: number };
}

export interface OutletSettings {
  name: string;
  address: string;
  note: string;
  operatingHours: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  city: string;
  province: string;
  whatsappNumber?: string;
  email?: string;
}

export interface NavigationLink {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  favicon: string;
}

export interface FullCMSData {
  settings: SiteSettings;
  sections: SectionSetting[];
  contentElements: Record<string, ContentElement>;
  products: ProductItem[];
  mediaAssets: MediaAsset[];
  outlet: OutletSettings;
  navigationLinks: NavigationLink[];
  seo: SEOSettings;
  lastUpdated: string;
  version: number;
  isPublished: boolean;
}

export interface ChangeLogItem {
  id: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details: string;
}

export interface PublishedVersionRecord {
  id: string;
  versionNumber: number;
  data: FullCMSData;
  publishedAt: string;
  publishedBy: string;
  note?: string;
}
