import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-dark-50">
      <AdminSidebar />

      <div className="lg:pl-[272px]">
        <AdminTopbar />

        <main className="min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;