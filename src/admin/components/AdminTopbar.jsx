import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

function getFullName(user) {
  return (
    [user?.firstname, user?.lastname]
      .filter(Boolean)
      .join(" ")
      .trim() || "Admin"
  );
}

function getInitials(user) {
  return (
    [user?.firstname, user?.lastname]
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A"
  );
}

function AdminTopbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const adminName = getFullName(user);
  const adminInitials = getInitials(user);
  const adminEmail = user?.email || "No email available";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setOpen(false);

    try {
      await logout();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("Admin logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-dark-100 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Mobile menu */}
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-dark-600 transition hover:bg-dark-50 hover:text-dark-900 lg:hidden"
        aria-label="Open admin menu"
      >
        <Menu size={21} />
      </button>

      {/* Admin account */}
      <div ref={dropdownRef} className="relative ml-auto">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-dark-50"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 text-sm font-extrabold text-white shadow-sm">
            {adminInitials}
          </div>

          {/* Admin name */}
          <div className="hidden text-left sm:block">
            <p className="max-w-[180px] truncate text-xs font-bold text-dark-900">
              {adminName}
            </p>

            <p className="mt-0.5 text-[10px] font-medium capitalize text-dark-400">
              {user?.role || "Administrator"}
            </p>
          </div>

          <ChevronDown
            size={16}
            className={[
              "text-dark-400 transition-transform",
              open ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-0 top-[calc(100%+10px)] w-72 overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card"
            role="menu"
          >
            {/* Profile header */}
            <div className="border-b border-dark-100 bg-dark-50/70 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-sm font-extrabold text-white">
                  {adminInitials}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-dark-900">
                    {adminName}
                  </p>

                  <p className="mt-1 truncate text-xs text-dark-500">
                    {adminEmail}
                  </p>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <ShieldCheck
                      size={12}
                      className="text-success"
                    />

                    <span className="text-[10px] font-semibold capitalize text-dark-500">
                      {user?.role || "Administrator"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-2">
              <Link
                to="/admin/dashboard"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-primary-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark-50 text-dark-500 transition group-hover:bg-primary-100 group-hover:text-primary-600">
                  <LayoutDashboard size={17} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-dark-700">
                    Dashboard
                  </p>

                  <p className="mt-0.5 text-[10px] text-dark-400">
                    View admin dashboard
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/accounts"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-primary-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark-50 text-dark-500 transition group-hover:bg-primary-100 group-hover:text-primary-600">
                  <UserCog size={17} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-dark-700">
                    Admin Accounts
                  </p>

                  <p className="mt-0.5 text-[10px] text-dark-400">
                    Manage administrator accounts
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/settings"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-primary-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark-50 text-dark-500 transition group-hover:bg-primary-100 group-hover:text-primary-600">
                  <Settings size={17} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-dark-700">
                    Settings
                  </p>

                  <p className="mt-0.5 text-[10px] text-dark-400">
                    Manage your account settings
                  </p>
                </div>
              </Link>

              <div className="my-2 border-t border-dark-100" />

              {/* Sign out */}
              <button
                type="button"
                onClick={handleLogout}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-danger/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark-50 text-dark-500 transition group-hover:bg-danger/10 group-hover:text-danger">
                  <LogOut size={17} />
                </span>

                <div>
                  <p className="text-sm font-semibold text-dark-700 transition group-hover:text-danger">
                    Sign out
                  </p>

                  <p className="mt-0.5 text-[10px] text-dark-400">
                    End your admin session
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminTopbar;

