"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  LineChart,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Farmers",
    icon: Users,
    href: "/dashboard/farmers",
  },
  {
    title: "Sales",
    icon: Wallet,
    href: "/dashboard/sales",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/dashboard/reports",
  },
  {
    title: "Analytics",
    icon: LineChart,
    href: "/dashboard/analytics",
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-gray-100/40 duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!isCollapsed && <span className="font-bold">Uwamambo</span>}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-8 left-0 right-0 flex">
          <nav className="flex flex-col gap-2 p-2 w-full">
            {/* <Link href="/dashboard/settings"> */}
            <Button
              variant={
                pathname === "/dashboard/settings" ? "secondary" : "ghost"
              }
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center"
              )}
            >
              <div
                className={cn(
                  "h-4 w-4 flex items-center gap-2",
                  !isCollapsed && "mr-2"
                )}
              >
                <UserButton />
                {!isCollapsed && <span> Settings</span>}
              </div>
            </Button>
            {/* </Link> */}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}
