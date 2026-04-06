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
import { isAdmin, hasPermission } from "@/utils/auth";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    adminOnly: true,
  },

  {
    name: "Leads Tracking",
    icon: Users,
    path: "/dashboard/leads",
    permission: "leads",
  },

  {
    name: "Website Orders",
    icon: ShoppingCart,
    path: "/dashboard/order",
    permission: "orders",
  },

  {
    name: "Dispatch Tracking",
    icon: Truck,
    path: "/dashboard/dispatch",
    permission: "dispatch",
  },

  {
    name: "Billing Management",
    icon: FileText,
    path: "/dashboard/billing",
    permission: "invoices", // ✅ IMPORTANT
  },

  {
    name: "Stock & Inventory",
    icon: Boxes,
    path: "/dashboard/inventory",
    permission: "inventory",
  },

  {
    name: "Printing Workflow",
    icon: Printer,
    path: "/dashboard/printing",
    permission: "printing",
  },

  {
    name: "Branch Management",
    icon: Building2,
    path: "/dashboard/branch",
    adminOnly: true,
  },

  {
    name: "Customer Database",
    icon: Database,
    path: "/dashboard/customers",
    adminOnly: true,
  },

  {
    name: "Hr Management",
    icon: Briefcase,
    path: "/dashboard/hr",
    adminOnly: true,
  },

  {
    name: "Marketing Automation",
    icon: Megaphone,
    path: "/dashboard/marketing",
    adminOnly: true,
  },

  {
    name: "Analytics",
    icon: BarChart,
    path: "/dashboard/analytics",
    adminOnly: true,
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
        {menu
          .filter((item) => {
            // 🔒 Admin-only
            if (item.adminOnly && !isAdmin()) return false;

            // ✅ Permission-based
            if (
              item.permission &&
              !hasPermission(item.permission) &&
              !isAdmin()
            ) {
              return false;
            }

            return true;
          })
          .map((item, i) => {
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
