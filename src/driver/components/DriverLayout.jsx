import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import DriverHeader from "./DriverHeader";
import DriverSidebar from "./DriverSidebar";
import DriverMobileNav from "./DriverMobileNav";

import useDriverSocket from "../hooks/useDriverSocket";
import useDriverDeliveryOffersSocket from "../hooks/useDriverDeliveryOffersSocket";

function DriverLayout() {
  useDriverSocket();
  useDriverDeliveryOffersSocket();
  
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    setSidebarOpen(false);

    if (typeof logout === "function") {
      await logout();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DriverSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DriverHeader user={user} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1">
          <Outlet />
        </main>

        <DriverMobileNav />
      </div>
    </div>
  );
}

export default DriverLayout;
