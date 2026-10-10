import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";

import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import { ROLES } from "../constants/roles";
import { useNotifications } from "../hooks/useNotifications";

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

 
  const { notifications: notificationData, markRead } = useNotifications();

  const notifications = Array.isArray(notificationData)
    ? notificationData
    : notificationData?.notifications || notificationData?.data || [];
  const navigate = useNavigate();

  const isCustomer = isAuthenticated && user?.role === ROLES.CUSTOMER;

  const displayName =
    user?.firstname && user?.lastname
      ? `${user.firstname} ${user.lastname}`
      : user?.firstname || "Resvill customer";

  const displayEmail = user?.email || "Sign in to manage your account";

  const unreadNotificationCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  const signOut = async () => {
    try {
      await logout();

      setIsAccountOpen(false);
      setIsNotificationsOpen(false);
      setIsSidebarOpen(false);

      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const closeCustomerMenus = () => {
    setIsNotificationsOpen(false);
    setIsAccountOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-dark-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex shrink-0 items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
              <span className="font-heading text-lg font-bold text-white">
                R
              </span>
            </div>

            <span className="font-heading text-xl font-bold tracking-tight text-dark-900">
              Resvill
            </span>
          </Link>

          {/* Desktop Navigation */}
          <Navigation />

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Notifications - Customers Only */}
            {isCustomer && (
              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  aria-expanded={isNotificationsOpen}
                  onClick={() => setIsNotificationsOpen((current) => !current)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
                >
                  <Bell size={20} strokeWidth={1.8} />

                  {unreadNotificationCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[9px] font-bold text-white">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-dark-100 bg-white p-3 shadow-card">
                    <div className="flex items-center justify-between px-2 py-2">
                      <h2 className="font-heading text-base font-extrabold text-dark-950">
                        Notifications
                      </h2>

                      <span className="text-xs font-bold text-primary-500">
                        {unreadNotificationCount} new
                      </span>
                    </div>

                    <div className="space-y-1">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          // <div
                          //   key={notification.id}
                          //   className="rounded-xl bg-primary-50/70 p-3"
                          // >
                          <div
                            key={notification._id}
                            onClick={() =>
                              !notification.isRead && markRead(notification._id)
                            }
                            className="cursor-pointer rounded-xl bg-primary-50/70 p-3"
                          >
                            <div className="flex gap-3">
                              {/* {notification.unread && ( */}
                              {!notification.isRead && (
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                              )}

                              <div>
                                <p className="text-sm font-bold text-dark-900">
                                  {notification.title}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-dark-600">
                                  {notification.message}
                                </p>

                                <p className="mt-1 text-[11px] font-semibold text-dark-400">
                                  {/* {notification.time} */}
                                  {new Date(
                                    notification.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-8 text-center">
                          <Bell size={24} className="mx-auto text-dark-300" />

                          <p className="mt-3 text-sm font-semibold text-dark-500">
                            No notifications yet.
                          </p>
                        </div>
                      )}
                    </div>

                    <Link
                      to={ROUTES.NOTIFICATIONS}
                      onClick={closeCustomerMenus}
                      className="mt-2 block rounded-xl px-3 py-2.5 text-center text-xs font-bold text-primary-500 transition-colors hover:bg-primary-50"
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Cart - Available to Guests and Customers */}
            <Link
              to={ROUTES.CART}
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />

              {itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[9px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Customer Account */}
            {isCustomer ? (
              <div className="relative">
                <button
                  type="button"
                  aria-label="Open account menu"
                  aria-expanded={isAccountOpen}
                  onClick={() => setIsAccountOpen((current) => !current)}
                  className="flex items-center gap-2 px-2 text-sm font-semibold text-dark-800 transition-colors hover:text-primary-500"
                >
                  <UserRound size={18} strokeWidth={1.8} />
                  Account
                  <ChevronDown
                    size={15}
                    className={`transition-transform ${
                      isAccountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-dark-100 bg-white p-3 shadow-card">
                    <div className="border-b border-dark-100 px-3 pb-3">
                      <p className="truncate text-sm font-extrabold text-dark-950">
                        {displayName}
                      </p>

                      <p className="mt-1 truncate text-xs text-dark-500">
                        {displayEmail}
                      </p>
                    </div>

                    <div className="mt-2 space-y-1">
                      <Link
                        to={ROUTES.PROFILE}
                        onClick={closeCustomerMenus}
                        className="block rounded-xl px-3 py-2.5 text-sm font-bold text-dark-700 hover:bg-primary-50 hover:text-primary-500"
                      >
                        Profile
                      </Link>

                      <Link
                        to={ROUTES.ORDERS}
                        onClick={closeCustomerMenus}
                        className="block rounded-xl px-3 py-2.5 text-sm font-bold text-dark-700 hover:bg-primary-50 hover:text-primary-500"
                      >
                        Order History
                      </Link>

                      <Link
                        to={ROUTES.NOTIFICATIONS}
                        onClick={closeCustomerMenus}
                        className="block rounded-xl px-3 py-2.5 text-sm font-bold text-dark-700 hover:bg-primary-50 hover:text-primary-500"
                      >
                        Notifications
                      </Link>

                      <button
                        type="button"
                        onClick={signOut}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-dark-700 hover:bg-red-50 hover:text-danger"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !isAuthenticated ? (
              /* Guest Actions */
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="px-3 text-sm font-semibold text-dark-800 transition-colors hover:text-primary-500"
                >
                  Login
                </Link>

                <Link
                  to={ROUTES.REGISTER}
                  className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-600 hover:shadow-md"
                >
                  Register
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Notifications - Customers Only */}
            {isCustomer && (
              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  aria-expanded={isNotificationsOpen}
                  onClick={() => setIsNotificationsOpen((current) => !current)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
                >
                  <Bell size={20} strokeWidth={1.8} />

                  {unreadNotificationCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[9px] font-bold text-white">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-dark-100 bg-white p-3 shadow-card">
                    <div className="flex items-center justify-between px-2 py-2">
                      <h2 className="font-heading text-base font-extrabold text-dark-950">
                        Notifications
                      </h2>

                      <span className="text-xs font-bold text-primary-500">
                        {unreadNotificationCount} new
                      </span>
                    </div>

                    <div className="space-y-1">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          // <div
                          //   key={notification.id}
                          //   className="rounded-xl bg-primary-50/70 p-3"
                          // >
                          <div
                            key={notification._id}
                            onClick={() =>
                              !notification.isRead && markRead(notification._id)
                            }
                            className="cursor-pointer rounded-xl bg-primary-50/70 p-3"
                          >
                            <div className="flex gap-3">
                              {/* {notification.unread && ( */}
                              {!notification.isRead && (
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                              )}

                              <div>
                                <p className="text-sm font-bold text-dark-900">
                                  {notification.title}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-dark-600">
                                  {notification.message}
                                </p>

                                <p className="mt-1 text-[11px] font-semibold text-dark-400">
                                  {/* {notification.time} */}
                                  {new Date(
                                    notification.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-8 text-center">
                          <Bell size={24} className="mx-auto text-dark-300" />

                          <p className="mt-3 text-sm font-semibold text-dark-500">
                            No notifications yet.
                          </p>
                        </div>
                      )}
                    </div>

                    <Link
                      to={ROUTES.NOTIFICATIONS}
                      onClick={closeCustomerMenus}
                      className="mt-2 block rounded-xl px-3 py-2.5 text-center text-xs font-bold text-primary-500 transition-colors hover:bg-primary-50"
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Cart - Available to Everyone */}
            <Link
              to={ROUTES.CART}
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />

              {itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[9px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Menu */}
            <button
              type="button"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-dark-800 transition-colors hover:bg-primary-50 hover:text-primary-500"
            >
              {isSidebarOpen ? (
                <X size={22} strokeWidth={1.8} />
              ) : (
                <Menu size={22} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}

export default Header;
