import React, { useState } from "react";
import { LuBell, LuMenu, LuRadio } from "react-icons/lu";
import useDriverSocketStatus from "../hooks/useDriverSocketStatus";
import useDriverNotifications from "../hooks/useDriverNotifications";

import DriverNotificationDropdown from "./DriverNotificationDropdown";

function DriverHeader({ user, onMenuClick }) {
  const { isConnected, isConnecting } = useDriverSocketStatus();

  const { notifications = [] } = useDriverNotifications();

  const unreadCount = notifications.filter(
    (notification) => !notification?.isRead,
  ).length;

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const firstName =
    user?.firstname ||
    user?.firstName ||
    user?.name?.split(" ")?.[0] ||
    "Driver";

  const socketLabel = isConnected
    ? "Live"
    : isConnecting
      ? "Connecting"
      : "Offline";

  const socketStyles = isConnected
    ? {
        wrapper: "border-success/20 bg-success/50",
        dot: "bg-success",
        text: "text-success",
      }
    : isConnecting
      ? {
          wrapper: "border-warning/20 bg-warning/5",
          dot: "bg-warning",
          text: "text-warning",
        }
      : {
          wrapper: "border-dark-100 bg-dark-50",
          dot: "bg-dark-400",
          text: "text-dark-500",
        };

  return (
    <header className="sticky top-0 z-30 border-b border-dark-100 bg-white/95 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark-100 bg-white text-dark-600 shadow-sm transition-all duration-200 hover:bg-dark-50 hover:text-dark-900 lg:hidden"
            aria-label="Open navigation"
          >
            <LuMenu className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-dark-400">
                Driver Operations
              </p>
            </div>

            <h1 className="mt-1 font-heading text-lg font-bold tracking-tight text-dark-900 sm:text-xl">
              Welcome back, {firstName}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Socket status */}
          <div
            className={[
              "flex items-center gap-2 rounded-xl border px-3 py-2",
              "transition-colors duration-200",
              socketStyles.wrapper,
            ].join(" ")}
          >
            <span className="relative flex h-2.5 w-2.5">
              {isConnected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-40" />
              )}

              <span
                className={[
                  "relative inline-flex h-2.5 w-2.5 rounded-full",
                  socketStyles.dot,
                ].join(" ")}
              />
            </span>

            <span
              className={[
                "hidden text-xs font-bold sm:inline",
                socketStyles.text,
              ].join(" ")}
            >
              {socketLabel}
            </span>

            <LuRadio
              className={["h-3.5 w-3.5 sm:hidden", socketStyles.text].join(" ")}
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((current) => !current)}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-dark-100 bg-white text-dark-500 shadow-sm transition-all duration-200 hover:border-dark-200 hover:bg-dark-50 hover:text-dark-900"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <LuBell className="h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-105" />

              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <DriverNotificationDropdown
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default DriverHeader;
