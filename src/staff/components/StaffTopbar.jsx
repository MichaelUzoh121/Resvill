import React from "react";
import { LuMenu, LuLogOut, LuUserRound, LuChevronDown } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function StaffTopbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const firstname = user?.firstname || "Staff";
  const lastname = user?.lastname || "";
  const fullName = `${firstname} ${lastname}`.trim();

  const initials = `${firstname?.charAt(0) || "S"}${
    lastname?.charAt(0) || ""
  }`.toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Staff logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-dark-100 bg-white/95 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark-100 bg-white text-dark-600 shadow-sm transition-all duration-200 hover:border-dark-200 hover:bg-dark-50 hover:text-dark-900 lg:hidden"
          aria-label="Open staff navigation"
        >
          <LuMenu className="h-5 w-5" />
        </button>

        {/* Desktop page context */}
        <div className="hidden min-w-0 lg:block">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dark-400">
              Staff Operations
            </p>
          </div>

          <h1 className="mt-1 font-heading text-lg font-bold tracking-tight text-dark-900">
            Welcome back, {firstname}
          </h1>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Account information */}
          <div className="hidden items-center gap-3 rounded-2xl border border-dark-100 bg-dark-50/70 px-3 py-2 sm:flex">
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-xs font-bold text-white shadow-sm">
              {initials}
            </div>

            <div className="min-w-0 pr-1">
              <p className="max-w-[180px] truncate text-sm font-bold text-dark-900">
                {fullName}
              </p>

              <p className="max-w-[180px] truncate text-[11px] text-dark-500">
                {user?.email || "Staff account"}
              </p>
            </div>

            <LuChevronDown className="h-4 w-4 shrink-0 text-dark-400" />
          </div>

          {/* Mobile avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary-600 sm:hidden">
            {initials}
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-dark-100 bg-white text-dark-500 shadow-sm transition-all duration-200 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
            title="Sign out"
            aria-label="Sign out"
          >
            <LuLogOut className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Mobile context */}
      <div className="border-t border-dark-100 px-4 py-2.5 sm:px-6 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
            Staff Operations
          </p>
        </div>
      </div>
    </header>
  );
}

export default StaffTopbar;