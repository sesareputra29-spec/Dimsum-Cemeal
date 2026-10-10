/**
 * Dimsum Cemeal - Product Catalog Data
 * All verified items, genuine images, and explicit order URLs.
 * Price is set to null when unverified to prevent false customer expectations.
 */

import { siteConfig } from "./siteConfig.ts";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  price: number | null; // null if unverified
  category: "Semua" | "Favorit" | "Spesial" | "Klasik";
  available: boolean;
  orderUrl: string;
  badge?: string;
  photoVerified: boolean;
}

export const products: Product[] = [
  {
    id: "dimsum-mealted",
    name: "Dimsum Mealted",
    description:
      "Varian dimsum favorit dengan limpahan keju lumer gurih yang meleleh lembut di setiap gigitan.",
    image: "/images/products/dimsum-mealted.png",
    price: null,
    category: "Favorit",
    available: true,
    orderUrl: siteConfig.orderLinks.goFood,
    badge: "Best Seller",
    photoVerified: true,
  },
  {
    id: "dimsum-crispy",
    name: "Dimsum Crispy",
    description:
      "Kombinasi tekstur luar renyah keemasan berpadu dengan kelembutan olahan daging autentik di dalamnya.",
    image: "/images/products/dimsum-crispy.png",
    price: null,
    category: "Favorit",
    available: true,
    orderUrl: siteConfig.orderLinks.grabFood,
    badge: "Sensasi Renyah",
    photoVerified: true,
  },
  {
    id: "dimsum-smoky",
    name: "Dimsum Smoky",
    description:
      "Dimsum dengan aroma asap panggangan khas yang sedap, gurih, dan memiliki karakter rasa yang mendalam.",
    image: "/images/products/dimsum-smoky.png",
    price: null,
    category: "Favorit",
    available: true,
    orderUrl: siteConfig.orderLinks.goFood,
    badge: "Aroma Khas",
    photoVerified: true,
  },
  {
    id: "dimsum-authentic-platter",
    name: "Dimsum Platter Aneka Rasa",
    description:
      "Sajian komplit pilihan rasa Dimsum Cemeal dengan aneka topping dan saus lezat, cocok untuk momen berbagi.",
    image: "/images/products/dimsum-authentic-platter.png",
    price: null,
    category: "Spesial",
    available: true,
    orderUrl: siteConfig.orderLinks.goFood,
    badge: "Porsi Berbagi",
    photoVerified: true,
  },
  {
    id: "dimsum-original",
    name: "Dimsum Original",
    description:
      "Dimsum klasik kukus dengan tekstur daging lembut berpadu rasa gurih autentik warisan resep khas Cemeal.",
    image: null,
    price: null,
    category: "Klasik",
    available: true,
    orderUrl: siteConfig.orderLinks.goFood,
    badge: "Menu Klasik",
    photoVerified: false,
  },
  {
    id: "dimsum-chilli-oil",
    name: "Dimsum Chilli Oil",
    description:
      "Dimsum kukus hangat disiram minyak cabai (chilli oil) gurih pedas aromatik racikan spesial Dimsum Cemeal.",
    image: null,
    price: null,
    category: "Spesial",
    available: true,
    orderUrl: siteConfig.orderLinks.goFood,
    badge: "Sensasi Pedas",
    photoVerified: false,
  },
  {
    id: "dimsum-mentai",
    name: "Dimsum Mentai",
    description:
      "Dimsum lembut berbalut saus mentai gurih-creamy yang dibakar singkat hingga menghasilkan aroma wangi khas.",
    image: null,
    price: null,
    category: "Spesial",
    available: true,
    orderUrl: siteConfig.orderLinks.grabFood,
    badge: "Creamy Mentai",
    photoVerified: false,
  },
  {
    id: "dimsum-mozarella",
    name: "Dimsum Mozarella",
    description:
      "Kelezatan dimsum premium dengan balutan keju mozzarella melar yang gurih saat dinikmati hangat.",
    image: null,
    price: null,
    category: "Favorit",
    available: true,
    orderUrl: siteConfig.orderLinks.grabFood,
    badge: "Keju Melar",
    photoVerified: false,
  },
];
