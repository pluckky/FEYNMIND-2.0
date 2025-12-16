import React from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex flex-row">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-[#121212] h-screen">
        <DashboardHeader />
        <div className="p-8 bg-[#1a1a1a] overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
