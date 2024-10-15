"use client";

import {
  ShoppingBagIcon,
  UsersIcon,
  ChartPieIcon,
  BanknotesIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { SproutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
  { name: "Farmers", href: "/dashboard/farmers", icon: UsersIcon },
  // { name: "Sales", href: "/dashboard/sales", icon: TagIcon },
  { name: "Sales", href: "/dashboard/sales", icon: ShoppingBagIcon },
  { name: "Bank Report", href: "/dashboard/reports", icon: BanknotesIcon },
  { name: "Reports", href: "", icon: ChartPieIcon },
  { name: "Farms", href: "/dashboard/farms", icon: SproutIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-orange-100 hover:text-orange-600 md:flex-none md:justify-start md:p-2 md:px-3",
              { "bg-orange-100": pathname === link.href }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
