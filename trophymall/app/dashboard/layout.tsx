"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAdmin } from "@/utils/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const adminOnlyRoutes = [
      "/dashboard",
      "/dashboard/branch",
      "/dashboard/customers",
      "/dashboard/hr",
      "/dashboard/marketing",
      "/dashboard/analytics",
    ];

    if (!isAdmin() && adminOnlyRoutes.includes(pathname)) {
      router.replace("/dashboard/leads");
    }
  }, [pathname]);

  return <>{children}</>;
}