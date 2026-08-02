"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
  Layers2,
  Box,
  Tag,
  Hash,
  Users2,
  BadgeDollarSignIcon,
  RefreshCcw,
  Book,
  Paperclip,
  BookSearch,
  DollarSign,
  Building,
  CheckLine,
  BookDashed,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  UserCircle,
  ShoppingCartIcon,
  PanelLeftClose,
  PanelLeftOpen,
  CircleDollarSignIcon,
  BarChart2,
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
    name: "Masters",
    icon: Database,
    permission: "invoices",
    children: [
      {
        name: "Account Group",
        path: "/dashboard/masters/account-group",
        icon: BarChart,
      },
      {
        name: "Account Master",
        path: "/dashboard/masters/account-master",
        icon: Database,
      },
      {
        name: "Customer Master",
        path: "/dashboard/masters/customer-master",
        icon: UserCircle,
      },
      {
        name: "Supplier Master",
        path: "/dashboard/masters/supplier-master",
        icon: ShoppingCart,
      },
      {
        name: "Product Group",
        path: "/dashboard/masters/product-group",
        icon: Layers2,
      },
      {
        name: "Product Master",
        path: "/dashboard/masters/product-master",
        icon: Box,
      },
      {
        name: "Product Category",
        path: "/dashboard/masters/product-category",
        icon: Tag,
      },
      {
        name: "Unit Master",
        path: "/dashboard/masters/unit-master",
        icon: Hash,
      },
      {
        name: "HSN Master",
        path: "/dashboard/masters/hsn-master",
        icon: Hash,
      },
      {
        name: "TM Code Master",
        path: "/dashboard/masters/tm-master",
        icon: Tag,
      },
      {
        name: "Series Master",
        path: "/dashboard/masters/series-master",
        icon: Database,
      },
      {
        name: "Prefix Master",
        path: "/dashboard/masters/prefix-master",
        icon: Database,
      },
      {
        name: "Salesman Master",
        path: "/dashboard/masters/salesman-master",
        icon: Users2,
      },
      {
        name: "Barcode Printing",
        path: "/dashboard/masters/barcode-printing",
        icon: Printer,
      },
    ],
  },
  {
    name: "Transactions",
    icon: BadgeDollarSignIcon,
    permission: "invoices",
    children: [
      {
        name: "Purchase Voucher",
        path: "/dashboard/transactions/purchase-voucher",
        icon: ShoppingCartIcon,
      },
      {
        name: "Purchase Return",
        path: "/dashboard/transactions/purchase-return",
        icon: RefreshCcw,
      },
      {
        name: "Quotation",
        path: "/dashboard/transactions/quotation",
        icon: Book,
      },
      {
        name: "Perfoma Invoice",
        path: "/dashboard/transactions/perfoma-invoice",
        icon: Paperclip,
      },
      {
        name: "Delivery Challan",
        path: "/dashboard/transactions/delivery-challan",
        icon: Layers2,
      },
      {
        name: "Jounral Entry",
        path: "/dashboard/transactions/jounral-entry",
        icon: BookSearch,
      },
      {
        name: "Cash Reciept",
        path: "/dashboard/transactions/cash-reciept",
        icon: DollarSign,
      },
      {
        name: "Bank Reciept",
        path: "/dashboard/transactions/bank-receipt",
        icon: Building,
      },
    ],
  },
  {
    name: "Reports",
    icon: BarChart2,
    permission: "invoices",
    children: [
      {
        name: "Sales Register",
        path: "/dashboard/reports/sales-register",
        icon: CircleDollarSignIcon
      },
      {
        name: "Purchase Register",
        path: "/dashboard/reports/purchase-register",
        icon: CheckLine,
      },
      {
        name: "Quotation Register",
        path: "/dashboard/reports/quotation-register",
        icon: Book,
      },
      {
        name: "Reciept Register",
        path: "/dashboard/reports/reciept-register",
        icon: BadgeDollarSignIcon,
      },
      {
        name: "Bank Register",
        path: "/dashboard/reports/bank-register",
        icon: Building,
      },
    ],
  },
  {
    name: "Ledger",
    icon: BookDashed,
    permission: "invoices",
    children: [
      {
        name: "Account Wise Ledger",
        path: "/dashboard/ledger/account-ledger",
        icon: BarChart,
      },
      {
        name: "Customer Wise Ledger",
        path: "/dashboard/ledger/customer-ledger",
        icon: Users2,
      },
      {
        name: "Suppiler Wise Ledger",
        path: "/dashboard/ledger/supplier-ledger",
        icon: ShoppingBag,
      },
      {
        name: "Bank Reconcilliation",
        path: "/dashboard/ledger/reconcliation",
        icon: RefreshCcw,
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
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Automatically open the parent menu if a child path matches the current URL
  useEffect(() => {
    menu.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => pathname === child.path
        );
        if (hasActiveChild) {
          setOpenMenus((prev) =>
            prev.includes(item.name) ? prev : [...prev, item.name]
          );
        }
      }
    });
  }, [pathname]);

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((m) => m !== menuName)
        : [...prev, menuName]
    );
  };

  return (
    <aside
      className={`bg-black border-r border-zinc-800 min-h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* LOGO & COLLAPSE TOGGLE */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        {!isCollapsed && (
          <img
            src="/logo/logo.png"
            width="93px"
            style={{ margin: "0 auto" }}
            alt="Logo"
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-900 transition mx-auto"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {menu
          .filter((item) => {
            if (item.adminOnly && !isAdmin()) return false;
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
                    onClick={() => {
                      if (isCollapsed) setIsCollapsed(false); // auto-expand sidebar on click if collapsed
                      toggleMenu(item.name);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm text-white hover:bg-zinc-900 transition ${
                      isCollapsed ? "justify-center" : ""
                    }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="shrink-0" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>

                    {!isCollapsed &&
                      (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                  </button>

                  {isOpen && !isCollapsed && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-zinc-800 pl-2">
                      {item.children.map((child, idx) => {
                        const ChildIcon = child.icon;
                        const childActive = pathname === child.path;

                        return (
                          <Link
                            key={idx}
                            href={child.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition ${
                              childActive
                                ? "bg-green-700 text-white font-medium"
                                : "text-gray-400 hover:bg-zinc-900 hover:text-white"
                            }`}
                          >
                            <ChildIcon size={14} className="shrink-0" />
                            <span>{child.name}</span>
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
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition ${
                  active
                    ? "bg-green-700 text-white font-medium"
                    : "text-gray-400 hover:bg-zinc-900 hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}