"use client"

import {
Search,
Bell,
Plus,
MapPin
} from "lucide-react"



export default function Topbar(){

return(

<header className="h-16 border-b border-zinc-800 bg-black flex items-center justify-between px-6">

{/* SEARCH */}

<div className="flex items-center bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg w-[420px]">

<Search size={16} className="text-gray-400"/>

<input
placeholder="Search orders, customers, products..."
className="bg-transparent outline-none text-white ml-2 w-full text-sm"
/>

</div>



{/* RIGHT SIDE */}

<div className="flex items-center gap-4">

{/* QUICK ADD */}

<button className="flex items-center gap-2 bg-green-700 px-4 py-2 rounded-lg text-white text-sm">

<Plus size={16}/>
Quick Add

</button>



{/* BRANCH */}

<div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg text-sm text-white">

<MapPin size={16}/>
Mumbai HQ

</div>



{/* NOTIFICATION */}

<button className="relative p-2 text-gray-400 hover:text-white">

<Bell size={18}/>

<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>

</button>



{/* USER */}

<div className="flex items-center gap-3">

<div className="w-9 h-9 bg-green-700 flex items-center justify-center rounded-full text-sm font-semibold">

AK

</div>

<div className="text-sm">

<p className="text-white leading-none">
Admin User
</p>

<p className="text-gray-400 text-xs">
Super Admin
</p>

</div>

</div>

</div>

</header>

)

}