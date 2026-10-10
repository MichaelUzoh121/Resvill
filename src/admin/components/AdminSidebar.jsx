import { NavLink } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  Users,
  UtensilsCrossed,
  FolderOpen,
  CreditCard,
  Ticket,
  Star,
  Truck,
  UserCog,
  Settings,
  LayoutDashboard,
  ChevronRight,
  MapPin,
} from "lucide-react";


const navigationGroups = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
      },
      {
        label: "Analytics",
        path: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Orders",
        path: "/admin/orders",
        icon: ClipboardList,
      },
      {
        label: "Customers",
        path: "/admin/customers",
        icon: Users,
      },
      {
        label: "Categories",
        path: "/admin/categories",
        icon: FolderOpen,
      },
      {
        label: "Foods",
        path: "/admin/foods",
        icon: UtensilsCrossed,
      },
    ],
  },
  {
    label: "Commerce",
    items: [
      {
        label: "Payments",
        path: "/admin/payments",
        icon: CreditCard,
      },
      {
        label: "Coupons",
        path: "/admin/coupons",
        icon: Ticket,
      },
      {
        label: "Reviews",
        path: "/admin/reviews",
        icon: Star,
      },
      {
        label: "Delivery",
        path: "/admin/delivery",
        icon: Truck,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Admin Accounts",
        path: "/admin/accounts",
        icon: UserCog,
      },
      {
        label: "Delivery Location",
        path: "/admin/delivery-locations",
        icon: MapPin,
      },
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] border-r border-dark-100 bg-white lg:block">
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="border-b border-dark-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500 shadow-sm">
              <span className="font-heading text-lg font-extrabold text-white">
                R
              </span>
            </div>

            <div>
              <h1 className="font-heading text-lg font-extrabold tracking-tight text-dark-900">
                Resvill
              </h1>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dark-400">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-dark-400">
                  {group.label}
                </p>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          [
                            "group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200",
                            isActive
                              ? "bg-primary-50 text-primary-500"
                              : "text-dark-600 hover:bg-dark-50 hover:text-dark-900",
                          ].join(" ")
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-500" />
                            )}

                            <span
                              className={[
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all",
                                isActive
                                  ? "bg-primary-500 text-white shadow-sm"
                                  : "bg-dark-50 text-dark-500 group-hover:bg-white group-hover:text-dark-800",
                              ].join(" ")}
                            >
                              <Icon size={17} strokeWidth={2} />
                            </span>

                            <span className="flex-1">
                              {item.label}
                            </span>

                            <ChevronRight
                              size={14}
                              className={[
                                "transition-all",
                                isActive
                                  ? "translate-x-0 text-primary-400"
                                  : "-translate-x-1 text-dark-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                              ].join(" ")}
                            />
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom admin card */}
        <div className="border-t border-dark-100 p-4">
          <div className="relative overflow-hidden rounded-2xl bg-dark-950 p-4">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-500/20 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />

                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-300">
                  System status
                </span>
              </div>

              <p className="mt-2 font-heading text-sm font-bold text-white">
                Resvill is running
              </p>

              <p className="mt-1 text-[11px] leading-5 text-dark-400">
                Manage your restaurant from one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;