export default function StatusBadge({ status }: any) {

  const styles: any = {
    "In Transit": "bg-blue-500/20 text-blue-400",
    Delivered: "bg-green-500/20 text-green-400",
    Pending: "bg-yellow-500/20 text-yellow-400",
    Delayed: "bg-red-500/20 text-red-400"
  }

  return (

    <span className={`px-3 py-1 rounded-md text-xs ${styles[status]}`}>
      {status}
    </span>

  )
}