import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import StaffSidebar from "./StaffSidebar";
import StaffTopbar from "./StaffTopbar";
import StaffMobileNav from "./StaffMobileNav";
import { useStaffSocket } from "../hooks/useStaffSocket";

function StaffLayout() {
  useStaffSocket();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-50">
      <div className="flex min-h-screen">
        <StaffSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <StaffTopbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      <StaffMobileNav />
    </div>
  );
}

export default StaffLayout;
