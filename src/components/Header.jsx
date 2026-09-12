// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   Search,
//   ShoppingBag,
//   UserRound,
//   ChevronDown,
// } from "lucide-react";

// function Header() {
//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-dark-100 bg-white/95 backdrop-blur-md">
//       <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
//             <span className="font-heading text-lg font-bold text-white">
//               R
//             </span>
//           </div>

//           <span className="font-heading text-xl font-bold tracking-tight text-dark-900">
//             Resvill
//           </span>
//         </Link>

//         {/* Navigation */}
//         <nav className="hidden items-center gap-8 lg:flex">
//           <Link
//             to="/"
//             className="text-sm font-semibold text-primary-500 transition-colors"
//           >
//             Home
//           </Link>

//           <Link
//             to="/menu"
//             className="text-sm font-medium text-dark-600 transition-colors hover:text-primary-500"
//           >
//             Menu
//           </Link>

//           <Link
//             to="/about"
//             className="text-sm font-medium text-dark-600 transition-colors hover:text-primary-500"
//           >
//             About
//           </Link>

//           <Link
//             to="/contact"
//             className="text-sm font-medium text-dark-600 transition-colors hover:text-primary-500"
//           >
//             Contact
//           </Link>

//           <button className="flex items-center gap-1 text-sm font-medium text-dark-600 transition-colors hover:text-primary-500">
//             More
//             <ChevronDown size={15} />
//           </button>
//         </nav>

//         {/* Actions */}
//         <div className="flex items-center gap-2 sm:gap-3">
//           {/* Search */}
//           <button
//             type="button"
//             aria-label="Search"
//             className="flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
//           >
//             <Search size={20} strokeWidth={1.8} />
//           </button>

//           {/* Cart */}
//           <Link
//             to="/cart"
//             aria-label="Shopping cart"
//             className="relative flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
//           >
//             <ShoppingBag size={20} strokeWidth={1.8} />

//             <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[9px] font-bold text-white">
//               2
//             </span>
//           </Link>

//           {/* Login */}
//           <Link
//             to="/login"
//             className="hidden items-center gap-2 px-2 text-sm font-semibold text-dark-800 transition-colors hover:text-primary-500 sm:flex"
//           >
//             <UserRound size={18} strokeWidth={1.8} />
//             Login
//           </Link>

//           {/* CTA */}
//           <Link
//             to="/menu"
//             className="hidden rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md md:block"
//           >
//             Order Now
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;



import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import { useCart } from "../context/CartContext";


function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(
    localStorage.getItem("resvill_auth_v1") === "true",
  );

  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("resvill_profile_v1") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const refreshAccount = () => {
      setIsSignedIn(localStorage.getItem("resvill_auth_v1") === "true");
      try {
        setProfile(JSON.parse(localStorage.getItem("resvill_profile_v1") || "{}"));
      } catch {
        setProfile({});
      }
    };

    window.addEventListener("resvill-auth-changed", refreshAccount);
    return () => window.removeEventListener("resvill-auth-changed", refreshAccount);
  }, []);

  const signOut = () => {
    localStorage.removeItem("resvill_auth_v1");
    setIsSignedIn(false);
    setIsAccountOpen(false);
    navigate("/");
  };

  const displayName = profile.name || "Resvill customer";
  const displayEmail = profile.email || "Sign in to manage your account";

  const notifications = [
    {
      id: 1,
      title: "Welcome to Resvill",
      message: "Your favorite meals are only a few clicks away.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      title: "Order updates coming soon",
      message: "You will see your order status here after checkout.",
      time: "Today",
      unread: true,
    },
  ];


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-dark-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
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
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={isNotificationsOpen}
                onClick={() => setIsNotificationsOpen((current) => !current)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
              >
                <Bell size={20} strokeWidth={1.8} />
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[9px] font-bold text-white">
                  {notifications.filter((notification) => notification.unread).length}
                </span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-dark-100 bg-white p-3 shadow-card">
                  <div className="flex items-center justify-between px-2 py-2">
                    <h2 className="font-heading text-base font-extrabold text-dark-950">
                      Notifications
                    </h2>
                    <span className="text-xs font-bold text-primary-500">
                      {notifications.length} new
                    </span>
                  </div>

                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="rounded-xl bg-primary-50/70 p-3"
                      >
                        <div className="flex gap-3">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                          <div>
                            <p className="text-sm font-bold text-dark-900">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-dark-600">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-[11px] font-semibold text-dark-400">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />

              {/* Mock cart count */}
             <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[9px] font-bold text-white">
                 {itemCount}
              </span>

            </Link>

            {isSignedIn ? (
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
                  <ChevronDown size={15} className={isAccountOpen ? "rotate-180" : ""} />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-dark-100 bg-white p-3 shadow-card">
                    <div className="border-b border-dark-100 px-3 pb-3">
                      <p className="truncate text-sm font-extrabold text-dark-950">{displayName}</p>
                      <p className="mt-1 truncate text-xs text-dark-500">{displayEmail}</p>
                    </div>
                    <div className="mt-2 space-y-1">
                      <Link to="/user/profile" onClick={() => setIsAccountOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-dark-700 hover:bg-primary-50 hover:text-primary-500">
                        Profile
                      </Link>
                      <Link to="/order-history" onClick={() => setIsAccountOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-bold text-dark-700 hover:bg-primary-50 hover:text-primary-500">
                        Order History
                      </Link>
                      <button type="button" onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-dark-700 hover:bg-red-50 hover:text-danger">
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-3 text-sm font-semibold text-dark-800 transition-colors hover:text-primary-500">
                  Login
                </Link>
                <Link to="/register" className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-600 hover:shadow-md">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />

              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[9px] font-bold text-white">
                2
              </span>
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
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}

export default Header;

