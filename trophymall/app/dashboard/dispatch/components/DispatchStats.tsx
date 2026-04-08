import { Package, Truck, CheckCircle, AlertTriangle } from "lucide-react";

export default function DispatchStats({ data = [] }: any) {

  // ✅ SAFE COUNTS
  const total = data.length;

  const inTransit = data.filter(
    (d: any) => d.delivery_status === "In Transit"
  ).length;

  const delivered = data.filter(
    (d: any) => d.delivery_status === "Delivered"
  ).length;

  const delayed = data.filter(
    (d: any) =>
      d.delivery_status === "Delayed" ||
      d.delivery_status === "Failed"
  ).length;

  return (
    <div className="grid grid-cols-4 gap-6">

      <Card
        icon={<Package className="text-blue-400" />}
        title="Total Dispatches"
        value={total}
        subtitle="This month"
      />

      <Card
        icon={<Truck className="text-purple-400" />}
        title="In Transit"
        value={inTransit}
        subtitle="Currently moving"
      />

      <Card
        icon={<CheckCircle className="text-green-400" />}
        title="Delivered"
        value={delivered}
        subtitle="Successfully delivered"
      />

      <Card
        icon={<AlertTriangle className="text-red-400" />}
        title="Delayed"
        value={delayed}
        subtitle="Needs attention"
      />

    </div>
  );
}

function Card({ icon, title, value, subtitle }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-start gap-4">
      <div className="bg-zinc-800 p-3 rounded-lg">
        {icon}
      </div>

      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-3xl font-bold text-white">{value}</h2>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}