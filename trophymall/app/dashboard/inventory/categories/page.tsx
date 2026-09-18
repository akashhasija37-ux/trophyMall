"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Trash2, Layers, X, Search, Check } from "lucide-react";
import { message, Modal } from "antd";

type SubCategory = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
  subCategories: SubCategory[];
  materials: string[];
  sportsTags: string[];
  itemCount: number;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);

  // Form states
  const [newCategoryName, setNewCategoryName] = useState("");
  
  // Searchable Sub-category dropdown states
  const [subCatSearchQuery, setSubCatSearchQuery] = useState("");
  const [isSubCatDropdownOpen, setIsSubCatDropdownOpen] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [predefinedSubCategories] = useState<string[]>([
    "Gold Medals",
    "Silver Medals",
    "Crystal Trophies",
    "Wooden Shields",
    "Acrylic Plaques",
    "Fiber Cups",
    "Metal Cups",
    "Badges & Pins",
    "Certificate Frames",
  ]);

  const [materialList] = useState<string[]>(["Glass", "Fibre", "Metal", "Wood", "Crystal", "Acrylic"]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(["Glass", "Metal"]);

  const [sportList] = useState<string[]>(["Cricket", "Football", "Badminton", "Tennis", "Basketball", "Chess"]);
  const [selectedSports, setSelectedSports] = useState<string[]>(["Cricket", "Football"]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newSubCategoryName, setNewSubCategoryName] = useState("");

  // Fetch inventory to group categories dynamically
  useEffect(() => {
    fetchCategoriesFromInventory();
  }, []);

  const fetchCategoriesFromInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Group items by category
        const categoryMap: { [key: string]: any } = {};

        data.forEach((item) => {
          const catName = (item.category || "General").trim();
          if (!categoryMap[catName]) {
            categoryMap[catName] = {
              id: catName,
              name: catName,
              subCategories: new Set<string>(),
              materials: new Set<string>(),
              sportsTags: new Set<string>(),
              itemCount: 0,
            };
          }
          categoryMap[catName].itemCount += 1;
          if (item.sub_category || item.subcategory) {
            categoryMap[catName].subCategories.add(item.sub_category || item.subcategory);
          }
          if (item.supplier) {
            categoryMap[catName].materials.add(item.supplier);
          }
        });

        const formattedCategories: Category[] = Object.values(categoryMap).map((cat, idx) => ({
          id: String(idx + 1),
          name: cat.name,
          subCategories: Array.from(cat.subCategories).map((s: any, sIdx) => ({ id: `s-${idx}-${sIdx}`, name: s })),
          materials: cat.materials.size > 0 ? Array.from(cat.materials) as string[] : ["Metal", "Wood", "Glass"],
          sportsTags: ["Cricket", "Football", "General"],
          itemCount: cat.itemCount,
        }));

        setCategories(formattedCategories);
      }
    } catch (err) {
      console.error("Failed to fetch inventory categories", err);
      message.error("Failed to load category mapping");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSubCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPredefinedSubCats = predefinedSubCategories.filter((sc) =>
    sc.toLowerCase().includes(subCatSearchQuery.toLowerCase())
  );

  const handleSelectSubCategory = (subName: string) => {
    if (!selectedSubCategories.includes(subName)) {
      setSelectedSubCategories((prev) => [...prev, subName]);
    }
    setSubCatSearchQuery("");
    setIsSubCatDropdownOpen(false);
  };

  const handleCreateNewSubCategoryFromSearch = (typedName: string) => {
    if (!typedName.trim()) return;
    if (!selectedSubCategories.includes(typedName.trim())) {
      setSelectedSubCategories((prev) => [...prev, typedName.trim()]);
    }
    setSubCatSearchQuery("");
    setIsSubCatDropdownOpen(false);
    message.success(`New sub-category "${typedName.trim()}" added to mapping!`);
  };

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      message.error("Category name is required");
      return;
    }

    const newCat: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      subCategories: selectedSubCategories.map((s, idx) => ({ id: `${Date.now()}-${idx}`, name: s })),
      materials: [...selectedMaterials],
      sportsTags: [...selectedSports],
      itemCount: 0,
    };

    setCategories((prev) => [...prev, newCat]);
    message.success("Category successfully created!");
    
    setNewCategoryName("");
    setSelectedSubCategories([]);
    setIsCategoryModalOpen(false);
  };

  const handleAddSubCategoryToExisting = () => {
    if (!selectedCategoryId || !newSubCategoryName.trim()) {
      message.error("Please select a category and enter sub-category name");
      return;
    }

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === selectedCategoryId) {
          return {
            ...cat,
            subCategories: [
              ...cat.subCategories,
              { id: Date.now().toString(), name: newSubCategoryName.trim() },
            ],
          };
        }
        return cat;
      })
    );

    message.success("Sub-category added successfully");
    setNewSubCategoryName("");
    setIsSubCategoryModalOpen(false);
  };

  const deleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    message.success("Category removed");
  };

  const deleteSubCategory = (catId: string, subId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            subCategories: cat.subCategories.filter((s) => s.id !== subId),
          };
        }
        return cat;
      })
    );
    message.success("Sub-category unmapped");
  };

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar relative">
          
          {/* HEADER */}
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/60">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Inventory / <span className="text-zinc-300">Category & Mapping Matrix</span>
              </p>
              <h1 className="text-xl font-bold text-white">Advanced Category Structure (Fetched from Database)</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm"
              >
                <Plus size={16} /> Create Category Mapping
              </button>
            </div>
          </div>

          <div className="p-6 max-w-[1600px] mx-auto flex flex-col space-y-6">
            
            {loading ? (
              <div className="py-20 text-center text-zinc-500">Fetching categories from inventory database...</div>
            ) : categories.length === 0 ? (
              <div className="py-20 text-center text-zinc-500">No categories found in inventory.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
                    
                    <div>
                      {/* TITLE & DELETE */}
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-green-950/80 border border-green-800/60 flex items-center justify-center text-green-400">
                            <Layers size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-bold text-base">{cat.name}</h3>
                              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-mono">{cat.itemCount} Items</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Database Mapped</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* SUB-CATEGORIES SECTION */}
                      <div className="space-y-2 mb-4">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Falling Sub-Categories</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subCategories.length === 0 ? (
                            <span className="text-zinc-600 text-xs italic">No sub-categories assigned</span>
                          ) : (
                            cat.subCategories.map((sub) => (
                              <div
                                key={sub.id}
                                className="bg-[#18181c] border border-zinc-800 text-zinc-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-2"
                              >
                                <span>{sub.name}</span>
                                <X
                                  size={12}
                                  className="cursor-pointer text-zinc-500 hover:text-red-400 transition-colors"
                                  onClick={() => deleteSubCategory(cat.id, sub.id)}
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* MATERIAL TAGS */}
                      <div className="space-y-2 mb-4">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Material Tags</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.materials.map((mat, i) => (
                            <span key={i} className="bg-blue-950/40 border border-blue-900/60 text-blue-300 text-[11px] px-2.5 py-1 rounded-lg font-mono">
                              {mat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* GAME / SPORT TAGS */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Sports Tags</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.sportsTags.map((sport, i) => (
                            <span key={i} className="bg-purple-950/40 border border-purple-900/60 text-purple-300 text-[11px] px-2.5 py-1 rounded-lg font-medium">
                              🏆 {sport}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    <button
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setIsSubCategoryModalOpen(true);
                      }}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus size={14} /> Add Sub-Category under {cat.name}
                    </button>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* CREATE CATEGORY MODAL */}
      <Modal
        title={<span className="text-white font-bold text-base">Create Category Mapping Structure</span>}
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        footer={null}
        width={700}
        className="dark-modal"
      >
        <div className="space-y-5 pt-3 text-gray-300">
          <div>
            <label className="text-xs text-zinc-400 block mb-1.5 font-semibold">1. Main Category Name *</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Trophies, Medals, Cups"
              className="w-full bg-[#18181c] border border-zinc-700/80 focus:border-green-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button onClick={() => setIsCategoryModalOpen(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors">Cancel</button>
            <button onClick={handleCreateCategory} className="bg-green-700 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-green-950/50 transition-colors">Save Category Mapping</button>
          </div>
        </div>
      </Modal>

      {/* ADD SUB-CATEGORY MODAL */}
      <Modal
        title={<span className="text-white font-bold">Add Sub-Category</span>}
        open={isSubCategoryModalOpen}
        onCancel={() => setIsSubCategoryModalOpen(false)}
        footer={null}
        className="dark-modal"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs text-gray-400 block mb-1 font-semibold">Select Parent Category *</label>
            <select
              value={selectedCategoryId || ""}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-[#18181c] border border-zinc-700 rounded-xl px-3.5 py-3 text-xs text-white outline-none cursor-pointer"
            >
              <option value="" disabled>Choose category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1 font-semibold">Sub-Category Name *</label>
            <input
              type="text"
              value={newSubCategoryName}
              onChange={(e) => setNewSubCategoryName(e.target.value)}
              placeholder="e.g. Fiber Trophy"
              className="w-full bg-[#18181c] border border-zinc-700 rounded-xl px-3.5 py-3 text-xs text-white outline-none focus:border-green-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button onClick={() => setIsSubCategoryModalOpen(false)} className="bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold">Cancel</button>
            <button onClick={handleAddSubCategoryToExisting} className="bg-green-700 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold">Save Sub-Category</button>
          </div>
        </div>
      </Modal>

    </div>
  );
}