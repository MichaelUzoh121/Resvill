// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   ChevronRight,
//   Heart,
//   House,
//   MapPin,
//   Package,
//   CreditCard,
//   Bell,
//   Settings,
//   Gift,
// } from "lucide-react";

// const menuItems = [
//   {
//     label: "Overview",
//     path: "/account",
//     icon: House,
//   },
//   {
//     label: "Profile",
//     path: "/account/profile",
//     icon: House,
//   },
//   {
//     label: "Addresses",
//     path: "/account/addresses",
//     icon: MapPin,
//   },
//   {
//     label: "Payments",
//     path: "/account/payments",
//     icon: CreditCard,
//   },
//   {
//     label: "Favourites",
//     path: "/account/favorites",
//     icon: Heart,
//   },
//   {
//     label: "Notifications",
//     path: "/account/notifications",
//     icon: Bell,
//   },
//   {
//     label: "Loyalty",
//     path: "/account/loyalty",
//     icon: Gift,
//   },
//   {
//     label: "Settings",
//     path: "/account/settings",
//     icon: Settings,
//   },
// ];

// function UserSidebar({ user }) {

//   const name =
//     `${user?.firstname || ""} ${user?.lastname || ""}`.trim()
//     || "Resvill Customer";

//   const initials =
//     name
//       .split(" ")
//       .filter(Boolean)
//       .map(item => item[0])
//       .join("")
//       .slice(0,2)
//       .toUpperCase();

//   return (
//     <aside className="h-fit rounded-2xl border border-dark-200 bg-white p-3 shadow-soft">

//       <div className="mb-3 flex items-center gap-3 border-b border-dark-100 px-3 pb-4">

//         <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">

//           {initials}

//         </div>

//         <div className="min-w-0">

//           <p className="truncate text-sm font-bold text-dark-900">
//             {name}
//           </p>

//           <p className="truncate text-xs text-dark-600">
//             {user?.email || "No email"}
//           </p>

//         </div>

//       </div>

//       <nav className="space-y-1">

//         {
//           menuItems.map(({label,path:menuPath,icon:Icon}) => (

//             <Link
//               key={menuPath}
//               to={menuPath}
//               className="
//               flex items-center gap-3 rounded-xl
//               px-3 py-3 text-sm font-semibold
//               text-dark-600 transition
//               hover:bg-primary-50
//               hover:text-primary-600
//               "
//             >

//               <Icon size={18}/>

//               <span className="flex-1">
//                 {label}
//               </span>

//               <ChevronRight size={15}/>

//             </Link>

//           ))
//         }

//       </nav>

//       <div className="mt-3 border-t border-dark-100 px-3 pt-3">

//         <Link
//           to="/orders"
//           className="
//           flex items-center gap-2
//           text-xs font-bold
//           text-primary-500
//           "
//         >

//           <Package size={15}/>

//           Order history

//         </Link>

//       </div>

//     </aside>
//   );
// }

// export default UserSidebar;

import { NavLink } from "react-router-dom";

import { Bell, Heart, House, MapPin, Settings, Star, User, MessageSquare, } from "lucide-react";
import { MdOutlineRateReview } from "react-icons/md";

const menuItems = [
  {
    label: "Dashboard",
    path: "/account",
    icon: House,
  },

  {
    label: "Profile",
    path: "/account/profile",
    icon: User,
  },

  {
    label: "Saved addresses",
    path: "/account/addresses",
    icon: MapPin,
  },

  {
    label: "Favourites",
    path: "/account/favorites",
    icon: Heart,
  },

  {
    label: "Reviews",
    path: "/account/reviews",
    icon: MessageSquare,
  },

  {
    label: "Loyalty",
    path: "/account/loyalty",
    icon: Star,
  },

  {
    label: "Settings",
    path: "/account/settings",
    icon: Settings,
  },
];

function UserSidebar() {
  return (
    <aside
      className="
        h-fit
        rounded-2xl
        border border-dark-200
        bg-white
        p-3
        shadow-soft
      "
    >
      <nav className="space-y-1">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/account"}
            className={({ isActive }) => `

                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  font-semibold
                  transition
                  border-none

                  ${
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-dark-600 hover:bg-dark-50 hover:text-dark-900"
                  }

                `}
          >
            <Icon size={18} strokeWidth={1.8} className="border-none" />

            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default UserSidebar;
