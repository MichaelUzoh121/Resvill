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
            <a
              href={link.path}
              className={`flex items-center gap-1 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                isActive
                  ? "text-primary-500"
                  : "text-dark-800 hover:text-primary-500"
              }`}
            >
              {link.label}
              {hasSubItems && <ChevronDown size={14} className="mt-0.5" />}
            </a>

            {/* Dropdown Menu */}
            {hasSubItems && activeDropdown === link.label && (
              <div className="absolute top-full left-0 z-50 w-48 rounded-2xl bg-white p-2 shadow-2xl border border-dark-100">
                {link.subItems.map((sub) => (
                  <a
                    key={sub.path}
                    href={sub.path}
                    className="block rounded-xl px-4 py-2.5 text-xs font-bold text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
                  >
                    {sub.label}
                  </a>
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
