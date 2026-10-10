import React, { useState } from "react";
import { Utensils, AlertCircle } from "lucide-react";
import { ProductItem } from "../types/cms.ts";
import { useCMS } from "../context/CMSContext.tsx";
import { ProductCard } from "./ProductCard.tsx";

interface MenuSectionProps {
  onSelectProduct: (product: ProductItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectProduct }) => {
  const { publishedData } = useCMS();
  const { settings, products, sections } = publishedData;
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const menuSec = sections.find((s) => s.id === "menu");
  if (menuSec && !menuSec.visible) return null;

  const categories = ["Semua", "Favorit", "Spesial", "Klasik"];

  const filteredProducts =
    selectedCategory === "Semua"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="menu"
      className="py-20 md:py-28 relative"
      style={{ backgroundColor: menuSec?.bgColor || settings.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0A18]/10 text-[#8B0A18] text-xs font-semibold tracking-wider uppercase mb-3">
            <Utensils className="w-3.5 h-3.5 text-[#F2B233]" />
            <span>Katalog Sajian</span>
          </div>

          <h2
            className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#251A18] tracking-tight mb-4"
            style={{ fontFamily: settings.headingFont }}
          >
            {menuSec?.title || "Temukan Favoritmu"}
          </h2>

          <p className="text-base sm:text-lg text-[#756761] text-balance">
            {menuSec?.subtitle || "Pilihan dimsum untuk menemani mood kamu hari ini."}
          </p>

          <div className="mt-8 inline-flex items-center p-1.5 bg-[#FFF0E0] rounded-xl border border-[#8B0A18]/10 max-w-full overflow-x-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#8B0A18] text-white shadow-sm"
                      : "text-[#251A18]/80 hover:text-[#8B0A18] hover:bg-white/60"
                  }`}
                  style={{
                    backgroundColor: isActive ? settings.primaryColor : "transparent",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>

        <div className="mt-12 max-w-2xl mx-auto p-4 rounded-xl bg-white/80 border border-[#8B0A18]/10 flex items-start gap-3 text-xs text-[#756761]">
          <AlertCircle className="w-4 h-4 text-[#8B0A18] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#251A18]">Informasi Menu & Harga:</strong> Untuk menjaga akurasi harga promo, bundel, dan ketersediaan stok harian, silakan cek langsung melalui aplikasi resmi GoFood atau GrabFood {settings.brandName}.
          </p>
        </div>
      </div>
    </section>
  );
};
