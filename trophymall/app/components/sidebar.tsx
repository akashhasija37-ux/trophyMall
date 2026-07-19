"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  ShoppingCartIcon,
   ChevronDown,
  ChevronRight,
} from "lucide-react";
import { isAdmin, hasPermission } from "@/utils/auth";
import path from "path";

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
    permission: "invoices",
    children: [
      {
        name: "Dashboard",
        path: "/dashboard/billing",
        icon: LayoutDashboard,
      },
      {
        name: "Sales Voucher",
        path: "/dashboard/create-invoice",
        icon: FileText,
      },
      {
        name: "Quotations",
        path: "/dashboard/billing/quotation",
        icon: FileText,
      },
      {
        name: "Proforma Invoice",
        path: "/dashboard/billing/proforma",
        icon: FileText,
      },
      {
        name: "Delivery Challan",
        path: "/dashboard/billing/challan",
        icon: Truck,
      },
      {
        name: "Booked Orders",
        path: "/dashboard/billing/booked-orders",
        icon: ShoppingCart,
      },
      {
        name: "Sale Return",
        path: "/dashboard/billing/sale-return",
        icon: ShoppingCart,
      },
      {
        name: "Purchase Voucher",
        path: "/dashboard/billing/purchase-voucher",
        icon: FileText,
      },
      {
        name: "Purchase Return",
        path: "/dashboard/billing/purchase-return",
        icon: FileText,
      },
      {
        name: "Journal Entry",
        path: "/dashboard/billing/journal-entry",
        icon: FileText,
      },
      {
        name: "Cash Receipt",
        path: "/dashboard/billing/cash-receipt",
        icon: FileText,
      },
      {
        name: "Bank Receipt",
        path: "/dashboard/billing/bank-receipt",
        icon: FileText,
      },
      {
        name: "Cash Payment",
        path: "/dashboard/billing/cash-payment",
        icon: FileText,
      },
      {
        name: "Bank Payment",
        path: "/dashboard/billing/bank-payment",
        icon: FileText,
      },
      {
        name: "Sale Register",
        path: "/dashboard/billing/sale-register",
        icon: ChartBar,
      },
      {
        name: "Purchase Register",
        path: "/dashboard/billing/purchase-register",
        icon: ChartBar,
      },
    ],
  },

  {
    name: "Stock & Inventory",
    icon: Boxes,
    path: "/dashboard/inventory",
    permission: "inventory",
  },

  {
    name: "Catalog",
    icon: ShoppingCartIcon,
    path: "/dashboard/catalog",
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

  const [openMenus, setOpenMenus] = useState<string[]>([
  "Billing Management",
]);

const toggleMenu = (menuName: string) => {
  setOpenMenus((prev) =>
    prev.includes(menuName)
      ? prev.filter((m) => m !== menuName)
      : [...prev, menuName]
  );
};

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

  // ------------------------
  // Parent with children
  // ------------------------

  if (item.children) {
    const isOpen = openMenus.includes(item.name);

    return (
      <div key={i}>
        <button
          onClick={() => toggleMenu(item.name)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm text-white hover:bg-zinc-900 transition"
        >
          <div className="flex items-center gap-3">
            <Icon size={18} />
            {item.name}
          </div>

          {isOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        {isOpen && (
          <div className="ml-6 mt-2 space-y-1">
            {item.children.map((child, idx) => {
              const ChildIcon = child.icon;
              const childActive =
                pathname === child.path;

              return (
                <Link
                  key={idx}
                  href={child.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                  ${
                    childActive
                      ? "bg-green-700 text-white"
                      : "text-gray-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <ChildIcon size={16} />
                  {child.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ------------------------
  // Normal menu item
  // ------------------------

  const active = pathname === item.path;

  return (
    <Link
      key={i}
      href={item.path!}
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
