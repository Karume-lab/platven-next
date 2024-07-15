import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platven Limited Dashboard",
  description: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen">
      <Header />
      <div className="h-full w-full flex ">
        <Sidebar />
        <main className="w-full flex flex-col pt-16 h-full overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
}
