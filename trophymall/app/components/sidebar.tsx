"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Truck,
  FileText,
  Boxes,
  Printer,
  Building2,
  Database,
  Megaphone,
  ChartBar,
  Briefcase,
  BarChart,
  BoxesIcon,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },

  {
    name: "Leads Tracking",
    icon: Users,
    path: "/dashboard/leads",
  },

//   {
//   name: "Products",
//   icon:BoxesIcon,
//   path: "/dashboard/products"
// },

  {
    name: "Website Orders",
    icon: ShoppingCart,
    path: "/dashboard/order",
  },

  {
    name: "Dispatch Tracking",
    icon: Truck,
    path: "/dashboard/dispatch",
  },

  {
    name: "Billing Management",
    icon: FileText,
    path: "/dashboard/billing",
  },

  {
    name: "Stock & Inventory",
    icon: Boxes,
    path: "/dashboard/inventory",
  },

  {
    name: "Printing Workflow",
    icon: Printer,
    path: "/dashboard/printing",
  },

  {
    name: "Branch Management",
    icon: Building2,
    path: "/dashboard/branch",
  },

  {
    name: "Customer Database",
    icon: Database,
    path: "/dashboard/customers",
  },

  {
    name: "Hr Management",
    icon: Briefcase,
    path: "/dashboard/hr",
  },

  {
    name: "Marketing Automation",
    icon: Megaphone,
    path: "/dashboard/marketing",
  },

  {
    name: "Analytics",
    icon: BarChart,
    path: "/dashboard/analytics",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black border-r border-zinc-800 min-h-screen flex flex-col">
      {/* LOGO */}

      <div className="p-6 border-b border-zinc-800">
        {/* 
<h1 className="text-white font-bold text-lg">
TrophyMall
</h1>

 */}

        <img src="/logo/logo.png" width="93px" style={{ margin: "0 auto" }} />
        {/* <p className="text-xs text-gray-200 ">
ERP System
</p> */}
      </div>

      {/* MENU */}

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menu.map((item, i) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={i}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
${
  active
    ? "bg-green-700 text-white"
    : "text-gray-400 hover:bg-zinc-900 hover:text-white"
}`}
            >
              <Icon size={18} />

              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
