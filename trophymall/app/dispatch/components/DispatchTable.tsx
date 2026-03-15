import StatusBadge from "./StatusBadge"
import { Send, Eye } from "lucide-react"

export default function DispatchTable({ data }: any) {

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

          {data.map((item: any) => (

            <tr
              key={item.dispatchId}
              className="border-t border-zinc-800 hover:bg-zinc-800/50"
            >

              <td className="p-4 text-blue-400 font-semibold">
                {item.dispatchId}
              </td>

              <td className="text-white">
                {item.orderId}
              </td>

              <td className="text-white">
                {item.customer}
                <div className="text-xs text-gray-400">
                  {item.items}
                </div>
              </td>

              <td className="text-white">
                {item.destination}
              </td>

              <td className="text-white">
                {item.courier}
              </td>

              <td className="text-white">
                {item.tracking}
              </td>

              <td>
                <StatusBadge status={item.status} />
              </td>

              <td className="text-white">
                {item.delivery}
              </td>

              <td className="text-right pr-6 text-gray-400 flex ">
                <Eye /> <Send className="ml-3"/>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}