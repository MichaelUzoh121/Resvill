import React from "react";
import {
  LuLayoutDashboard,
  LuPackage,
  LuClock3,
  LuUserRound,
  LuBike,
} from "react-icons/lu";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Home",
    to: "/driver",
    icon: LuLayoutDashboard,
    end: true,
  },
  {
    label: "Offers",
    to: "/driver/offers",
    icon: LuPackage,
  },
  {
    label: "Active",
    to: "/driver/active",
    icon: LuBike,
  },
  {
    label: "History",
    to: "/driver/history",
    icon: LuClock3,
  },
  {
    label: "Account",
    to: "/driver/account",
    icon: LuUserRound,
  },
];

function DriverMobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-dark-100 bg-white/95 px-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "group relative flex min-h-[68px] flex-col items-center justify-center gap-1.5 px-1 py-2.5",
                  "text-[10px] font-bold transition-all duration-200",
                  isActive
                    ? "text-primary-600"
                    : "text-dark-400 hover:text-dark-700",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  <span
                    className={[
                      "absolute left-1/2 top-0 h-0.5 w-7 -translate-x-1/2 rounded-b-full",
                      "transition-all duration-200",
                      isActive
                        ? "bg-primary-500 opacity-100"
                        : "bg-transparent opacity-0",
                    ].join(" ")}
                  />

                  {/* Icon */}
                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      "transition-all duration-200",
                      isActive
                        ? "bg-primary-50 text-primary-600"
                        : "bg-transparent text-dark-400 group-hover:bg-dark-50 group-hover:text-dark-700",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-[19px] w-[19px] transition-transform duration-200",
                        isActive
                          ? "scale-105"
                          : "group-hover:scale-105",
                      ].join(" ")}
                    />
                  </span>

                  {/* Label */}
                  <span className="leading-none">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default DriverMobileNav;