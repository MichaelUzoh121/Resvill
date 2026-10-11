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
