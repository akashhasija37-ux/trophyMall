"use client";

import { MessageCircle, Package, Truck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: MessageCircle,
    title: "SEND AN INQUIRY",
    desc: "Send us a message regarding your desired item to ensure complete information.",
  },
  {
    icon: Package,
    title: "PLACEMENT OF ORDERS",
    desc: "After confirming delivery and order information, we immediately process the order.",
  },
  {
    icon: Truck,
    title: "SHIPPING",
    desc: "Once picked up by courier we provide a tracking number for your order.",
  },
];

export default function OrderProcess() {
  return (
    <section className="bg-[#F4F1E8] py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* title */}

        <h2 className="text-center text-3xl font-bold mb-20 tracking-wide text-black">
          3 STEP ORDER PROCESS
        </h2>

        {/* steps */}

        <div className="relative grid md:grid-cols-3 gap-16 text-center">
          {/* connection line */}

          <div className="hidden md:block absolute top-14 left-0 w-full h-[2px] bg-gray-300" />

          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* icon */}

                <div className="flex justify-center mb-6">
                  <div className="relative w-24 h-24 rounded-full bg-black flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                    <Icon size={34} className="text-white" />

                    {/* number bubble */}

                    <span className="absolute -top-2 -right-2 bg-white border text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full shadow text-black">
                      {i + 1}
                    </span>
                  </div>
                </div>

                {/* title */}

                <h3 className="text-lg font-semibold tracking-wide">
                  {step.title}
                </h3>

                {/* desc */}

                <p className="text-gray-600 text-sm mt-4 max-w-[250px] mx-auto leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* bottom text */}

        {/* <p className="text-center mt-20 font-semibold tracking-widest text-sm">
CASH ON DELIVERY AVAILABLE
</p> */}
      </div>
    </section>
  );
}
