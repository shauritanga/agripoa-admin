import type { Metadata } from "next";

import { Sidebar } from "../components/Sidebar";

export const metadata: Metadata = {
  title: "Avocado Cooperative",
  description: "Management system for avocado farmers cooperative",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto ml-2">{children}</main>
    </div>
  );
}
