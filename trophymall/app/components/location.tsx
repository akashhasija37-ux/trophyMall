"use client"

import { MapPin } from "lucide-react"

export default function Location(){

return(

<section className="py-24 px-6 bg-[#F4F1E8]">

<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

{/* Left Side - Address */}

<div>

<h2 className="text-4xl font-bold mb-6 text-black">
Visit Our Store
</h2>

<p className="text-gray-600 mb-8">
Come explore our premium collection of trophies, medals and corporate awards.
Our team will help you customize the perfect award for your event.
</p>

<div className="flex items-start gap-4 bg-white p-6 rounded-xl shadow">

<MapPin className="text-black mt-1"/>

<div>

<h4 className="font-semibold text-lg">
Trophies & Awards Mall
</h4>

<p className="text-gray-600">
1st Floor, above Indian Bank  
<br/>
Near Criticare Hospital  
<br/>
Ulhasnagar, Maharashtra 421003
</p>

</div>

</div>

</div>


{/* Right Side - Map */}

<div className="w-full h-[420px] rounded-xl overflow-hidden shadow-lg">

<iframe
src="https://www.google.com/maps?q=Trophies%20%26%20Awards%20Mall%20Ulhasnagar&output=embed"
width="100%"
height="100%"
style={{border:0}}
loading="lazy"
/>

</div>

</div>

</section>

)
}