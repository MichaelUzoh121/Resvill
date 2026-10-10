import React from "react";
import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuClipboardList,
  LuChefHat,
  LuTruck,
  LuBell,
  LuUserRound,
  LuX,
  LuCircleDot,
} from "react-icons/lu";

const navigation = [
  {
    label: "Dashboard",
    to: "/staff",
    icon: LuLayoutDashboard,
    end: true,
  },
  {
    label: "Orders",
    to: "/staff/orders",
    icon: LuClipboardList,
  },
  {
    label: "Kitchen",
    to: "/staff/kitchen",
    icon: LuChefHat,
  },
  {
    label: "Deliveries",
    to: "/staff/deliveries",
    icon: LuTruck,
  },
  {
    label: "Notifications",
    to: "/staff/notifications",
    icon: LuBell,
  },
  {
    label: "Account",
    to: "/staff/account",
    icon: LuUserRound,
  },
];

function StaffSidebar({ open = false, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close staff navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-dark-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col",
          "border-r border-dark-100 bg-white",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:top-0 lg:h-screen lg:z-30 lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-dark-100 px-5">
          <NavLink
            to="/staff"
            className="group flex items-center gap-3"
            onClick={onClose}
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 overflow-hidden rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
              <span className="relative z-10 font-heading text-lg font-bold text-white">
                R
              </span>

              {/* <div className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -left-3 h-10 w-10 rounded-full bg-black/10" /> */}
            </div>

            <div className="min-w-0">
              <span className="block font-heading text-xl font-bold tracking-tight text-dark-900">
                Resvill
              </span>

              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-dark-400">
                Staff Portal
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-dark-400 transition hover:bg-dark-50 hover:text-dark-900 lg:hidden"
            aria-label="Close navigation"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-4 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dark-400">
              Operations
            </p>

            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
          </div>

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "group relative flex items-center gap-3 rounded-xl px-3.5 py-3",
                      "text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-primary-50 text-primary-600"
                        : "text-dark-600 hover:bg-dark-50 hover:text-dark-900",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}
                      <span
                        className={[
                          "absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full transition-opacity",
                          isActive ? "bg-primary-500 opacity-100" : "opacity-0",
                        ].join(" ")}
                      />

                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all",
                          isActive
                            ? "bg-white text-primary-600 shadow-sm"
                            : "bg-transparent text-dark-400 group-hover:bg-white group-hover:text-dark-700",
                        ].join(" ")}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </span>

                      <span className="flex-1">{item.label}</span>

                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Workspace Status */}
        <div className="shrink-0 border-t border-dark-100 p-4">
          <div className="overflow-hidden rounded-2xl border border-dark-100 bg-dark-50 p-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>

              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-dark-500">
                Workspace Active
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-dark-800">
                  Staff Operations
                </p>

                <p className="mt-0.5 text-xs text-dark-400">
                  Resvill workspace
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-success shadow-sm">
                <LuCircleDot className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default StaffSidebar;
