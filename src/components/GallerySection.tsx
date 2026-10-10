import React, { useState } from "react";
import { Camera, X, ZoomIn, Eye } from "lucide-react";
import { useCMS } from "../context/CMSContext.tsx";

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  caption: string;
  span?: string;
}

export const GallerySection: React.FC = () => {
  const { publishedData } = useCMS();
  const { settings, sections } = publishedData;
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const galSec = sections.find((s) => s.id === "galeri");
  if (galSec && !galSec.visible) return null;

  const galleryItems: GalleryItem[] = [
    {
      id: "platter",
      src: "/images/products/dimsum-authentic-platter.png",
      title: `Sajikan Platter ${settings.brandName}`,
      caption: "Kombinasi aneka varian topping dan saus autentik siap santap",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      id: "kukus-bambu",
      src: "/images/gallery/dimsum-kukus-bambu.png",
      title: "Pengukusan Klakat Bambu Tradisional",
      caption: "Menjaga kehangatan, kelembapan, dan aroma khas dimsum",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      id: "mealted",
      src: "/images/products/dimsum-mealted.png",
      title: "Dimsum Mealted",
      caption: "Sensasi lelehan keju lumer yang gurih menggugah selera",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      id: "craftsmanship",
      src: "/images/gallery/dimsum-craftsmanship.png",
      title: "Dedikasi & Racikan Resep",
      caption: "Dibuat dengan bahan segar pilihan untuk kualitas rasa konsisten",
      span: "md:col-span-1 md:row-span-2",
    },
    {
      id: "crispy",
      src: "/images/products/dimsum-crispy.png",
      title: "Dimsum Crispy",
      caption: "Tekstur garing di luar dengan daging lembut di dalam",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      id: "outlet",
      src: "/images/outlet/outlet-bhayangkara.png",
      title: "Outlet Physical Location",
      caption: "Lokasi fisik di Alfamart Bhayangkara Serang",
      span: "md:col-span-2 md:row-span-1",
    },
  ];

  return (
    <section
      id="galeri"
      className="py-20 md:py-28 relative"
      style={{ backgroundColor: galSec?.bgColor || settings.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0A18]/10 text-[#8B0A18] text-xs font-semibold tracking-wider uppercase mb-3">
            <Camera className="w-3.5 h-3.5 text-[#F2B233]" />
            <span>Dokumentasi Nyata</span>
          </div>
          <h2
            className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#251A18] tracking-tight"
            style={{ fontFamily: settings.headingFont }}
          >
            {galSec?.title || "Kenikmatan dalam Setiap Gigitan"}
          </h2>
          <p className="text-sm sm:text-base text-[#756761] mt-3">
            Kumpulan potret sajian asli, proses pembuatan, dan outlet {settings.brandName}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[240px] md:auto-rows-[260px]">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#8B0A18]/10 cursor-pointer ${
                item.span || ""
              }`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute inset-x-0 bottom-0 p-5 text-white flex flex-col justify-end">
                <span className="text-[10px] tracking-widest text-[#F2B233] font-semibold uppercase mb-1 flex items-center gap-1.5">
                  <Eye className="w-3 h-3" />
                  <span>Foto Asli</span>
                </span>
                <h3
                  className="font-bold text-base sm:text-lg text-white leading-snug"
                  style={{ fontFamily: settings.headingFont }}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-1">
                  {item.caption}
                </p>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#251A18] rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-5 bg-[#251A18] text-white border-t border-white/10">
              <h3 className="font-bold text-lg text-[#F2B233]">{activeImage.title}</h3>
              <p className="text-xs sm:text-sm text-white/80 mt-1">{activeImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
