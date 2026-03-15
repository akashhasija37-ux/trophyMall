import { Eye, Pencil, Download, Send } from "lucide-react"

const invoices = [
  {
    id: "INV-2025-0891",
    customer: "Acme Corporation",
    branch: "Mumbai HQ",
    amount: "₹45,600",
    status: "Paid",
    date: "Feb 20, 2026",
    salesperson: "Rajesh Kumar"
  },
  {
    id: "INV-2025-0892",
    customer: "Tech Solutions Ltd",
    branch: "Delhi Branch",
    amount: "₹32,800",
    status: "Pending",
    date: "Feb 28, 2026",
    salesperson: "Priya Sharma"
  },
  {
    id: "INV-2025-0893",
    customer: "Global Enterprises",
    branch: "Bangalore Branch",
    amount: "₹78,900",
    status: "Overdue",
    date: "Feb 10, 2026",
    salesperson: "Amit Patel"
  }
]

export default function InvoiceTable() {

  const badge = {
    Paid: "bg-green-500/20 text-green-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Overdue: "bg-red-500/20 text-red-400"
  }

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h3 className="text-white font-semibold mb-6">
        All Invoices
      </h3>

      <table className="w-full">

        <thead className="text-gray-400 text-sm">

          <tr>

            <th className="text-left pb-3">Invoice ID</th>
            <th className="text-left">Customer</th>
            <th className="text-left">Branch</th>
            <th className="text-left">Amount</th>
            <th className="text-left">Status</th>
            <th className="text-left">Due Date</th>
            <th className="text-left">Salesperson</th>
            <th className="text-right">Actions</th>

          </tr>

        </thead>

        <tbody>

          {invoices.map((i, idx) => (

            <tr key={idx} className="border-t border-zinc-800">

              <td className="py-4 text-blue-400">{i.id}</td>
              <td className="text-white">{i.customer}</td>
              <td className="text-white">{i.branch}</td>
              <td className="text-white">{i.amount}</td>

              <td>
                <span className={`px-3 py-1 rounded text-xs ${badge[i.status]}`}>
                  {i.status}
                </span>
              </td>

              <td className="text-white">{i.date}</td>

              <td className="text-white">{i.salesperson}</td>

              <td className="flex justify-end gap-3 text-gray-400">

                <Eye size={18} />
                <Pencil size={18} />
                <Download size={18} />
                <Send size={18} />

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}