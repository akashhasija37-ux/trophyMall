"use client";

import Image from "next/image";

const categories = [
  {
    name: "CRYSTAL",
    image: "/categories/E2-1.webp",
  },
  {
    name: "WOODEN",
    image: "/categories/F1-1-1.webp",
  },
  {
    name: "ACRYLIC",
    image: "/categories/G1-5.webp",
  },
  {
    name: "FIBRE",
    image: "/categories/J1.webp",
  },
];

//const data =categories

export default function Categories() {
  return (
    <section className="bg-[#F4F1E8] py-24 px-10">
      <h2 className="text-4xl text-center font-semibold mb-16 text-black">
        Explore Our Categories
      </h2>

      <div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto">
        {categories.map((cat, i) => (
          <div key={i} className="text-center group cursor-pointer">
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
              <Image
                src={cat.image}
                width={300}
                height={300}
                alt={cat.name}
                className="mx-auto"
              />
            </div>

            <p className="mt-6 text-lg font-medium tracking-wide text-black">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
