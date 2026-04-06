"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

// 🔥 PERMISSION → ROUTE MAP
const permissionRouteMap: any = {
  leads: "/dashboard/leads",
  orders: "/dashboard/order",
  dispatch: "/dashboard/dispatch",
  invoices: "/dashboard/billing",
  inventory: "/dashboard/inventory",
  printing: "/dashboard/printing",
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const user = data.user;

      // ✅ STORE USER
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = "auth=true; path=/; max-age=86400";

      // 🔥 ROLE + PERMISSION BASED REDIRECT
      if (user.role === "Super Admin") {
        window.location.href = "/dashboard";
        return;
      }

      const permissions = user.permissions || [];

      // ❌ No permissions fallback
      if (!permissions.length) {
        window.location.href = "/unauthorized";
        return;
      }

      // ✅ Find first valid route
      let redirectPath = "/dashboard/leads"; // fallback

      for (let perm of permissions) {
        if (permissionRouteMap[perm]) {
          redirectPath = permissionRouteMap[perm];
          break;
        }
      }

      window.location.href = redirectPath;
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            <span>Trophy</span>
            <span className="text-amber-400">Mall</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Dashboard Login
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-zinc-700"
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-zinc-700"
            required
          />

          <div className="flex justify-between items-center text-sm text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-amber-400" />
              Remember me
            </label>

            <Link href="#" className="hover:text-amber-400">
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-amber-400 text-black py-3 rounded-lg font-semibold">
            Login
          </button>
        </form>

        <div className="text-center text-sm text-gray-400 mt-4">
          <Link href="/" className="hover:text-amber-400">
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}