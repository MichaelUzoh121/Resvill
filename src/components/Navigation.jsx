// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// const navigationLinks = [
//   {
//     label: "Home",
//     path: "/",
//   },
//   {
//     label: "Menu",
//     path: "/menu",
//   },
//   {
//     label: "About",
//     path: "/about",
//   },
//   {
//     label: "Contact",
//     path: "/contact",
//   },
// ];

// function Navigation() {
//   const location = useLocation();

//   return (
//     <nav className="hidden items-center gap-8 lg:flex">
//       {navigationLinks.map((link) => {
//         const isActive = location.pathname === link.path;

//         return (
//           <Link
//             key={link.path}
//             to={link.path}
//             className={`relative py-2 text-sm font-semibold transition-colors ${
//               isActive
//                 ? "text-primary-500"
//                 : "text-dark-600 hover:text-primary-500"
//             }`}
//           >
//             {link.label}

//             {isActive && (
//               <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-500" />
//             )}
//           </Link>
//         );
//       })}
//     </nav>
//   );
// }

// export default Navigation;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const navigationLinks = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Food Menu",
    path: "/menu",
  },
  {
    label: "Group Order",
    path: "/group-order",
  },
  {
    label: "Pages",
    path: "/about",
    subItems: [
      { label: "About Us", path: "/about" },
      { label: "Gallery", path: "/gallery" },
      { label: "FAQ's", path: "/faq" },
    ],
  },
  {
    label: "Reservation",
    path: "/reservation",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];

function Navigation() {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navigationLinks.map((link) => {
        const isActive = location.pathname === link.path;
        const hasSubItems = Boolean(link.subItems);

        return (
          <div
            key={link.label}
            className="relative"
            onMouseEnter={() => hasSubItems && setActiveDropdown(link.label)}
            onMouseLeave={() => hasSubItems && setActiveDropdown(null)}
          >
            <Link
              to={link.path}
              className={`flex items-center gap-1 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                isActive
                  ? "text-primary-500"
                  : "text-dark-800 hover:text-primary-500"
              }`}
            >
              {link.label}
              {hasSubItems && <ChevronDown size={14} className="mt-0.5" />}
            </Link>

            {/* Dropdown Menu */}
            {hasSubItems && activeDropdown === link.label && (
              <div className="absolute top-full left-0 z-50 w-48 rounded-2xl bg-white p-2 shadow-2xl border border-dark-100">
                {link.subItems.map((sub) => (
                  <Link
                    key={sub.path}
                    to={sub.path}
                    className="block rounded-xl px-4 py-2.5 text-xs font-bold text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Navigation;
