import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext.tsx";
import { ProductItem } from "../../types/cms.ts";
import { ShoppingBag, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, X, Check } from "lucide-react";

export const ProductsManagerTab: React.FC = () => {
  const { draftData, addProduct, updateProducts, deleteProduct } = useCMS();
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formState, setFormState] = useState<Partial<ProductItem>>({
    name: "",
    description: "",
    price: null,
    image: null,
    category: "Favorit",
    available: true,
    badge: "",
    orderUrl: draftData.outlet.mapsUrl,
    photoVerified: true,
  });

  const handleEditClick = (product: ProductItem) => {
    setEditingProduct(product);
    setFormState(product);
    setIsAdding(false);
  };

  const handleAddNewClick = () => {
    setIsAdding(true);
    setEditingProduct(null);
    setFormState({
      name: "",
      description: "",
      price: null,
      image: "/images/products/dimsum-authentic-platter.png",
      category: "Favorit",
      available: true,
      badge: "Menu Baru",
      orderUrl: "https://gofood.co.id/serang/restaurant/dimsum-cemeal-alfamart-bhayangkara-843af7ca-5e01-4044-8fff-daddfad62706",
      photoVerified: true,
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name) return;

    if (isAdding) {
      addProduct({
        name: formState.name || "Menu Dimsum Baru",
        description: formState.description || "",
        price: formState.price !== undefined ? formState.price : null,
        image: formState.image || null,
        category: formState.category || "Favorit",
        available: formState.available ?? true,
        badge: formState.badge || "",
        orderUrl: formState.orderUrl || "https://gofood.co.id/serang/restaurant/dimsum-cemeal-alfamart-bhayangkara-843af7ca-5e01-4044-8fff-daddfad62706",
        orderIndex: draftData.products.length + 1,
        photoVerified: formState.photoVerified ?? true,
      });
      setIsAdding(false);
    } else if (editingProduct) {
      const updatedList = draftData.products.map((p) =>
        p.id === editingProduct.id ? ({ ...p, ...formState } as ProductItem) : p
      );
      updateProducts(updatedList);
      setEditingProduct(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-xl text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8B0A18]" />
            <span>Manajemen Menu & Katalog Produk ({draftData.products.length})</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Tambah, edit, hapus, atur foto asli, harga, dan ketersediaan menu dimsum.
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="inline-flex items-center gap-2 bg-[#8B0A18] hover:bg-[#720712] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#F2B233]" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Add / Edit Form Modal / Drawer */}
      {(isAdding || editingProduct) && (
        <form
          onSubmit={handleSaveForm}
          className="bg-white rounded-2xl p-6 border-2 border-[#8B0A18]/20 shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-heading font-bold text-base text-[#8B0A18]">
              {isAdding ? "Tambah Menu Dimsum Baru" : `Edit Menu: ${editingProduct?.name}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingProduct(null);
              }}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                required
                value={formState.name || ""}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
                placeholder="Dimsum Mentai / Original / etc."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kategori Produk
              </label>
              <select
                value={formState.category || "Favorit"}
                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
              >
                <option value="Favorit">Favorit</option>
                <option value="Spesial">Spesial</option>
                <option value="Klasik">Klasik</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Deskripsi Singkat (Penggugah Selera)
              </label>
              <textarea
                rows={2}
                value={formState.description || ""}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
                placeholder="Penjelasan varian rasa dimsum..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Harga Rp (Biarkan Kosong Jika Cek di App)
              </label>
              <input
                type="number"
                value={formState.price === null ? "" : formState.price}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    price: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
                placeholder="Kosong = 'Cek di Aplikasi'"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Badge / Label Menu
              </label>
              <input
                type="text"
                value={formState.badge || ""}
                onChange={(e) => setFormState({ ...formState, badge: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl"
                placeholder="Best Seller / Keju Melar / etc."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                URL Gambar Produk
              </label>
              <input
                type="text"
                value={formState.image || ""}
                onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs"
                placeholder="/images/products/dimsum-mealted.png"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tautan Pemesanan Langsung (GoFood / GrabFood)
              </label>
              <input
                type="url"
                value={formState.orderUrl || ""}
                onChange={(e) => setFormState({ ...formState, orderUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#8B0A18] hover:bg-[#720712] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      )}

      {/* Product List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {draftData.products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B0A18] bg-[#8B0A18]/10 px-2 py-0.5 rounded">
                  {p.category}
                </span>
                {p.badge && (
                  <span className="text-[10px] font-bold text-[#58050E] bg-[#F2B233] px-2 py-0.5 rounded">
                    {p.badge}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 text-center p-1 shrink-0">
                    Foto Pending
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-sm text-gray-900">{p.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                    {p.description}
                  </p>
                  <p className="text-xs font-semibold text-[#8B0A18] mt-1">
                    {p.price !== null ? `Rp ${p.price.toLocaleString("id-ID")}` : "Cek di App"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                {p.photoVerified ? "Foto Asli Cemeal" : "Placeholder"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEditClick(p)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteProduct(p.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
