import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Utensils,
  Calendar,
  Phone,
  X,
  Truck,
  ChevronDown,
  UserRound,
  LayoutGrid,
  LayoutDashboard,
} from "lucide-react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";
import { ROLE_DASHBOARD_ROUTES, ROLES } from "../constants/roles";

const navigationLinks = [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "Food Menu",
    path: "/menu",
    icon: Utensils,
  },
  {
    label: "Group Order",
    path: "/group-order",
    icon: HiOutlineUserGroup,
  },
  {
    label: "Reservation",
    path: "/reservation",
    icon: Calendar,
  },
  {
    label: "Pages",
    path: "/about",
    icon: LayoutGrid,
    subItems: [
      { label: "About", path: "/about" },
      { label: "Gallery", path: "/gallery" },
      { label: "FAQs", path: "/faq" },
    ],
  },
  {
    label: "Contact Us",
    path: "/contact",
    icon: Phone,
  },
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const isCustomer = isAuthenticated && user?.role === ROLES.CUSTOMER;
  const dashboardPath = ROLE_DASHBOARD_ROUTES[user?.role];
  const visibleNavigationLinks = dashboardPath
    ? [
        { label: "Dashboard", path: dashboardPath, icon: LayoutDashboard },
        ...navigationLinks,
      ]
    : navigationLinks;

  const signOut = async () => {
    try {
      await logout();
      onClose();
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  if (!isOpen) return null;

  const toggleAccordion = (label) => {
    setExpandedMenu((prev) => (prev === label ? null : label));
  };

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-dark-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl">
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-dark-100 px-5">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 shadow-md">
              <span className="font-heading font-black text-white uppercase">
                R
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-black tracking-tight text-dark-900 uppercase">
                Res<span className="text-primary-500">vill</span>
              </span>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
          <div className="space-y-1">
            {visibleNavigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                location.pathname === link.path ||
                link.subItems?.some((sub) => location.pathname === sub.path) ||
                (dashboardPath &&
                  link.path === dashboardPath &&
                  location.pathname.startsWith(dashboardPath));
              const hasSub = Boolean(link.subItems);
              const isExpanded = expandedMenu === link.label;

              return (
                <div key={link.label} className="flex flex-col">
                  {hasSub ? (
                    <button
                      type="button"
                      onClick={() => toggleAccordion(link.label)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-extrabold transition-colors ${
                        isActive
                          ? "bg-primary-50 text-primary-500"
                          : "text-dark-800 hover:bg-dark-50 hover:text-primary-500"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={19} strokeWidth={2} />
                        {link.label}
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-primary-500" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-extrabold transition-colors ${
                        isActive
                          ? "bg-primary-50 text-primary-500"
                          : "text-dark-800 hover:bg-dark-50 hover:text-primary-500"
                      }`}
                    >
                      <Icon size={19} strokeWidth={2} />
                      {link.label}
                    </Link>
                  )}

                  {/* Accordion Sub-items */}
                  {hasSub && isExpanded && (
                    <div className="my-1 space-y-1 pl-11">
                      {link.subItems.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={onClose}
                          className="block rounded-lg py-2 text-xs font-bold text-dark-600 transition-colors hover:text-primary-500"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isCustomer && (
              <div>
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((current) => !current)}
                  aria-expanded={isAccountOpen}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-extrabold text-dark-800 transition-colors hover:bg-dark-50 hover:text-primary-500"
                >
                  <span className="flex items-center gap-3">
                    <UserRound size={19} strokeWidth={2} />
                    Account
                  </span>
                  <ChevronDown
                    size={16}
                    className={isAccountOpen ? "rotate-180" : ""}
                  />
                </button>

                {isAccountOpen && (
                  <div className="mx-2 mt-1 rounded-2xl border border-dark-100 bg-dark-50 p-3">
                    <p className="truncate text-xs font-extrabold text-dark-950">
                      {[user?.firstname, user?.lastname]
                        .filter(Boolean)
                        .join(" ") || "Resvill customer"}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-dark-500">
                      {user?.email || "Account details"}
                    </p>
                    <div className="mt-2 space-y-1 border-t border-dark-100 pt-2">
                      <Link
                        to={ROUTES.PROFILE}
                        onClick={onClose}
                        className="block rounded-lg px-2 py-2 text-xs font-bold text-dark-700 hover:bg-white hover:text-primary-500"
                      >
                        Profile
                      </Link>
                      <Link
                        to={ROUTES.ORDERS}
                        onClick={onClose}
                        className="block rounded-lg px-2 py-2 text-xs font-bold text-dark-700 hover:bg-white hover:text-primary-500"
                      >
                        Order History
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Card Callout */}
          <div className="mt-auto space-y-4 pt-6">
            <div className="rounded-2xl bg-dark-900 p-4 text-white shadow-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold text-accent-400">
                <Truck size={16} /> Fast Delivery Challenge
              </div>
              <p className="mt-1 text-xs text-dark-300">
                Get hot, crispy food delivered to your door in 30 minutes.
              </p>
            </div>

            <Link
              to="/menu"
              onClick={onClose}
              className="flex items-center justify-center rounded-xl bg-primary-500 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-600"
            >
              Order Now
            </Link>

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={ROUTES.LOGIN}
                  onClick={onClose}
                  className="flex items-center justify-center rounded-xl border border-dark-200 py-3 text-xs font-extrabold text-dark-700 transition-colors hover:border-primary-500 hover:text-primary-500"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  onClick={onClose}
                  className="flex items-center justify-center rounded-xl bg-primary-500 py-3 text-xs font-extrabold text-white transition-colors hover:bg-primary-600"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={signOut}
                className="w-full text-center text-xs font-bold text-dark-500 hover:text-primary-500"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;
