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



import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, UserRound } from "lucide-react";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import { useCart } from "../context/CartContext";


function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { itemCount } = useCart();


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
            {/* Search */}
            <Link
              to="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-500"
            >
              <Search size={20} strokeWidth={1.8} />
            </Link>

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

            {/* Profile */}
            <Link
              to="/user/profile"
              aria-label="Open profile"
              className="flex items-center gap-2 px-2 text-sm font-semibold text-dark-800 transition-colors hover:text-primary-500"
            >
              <UserRound size={18} strokeWidth={1.8} />
              Profile
            </Link>

            {/* Login */}
            <Link
              to="/login"
              className="px-3 text-sm font-semibold text-dark-800 transition-colors hover:text-primary-500"
            >
              Login
            </Link>

            {/* Register */}
            <Link
              to="/register"
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-600 hover:shadow-md"
            >
              Register
            </Link>
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
