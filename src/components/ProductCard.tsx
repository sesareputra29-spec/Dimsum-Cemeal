import React from "react";
import { ShoppingBag, ImageOff, CheckCircle2 } from "lucide-react";
import { ProductItem } from "../types/cms.ts";
import { useCMS } from "../context/CMSContext.tsx";

interface ProductCardProps {
  product: ProductItem;
  onSelectProduct: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { publishedData } = useCMS();
  const { settings } = publishedData;

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#8B0A18]/10 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-[#FFF3E6] overflow-hidden">
        {product.image ? (
          <>
            <img
              src={product.image}
              alt={`Foto ${product.name}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {product.photoVerified && (
              <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#F2B233]" />
                <span>Foto Asli Cemeal</span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FFF3E6] to-[#FFEAD1]">
            <div className="w-12 h-12 rounded-full bg-[#8B0A18]/10 flex items-center justify-center text-[#8B0A18] mb-2.5">
              <ImageOff className="w-6 h-6 text-[#8B0A18]" />
            </div>
            <p className="font-semibold text-sm text-[#8B0A18]">
              {product.name}
            </p>
            <p className="text-[11px] text-[#756761] mt-1 max-w-[180px]">
              Foto katalog segera diperbarui
            </p>
          </div>
        )}

        {product.badge && (
          <div
            className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider"
            style={{
              backgroundColor: settings.primaryColor,
              color: settings.secondaryColor,
            }}
          >
            {product.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className="text-[11px] font-medium uppercase tracking-wider"
              style={{ color: settings.primaryColor }}
            >
              {product.category}
            </span>
            <span className="text-[11px] text-[#756761]">Siap Saji</span>
          </div>

          <h3
            className="font-bold text-lg text-[#251A18] group-hover:text-[#8B0A18] transition-colors leading-snug"
            style={{ fontFamily: settings.headingFont }}
          >
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#756761] mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-4 mt-4 border-t border-[#8B0A18]/10 flex items-center justify-between gap-3">
          <div>
            {product.price !== null ? (
              <div>
                <span className="text-[10px] text-[#756761] block">Harga</span>
                <span className="font-semibold text-base text-[#8B0A18] tabular-nums">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[10px] text-[#756761] block">Informasi Harga</span>
                <span className="text-xs font-semibold text-[#8B0A18]">
                  Cek di GoFood / GrabFood
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectProduct(product)}
            className="inline-flex items-center gap-1.5 font-semibold text-xs px-3.5 py-2.5 rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap cursor-pointer active:scale-95"
            style={{
              backgroundColor: settings.secondaryColor,
              color: settings.primaryDarkColor,
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pesan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
