"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
{
name:"Navnit Motors",
role:"Retail Partner",
text:"Outstanding trophy craftsmanship. The quality exceeded our expectations and delivery was very fast."
},
{
name:"Tata Motors",
role:"Corporate Client",
text:"Perfect trophies for our annual awards. Premium finishing and excellent customer service."
},
{
name:"PUBG India Series",
role:"Event Organizer",
text:"Amazing custom trophies designed exactly as we imagined. Highly recommended."
},
{
name:"Reliance Retail",
role:"Marketing Team",
text:"We ordered bulk corporate awards and every piece was flawless."
},
{
name:"Infosys",
role:"HR Department",
text:"Professional service and beautiful crystal awards. Our employees loved them."
},
{
name:"HDFC Bank",
role:"Corporate Events",
text:"Customization options are amazing. The engraving quality is top notch."
},
{
name:"ICICI Bank",
role:"Recognition Program",
text:"Best trophy supplier we have worked with so far."
},
{
name:"Wipro",
role:"Corporate Relations",
text:"Premium acrylic awards delivered on time with perfect packaging."
},
{
name:"JLR India",
role:"Dealer Awards",
text:"The design team understood our requirement perfectly and delivered stunning trophies."
},
{
name:"Byju's",
role:"Team Recognition",
text:"Fantastic service and elegant trophies. Will definitely order again."
}
]

export default function Testimonials(){

const [index,setIndex] = useState(0)

const prev = () => {
setIndex((prev)=> prev === 0 ? testimonials.length-1 : prev-1)
}

const next = () => {
setIndex((prev)=> prev === testimonials.length-1 ? 0 : prev+1)
}

/* auto slider */
useEffect(()=>{
const timer = setInterval(()=>{
setIndex((prev)=> prev === testimonials.length-1 ? 0 : prev+1)
},1000)

return ()=>clearInterval(timer)
},[])

const current = testimonials[index]

return(

<section className="relative py-28 px-6 bg-[#1e2235] text-white overflow-hidden">

<div className="max-w-6xl mx-auto text-center">

{/* heading */}

<h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
What Our Clients Say About Us
</h2>

<p className="text-gray-400 max-w-xl mx-auto mb-16">
Trusted by leading brands and organizations across India for premium trophies and awards.
</p>

{/* testimonial card */}

<div className="max-w-xl mx-auto bg-[#2a2f45] rounded-xl p-10 shadow-xl transition">

{/* stars */}

<div className="flex justify-center gap-1 mb-6">
{[...Array(5)].map((_,i)=>(
<Star key={i} size={18} className="text-yellow-400 fill-yellow-400"/>
))}
</div>

{/* review */}

<p className="text-gray-300 leading-relaxed mb-8">
{current.text}
</p>

{/* user */}

<h4 className="font-semibold text-lg">
{current.name}
</h4>

<p className="text-sm text-gray-400">
{current.role}
</p>

</div>

{/* navigation */}

<div className="flex justify-center mt-12 gap-4">

<button
onClick={prev}
className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2a2f45] hover:bg-purple-500 transition"
>
<ChevronLeft/>
</button>

<button
onClick={next}
className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-orange-400"
>
<ChevronRight/>
</button>

</div>

</div>

</section>
)
}