import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  House,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Settings,
  ShoppingBag,
} from "lucide-react";
import Row1 from "./Row1";
import { getOrders } from "../../utils/orders";

const menuItems = [
  { key: "overview", label: "Overview", icon: House },
  { key: "orders", label: "My orders", icon: Package },
  { key: "addresses", label: "Saved addresses", icon: MapPin },
  { key: "payments", label: "Payment methods", icon: CreditCard },
  { key: "favorites", label: "Favourites", icon: Heart },
];

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const formatMoney = (value) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`;

function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [profileForm, setProfileForm] = useState({
    fullName: "Michael Uzoh",
    phone: "+234 801 234 5678",
    email: "michael@example.com",
    birthday: "2026-08-29",
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const orders = useMemo(() => getOrders(), []);
  const recentOrders = orders.slice(0, 2);
  const customerName = "Michael Uzoh";
  const initials = customerName
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <main className="min-h-screen bg-dark-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary-500">
              My account
            </p>
            <h1 className="text-3xl font-extrabold text-dark-900 sm:text-4xl">
              Welcome back, Michael
            </h1>
            <p className="mt-2 text-sm text-dark-600">
              Manage your orders, account details, and saved preferences.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-600"
          >
            <ShoppingBag size={17} />
            Order food
          </Link>
        </div>

        <Row1 name={customerName} initials={initials} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit rounded-2xl border border-dark-200 bg-white p-3 shadow-soft">
            <div className="mb-3 flex items-center gap-3 border-b border-dark-100 px-3 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 font-heading font-bold text-primary-600">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-dark-900">{customerName}</p>
                <p className="truncate text-xs text-dark-600">michael@example.com</p>
              </div>
            </div>

            <nav className="space-y-1" aria-label="Account navigation">
              {menuItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                    activeTab === key
                      ? "bg-primary-50 text-primary-600"
                      : "text-dark-600 hover:bg-dark-50 hover:text-dark-900"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span className="flex-1">{label}</span>
                  {activeTab === key && <ChevronRight size={16} />}
                </button>
              ))}
            </nav>

            <div className="mt-3 border-t border-dark-100 pt-3">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-dark-600 transition hover:bg-dark-50 hover:text-primary-600"
              >
                <Settings size={18} strokeWidth={1.8} />
                Account settings
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-danger transition hover:bg-red-50"
              >
                <LogOut size={18} strokeWidth={1.8} />
                Log out
              </button>
            </div>
          </aside>

          <section className="min-w-0">
            {activeTab === "overview" && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft">
                    <p className="text-sm text-dark-600">Total orders</p>
                    <p className="mt-2 text-3xl font-extrabold text-dark-900">{orders.length || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft">
                    <p className="text-sm text-dark-600">Saved favourites</p>
                    <p className="mt-2 text-3xl font-extrabold text-dark-900">8</p>
                  </div>
                  <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft">
                    <p className="text-sm text-dark-600">Reward points</p>
                    <p className="mt-2 text-3xl font-extrabold text-primary-500">240</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-dark-200 bg-white p-5 shadow-soft sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-dark-900">Recent orders</h2>
                      <p className="mt-1 text-sm text-dark-600">Keep track of your latest meals.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="text-sm font-bold text-primary-500 hover:text-primary-600"
                    >
                      View all
                    </button>
                  </div>
                  {recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <OrderRow key={order.id} order={order} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState text="You have not placed any orders yet." />
                  )}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <AccountCard icon={MapPin} title="Delivery address" detail="12 Example Street, Abuja" action="Edit address" />
                  <AccountCard icon={CreditCard} title="Preferred payment" detail="Visa ending in 4242" action="Manage payments" />
                </div>

                <ProfileForms
                  profileForm={profileForm}
                  setProfileForm={setProfileForm}
                  passwordForm={passwordForm}
                  setPasswordForm={setPasswordForm}
                />
              </>
            )}

            {activeTab === "orders" && (
              <ContentPanel title="My orders" description="Review your order history and current deliveries.">
                {orders.length > 0 ? orders.map((order) => <OrderRow key={order.id} order={order} />) : <EmptyState text="You have not placed any orders yet." />}
              </ContentPanel>
            )}

            {activeTab === "addresses" && (
              <ContentPanel title="Saved addresses" description="Your saved delivery locations.">
                <AccountCard icon={MapPin} title="Home" detail="12 Example Street, Abuja" action="Edit address" />
              </ContentPanel>
            )}

            {activeTab === "payments" && (
              <ContentPanel title="Payment methods" description="Manage the payment methods you use at checkout.">
                <AccountCard icon={CreditCard} title="Visa card" detail="•••• 4242 · Expires 08/28" action="Edit payment" />
              </ContentPanel>
            )}

            {activeTab === "favorites" && (
              <ContentPanel title="Favourites" description="Your favourite meals will appear here.">
                <EmptyState text="Save meals from the menu to find them quickly next time." />
              </ContentPanel>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileForms({ profileForm, setProfileForm, passwordForm, setPasswordForm }) {
  const updateProfile = (event) => {
    event.preventDefault();
  };

  const updatePassword = (event) => {
    event.preventDefault();
  };

  const updateField = (setForm) => (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <form onSubmit={updateProfile} className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">Account details</p>
          <h2 className="mt-1 text-xl font-bold text-dark-900">Your profile</h2>
          <p className="mt-1 text-sm text-dark-600">Keep your personal information up to date.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" name="fullName" value={profileForm.fullName} onChange={updateField(setProfileForm)} />
          <FormField label="Phone" name="phone" value={profileForm.phone} onChange={updateField(setProfileForm)} />
          <FormField label="Your email" type="email" name="email" value={profileForm.email} onChange={updateField(setProfileForm)} className="sm:col-span-2" />
          <FormField label="Your birthday" type="date" name="birthday" value={profileForm.birthday} onChange={updateField(setProfileForm)} className="sm:col-span-2" />
        </div>
        <button type="submit" className="mt-5 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600">
          Update profile
        </button>
      </form>

      <form onSubmit={updatePassword} className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">Security</p>
          <h2 className="mt-1 text-xl font-bold text-dark-900">Change password</h2>
          <p className="mt-1 text-sm text-dark-600">Use a strong password to keep your account safe.</p>
        </div>
        <div className="space-y-4">
          <FormField label="Current password" type="password" name="current" value={passwordForm.current} onChange={updateField(setPasswordForm)} />
          <FormField label="New password" type="password" name="next" value={passwordForm.next} onChange={updateField(setPasswordForm)} />
          <FormField label="Confirm new password" type="password" name="confirm" value={passwordForm.confirm} onChange={updateField(setPasswordForm)} />
        </div>
        <button type="submit" className="mt-5 rounded-xl border border-primary-500 px-6 py-3 text-sm font-bold text-primary-500 transition hover:bg-primary-50">
          Update password
        </button>
      </form>
    </div>
  );
}

function FormField({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-dark-800">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
      />
    </label>
  );
}

function OrderRow({ order }) {
  const items = order.items || [];
  const total = order.total ?? order.totals?.total ?? order.subtotal;
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-dark-100 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
          <Package size={21} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-dark-900">Order #{order.id}</p>
          <p className="mt-1 truncate text-xs text-dark-600">
            {items.map((item) => `${item.quantity}× ${item.name}`).join(", ") || "Food order"}
          </p>
          <p className="mt-1 text-xs text-dark-500">{formatDate(order.createdAt)}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-sm font-extrabold text-dark-900">{formatMoney(total)}</p>
          <span className="mt-1 inline-flex rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-bold capitalize text-secondary-700">
            {order.status || "confirmed"}
          </span>
        </div>
        <ChevronRight size={18} className="text-dark-400" />
      </div>
    </div>
  );
}

function AccountCard({ icon: Icon, title, detail, action }) {
  return (
    <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
          <Icon size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-dark-900">{title}</h3>
          <p className="mt-1 text-sm text-dark-600">{detail}</p>
          <button type="button" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-500 hover:text-primary-600">
            <Pencil size={13} />
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentPanel({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft sm:p-6">
      <h2 className="text-xl font-bold text-dark-900">{title}</h2>
      <p className="mt-1 mb-5 text-sm text-dark-600">{description}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-xl bg-dark-50 px-5 py-10 text-center">
      <Bell className="mx-auto text-dark-400" size={24} />
      <p className="mt-3 text-sm text-dark-600">{text}</p>
    </div>
  );
}

export default Profile;