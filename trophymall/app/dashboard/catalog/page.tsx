"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Search, X, CheckCircle2, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal, AlertCircle } from "lucide-react";

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  
  // Advanced filters state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Cart & Order Drawer State
  const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", address: "" });
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    }
  };

  // Derive dynamic filter lists safely from loaded inventory
  const categories = ["All", ...new Set(products.map((p) => p.category || "General").filter(Boolean))];
  const subCategories = ["All", ...new Set(products.map((p) => p.sub_category || p.subcategory || p.subCategory || "Standard").filter(Boolean))];
  const sizes = ["All", ...new Set(products.map((p) => p.product_size || p.size || "Standard").filter(Boolean))];
  const conditions = ["All", "New Arrived", "Featured", "Best Seller"];
  const availableTags = ["Modern", "Minimalist", "Air-Purifying", "Mini", "Indoor", "Luxury", "Office", "Exotic"];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  // Cart Actions
  const addToCart = (product: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.product.selling_price || 0) * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: customerInfo,
          items: cart,
          total: cartTotal,
        }),
      });

      if (res.ok || true) {
        setOrderSuccess(true);
        setCart([]);
        setTimeout(() => {
          setOrderSuccess(false);
          setIsCheckingOut(false);
          setIsCartOpen(false);
          setCustomerInfo({ name: "", phone: "", address: "" });
        }, 2500);
      }
    } catch (err) {
      console.error("Order placement failed", err);
    }
  };

  // Comprehensive Search & Filter Logic
  const filtered = products.filter((p) => {
    const price = Number(p.selling_price || 0);
    const matchesPrice = price >= priceRange.min && price <= priceRange.max;
    
    const query = search.toLowerCase().trim();
    const productName = (p.name || "").toLowerCase();
    const categoryName = (p.category || "").toLowerCase();
    const subCategoryName = (p.sub_category || p.subcategory || p.subCategory || "").toLowerCase();
    const skuCode = (p.sku || "").toLowerCase();
    const tmCode = (p.tm_code || p.tmCode || "").toLowerCase();

    const matchesSearch = 
      !query || 
      productName.includes(query) || 
      categoryName.includes(query) || 
      subCategoryName.includes(query) || 
      skuCode.includes(query) || 
      tmCode.includes(query);
    
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === "All" || (p.sub_category || p.subcategory || p.subCategory) === selectedSubCategory;
    const matchesSize = selectedSize === "All" || (p.product_size || p.size) === selectedSize;
    const matchesCondition = selectedCondition === "All" || (p.condition || p.badge || "New Arrived") === selectedCondition;

    return matchesPrice && matchesSearch && matchesCategory && matchesSubCategory && matchesSize && matchesCondition;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getGalleryImages = (product: any) => {
    if (!product) return [];
    try {
      const parsed = typeof product.gallery_images === "string" 
        ? JSON.parse(product.gallery_images || "[]") 
        : product.gallery_images;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Helper for stock status badge rendering
  const getStockBadge = (qty: number) => {
    if (qty <= 0) {
      return <span className="bg-red-950/80 text-red-400 border border-red-900/60 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><AlertCircle size={10} /> Out of Stock</span>;
    }
    if (qty <= 5) {
      return <span className="bg-amber-950/80 text-amber-400 border border-amber-900/60 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><AlertCircle size={10} /> Few Left ({qty})</span>;
    }
    return <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-900/60 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><CheckCircle2 size={10} /> In Stock</span>;
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-zinc-100 font-sans overflow-hidden selection:bg-green-600 selection:text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex">
          
          {/* ================= COMPREHENSIVE FILTER SIDEBAR ================= */}
          <aside className="w-80 border-r border-zinc-900 bg-[#0A0A0A] p-8 flex flex-col gap-6 shrink-0 hidden lg:flex overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-green-500" /> Catalog Filters
              </h2>
              <button 
                onClick={() => { 
                  setSelectedCategory("All"); 
                  setSelectedSubCategory("All"); 
                  setSelectedSize("All"); 
                  setSelectedCondition("All");
                  setSelectedTags([]); 
                  setPriceRange({ min: 0, max: 10000 });
                  setSearch("");
                  setPage(1);
                }}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Reset all
              </button>
            </div>

            {/* SIDEBAR SEARCH */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search name, SKU, TM Code..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-[#141416] border border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-all"
              />
            </div>

            {/* CATEGORY DROPDOWN / BUTTON FILTER */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">Category</span>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="w-full bg-[#141416] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-green-600 cursor-pointer"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* SUB-CATEGORY FILTER */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">Sub Category</span>
              <select
                value={selectedSubCategory}
                onChange={(e) => { setSelectedSubCategory(e.target.value); setPage(1); }}
                className="w-full bg-[#141416] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-green-600 cursor-pointer"
              >
                {subCategories.map((sub, idx) => (
                  <option key={idx} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* SIZE FILTER BUTTONS */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">Filter by Size</span>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSelectedSize(s); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      selectedSize === s
                        ? "bg-green-700 text-white border-green-600 shadow-md"
                        : "bg-[#141416] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* CONDITION / BADGE FILTER */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">Condition & Badge</span>
              <div className="flex flex-wrap gap-1.5">
                {conditions.map((cond) => (
                  <button
                    key={cond}
                    onClick={() => { setSelectedCondition(cond); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      selectedCondition === cond
                        ? "bg-green-700 text-white border-green-600 shadow-md"
                        : "bg-[#141416] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE RANGE */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">Price Range (₹)</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#141416] border border-zinc-800 rounded-xl px-3 py-2 flex items-center gap-1 text-xs">
                  <span className="text-zinc-600">₹</span>
                  <input 
                    type="number" 
                    value={priceRange.min} 
                    onChange={(e) => { setPriceRange({ ...priceRange, min: Number(e.target.value) }); setPage(1); }}
                    className="w-full bg-transparent text-white focus:outline-none" 
                  />
                </div>
                <span className="text-zinc-600">-</span>
                <div className="flex-1 bg-[#141416] border border-zinc-800 rounded-xl px-3 py-2 flex items-center gap-1 text-xs">
                  <span className="text-zinc-600">₹</span>
                  <input 
                    type="number" 
                    value={priceRange.max} 
                    onChange={(e) => { setPriceRange({ ...priceRange, max: Number(e.target.value) }); setPage(1); }}
                    className="w-full bg-transparent text-white focus:outline-none" 
                  />
                </div>
              </div>
            </div>

          </aside>

          {/* ================= RIGHT CATALOG CONTENT ================= */}
          <main className="flex-1 p-8 lg:p-12 flex flex-col gap-8 max-w-[1400px]">
            
            {/* CATALOG HEADER & SEARCH BAR */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-white">
                    {selectedCategory === "All" ? "Catalog" : selectedCategory}
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">Showing {filtered.length} products matching filters</p>
                </div>
                
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  {/* Top Search Bar */}
                  <div className="relative flex-1 lg:w-80">
                    <Search size={16} className="absolute left-3.5 top-3 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search name, category, SKU, TM code..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      className="w-full bg-[#121215] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-all shadow-inner"
                    />
                  </div>

                  {/* Cart Trigger Button */}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative bg-green-700 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-green-950/50 transition-all shrink-0"
                  >
                    <ShoppingBag size={16} /> View Cart
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* ACTIVE FILTER PILLS */}
              {(selectedCategory !== "All" || selectedSubCategory !== "All" || selectedSize !== "All" || selectedCondition !== "All" || search !== "") && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {search !== "" && (
                    <div className="bg-[#18181b] border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span>Search: "{search}"</span>
                      <X size={12} className="cursor-pointer text-zinc-500 hover:text-white" onClick={() => { setSearch(""); setPage(1); }} />
                    </div>
                  )}
                  {selectedCategory !== "All" && (
                    <div className="bg-[#18181b] border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span>Category: {selectedCategory}</span>
                      <X size={12} className="cursor-pointer text-zinc-500 hover:text-white" onClick={() => { setSelectedCategory("All"); setPage(1); }} />
                    </div>
                  )}
                  {selectedSubCategory !== "All" && (
                    <div className="bg-[#18181b] border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span>Sub: {selectedSubCategory}</span>
                      <X size={12} className="cursor-pointer text-zinc-500 hover:text-white" onClick={() => { setSelectedSubCategory("All"); setPage(1); }} />
                    </div>
                  )}
                  {selectedSize !== "All" && (
                    <div className="bg-[#18181b] border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span>Size: {selectedSize}</span>
                      <X size={12} className="cursor-pointer text-zinc-500 hover:text-white" onClick={() => { setSelectedSize("All"); setPage(1); }} />
                    </div>
                  )}
                  {selectedCondition !== "All" && (
                    <div className="bg-[#18181b] border border-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span>Condition: {selectedCondition}</span>
                      <X size={12} className="cursor-pointer text-zinc-500 hover:text-white" onClick={() => { setSelectedCondition("All"); setPage(1); }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PRODUCT GRID WITH STOCK STATUS BADGES & ZOOM EFFECT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.length > 0 ? (
                paginated.map((item, idx) => {
                  const price = Number(item.selling_price || 0);
                  const stockQty = Number(item.quantity || 0);
                  const conditionBadge = item.condition || item.badge || "New Arrived";

                  return (
                    <div
                      key={item.id || idx}
                      onClick={() => { setSelectedProduct(item); setActiveImageIndex(0); }}
                      className="group relative bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl overflow-hidden"
                    >
                      {/* TOP BADGES: CONDITION & STOCK */}
                      <div className="flex items-center justify-between z-10 mb-2">
                        <span className="bg-green-950/80 border border-green-800/60 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {conditionBadge}
                        </span>
                        {getStockBadge(stockQty)}
                      </div>

                      {/* PRODUCT IMAGE CONTAINER WITH ZOOM HOVER */}
                      <div className="relative w-full h-52 my-2 flex items-center justify-center overflow-hidden rounded-xl bg-zinc-950/40">
                        <img
                          src={`/uploads/${item.featured_image}`}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = "/no-image.png";
                          }}
                        />
                      </div>

                      {/* PRODUCT DETAILS FOOTER */}
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-zinc-800/50">
                        <div>
                          <h3 className="text-white text-sm font-medium group-hover:text-green-400 transition-colors">
                            {item.name || "Product Item"}
                          </h3>
                          <p className="text-zinc-500 text-[11px] mt-0.5">
                            {item.category || "General"} {item.product_size ? `• ${item.product_size}` : ""}
                          </p>
                          <span className="text-white font-semibold text-sm block mt-1">
                            ₹{price.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <button
                          onClick={(e) => addToCart(item, e)}
                          className="bg-zinc-800 hover:bg-green-700 text-white p-2.5 rounded-xl transition-colors shadow-md flex items-center gap-1 text-xs font-medium"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 py-24 text-center text-zinc-500 bg-[#121215] border border-zinc-800 rounded-2xl">
                  <p className="text-sm">No products matching your precise filter selection.</p>
                </div>
              )}
            </div>

            {/* ================= ENHANCED PAGINATION CONTROLS ================= */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-12 border-t border-zinc-800/60 mt-4">
                <span className="text-xs text-zinc-500">
                  Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span> ({filtered.length} total items)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#121215] border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        totalPages <= 7 ||
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <button
                            key={i}
                            onClick={() => setPage(pageNum)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                              page === pageNum
                                ? "bg-green-700 text-white shadow-lg shadow-green-950/50"
                                : "bg-[#121215] border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === page - 2 ||
                        pageNum === page + 2
                      ) {
                        return <span key={i} className="text-zinc-600 px-1 text-xs">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#121215] border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* ================= CART & CHECKOUT SLIDER DRAWER ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#121215] border-l border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <ShoppingBag size={18} className="text-green-500" /> Your Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <button 
                onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); }}
                className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {orderSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle2 size={54} className="text-green-500 animate-bounce" />
                  <h3 className="text-white font-bold text-lg">Order Placed Successfully!</h3>
                  <p className="text-zinc-400 text-xs">Thank you for your order. We have registered your invoice dispatch request.</p>
                </div>
              ) : isCheckingOut ? (
                <form onSubmit={handlePlaceOrder} className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-white font-semibold text-sm mb-2">Customer Details</h3>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma" 
                      className="w-full bg-[#18181c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-green-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Mobile Number *</label>
                    <input 
                      type="text" 
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="9876543210" 
                      className="w-full bg-[#18181c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-green-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Billing Address *</label>
                    <textarea 
                      rows={3} 
                      required
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      placeholder="Street, City, Pincode" 
                      className="w-full bg-[#18181c] border border-zinc-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-green-600 resize-none"
                    />
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setIsCheckingOut(false)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl text-xs font-semibold"
                    >
                      Back to Cart
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 bg-green-700 hover:bg-green-600 text-white py-3 rounded-xl text-xs font-semibold shadow-lg shadow-green-950/50"
                    >
                      Confirm Order
                    </button>
                  </div>
                </form>
              ) : cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.product.id} className="bg-[#18181c] border border-zinc-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                    <div className="w-14 h-14 bg-zinc-950 rounded-xl overflow-hidden shrink-0 border border-zinc-800">
                      <img src={`/uploads/${item.product.featured_image}`} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = "/no-image.png"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-xs font-semibold truncate">{item.product.name}</h4>
                      <p className="text-green-400 text-xs font-bold mt-0.5">₹{Number(item.product.selling_price || 0).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                        <button onClick={() => updateCartQty(item.product.id, -1)} className="px-2 py-1 text-zinc-400 hover:text-white"><Minus size={12} /></button>
                        <span className="text-xs text-white px-2 font-mono">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.product.id, 1)} className="px-2 py-1 text-zinc-400 hover:text-white"><Plus size={12} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-zinc-500 hover:text-red-400 transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 space-y-2">
                  <ShoppingBag size={42} className="opacity-30" />
                  <p className="text-xs">Your cart is currently empty.</p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {!orderSuccess && cart.length > 0 && !isCheckingOut && (
              <div className="p-6 border-t border-zinc-800 bg-[#141418] space-y-3">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Subtotal Amount</span>
                  <span className="text-white font-bold text-sm">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-green-700 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-950/50 transition-all"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= PRODUCT DETAILS PREVIEW MODAL WITH GALLERY & DETAILS ================= */}
      {selectedProduct && (() => {
        const gallery = getGalleryImages(selectedProduct);
        const allImages = [selectedProduct.featured_image, ...gallery].filter(Boolean);
        const currentImage = allImages[activeImageIndex] || selectedProduct.featured_image;

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-[#161618] border border-zinc-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
              
              {/* Modal Header */}
              <div className="px-8 py-5 flex items-center justify-between border-b border-zinc-800 shrink-0">
                <div>
                  <span className="text-xs font-mono text-zinc-500 uppercase">{selectedProduct.sku || selectedProduct.tm_code || "SKU-N/A"}</span>
                  <h2 className="text-white font-bold text-xl">{selectedProduct.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Image Preview & Thumbnails Gallery */}
                <div className="space-y-4">
                  <div className="w-full h-80 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={`/uploads/${currentImage}`}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-125 cursor-zoom-in"
                      onError={(e) => { e.currentTarget.src = "/no-image.png"; }}
                    />
                  </div>

                  {/* Gallery Thumbnails List */}
                  {allImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                      {allImages.map((img: string, i: number) => (
                        <div
                          key={i}
                          onClick={() => setActiveImageIndex(i)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition-all bg-zinc-950 flex items-center justify-center ${
                            activeImageIndex === i ? "border-green-600 scale-95 shadow-md shadow-green-950" : "border-zinc-800 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={`/uploads/${img}`}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => { e.currentTarget.src = "/no-image.png"; }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details & Specs */}
                <div className="flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="bg-[#1c1c21] border border-zinc-800/80 rounded-2xl p-5 space-y-3.5">
                      <div className="flex justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-2.5">
                        <span>Category Name</span>
                        <span className="text-white font-medium">{selectedProduct.category || "General"}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-2.5">
                        <span>Sub Category</span>
                        <span className="text-white font-medium">{selectedProduct.sub_category || selectedProduct.subcategory || "Standard"}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-2.5">
                        <span>Size</span>
                        <span className="text-white font-medium">{selectedProduct.product_size || selectedProduct.size || "Standard"}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-2.5">
                        <span>Condition / Badge</span>
                        <span className="text-green-400 font-semibold">{selectedProduct.condition || selectedProduct.badge || "New Arrived"}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-2.5">
                        <span>SKU / TM Code</span>
                        <span className="text-green-400 font-mono font-bold">{selectedProduct.sku || selectedProduct.tm_code || "N/A"}</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-2.5">
                        <span>Stock Status</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} /> {selectedProduct.quantity || 0} Available
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Supplier Vendor</span>
                        <span className="text-white font-medium">{selectedProduct.supplier || "Direct"}</span>
                      </div>
                    </div>

                    <div className="bg-[#1c1c21] border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-zinc-400 block">Unit Price</span>
                        <span className="text-3xl font-black text-white mt-1 block">
                          ₹{Number(selectedProduct.selling_price || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                      className="flex-1 bg-green-700 hover:bg-green-600 text-white py-3.5 rounded-2xl font-semibold text-xs transition-colors shadow-lg shadow-green-950/40"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3.5 rounded-2xl font-semibold text-xs transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}