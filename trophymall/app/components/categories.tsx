// "use client"

// import { motion } from "framer-motion"

// const categories = [
// "Corporate Awards",
// "Sports Trophies",
// "Crystal Awards",
// "Custom Medals",
// "Wooden Plaques",
// "Acrylic Awards"
// ]

// export default function Categories(){

// return(
// <section className="px-10 py-20 bg-[#F4F1E8] text-black">

// <h2 className="text-3xl font-bold text-center mb-12">
// Explore Our Categories
// </h2>

// <div className="grid md:grid-cols-3 gap-8">

// {categories.map((cat,i)=>(
// <motion.div
// key={i}
// whileHover={{scale:1.05}}
// className="bg-white p-8 rounded-xl shadow"
// >
// <h3 className="text-xl font-semibold">{cat}</h3>
// <p className="text-gray-600 mt-2">
// Premium trophies and awards crafted for excellence.
// </p>
// </motion.div>
// ))}

// </div>

// </section>
// )
// }