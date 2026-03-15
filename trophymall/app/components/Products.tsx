"use client"

import Image from "next/image"

export default function Products(){

const products = [
{
name:"Soccer",
desc:"Champion Awards",
image:"/creation/12.png"
},
{
name:"Cricket",
desc:"Champion Awards",
image:"/creation/6.png"
}
]

return(

<section className="bg-[#F4F1E8] py-15">

<div className="max-w-7xl mx-auto px-6">

{/* section title */}

<p className="text-center text-3xl font-bold mb-20 tracking-wide text-black">
OUR LATEST CREATION
</p>

{/* products */}

<div className="grid md:grid-cols-2 gap-16">

{products.map((p,i)=>(

<div key={i} className="text-center group cursor-pointer">

{/* image container */}

<div className="bg-white p-8 rounded-sm shadow-sm">

<Image
src={p.image}
width={800}
height={600}
alt={p.name}
className="mx-auto transition duration-500 group-hover:scale-105"
/>

</div>

{/* caption */}

<div className="mt-3 bg-white ">

<h3 className="text-sm font-semibold tracking-wide text-black">
{p.name}
</h3>

<p className="text-xs text-gray-500 mt-1">
{p.desc}
</p>

</div>

</div>

))}

</div>

</div>

</section>

)

}