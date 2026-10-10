import React from "react";
import {
  LuLayoutDashboard,
  LuPackage,
  LuClock3,
  LuUserRound,
  LuLogOut,
  LuX,
  LuBike,
  LuCircleDot,
} from "react-icons/lu";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    to: "/driver",
    icon: LuLayoutDashboard,
    end: true,
  },
  {
    label: "Delivery Offers",
    to: "/driver/offers",
    icon: LuPackage,
  },
  {
    label: "Current Delivery",
    to: "/driver/current",
    icon: LuBike,
  },
  {
    label: "Active Deliveries",
    to: "/driver/active",
    icon: LuPackage,
  },
  {
    label: "Delivery History",
    to: "/driver/history",
    icon: LuClock3,
  },
  {
    label: "Account",
    to: "/driver/account",
    icon: LuUserRound,
  },
];

function DriverSidebar({
  isOpen = false,
  onClose,
  onLogout,
}) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-dark-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col",
          "border-r border-dark-100 bg-white",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:sticky lg:top-0 lg:h-screen lg:z-30 lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-dark-100 px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-primary-500 shadow-sm">
              <span className="relative z-10 font-heading text-lg font-bold text-white">
                R
              </span>

              {/* <div className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -left-3 h-10 w-10 rounded-full bg-black/10" /> */}
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold tracking-tight text-dark-900">
                Resvill
              </h2>

              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-dark-400">
                Driver Portal
              </p>
            </div>
          </div>

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
              Delivery Operations
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
                          "absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full",
                          "transition-opacity duration-200",
                          isActive
                            ? "bg-primary-500 opacity-100"
                            : "opacity-0",
                        ].join(" ")}
                      />

                      {/* Icon container */}
                      <span
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          "transition-all duration-200",
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

        {/* Driver workspace */}
        <div className="shrink-0 border-t border-dark-100 p-4">
          <div className="mb-3 overflow-hidden rounded-2xl border border-dark-100 bg-dark-50 p-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-500">
                Driver Workspace
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-dark-800">
                  Delivery Active
                </p>

                <p className="mt-0.5 text-xs text-dark-400">
                  Resvill operations
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-success shadow-sm">
                <LuCircleDot className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3.5 py-3 text-sm font-semibold text-dark-500 transition-all duration-200 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors group-hover:bg-white">
              <LuLogOut className="h-[18px] w-[18px]" />
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default DriverSidebar;