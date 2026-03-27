"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "123456") {
      document.cookie = "auth=true; path=/; max-age=86400; SameSite=Lax";

      // ✅ FORCE middleware trigger
      window.location.href = "/dashboard";
    } else {
      alert("Invalid credentials");
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
          <p className="text-gray-400 text-sm mt-2">Dashboard Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-zinc-700"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-zinc-700"
          />

          <div className="flex justify-between items-center text-sm text-gray-400">
            {" "}
            <label className="flex items-center gap-2 cursor-pointer">
              {" "}
              <input type="checkbox" className="accent-amber-400" /> Remember
              me{" "}
            </label>{" "}
            <Link href="#" className="hover:text-amber-400">
              {" "}
              Forgot Password?{" "}
            </Link>{" "}
          </div>

          <button className="w-full bg-amber-400 text-black py-3 rounded-lg font-semibold">
            Login
          </button>
        </form>
        <div className="text-center text-sm text-gray-400 mt-4">
          {" "}
          <Link href="/" className="hover:text-amber-400">
            {" "}
            ← Back to Website{" "}
          </Link>{" "}
        </div>
      </div>
    </div>
  );
}
