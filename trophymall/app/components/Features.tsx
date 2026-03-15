import { Award, Truck, Sparkles, Factory } from "lucide-react";

export default function Features() {
  const items = [
    { icon: <Award />, title: "Premium Materials" },
    { icon: <Truck />, title: "Fast Delivery" },
    { icon: <Sparkles />, title: "Custom Designs" },
    { icon: <Factory />, title: "In-house Manufacturing" },
  ];

  return (
    <section className="px-10 py-20 bg-[#F4F1E8] text-black">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>

      <div className="grid md:grid-cols-4 gap-8">
        {items.map((f, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-xl text-center flex gap-6"
          >
            <div className="mb-4">{f.icon}</div>
            <h3 className="font-semibold">{f.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
