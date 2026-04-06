"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Plus,
  MapPin,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export default function Topbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const dropdownRef = useRef<any>(null);

  // 🔥 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // ✅ Clear localStorage
    localStorage.removeItem("user");

    // ✅ Clear auth cookie
    document.cookie = "auth=; path=/; max-age=0";

    // ✅ Redirect to login
    window.location.href = "/login";
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-black flex items-center justify-between px-6">
      {/* SEARCH */}
      <div className="flex items-center bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg w-[420px]">
        <Search size={16} className="text-gray-400" />
        <input
          placeholder="Search orders, customers, products..."
          className="bg-transparent outline-none text-white ml-2 w-full text-sm"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* QUICK ADD */}
        <button className="flex items-center gap-2 bg-green-700 px-4 py-2 rounded-lg text-white text-sm">
          <Plus size={16} />
          Quick Add
        </button>

        {/* BRANCH */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-sm text-white">
          <MapPin size={16} />
          Mumbai HQ
        </div>

        {/* NOTIFICATION */}
        <button className="relative p-2 text-gray-400 hover:text-white">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* PROFILE */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setOpenProfile(!openProfile)}
          >
            <div className="w-9 h-9 bg-green-700 flex items-center justify-center rounded-full text-sm font-semibold">
              AK
            </div>

            <div className="text-sm">
              <p className="text-white leading-none">Admin User</p>
              <p className="text-gray-400 text-xs">Super Admin</p>
            </div>

            <ChevronDown size={16} className="text-gray-400" />
          </div>

          {/* 🔥 DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg overflow-hidden z-50">
              {/* HEADER */}
              <div className="px-4 py-3 border-b border-zinc-800">
                <p className="text-white text-sm font-semibold">Admin User</p>
                <p className="text-gray-400 text-xs">admin@trophymall.com</p>
              </div>

              {/* MENU */}
              <div className="flex flex-col text-sm">
                <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 text-gray-300">
                  <User size={16} /> My Profile
                </button>

                <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 text-gray-300">
                  <Settings size={16} /> Settings
                </button>

                <div className="border-t border-zinc-800" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-400"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
