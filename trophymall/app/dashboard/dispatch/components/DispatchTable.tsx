import StatusBadge from "./StatusBadge";
import { Send, Eye } from "lucide-react";
import dayjs from "dayjs";
export default function DispatchTable({ data, onView, onSend }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="text-gray-400 text-sm">
          <tr className="text-left">
            <th className="p-4">Dispatch ID</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Destination</th>
            <th>Courier</th>
            <th>Tracking No</th>
            <th>Status</th>
            <th>Expected Delivery</th>
            <th className="text-right pr-6">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center text-gray-500 py-10">
                No dispatch records found 🚚
              </td>
            </tr>
          )}

          {data.map((item: any) => (
            <tr
              key={item.dispatchId}
              className="border-t border-zinc-800 hover:bg-zinc-800/50 transition"
            >
              {/* Dispatch ID */}
              <td className="p-4 text-blue-400 font-semibold cursor-pointer" onClick={() => onView?.(item)}>
                {item.dispatchId}
              </td>

              {/* Order ID */}
              <td className="text-white">{item.orderId}</td>

              {/* Customer */}
              <td className="text-white">
                {item.customer}
                <div className="text-xs text-gray-400">{item.items}</div>
              </td>

              {/* Destination */}
              <td className="text-white">{item.destination}</td>

              {/* Courier */}
              <td className="text-white">{item.courier}</td>

              {/* Tracking */}
              <td className="text-white">{item.tracking}</td>

              {/* Status */}
              <td>
                <StatusBadge status={item.status} />
              </td>

              {/* Delivery */}
              <td className="text-white">
                {item.delivery
                  ? dayjs(item.delivery).format("DD MMM YYYY, hh:mm A")
                  : "-"}
              </td>

              {/* ACTIONS */}
              <td className="pr-6">
                <div className="flex justify-end items-center gap-3 text-gray-400">
                  {/* VIEW */}
                  <button
                    onClick={() => onView?.(item)}
                    className="hover:text-white transition"
                    title="View Dispatch"
                  >
                    <Eye size={18} />
                  </button>

                  {/* SEND TRACKING */}
                  <button
                    onClick={() => onSend?.(item)}
                    className="hover:text-green-400 transition"
                    title="Send Tracking"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
