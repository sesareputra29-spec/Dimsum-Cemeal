/**
 * Dimsum Cemeal - Site Configuration & Verified Business Data
 * Serang, Banten, Indonesia
 */

export interface SiteConfig {
  brandName: string;
  tagline: string;
  eyebrow: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  colors: {
    maroon: string;
    maroonDark: string;
    gold: string;
    cream: string;
    white: string;
    darkText: string;
    mutedText: string;
  };
  outlet: {
    name: string;
    address: string;
    note: string;
    operatingHours: string;
    mapsUrl: string;
    mapsEmbedUrl: string;
    city: string;
    province: string;
  };
  orderLinks: {
    goFood: string;
    grabFood: string;
  };
  socialLinks: {
    instagram: string;
    oldSite: string;
  };
}

export const siteConfig: SiteConfig = {
  brandName: "Dimsum Cemeal",
  tagline: "Cemeal-in Mood Kamu Hari Ini!",
  eyebrow: "DIMSUM FAVORIT UNTUK SETIAP MOMEN",
  heroDescription:
    "Nikmati kelezatan dimsum dengan pilihan rasa yang menggugah selera. Teman sempurna untuk menemani waktu santai, berkumpul, dan berbagi kebahagiaan.",
  aboutTitle: "Lebih dari Sekadar Dimsum",
  aboutDescription:
    "Dimsum Cemeal hadir untuk menemani berbagai momen melalui sajian dimsum yang lezat dan pilihan rasa yang menarik. Kami percaya bahwa makanan bukan sekadar soal rasa, tetapi juga tentang kebersamaan dan kebahagiaan dalam setiap gigitan.",
  colors: {
    maroon: "#8B0A18",
    maroonDark: "#58050E",
    gold: "#F2B233",
    cream: "#FFF8F0",
    white: "#FFFFFF",
    darkText: "#251A18",
    mutedText: "#756761",
  },
  outlet: {
    name: "Dimsum Cemeal - Alfamart Bhayangkara",
    address: "Alfamart Bhayangkara, depan Saung Edi, Serang, Banten",
    note: "Patokan: Berada di area Alfamart Bhayangkara tepat di seberang Saung Edi Serang",
    operatingHours: "Senin – Sabtu, 13.00 – 21.00 WIB",
    mapsUrl: "https://maps.app.goo.gl/MHbhdPKLPMzGe94v9",
    // Embed map coordinate: -6.131269, 106.174296
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=-6.131269,106.174296&hl=id&z=17&output=embed",
    city: "Serang",
    province: "Banten",
  },
  orderLinks: {
    goFood:
      "https://gofood.co.id/serang/restaurant/dimsum-cemeal-alfamart-bhayangkara-843af7ca-5e01-4044-8fff-daddfad62706",
    grabFood: "https://r.grab.com/g/2-1-6-C6MJAYUYV6DKJA",
  },
  socialLinks: {
    instagram: "https://www.instagram.com/dimsum.cemeal/",
    oldSite: "https://sites.google.com/view/dimsumcemeals",
  },
};
