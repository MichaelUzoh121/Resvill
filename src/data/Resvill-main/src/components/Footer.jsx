// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   Facebook,
//   Instagram,
//   Twitter,
//   Mail,
//   Phone,
//   MapPin,
//   ArrowUpRight,
// } from "lucide-react";

// const quickLinks = [
//   { label: "Home", path: "/" },
//   { label: "Menu", path: "/menu" },
//   { label: "About Us", path: "/about" },
//   { label: "Contact", path: "/contact" },
// ];

// const customerLinks = [
//   { label: "Track Order", path: "/track-order" },
//   { label: "Cart", path: "/cart" },
//   { label: "Login", path: "/login" },
//   { label: "Register", path: "/register" },
// ];

// const supportLinks = [
//   { label: "FAQ", path: "/faq" },
//   { label: "Contact Support", path: "/contact" },
//   { label: "Terms & Conditions", path: "/terms" },
//   { label: "Privacy Policy", path: "/privacy" },
// ];

// function Footer() {
//   return (
//     <footer className="bg-dark-950 text-white">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Main Footer */}
//         <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
//           {/* Brand */}
//           <div className="max-w-sm">
//             <Link to="/" className="inline-flex items-center gap-2">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500">
//                 <span className="font-heading text-xl font-bold text-white">
//                   R
//                 </span>
//               </div>

//               <span className="font-heading text-xl font-bold tracking-tight">
//                 Resvill
//               </span>
//             </Link>

//             <p className="mt-5 text-sm leading-7 text-dark-300">
//               Delicious meals, delivered with care. Discover your favorite
//               foods, order with ease, and track your meal every step of the
//               way.
//             </p>

//             {/* Contact */}
//             <div className="mt-6 space-y-3">
//               <a
//                 href="mailto:hello@resvill.com"
//                 className="flex items-center gap-3 text-sm text-dark-300 transition-colors hover:text-primary-400"
//               >
//                 <Mail size={17} strokeWidth={1.8} />
//                 hello@resvill.com
//               </a>

//               <a
//                 href="tel:+2340000000000"
//                 className="flex items-center gap-3 text-sm text-dark-300 transition-colors hover:text-primary-400"
//               >
//                 <Phone size={17} strokeWidth={1.8} />
//                 +234 000 000 0000
//               </a>

//               <div className="flex items-center gap-3 text-sm text-dark-300">
//                 <MapPin size={17} strokeWidth={1.8} />
//                 Nigeria
//               </div>
//             </div>

//             {/* Socials */}
//             <div className="mt-7 flex items-center gap-3">
//               <a
//                 href="#"
//                 aria-label="Facebook"
//                 className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-700 text-dark-300 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white"
//               >
//                 <Facebook size={17} />
//               </a>

//               <a
//                 href="#"
//                 aria-label="Instagram"
//                 className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-700 text-dark-300 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white"
//               >
//                 <Instagram size={17} />
//               </a>

//               <a
//                 href="#"
//                 aria-label="Twitter"
//                 className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-700 text-dark-300 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white"
//               >
//                 <Twitter size={17} />
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="font-heading text-sm font-semibold">
//               Quick Links
//             </h3>

//             <ul className="mt-5 space-y-3.5">
//               {quickLinks.map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-sm text-dark-300 transition-colors hover:text-primary-400"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Customer */}
//           <div>
//             <h3 className="font-heading text-sm font-semibold">
//               Customer
//             </h3>

//             <ul className="mt-5 space-y-3.5">
//               {customerLinks.map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-sm text-dark-300 transition-colors hover:text-primary-400"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="font-heading text-sm font-semibold">
//               Support
//             </h3>

//             <ul className="mt-5 space-y-3.5">
//               {supportLinks.map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-sm text-dark-300 transition-colors hover:text-primary-400"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Footer */}
//         <div className="flex flex-col gap-4 border-t border-dark-800 py-6 sm:flex-row sm:items-center sm:justify-between">
//           <p className="text-xs text-dark-400">
//             © {new Date().getFullYear()} Resvill. All rights reserved.
//           </p>

//           <div className="flex items-center gap-5">
//             <Link
//               to="/terms"
//               className="text-xs text-dark-400 transition-colors hover:text-white"
//             >
//               Terms
//             </Link>

//             <Link
//               to="/privacy"
//               className="text-xs text-dark-400 transition-colors hover:text-white"
//             >
//               Privacy
//             </Link>

//             <Link
//               to="/contact"
//               className="group flex items-center gap-1 text-xs text-dark-400 transition-colors hover:text-primary-400"
//             >
//               Get in touch
//               <ArrowUpRight
//                 size={13}
//                 className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
//               />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;





// import React from "react";
// import { Link } from "react-router-dom";

// import {
//   Mail,
//   Phone,
//   MapPin,
//   ArrowUpRight,
// } from "lucide-react";

// import {
//   FaFacebookF,
//   FaInstagram,
//   FaTwitter,
// } from "react-icons/fa";

// const quickLinks = [
//   { label: "Home", path: "/" },
//   { label: "Menu", path: "/menu" },
//   { label: "About Us", path: "/about" },
//   { label: "Contact", path: "/contact" },
// ];

// const customerLinks = [
//   { label: "Track Order", path: "/track-order" },
//   { label: "Cart", path: "/cart" },
//   { label: "Login", path: "/login" },
//   { label: "Register", path: "/register" },
// ];

// const supportLinks = [
//   { label: "FAQ", path: "/faq" },
//   { label: "Contact Support", path: "/contact" },
//   { label: "Terms & Conditions", path: "/terms" },
//   { label: "Privacy Policy", path: "/privacy" },
// ];

// function Footer() {
//   return (
//     <footer className="bg-dark-950 text-white">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Main Footer */}
//         <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
//           {/* Brand */}
//           <div className="max-w-sm">
//             <Link to="/" className="inline-flex items-center gap-2">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500">
//                 <span className="font-heading text-xl font-bold text-white">
//                   R
//                 </span>
//               </div>

//               <span className="font-heading text-xl font-bold tracking-tight">
//                 Resvill
//               </span>
//             </Link>

//             <p className="mt-5 text-sm leading-7 text-dark-300">
//               Delicious meals, delivered with care. Discover your favorite
//               foods, order with ease, and track your meal every step of the
//               way.
//             </p>

//             {/* Contact */}
//             <div className="mt-6 space-y-3">
//               <a
//                 href="mailto:hello@resvill.com"
//                 className="flex items-center gap-3 text-sm text-dark-300 transition-colors hover:text-primary-400"
//               >
//                 <Mail size={17} strokeWidth={1.8} />
//                 hello@resvill.com
//               </a>

//               <a
//                 href="tel:+2340000000000"
//                 className="flex items-center gap-3 text-sm text-dark-300 transition-colors hover:text-primary-400"
//               >
//                 <Phone size={17} strokeWidth={1.8} />
//                 +234 000 000 0000
//               </a>

//               <div className="flex items-center gap-3 text-sm text-dark-300">
//                 <MapPin size={17} strokeWidth={1.8} />
//                 Nigeria
//               </div>
//             </div>

//             {/* Socials */}
//             <div className="mt-7 flex items-center gap-3">
//               <a
//                 href="#"
//                 aria-label="Facebook"
//                 className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-700 text-dark-300 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white"
//               >
//                 <FaFacebookF size={15} />
//               </a>

//               <a
//                 href="#"
//                 aria-label="Instagram"
//                 className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-700 text-dark-300 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white"
//               >
//                 <FaInstagram size={15} />
//               </a>

//               <a
//                 href="#"
//                 aria-label="Twitter"
//                 className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-700 text-dark-300 transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white"
//               >
//                 <FaTwitter size={15} />
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="font-heading text-sm font-semibold">
//               Quick Links
//             </h3>

//             <ul className="mt-5 space-y-3.5">
//               {quickLinks.map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-sm text-dark-300 transition-colors hover:text-primary-400"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Customer */}
//           <div>
//             <h3 className="font-heading text-sm font-semibold">
//               Customer
//             </h3>

//             <ul className="mt-5 space-y-3.5">
//               {customerLinks.map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-sm text-dark-300 transition-colors hover:text-primary-400"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="font-heading text-sm font-semibold">
//               Support
//             </h3>

//             <ul className="mt-5 space-y-3.5">
//               {supportLinks.map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-sm text-dark-300 transition-colors hover:text-primary-400"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Footer */}
//         <div className="flex flex-col gap-4 border-t border-dark-800 py-6 sm:flex-row sm:items-center sm:justify-between">
//           <p className="text-xs text-dark-400">
//             © {new Date().getFullYear()} Resvill. All rights reserved.
//           </p>

//           <div className="flex items-center gap-5">
//             <Link
//               to="/terms"
//               className="text-xs text-dark-400 transition-colors hover:text-white"
//             >
//               Terms
//             </Link>

//             <Link
//               to="/privacy"
//               className="text-xs text-dark-400 transition-colors hover:text-white"
//             >
//               Privacy
//             </Link>

//             <Link
//               to="/contact"
//               className="group flex items-center gap-1 text-xs text-dark-400 transition-colors hover:text-primary-400"
//             >
//               Get in touch
//               <ArrowUpRight
//                 size={13}
//                 className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
//               />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;



// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   ArrowUpRight,
//   Mail,
//   MapPin,
//   Phone,
//   Send,
// } from "lucide-react";
// import {
//   FaFacebookF,
//   FaInstagram,
//   FaTwitter,
// } from "react-icons/fa";

// const exploreLinks = [
//   { label: "Home", path: "/" },
//   { label: "Menu", path: "/menu" },
//   { label: "About Us", path: "/about" },
//   { label: "Contact", path: "/contact" },
// ];

// const customerLinks = [
//   { label: "Track Order", path: "/track-order" },
//   { label: "My Cart", path: "/cart" },
//   { label: "Login", path: "/login" },
//   { label: "Register", path: "/register" },
// ];

// const supportLinks = [
//   { label: "FAQ", path: "/faq" },
//   { label: "Terms & Conditions", path: "/terms" },
//   { label: "Privacy Policy", path: "/privacy" },
// ];

// function Footer() {
//   return (
//     <footer className="bg-dark-950 text-white">

//       {/* =====================================================
//           CTA
//       ===================================================== */}
//       <div className="border-b border-white/10">
//         <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
//           <div className="relative overflow-hidden rounded-3xl bg-primary-500 px-6 py-12 sm:px-10 lg:px-14 lg:py-14">

//             {/* Decorative circles */}
//             <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
//             <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-black/5" />

//             <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">

//               <div className="max-w-2xl">
//                 <span className="mb-3 inline-block text-sm font-bold uppercase tracking-[0.18em] text-white/75">
//                   Hungry already?
//                 </span>

//                 <h2 className="max-w-xl font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//                   Your next favorite meal is just a few clicks away.
//                 </h2>

//                 <p className="mt-4 max-w-lg text-sm leading-7 text-white/80 sm:text-base">
//                   Explore delicious meals, discover new favorites, and enjoy
//                   convenient delivery right to your doorstep.
//                 </p>
//               </div>

//               <Link
//                 to="/menu"
//                 className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary-500 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
//               >
//                 Explore Menu

//                 <ArrowUpRight
//                   size={17}
//                   className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
//                 />
//               </Link>

//             </div>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           MAIN FOOTER
//       ===================================================== */}
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

//         <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.25fr] lg:gap-10 lg:py-16">

//           {/* Brand */}
//           <div className="max-w-sm">

//             <Link
//               to="/"
//               className="inline-flex items-center gap-3"
//               aria-label="Resvill Home"
//             >
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500">
//                 <span className="font-heading text-xl font-extrabold text-white">
//                   R
//                 </span>
//               </div>

//               <span className="font-heading text-2xl font-bold tracking-tight">
//                 Resvill
//               </span>
//             </Link>

//             <p className="mt-5 text-sm leading-7 text-dark-400">
//               Good food, made simple. Discover delicious meals, order your
//               favorites, and enjoy a smooth food delivery experience with
//               Resvill.
//             </p>

//             {/* Contact */}
//             <div className="mt-7 space-y-3">

//               <a
//                 href="mailto:hello@resvill.com"
//                 className="group flex items-center gap-3 text-sm text-dark-400 transition-colors hover:text-white"
//               >
//                 <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-primary-500">
//                   <Mail size={15} />
//                 </span>

//                 hello@resvill.com
//               </a>

//               <a
//                 href="tel:+2340000000000"
//                 className="group flex items-center gap-3 text-sm text-dark-400 transition-colors hover:text-white"
//               >
//                 <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors group-hover:bg-primary-500">
//                   <Phone size={15} />
//                 </span>

//                 +234 000 000 0000
//               </a>

//               <div className="flex items-center gap-3 text-sm text-dark-400">
//                 <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
//                   <MapPin size={15} />
//                 </span>

//                 Nigeria
//               </div>

//             </div>

//             {/* Socials */}
//             <div className="mt-7 flex items-center gap-2.5">

//               <a
//                 href="#"
//                 aria-label="Facebook"
//                 className="flex h-9 w-9 items-center justify-center rounded-full border border-dark-800 text-dark-400 transition-all duration-300 hover:border-primary-500 hover:bg-primary-500 hover:text-white"
//               >
//                 <FaFacebookF size={13} />
//               </a>

//               <a
//                 href="#"
//                 aria-label="Instagram"
//                 className="flex h-9 w-9 items-center justify-center rounded-full border border-dark-800 text-dark-400 transition-all duration-300 hover:border-primary-500 hover:bg-primary-500 hover:text-white"
//               >
//                 <FaInstagram size={14} />
//               </a>

//               <a
//                 href="#"
//                 aria-label="Twitter"
//                 className="flex h-9 w-9 items-center justify-center rounded-full border border-dark-800 text-dark-400 transition-all duration-300 hover:border-primary-500 hover:bg-primary-500 hover:text-white"
//               >
//                 <FaTwitter size={13} />
//               </a>

//             </div>
//           </div>

//           {/* Explore */}
//           <div>
//             <h3 className="font-heading text-sm font-semibold text-white">
//               Explore
//             </h3>

//             <ul className="mt-5 space-y-3.5">
//               {exploreLinks.map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-sm text-dark-400 transition-colors hover:text-primary-400"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Customer */}
//           <div>
//             <h3 className="font-heading text-sm font-semibold text-white">
//               Customer
//             </h3>

//             <ul className="mt-5 space-y-3.5">
//               {customerLinks.map((link) => (
//                 <li key={link.path}>
//                   <Link
//                     to={link.path}
//                     className="text-sm text-dark-400 transition-colors hover:text-primary-400"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Newsletter */}
//           <div>
//             <h3 className="font-heading text-sm font-semibold text-white">
//               Stay in the loop
//             </h3>

//             <p className="mt-5 text-sm leading-6 text-dark-400">
//               Get updates about new meals, special offers, and delicious
//               deals from Resvill.
//             </p>

//             <form className="mt-5">
//               <div className="flex items-center rounded-xl border border-dark-800 bg-dark-900 p-1.5 transition-colors focus-within:border-primary-500">

//                 <input
//                   type="email"
//                   placeholder="Your email address"
//                   aria-label="Email address"
//                   className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-dark-500"
//                 />

//                 <button
//                   type="submit"
//                   aria-label="Subscribe"
//                   className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white transition-colors hover:bg-primary-600"
//                 >
//                   <Send size={16} />
//                 </button>

//               </div>
//             </form>

//             <div className="mt-5 flex items-center gap-2 text-xs text-dark-500">
//               <span className="h-1.5 w-1.5 rounded-full bg-success" />
//               Fresh meals. Fast delivery. Happy customers.
//             </div>
//           </div>

//         </div>

//         {/* ===================================================
//             BOTTOM BAR
//         =================================================== */}
//         <div className="flex flex-col gap-4 border-t border-dark-900 py-6 sm:flex-row sm:items-center sm:justify-between">

//           <p className="text-xs text-dark-500">
//             © {new Date().getFullYear()} Resvill. All rights reserved.
//           </p>

//           <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

//             <Link
//               to="/terms"
//               className="text-xs text-dark-500 transition-colors hover:text-white"
//             >
//               Terms
//             </Link>

//             <Link
//               to="/privacy"
//               className="text-xs text-dark-500 transition-colors hover:text-white"
//             >
//               Privacy
//             </Link>

//             <Link
//               to="/contact"
//               className="group flex items-center gap-1 text-xs text-dark-500 transition-colors hover:text-primary-400"
//             >
//               Get in touch

//               <ArrowUpRight
//                 size={12}
//                 className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
//               />
//             </Link>

//           </div>
//         </div>

//       </div>
//     </footer>
//   );
// }

// export default Footer;

















import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Send,
  Utensils,
  Sparkles,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const exploreLinks = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/menu" },
  { label: "Reservations", path: "/reservations" },
  { label: "Group Ordering", path: "/group-order" },
];

const customerLinks = [
  { label: "Track Order", path: "/track-order" },
  { label: "My Cart", path: "/cart" },
  { label: "Login", path: "/login" },
  { label: "Create Account", path: "/register" },
];

const supportLinks = [
  { label: "FAQ", path: "/faq" },
  { label: "Contact Us", path: "/contact" },
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Privacy Policy", path: "/privacy" },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-dark-950 text-white">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      {/* Large ambient glow */}
      <div className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-primary-500/[0.07] blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-[500px] w-[500px] rounded-full bg-primary-500/[0.05] blur-[120px]" />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-24 bottom-32 h-64 w-64 rounded-full border border-primary-500/10" />

      <div className="pointer-events-none absolute -left-16 bottom-40 h-48 w-48 rounded-full border border-primary-500/5" />

      <div className="pointer-events-none absolute right-[-120px] top-96 h-72 w-72 rounded-full border border-white/[0.03]" />

      {/* Floating decorative icons */}
      <div className="pointer-events-none absolute left-[8%] top-[48%] hidden rotate-12 text-primary-500/[0.06] lg:block">
        <Utensils size={100} strokeWidth={1} />
      </div>

      <div className="pointer-events-none absolute right-[8%] bottom-[24%] hidden -rotate-12 text-primary-500/[0.05] lg:block">
        <Sparkles size={90} strokeWidth={1} />
      </div>

      {/* =====================================================
          CTA
      ===================================================== */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">

          <div className="group relative overflow-hidden rounded-[2rem] bg-primary-500 px-6 py-12 shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:px-10 lg:px-14 lg:py-14">

            {/* CTA decoration */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-110" />

            <div className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-black/5" />

            <div className="pointer-events-none absolute right-[25%] top-8 h-20 w-20 rounded-full bg-white/5 blur-xl" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  Hungry already?
                </span>

                <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Your next favorite meal is just a few clicks away.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                  Explore delicious meals, discover new favorites, and
                  enjoy a simple food ordering experience with Resvill.
                </p>

              </div>

              <Link
                to="/menu"
                className="group/button inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary-500 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Explore Menu

                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                />
              </Link>

            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}
      <div className="relative">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr] lg:gap-10 lg:py-20">

            {/* =================================================
                BRAND
            ================================================= */}
            <div className="max-w-sm">

              <Link
                to="/"
                className="inline-flex items-center gap-2.5"
                aria-label="Resvill Home"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 shadow-lg shadow-primary-500/20">
                  <span className="font-heading text-lg font-extrabold text-white">
                    R
                  </span>
                </div>

                <span className="font-heading text-2xl font-extrabold tracking-tight">
                  Resvill
                </span>
              </Link>

              <p className="mt-5 text-sm leading-7 text-dark-400">
                Good food, made simple. Discover delicious meals, order
                what you love, and enjoy a smooth experience from order
                to delivery.
              </p>

              {/* Contact */}
              <div className="mt-7 space-y-3">

                <a
                  href="mailto:hello@resvill.com"
                  className="group flex items-center gap-3 text-sm text-dark-400 transition-colors hover:text-white"
                >
                  <Mail
                    size={15}
                    className="text-primary-500 transition-transform group-hover:scale-110"
                  />
                  hello@resvill.com
                </a>

                <a
                  href="tel:+2340000000000"
                  className="group flex items-center gap-3 text-sm text-dark-400 transition-colors hover:text-white"
                >
                  <Phone
                    size={15}
                    className="text-primary-500 transition-transform group-hover:scale-110"
                  />
                  +234 000 000 0000
                </a>

                <div className="flex items-center gap-3 text-sm text-dark-400">
                  <MapPin size={15} className="text-primary-500" />
                  Nigeria
                </div>

              </div>

              {/* Socials */}
              <div className="mt-7 flex items-center gap-2">

                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-dark-400 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  <FaFacebookF size={12} />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-dark-400 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  <FaInstagram size={13} />
                </a>

                <a
                  href="#"
                  aria-label="Twitter"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-dark-400 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  <FaTwitter size={12} />
                </a>

              </div>

            </div>

            {/* =================================================
                EXPLORE
            ================================================= */}
            <div>

              <h3 className="font-heading text-sm font-bold text-white">
                Explore
              </h3>

              <ul className="mt-5 space-y-3.5">

                {exploreLinks.map((link) => (
                  <li key={link.path}>

                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-1 text-sm text-dark-400 transition-colors hover:text-primary-400"
                    >
                      {link.label}

                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>

                  </li>
                ))}

              </ul>

            </div>

            {/* =================================================
                CUSTOMER
            ================================================= */}
            <div>

              <h3 className="font-heading text-sm font-bold text-white">
                Your Resvill
              </h3>

              <ul className="mt-5 space-y-3.5">

                {customerLinks.map((link) => (
                  <li key={link.path}>

                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-1 text-sm text-dark-400 transition-colors hover:text-primary-400"
                    >
                      {link.label}

                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>

                  </li>
                ))}

              </ul>

            </div>

            {/* =================================================
                SUPPORT
            ================================================= */}
            <div>

              <h3 className="font-heading text-sm font-bold text-white">
                Support
              </h3>

              <ul className="mt-5 space-y-3.5">

                {supportLinks.map((link) => (
                  <li key={link.path}>

                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-1 text-sm text-dark-400 transition-colors hover:text-primary-400"
                    >
                      {link.label}

                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </Link>

                  </li>
                ))}

              </ul>

            </div>

          </div>

          {/* =====================================================
              NEWSLETTER
          ===================================================== */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-7 sm:px-7 lg:px-8">

            {/* Newsletter glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary-500/[0.08] blur-3xl" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-lg">

                <div className="flex items-center gap-2">

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                    <Mail size={15} />
                  </span>

                  <h3 className="font-heading text-lg font-bold text-white">
                    Stay in the loop
                  </h3>

                </div>

                <p className="mt-2 text-sm leading-6 text-dark-400">
                  Get updates about new meals, special offers, and
                  everything happening at Resvill.
                </p>

              </div>

              <form className="w-full max-w-md">

                <div className="flex items-center rounded-xl border border-white/10 bg-dark-900/80 p-1.5 shadow-inner transition-colors focus-within:border-primary-500">

                  <input
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Email address"
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-dark-500"
                  />

                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white transition-all duration-300 hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20"
                  >
                    <Send size={16} />
                  </button>

                </div>

              </form>

            </div>

          </div>

          {/* =====================================================
              BOTTOM BAR
          ===================================================== */}
          <div className="flex flex-col gap-4 border-t border-white/[0.07] py-7 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-dark-500">
              © {new Date().getFullYear()} Resvill. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

              <Link
                to="/terms"
                className="text-xs text-dark-500 transition-colors hover:text-white"
              >
                Terms
              </Link>

              <Link
                to="/privacy"
                className="text-xs text-dark-500 transition-colors hover:text-white"
              >
                Privacy
              </Link>

              <Link
                to="/contact"
                className="group flex items-center gap-1 text-xs text-dark-500 transition-colors hover:text-primary-400"
              >
                Get in touch

                <ArrowUpRight
                  size={12}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

            </div>

          </div>

        </div>
      </div>

    </footer>
  );
}

export default Footer;

