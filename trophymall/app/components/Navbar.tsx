"use client"

import { motion } from "framer-motion"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="flex justify-between items-center px-10 py-6 bg-[#1C1C1C]"
      style={{height:'105px'}}
    >
     <img src="/logo/logo.png" alt="logo" width="90px" height="70px" />

      <div className="flex gap-8 text-sm">
        <a href="#">Home</a>
        <a href="#">Products</a>
        <a href="#">Corporate</a>
        <a href="#">Sports</a>
        <a href="#">Contact</a>
      </div>

      <button className="bg-white text-black px-5 py-2 rounded-lg">
        Get Quote
      </button>
    </motion.nav>
  )
}