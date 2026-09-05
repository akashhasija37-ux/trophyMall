"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Search, X, CheckCircle2, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowLeft, Layers, Grid, AlertCircle, ChevronDown } from "lucide-react";

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  
  // Navigation State
  const [viewMode, setViewMode] = useState<"categories" | "subcategories" | "products">("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  // Filters & Sorting state matching Myntra UI layout
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  
  const [sortBy, setSortBy] = useState("Recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 200, max: 1100 });
  
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

  const categoryList = Array.from(new Set(products.map((p) => p.category || "General").filter(Boolean))).map((cat) => {
    const catProducts = products.filter((p) => (p.category || "General") === cat);
    return {
      name: cat,
      count: catProducts.length,
      image: catProducts[0]?.featured_image || null,
    };
  });

  const subCategoryList = selectedCategory 
    ? Array.from(new Set(products.filter((p) => (p.category || "General") === selectedCategory).map((p) => p.sub_category || p.subcategory || p.subCategory || "Standard").filter(Boolean))).map((sub) => {
        const subProducts = products.filter((p) => (p.category || "General") === selectedCategory && ((p.sub_category || p.subcategory || p.subCategory || "Standard") === sub));
        return {
          name: sub,
          count: subProducts.length,
          image: subProducts[0]?.featured_image || null,
        };
      })
    : [];

  const availableBrands = Array.from(new Set(products.map((p) => p.supplier || p.brand || "AMRIT TOP WEAR").filter(Boolean)));
  const availableColors = [
    { name: "Blue", hex: "#0070f3" },
    { name: "Peach", hex: "#ffdab9" },
    { name: "Beige", hex: "#f5f5dc" },
    { name: "Yellow", hex: "#facc15" },
    { name: "Maroon", hex: "#800000" },
    { name: "White", hex: "#ffffff" },
    { name: "Turquoise Blue", hex: "#06b6d4" },
  ];
  
  const discountOptions = [50, 60, 70, 80];

  const toggleBrandFilter = (brandName: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
    setPage(1);
  };

  const toggleColorFilter = (colorName: string) => {
    setSelectedColors(prev => 
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
    setPage(1);
  };

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

  const filteredProducts = products.filter((p) => {
    const price = Number(p.selling_price || 0);
    const matchesPrice = price >= priceRange.min && price <= priceRange.max;
    
    const query = search.toLowerCase().trim();
    const productName = (p.name || "").toLowerCase();
    const matchesSearch = !query || productName.includes(query);
    
    const itemBrand = p.supplier || p.brand || "AMRIT TOP WEAR";
    const itemDisc = Number(p.discount || 0);

    const matchesCategoryCard = !selectedCategory || (p.category || "General") === selectedCategory;
    const matchesSubCategoryCard = !selectedSubCategory || (p.sub_category || p.subcategory || "Standard") === selectedSubCategory;

    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(itemBrand);
    const matchesDiscount = itemDisc >= minDiscount;

    return matchesPrice && matchesSearch && matchesCategoryCard && matchesSubCategoryCard && matchesBrand && matchesDiscount;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.selling_price || 0);
    const priceB = Number(b.selling_price || 0);
    if (sortBy === "Price: Low to High") return priceA - priceB;
    if (sortBy === "Price: High to Low") return priceB - priceA;
    if (sortBy === "What's New") return (b.id || 0) > (a.id || 0) ? 1 : -1;
    return 0; // "Recommended" default
  });

  const totalPages = Math.ceil(sortedProducts.length / pageSize) || 1;
  const paginated = sortedProducts.slice((page - 1) * pageSize, page * pageSize);

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

        <div className="flex-1 overflow-y-auto custom-scrollbar flex">
          
          {/* ================= EXACT MYNTRA-STYLE LEFT SIDEBAR FILTERS ================= */}
          <aside className="w-72 border-r border-zinc-800 bg-[#0A0A0A] p-6 flex flex-col gap-6 shrink-0 hidden lg:flex overflow-y-auto custom-scrollbar">
            
            {/* Header & Clear All */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-black tracking-widest text-white uppercase">
                FILTERS
              </span>
              <button 
                onClick={() => { 
                  setSelectedBrands([]);
                  setSelectedColors([]);
                  setMinDiscount(0);
                  setPriceRange({ min: 200, max: 1100 });
                  setSearch("");
                  setPage(1);
                }}
                className="text-[11px] text-red-400 hover:text-red-300 font-bold tracking-wider transition-colors uppercase"
              >
                CLEAR ALL
              </button>
            </div>

            {/* BRAND SECTION */}
            <div className="flex flex-col gap-3 pb-5 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest text-white uppercase">BRAND</span>
              </div>
              <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {availableBrands.map((brand: string) => {
                  const isChecked = selectedBrands.includes(brand);
                  const count = products.filter(p => (p.supplier || p.brand || "AMRIT TOP WEAR") === brand).length;
                  return (
                    <label key={brand} className="flex items-center justify-between text-xs text-zinc-300 hover:text-white cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => { toggleBrandFilter(brand); setViewMode("products"); }}
                          className="w-4 h-4 rounded bg-[#141416] border-zinc-700 text-green-600 focus:ring-0 cursor-pointer accent-green-600"
                        />
                        <span className="group-hover:translate-x-0.5 transition-transform text-zinc-200">{brand}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* PRICE SECTION (Slider style range) */}
            <div className="flex flex-col gap-3 pb-5 border-b border-zinc-800">
              <span className="text-[11px] font-black tracking-widest text-white uppercase">PRICE</span>
              
              {/* Custom Pink Bar Range representation matching screenshot */}
              <div className="relative flex items-center pt-2">
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 w-3/4 rounded-full" />
                </div>
                <div className="absolute left-1/4 w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-white shadow cursor-pointer" />
                <div className="absolute right-1 w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-white shadow cursor-pointer" />
              </div>

              <div className="flex justify-between items-center text-xs font-bold text-white mt-1">
                <span>₹{priceRange.min} - ₹{priceRange.max}+</span>
              </div>
            </div>

            {/* COLOR SECTION WITH SEARCH ICON */}
            <div className="flex flex-col gap-3 pb-5 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest text-white uppercase">COLOR</span>
                <Search size={14} className="text-zinc-400 cursor-pointer hover:text-white" />
              </div>
              <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {availableColors.map((col) => {
                  const isChecked = selectedColors.includes(col.name);
                  return (
                    <label key={col.name} className="flex items-center justify-between text-xs text-zinc-300 hover:text-white cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => { toggleColorFilter(col.name); setViewMode("products"); }}
                          className="w-4 h-4 rounded bg-[#141416] border-zinc-700 text-green-600 focus:ring-0 cursor-pointer accent-green-600"
                        />
                        <div className="w-3 h-3 rounded-full border border-zinc-700 shrink-0" style={{ backgroundColor: col.hex }} />
                        <span className="group-hover:translate-x-0.5 transition-transform text-zinc-200">{col.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">(12)</span>
                    </label>
                  );
                })}
                <span className="text-xs text-pink-500 font-semibold cursor-pointer pt-1 hover:underline">+ 15 more</span>
              </div>
            </div>

            {/* DISCOUNT RANGE RADIO BUTTONS */}
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-black tracking-widest text-white uppercase">DISCOUNT RANGE</span>
              <div className="flex flex-col gap-2.5">
                {discountOptions.map((disc) => (
                  <label key={disc} className="flex items-center gap-3 text-xs text-zinc-300 hover:text-white cursor-pointer group">
                    <input 
                      type="radio"
                      name="discountRange"
                      checked={minDiscount === disc}
                      onChange={() => { setMinDiscount(disc); setPage(1); setViewMode("products"); }}
                      className="w-4 h-4 bg-[#141416] border-zinc-700 text-green-600 focus:ring-0 cursor-pointer accent-green-600"
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform text-zinc-200">{disc}% and above</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* ================= RIGHT MAIN CONTENT AREA ================= */}
          <main className="flex-1 p-8 lg:p-12 flex flex-col gap-8 max-w-[1400px]">
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="flex items-center gap-3">
                  {viewMode !== "categories" && (
                    <button
                      onClick={() => {
                        if (viewMode === "products" && selectedCategory && subCategoryList.length > 0) {
                          setViewMode("subcategories");
                          setSelectedSubCategory(null);
                        } else {
                          setViewMode("categories");
                          setSelectedCategory(null);
                          setSelectedSubCategory(null);
                        }
                      }}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
                      title="Go Back"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-white capitalize">
                      {viewMode === "categories" && "Product Categories"}
                      {viewMode === "subcategories" && `${selectedCategory} Sub-Categories`}
                      {viewMode === "products" && (selectedSubCategory || selectedCategory || "All Products")}
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">
                      {viewMode === "categories" && `Select a category to explore sub-categories and items`}
                      {viewMode === "subcategories" && `Select a sub-category or view items`}
                      {viewMode === "products" && `Showing ${sortedProducts.length} matching inventory items`}
                    </p>
                  </div>
                </div>
                
                {/* SORT BY DROPDOWN MATCHING REFERENCE SCREENSHOT */}
                <div className="flex items-center gap-3">
                  {viewMode === "products" && (
                    <div className="relative">
                      <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 bg-[#121215] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-medium hover:border-zinc-700 transition-all cursor-pointer"
                      >
                        <span>Sort by : <strong className="text-green-400">{sortBy}</strong></span>
                        <ChevronDown size={14} className="text-zinc-400" />
                      </button>

                      {isSortOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-[#16161a] border border-zinc-800 rounded-2xl shadow-2xl z-50 py-2">
                          {[
                            "Recommended",
                            "What's New",
                            "Popularity",
                            "Better Discount",
                            "Price: High to Low",
                            "Price: Low to High",
                            "Customer Rating",
                          ].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                                sortBy === opt ? "text-green-400 font-bold bg-zinc-900" : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

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
            </div>

            {/* ================= VIEW 1: CATEGORY CARDS ================= */}
            {viewMode === "categories" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {categoryList.map((cat, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      const hasSub = products.some(p => p.category === cat.name && (p.sub_category || p.subcategory || p.subCategory));
                      if (hasSub) {
                        setViewMode("subcategories");
                      } else {
                        setSelectedSubCategory(null);
                        setViewMode("products");
                      }
                      setPage(1);
                    }}
                    className="group relative bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:border-zinc-600 hover:shadow-2xl overflow-hidden h-64"
                  >
                    {cat.image && (
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity overflow-hidden">
                        <img src={`/uploads/${cat.image}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/80 to-transparent" />
                      </div>
                    )}

                    <div className="relative z-10 flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-green-500 group-hover:bg-green-700 group-hover:text-white transition-colors">
                        <Layers size={22} />
                      </div>
                      <span className="text-xs font-semibold text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800">
                        {cat.count} Items
                      </span>
                    </div>

                    <div className="relative z-10 mt-auto">
                      <h3 className="text-white text-lg font-bold group-hover:text-green-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                        Explore Sub-categories & Products <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ================= VIEW 2: SUB-CATEGORY CARDS ================= */}
            {viewMode === "subcategories" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                <div
                  onClick={() => {
                    setSelectedSubCategory(null);
                    setViewMode("products");
                    setPage(1);
                  }}
                  className="group relative bg-[#121215] border border-green-700/50 rounded-2xl p-6 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:bg-zinc-900 overflow-hidden h-52"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-green-950 border border-green-800 flex items-center justify-center text-green-400">
                      <Grid size={18} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white text-base font-bold">All {selectedCategory}</h3>
                    <p className="text-xs text-green-400 mt-1">View all items directly in this category</p>
                  </div>
                </div>

                {subCategoryList.map((sub, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedSubCategory(sub.name);
                      setViewMode("products");
                      setPage(1);
                    }}
                    className="group relative bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:border-zinc-600 hover:shadow-2xl overflow-hidden h-52"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-800 transition-colors">
                        <Grid size={18} />
                      </div>
                      <span className="text-xs font-semibold text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                        {sub.count} Items
                      </span>
                    </div>

                    <div>
                      <h3 className="text-white text-base font-bold group-hover:text-green-400 transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">Browse products</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ================= VIEW 3: PRODUCT CATALOG GRID ================= */}
            {viewMode === "products" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
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
                          <div className="flex items-center justify-between z-10 mb-2">
                            <span className="bg-green-950/80 border border-green-800/60 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                              {conditionBadge}
                            </span>
                            {getStockBadge(stockQty)}
                          </div>

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

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-12 border-t border-zinc-800/60 mt-4">
                    <span className="text-xs text-zinc-500">
                      Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span> ({sortedProducts.length} total items)
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
              </>
            )}

          </main>

        </div>
      </div>

      {/* ================= CART & CHECKOUT SLIDER DRAWER ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#121215] border-l border-zinc-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
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

      {/* ================= PRODUCT DETAILS PREVIEW MODAL ================= */}
      {selectedProduct && (() => {
        const gallery = getGalleryImages(selectedProduct);
        const allImages = [selectedProduct.featured_image, ...gallery].filter(Boolean);
        const currentImage = allImages[activeImageIndex] || selectedProduct.featured_image;

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-[#161618] border border-zinc-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
              
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

              <div className="p-8 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4">
                  <div className="w-full h-80 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={`/uploads/${currentImage}`}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-125 cursor-zoom-in"
                      onError={(e) => { e.currentTarget.src = "/no-image.png"; }}
                    />
                  </div>

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