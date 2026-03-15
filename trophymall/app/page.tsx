"use client"

import { motion } from "framer-motion"

export default function FranchisePage(){

return(

<div className="bg-black text-white overflow-hidden">

{/* HERO */}

<section className="px-10 py-36 text-center bg-gradient-to-b from-black to-zinc-900">

<h1 className="text-6xl font-bold mb-6 leading-tight">
Own a <span className="text-amber-400">TrophyMall</span><br/>
Franchise
</h1>

<p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
Join India's premium trophy and awards brand. Build a profitable business
with manufacturing, marketing and design support from TrophyMall.
</p>

<div className="flex justify-center gap-6">

<button className="bg-amber-400 text-black px-8 py-4 rounded-lg font-semibold hover:scale-105 transition">
Apply Now
</button>

<button className="border border-white px-8 py-4 rounded-lg hover:bg-white hover:text-black transition">
Download Brochure
</button>

</div>

</section>


{/* BUSINESS STATS */}

<section className="px-10 py-24 bg-zinc-900">

<div className="grid md:grid-cols-4 gap-10 text-center">

<div>
<h3 className="text-4xl font-bold text-amber-400">10K+</h3>
<p className="text-gray-400">Products Sold</p>
</div>

<div>
<h3 className="text-4xl font-bold text-amber-400">500+</h3>
<p className="text-gray-400">Corporate Clients</p>
</div>

<div>
<h3 className="text-4xl font-bold text-amber-400">50+</h3>
<p className="text-gray-400">Cities Served</p>
</div>

<div>
<h3 className="text-4xl font-bold text-amber-400">10+</h3>
<p className="text-gray-400">Years Experience</p>
</div>

</div>

</section>


{/* WHY TROPHYMALL */}

<section className="px-10 py-28">

<h2 className="text-4xl font-bold text-center mb-20">
Why TrophyMall Franchise
</h2>

<div className="grid md:grid-cols-3 gap-10">

<motion.div whileHover={{y:-10}} className="bg-zinc-900 p-10 rounded-xl">
<h3 className="text-xl font-semibold mb-4">
High Demand Market
</h3>
<p className="text-gray-400">
Corporate awards, sports events, schools and colleges require trophies
throughout the year creating strong demand.
</p>
</motion.div>

<motion.div whileHover={{y:-10}} className="bg-zinc-900 p-10 rounded-xl">
<h3 className="text-xl font-semibold mb-4">
Premium Product Range
</h3>
<p className="text-gray-400">
Crystal, acrylic, wooden, fiber trophies and customized corporate awards.
</p>
</motion.div>

<motion.div whileHover={{y:-10}} className="bg-zinc-900 p-10 rounded-xl">
<h3 className="text-xl font-semibold mb-4">
Centralized Manufacturing
</h3>
<p className="text-gray-400">
TrophyMall manages production and design while franchise partners focus
on growing local markets.
</p>
</motion.div>

</div>

</section>


{/* INVESTMENT */}

<section className="px-10 py-28 bg-zinc-900">

<h2 className="text-4xl font-bold text-center mb-20">
Investment Details
</h2>

<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

<div className="bg-black p-10 rounded-xl text-center border border-zinc-700">
<h3 className="text-xl mb-4">Investment</h3>
<p className="text-3xl text-amber-400 font-semibold">₹5L – ₹10L</p>
</div>

<div className="bg-black p-10 rounded-xl text-center border border-zinc-700">
<h3 className="text-xl mb-4">Space Required</h3>
<p className="text-3xl text-amber-400 font-semibold">200–500 sqft</p>
</div>

<div className="bg-black p-10 rounded-xl text-center border border-zinc-700">
<h3 className="text-xl mb-4">ROI</h3>
<p className="text-3xl text-amber-400 font-semibold">12–18 Months</p>
</div>

</div>

</section>


{/* PROCESS */}

<section className="px-10 py-28">

<h2 className="text-4xl font-bold text-center mb-20">
Franchise Process
</h2>

<div className="grid md:grid-cols-4 gap-10 text-center">

<div>
<h3 className="text-5xl text-amber-400 mb-4">1</h3>
<p>Submit Application</p>
</div>

<div>
<h3 className="text-5xl text-amber-400 mb-4">2</h3>
<p>Initial Discussion</p>
</div>

<div>
<h3 className="text-5xl text-amber-400 mb-4">3</h3>
<p>Agreement & Approval</p>
</div>

<div>
<h3 className="text-5xl text-amber-400 mb-4">4</h3>
<p>Launch Franchise</p>
</div>

</div>

</section>


{/* FORM */}

<section className="px-10 py-28 bg-zinc-900">

<h2 className="text-4xl font-bold text-center mb-14">
Apply For Franchise
</h2>

<form className="max-w-3xl mx-auto grid gap-6">

<input
className="p-4 rounded-lg bg-black border border-zinc-700"
placeholder="Full Name"
/>

<input
className="p-4 rounded-lg bg-black border border-zinc-700"
placeholder="Phone Number"
/>

<input
className="p-4 rounded-lg bg-black border border-zinc-700"
placeholder="City"
/>

<textarea
className="p-4 rounded-lg bg-black border border-zinc-700"
placeholder="Message"
/>

<button className="bg-amber-400 text-black py-4 rounded-lg font-semibold hover:scale-105 transition">
Submit Application
</button>

</form>

</section>

</div>

)
}