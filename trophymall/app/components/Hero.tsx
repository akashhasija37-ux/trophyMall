"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-[#0f0f0f] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Premium Trophies <br />& Custom Awards
          </h1>

          <p className="mt-6 text-gray-400 text-lg max-w-xl">
            Celebrate achievements with beautifully crafted trophies, medals and
            corporate awards designed to inspire success.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
              Explore Products
            </button>

            <button className="border border-gray-500 px-6 py-3 rounded-lg hover:bg-white hover:text-black transition">
              Custom Quote
            </button>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <Image
            src="/hero/hero-trophy.png"
            alt="Premium Trophy"
            width={500}
            height={600}
            priority
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
