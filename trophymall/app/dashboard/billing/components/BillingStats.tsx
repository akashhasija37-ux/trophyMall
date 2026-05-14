import { DollarSign, FileText, AlertTriangle } from "lucide-react";

export default function BillingStats() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹8.4L",
      icon: DollarSign,
      color: "text-green-400",
      note: "+12.5%",
    },
    {
      title: "Outstanding Payments",
      value: "₹2.1L",
      icon: FileText,
      color: "text-yellow-400",
      note: "24 invoices",
    },
    {
      title: "Overdue Invoices",
      value: "12",
      icon: AlertTriangle,
      color: "text-red-400",
      note: "₹1.2L pending",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((s, i) => {
        const Icon = s.icon;

        return (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-start gap-4"
          >
            <div className="bg-zinc-800 p-3 rounded-lg">
              <Icon className={s.color} size={22} />
            </div>

            <div>
              <p className="text-gray-400 text-sm">{s.title}</p>
              <h2 className="text-3xl font-bold text-white">{s.value}</h2>
              <p className={`${s.color} text-sm`}>{s.note}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
