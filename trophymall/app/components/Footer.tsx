"use client"

import Image from "next/image"
import { Facebook, Instagram, Youtube, Phone } from "lucide-react"

export default function Footer(){

return(

<footer className="bg-black text-gray-400 px-10 pt-16 pb-6">

{/* Top Section */}

<div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

{/* Logo */}

<div>
<Image
src="/logo/logo.png"
alt="logo"
width={90}
height={90}
/>

<p className="mt-4 text-gray-400">
Premium trophies and awards manufacturer.
</p>
</div>


{/* Products */}

<div>
<h4 className="text-white font-semibold mb-4">
Products
</h4>

<ul className="space-y-2">

<li className="hover:text-white cursor-pointer">
Corporate Awards
</li>

<li className="hover:text-white cursor-pointer">
Sports Trophies
</li>

<li className="hover:text-white cursor-pointer">
Custom Medals
</li>

</ul>
</div>


{/* Company */}

<div>
<h4 className="text-white font-semibold mb-4">
Company
</h4>

<ul className="space-y-2">

<li className="hover:text-white cursor-pointer">
About
</li>

<li className="hover:text-white cursor-pointer">
Contact
</li>

<li className="hover:text-white cursor-pointer">
Blog
</li>

</ul>
</div>


{/* Contact */}

<div>

<h4 className="text-white font-semibold mb-4">
Contact
</h4>

<p>India</p>

<p className="mb-6">
+91 XXXXX XXXXX
</p>

{/* Social Icons */}

<h4 className="text-white font-semibold mb-3">
Connect With Us
</h4>

<div className="flex gap-4">

<a
href="#"
className="bg-zinc-900 p-3 rounded-full hover:bg-white hover:text-black transition"
>
<Facebook size={18}/>
</a>

<a
href="#"
className="bg-zinc-900 p-3 rounded-full hover:bg-white hover:text-black transition"
>
<Instagram size={18}/>
</a>

<a
href="#"
className="bg-zinc-900 p-3 rounded-full hover:bg-white hover:text-black transition"
>
<Youtube size={18}/>
</a>

<a
href="#"
className="bg-zinc-900 p-3 rounded-full hover:bg-white hover:text-black transition"
>
<Phone size={18}/>
</a>

</div>

</div>

</div>


{/* Divider */}

<div className="border-t border-zinc-800 mt-12 pt-6 text-center text-sm">

© {new Date().getFullYear()} TrophyMall. All rights reserved.

</div>

</footer>

)
}