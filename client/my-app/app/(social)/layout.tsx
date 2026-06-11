import React from "react";

import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import ButtonNavbar from "@/components/ButtonNavbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen md:max-w-7xl mx-auto px-0 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* LEFT SIDEBAR */}
        <aside className="hidden md:block md:col-span-3 border-r h-screen sticky top-0 px-6">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="w-full md:col-span-6 min-h-screen md:px-8 md:pt-6">
          {children}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden md:block md:col-span-3 border-l h-screen sticky top-0 px-6">
          <RightSidebar />
        </aside>
        <ButtonNavbar />
      </div>
    </div>
  );
};

export default Layout;
