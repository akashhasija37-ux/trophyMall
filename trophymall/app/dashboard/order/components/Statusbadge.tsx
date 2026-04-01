export default function StatusBadge({ status }: { status: string }) {

  const styles: any = {
    Processing: "bg-blue-600/20 text-blue-400",
    Confirmed: "bg-orange-600/20 text-orange-400",
    Pending: "bg-yellow-600/20 text-yellow-400",
    Shipped: "bg-purple-600/20 text-purple-400",
    Cancelled: "bg-red-600/20 text-red-400",
    Delivered:"bg-green-600/20 text-green-400",
  }

  return (
    <span
      className={`px-3 py-1 rounded-md text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  )
}