import React from "react";
import { X, ArrowUpRight, Bike, MapPin, Store, CheckCircle2 } from "lucide-react";
import { siteConfig } from "../data/siteConfig.ts";
import { ProductItem } from "../types/cms.ts";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: ProductItem | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  selectedProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#8B0A18]/20 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#756761] hover:text-[#8B0A18] hover:bg-[#8B0A18]/10 transition-colors cursor-pointer"
          aria-label="Tutup jendela pemesanan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#8B0A18]/10 text-[#8B0A18] flex items-center justify-center mx-auto mb-3">
            <Bike className="w-6 h-6 text-[#8B0A18]" />
          </div>

          <h3 className="font-heading font-bold text-2xl text-[#251A18]">
            Pilih Cara Pemesanan
          </h3>

          {selectedProduct ? (
            <p className="text-xs text-[#8B0A18] font-semibold mt-1">
              Menu yang dipilih: <span className="underline">{selectedProduct.name}</span>
            </p>
          ) : (
            <p className="text-xs text-[#756761] mt-1">
              Pesan mudah dan cepat langsung melalui aplikasi favorit Anda
            </p>
          )}
        </div>

        {/* Order Options */}
        <div className="space-y-3.5 mb-6">
          {/* GoFood */}
          <a
            href={selectedProduct?.orderUrl || siteConfig.orderLinks.goFood}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between p-4 rounded-2xl border-2 border-[#EE2737]/20 hover:border-[#EE2737] bg-white hover:bg-[#EE2737]/5 transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EE2737] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                GF
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-[#251A18] group-hover:text-[#EE2737] transition-colors">
                  GoFood
                </p>
                <p className="text-[11px] text-[#756761]">
                  Pesan antar via aplikasi Gojek
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#756761] group-hover:text-[#EE2737] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* GrabFood */}
          <a
            href={siteConfig.orderLinks.grabFood}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between p-4 rounded-2xl border-2 border-[#00B14F]/20 hover:border-[#00B14F] bg-white hover:bg-[#00B14F]/5 transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#00B14F] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                Gr
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-[#251A18] group-hover:text-[#00B14F] transition-colors">
                  GrabFood
                </p>
                <p className="text-[11px] text-[#756761]">
                  Pesan antar via aplikasi Grab
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#756761] group-hover:text-[#00B14F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Dine-in / Takeaway at Outlet */}
          <a
            href={siteConfig.outlet.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between p-4 rounded-2xl border border-[#8B0A18]/15 hover:border-[#8B0A18] bg-[#FFF8F0] hover:bg-[#FFF3E6] transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#8B0A18] text-[#F2B233] flex items-center justify-center font-bold text-sm shadow-sm">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-[#8B0A18]">
                  Beli Langsung di Gerai
                </p>
                <p className="text-[11px] text-[#756761]">
                  Alfamart Bhayangkara, Serang
                </p>
              </div>
            </div>
            <MapPin className="w-5 h-5 text-[#8B0A18]" />
          </a>
        </div>

        {/* Note */}
        <div className="p-3 rounded-xl bg-[#FFF0E0] border border-[#8B0A18]/10 text-center">
          <p className="text-[11px] text-[#756761] flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8B0A18]" />
            <span>Semua pesanan dijamin autentik dari Dimsum Cemeal</span>
          </p>
        </div>
      </div>
    </div>
  );
};
