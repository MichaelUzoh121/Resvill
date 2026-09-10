
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Search,
//   Home,
//   Utensils,
//   Info,
//   Phone,
//   LogIn,
//   UserPlus,
//   X,
// } from "lucide-react";

// const navigationLinks = [
//   {
//     label: "Home",
//     path: "/",
//     icon: Home,
//   },
//   {
//     label: "Menu",
//     path: "/menu",
//     icon: Utensils,
//   },
//   {
//     label: "About",
//     path: "/about",
//     icon: Info,
//   },
//   {
//     label: "Contact",
//     path: "/contact",
//     icon: Phone,
//   },
// ];

// function Sidebar({ isOpen, onClose }) {
//   const location = useLocation();

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[60] md:hidden">
//       {/* Overlay */}
//       <button
//         type="button"
//         aria-label="Close menu"
//         onClick={onClose}
//         className="absolute inset-0 h-full w-full bg-dark-950/40 backdrop-blur-sm"
//       />

//       {/* Sidebar */}
//       <aside className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl">
//         {/* Header */}
//         <div className="flex h-20 items-center justify-between border-b border-dark-100 px-5">
//           <Link
//             to="/"
//             onClick={onClose}
//             className="flex items-center gap-2"
//           >
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
//               <span className="font-heading font-bold text-white">R</span>
//             </div>

//             <span className="font-heading text-lg font-bold text-dark-900">
//               Resvill
//             </span>
//           </Link>

//           <button
//             type="button"
//             aria-label="Close menu"
//             onClick={onClose}
//             className="flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
//           >
//             <X size={21} />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex flex-1 flex-col px-5 py-6">
//           <div className="space-y-1">
//             {navigationLinks.map((link) => {
//               const Icon = link.icon;
//               const isActive = location.pathname === link.path;

//               return (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={onClose}
//                   className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
//                     isActive
//                       ? "bg-primary-50 text-primary-500"
//                       : "text-dark-700 hover:bg-dark-50 hover:text-primary-500"
//                   }`}
//                 >
//                   <Icon size={19} strokeWidth={1.8} />
//                   {link.label}
//                 </Link>
//               );
//             })}

//             <Link
//               to="/search"
//               onClick={onClose}
//               className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-dark-700 transition-colors hover:bg-dark-50 hover:text-primary-500"
//             >
//               <Search size={19} strokeWidth={1.8} />
//               Search
//             </Link>
//           </div>

//           {/* Authentication */}
//           <div className="mt-auto space-y-3 border-t border-dark-100 pt-6">
//             <Link
//               to="/login"
//               onClick={onClose}
//               className="flex items-center justify-center gap-2 rounded-xl border border-dark-200 px-4 py-3 text-sm font-semibold text-dark-800 transition-colors hover:border-primary-500 hover:text-primary-500"
//             >
//               <LogIn size={18} />
//               Login
//             </Link>

//             <Link
//               to="/register"
//               onClick={onClose}
//               className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-primary-600"
//             >
//               <UserPlus size={18} />
//               Register
//             </Link>
//           </div>
//         </nav>
//       </aside>
//     </div>
//   );
// }

// export default Sidebar;




import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Home,
  Utensils,
  ShoppingBag,
  Calendar,
  Phone,
  X,
  Truck,
  ChevronDown,
  Info,
  UserRound,
} from "lucide-react";

const navigationLinks = [
  {
    label: "Home Pages",
    path: "/",
    icon: Home,
    subItems: [
      { label: "Home 01", path: "/" },
      { label: "Home 02", path: "/home-2" },
      { label: "Home 03", path: "/home-3" },
    ],
  },
  {
    label: "Food Menu",
    path: "/menu",
    icon: Utensils,
    subItems: [
      { label: "Food Menu 01", path: "/menu" },
      { label: "Food Menu 02", path: "/menu-2" },
    ],
  },
  {
    label: "Shop & Orders",
    path: "/shop",
    icon: ShoppingBag,
    subItems: [
      { label: "Shop Grid", path: "/shop" },
      { label: "Shop List", path: "/shop-list" },
      { label: "Shopping Cart", path: "/cart" },
      { label: "Checkout", path: "/checkout" },
    ],
  },
  {
    label: "Reservation",
    path: "/reservation",
    icon: Calendar,
  },
  {
    label: "About Us",
    path: "/about",
    icon: Info,
  },
  {
    label: "Contact Us",
    path: "/contact",
    icon: Phone,
  },
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

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
              <span className="font-heading font-black text-white uppercase">FK</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-black tracking-tight text-dark-900 uppercase">
                FOOD<span className="text-primary-500">KING</span>
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
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
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

            <Link
              to="/search"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-extrabold text-dark-800 transition-colors hover:bg-dark-50 hover:text-primary-500"
            >
              <Search size={19} strokeWidth={2} />
              Search Menu
            </Link>

            <Link
              to="/user/profile"
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-extrabold transition-colors ${
                location.pathname === "/user/profile"
                  ? "bg-primary-50 text-primary-500"
                  : "text-dark-800 hover:bg-dark-50 hover:text-primary-500"
              }`}
            >
              <UserRound size={19} strokeWidth={2} />
              My Profile
            </Link>
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
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;