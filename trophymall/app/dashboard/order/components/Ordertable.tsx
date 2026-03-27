import StatusBadge from "./Statusbadge";

export default function OrdersTable({ orders }: any) {

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden">

      <table className="w-full text-sm">

        <thead className="border-b border-zinc-700">
          <tr className="text-left">
            <th className="p-4">Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Location</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>

          {orders.map((order: any) => (
            <tr key={order.id} className="border-b border-zinc-800 text-white">

              <td className="p-4 font-semibold">{order.orderId}</td>
              <td className="text-white">{order.customer}</td>
              <td>{order.product}</td>
              <td>{order.quantity}</td>
              <td>₹{order.amount}</td>

              <td>
                <StatusBadge status={order.status} />
              </td>

              <td>{order.location}</td>

              <td>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}