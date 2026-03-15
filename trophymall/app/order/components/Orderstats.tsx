export default function OrderStats({ stats }: any) {
  return (
    <div className="grid grid-cols-4 gap-6">

      <Card title="Total Orders" value={stats.total} />
      <Card title="Processing" value={stats.processing} />
      <Card title="Shipped" value={stats.shipped} />
      <Card title="Revenue" value={`₹${stats.revenue}`} />

    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}