import React, { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  House,
  MapPin,
  Package,
  Pencil,
  ShoppingBag,
} from "lucide-react";
import Row1 from "./Row1";
import { getOrders } from "../../utils/orders";
import { normalizeLocation } from "../../utils/address";
import AddressAutocomplete from "../../components/AddressAutocomplete";
import { fileToCompressedDataUrl } from "../../utils/image";

const menuItems = [
  { key: "overview", label: "Overview", icon: House },
  { key: "addresses", label: "Saved addresses", icon: MapPin },
  { key: "payments", label: "Payment methods", icon: CreditCard },
  { key: "favorites", label: "Favourites", icon: Heart },
];

const readProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("resvill_profile_v1") || "{}");
  } catch {
    return {};
  }
};

const formatMoney = (value) =>
  `₦${Number(value || 0).toLocaleString("en-NG")}`;

function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [profileForm, setProfileForm] = useState(() => {
    const saved = readProfile();
    return {
      fullName: saved.fullName || saved.name || "",
      phone: saved.phone || "",
      email: saved.email || "",
      birthday: saved.birthday || "",
      homeAddress: normalizeLocation(saved.homeAddress || saved.address),
      deliveryAddress: normalizeLocation(saved.deliveryAddress || saved.address),
      preferredPayment: saved.preferredPayment || "Cash on delivery",
      photoUrl: saved.photoUrl || "",
    };
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const orders = useMemo(() => getOrders(), []);
  const customerName = profileForm.fullName || "Resvill customer";
  const initials = customerName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const saveProfile = (event) => {
    event.preventDefault();
    localStorage.setItem(
      "resvill_profile_v1",
      JSON.stringify({
        ...readProfile(),
        name: profileForm.fullName,
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        email: profileForm.email,
        birthday: profileForm.birthday,
        homeAddress: profileForm.homeAddress,
        deliveryAddress: profileForm.deliveryAddress,
        address: profileForm.deliveryAddress.addressText,
        preferredPayment: profileForm.preferredPayment,
        photoUrl: profileForm.photoUrl,
      }),
    );
    window.dispatchEvent(new Event("resvill-profile-changed"));
    toast.success("Profile details updated.");
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const updateAddress = (field) => (location) => {
    setProfileForm((current) => ({ ...current, [field]: location }));
  };

  const updatePhoto = async (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("That image is too large. Please choose one under 8MB.");
      return;
    }

    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setProfileForm((current) => ({ ...current, photoUrl: dataUrl }));
      localStorage.setItem(
        "resvill_profile_v1",
        JSON.stringify({ ...readProfile(), photoUrl: dataUrl }),
      );
      window.dispatchEvent(new Event("resvill-profile-changed"));
      toast.success("Profile photo updated.");
    } catch (error) {
      toast.error(error.message || "Couldn't update your photo. Please try again.");
    }
  };

  const updatePassword = (event) => {
    event.preventDefault();

    if (passwordForm.next.length < 8) {
      toast.error("Your new password must be at least 8 characters.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setPasswordForm({ current: "", next: "", confirm: "" });
    toast.success("Password update is ready for backend connection.");
  };

  return (
    <main className="min-h-screen bg-dark-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary-500">
              My account
            </p>
            <h1 className="text-3xl font-extrabold text-dark-900 sm:text-4xl">
              Welcome back, {customerName.split(" ")[0]}
            </h1>
            <p className="mt-2 text-sm text-dark-600">
              Manage your personal details and saved preferences.
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

        <Row1
          name={customerName}
          initials={initials || "RC"}
          email={profileForm.email}
          phone={profileForm.phone}
          photoUrl={profileForm.photoUrl}
          onPhotoChange={updatePhoto}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit rounded-2xl border border-dark-200 bg-white p-3 shadow-soft">
            <div className="mb-3 flex items-center gap-3 border-b border-dark-100 px-3 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 font-heading font-bold text-primary-600">
                {initials || "RC"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-dark-900">{customerName}</p>
                <p className="truncate text-xs text-dark-600">
                  {profileForm.email || "Add your email"}
                </p>
              </div>
            </div>

            <nav className="space-y-1" aria-label="Profile navigation">
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

            <div className="mt-3 border-t border-dark-100 px-3 pt-3">
              <Link
                to="/order-history"
                className="flex items-center gap-2 text-xs font-bold text-primary-500 hover:text-primary-600"
              >
                <Package size={15} />
                View order history
              </Link>
            </div>
          </aside>

          <section className="min-w-0">
            {activeTab === "overview" && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard label="Total orders" value={orders.length || 0} />
                  <StatCard label="Saved favourites" value="8" />
                  <StatCard label="Reward points" value="240" accent />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <AccountCard
                    icon={MapPin}
                    title="Delivery address"
                    detail={profileForm.deliveryAddress.addressText || "No delivery address saved"}
                    action="Edit address"
                    onClick={() => setActiveTab("addresses")}
                  />
                  <AccountCard
                    icon={CreditCard}
                    title="Preferred payment"
                    detail={profileForm.preferredPayment}
                    action="Edit payment"
                    onClick={() => setActiveTab("payments")}
                  />
                </div>

                <ProfileForms
                  profileForm={profileForm}
                  passwordForm={passwordForm}
                  setPasswordForm={setPasswordForm}
                  updateField={updateField}
                  updateAddress={updateAddress}
                  saveProfile={saveProfile}
                  updatePassword={updatePassword}
                />
              </>
            )}

            {activeTab === "addresses" && (
              <ContentPanel title="Saved addresses" description="Edit the addresses used for your orders.">
                <AddressForm
                  profileForm={profileForm}
                  updateAddress={updateAddress}
                  saveProfile={saveProfile}
                />
              </ContentPanel>
            )}

            {activeTab === "payments" && (
              <ContentPanel title="Preferred payment" description="Choose your preferred payment method for checkout.">
                <PaymentForm
                  value={profileForm.preferredPayment}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      preferredPayment: event.target.value,
                    }))
                  }
                  onSave={saveProfile}
                />
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

function StatCard({ label, value, accent = false }) {
  return (
    <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft">
      <p className="text-sm text-dark-600">{label}</p>
      <p className={`mt-2 text-3xl font-extrabold ${accent ? "text-primary-500" : "text-dark-900"}`}>
        {value}
      </p>
    </div>
  );
}

function ProfileForms({ profileForm, passwordForm, setPasswordForm, updateField, updateAddress, saveProfile, updatePassword }) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <form onSubmit={saveProfile} className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">Account details</p>
          <h2 className="mt-1 text-xl font-bold text-dark-900">Your profile</h2>
          <p className="mt-1 text-sm text-dark-600">Keep your personal information and addresses up to date.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" name="fullName" value={profileForm.fullName} onChange={updateField} />
          <FormField label="Phone" name="phone" value={profileForm.phone} onChange={updateField} />
          <FormField label="Your email" type="email" name="email" value={profileForm.email} onChange={updateField} className="sm:col-span-2" />
          <FormField label="Your birthday" type="date" name="birthday" value={profileForm.birthday} onChange={updateField} className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <AddressAutocomplete
              label="Home address"
              value={profileForm.homeAddress}
              onChange={updateAddress("homeAddress")}
            />
          </div>
          <div className="sm:col-span-2">
            <AddressAutocomplete
              label="Delivery address"
              value={profileForm.deliveryAddress}
              onChange={updateAddress("deliveryAddress")}
              showInstructions
            />
          </div>
        </div>
        <button type="submit" className="mt-5 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600">
          Save profile and addresses
        </button>
      </form>

      <form onSubmit={updatePassword} className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">Security</p>
          <h2 className="mt-1 text-xl font-bold text-dark-900">Change password</h2>
          <p className="mt-1 text-sm text-dark-600">Use a strong password to keep your account safe.</p>
        </div>
        <div className="space-y-4">
          <FormField label="Current password" type="password" name="current" value={passwordForm.current} onChange={(event) => setPasswordForm((current) => ({ ...current, current: event.target.value }))} />
          <FormField label="New password" type="password" name="next" value={passwordForm.next} onChange={(event) => setPasswordForm((current) => ({ ...current, next: event.target.value }))} />
          <FormField label="Confirm new password" type="password" name="confirm" value={passwordForm.confirm} onChange={(event) => setPasswordForm((current) => ({ ...current, confirm: event.target.value }))} />
        </div>
        <button type="submit" className="mt-5 rounded-xl border border-primary-500 px-6 py-3 text-sm font-bold text-primary-500 transition hover:bg-primary-50">
          Update password
        </button>
      </form>
    </div>
  );
}

function AddressForm({ profileForm, updateAddress, saveProfile }) {
  return (
    <form onSubmit={saveProfile} className="space-y-5">
      <AddressAutocomplete
        label="Home address"
        value={profileForm.homeAddress}
        onChange={updateAddress("homeAddress")}
      />
      <AddressAutocomplete
        label="Delivery address"
        value={profileForm.deliveryAddress}
        onChange={updateAddress("deliveryAddress")}
        showInstructions
      />
      <button type="submit" className="rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white hover:bg-primary-600">
        Save addresses
      </button>
    </form>
  );
}

function PaymentForm({ value, onChange, onSave }) {
  return (
    <form onSubmit={onSave} className="space-y-4">
      <label className="block text-sm font-bold text-dark-800">
        Preferred payment method
        <select value={value} onChange={onChange} className="mt-2 w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-500">
          <option>Cash on delivery</option>
          <option>Paystack</option>
          <option>Card payment</option>
          <option>Bank transfer</option>
        </select>
      </label>
      <p className="text-xs leading-5 text-dark-500">
        Actual payment methods and saved cards will be connected securely through the backend.
      </p>
      <button type="submit" className="rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white hover:bg-primary-600">
        Save preferred payment
      </button>
    </form>
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

function AccountCard({ icon: Icon, title, detail, action, onClick }) {
  return (
    <div className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
          <Icon size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-dark-900">{title}</h3>
          <p className="mt-1 text-sm text-dark-600">{detail}</p>
          <button type="button" onClick={onClick} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-500 hover:text-primary-600">
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
      <p className="mb-5 mt-1 text-sm text-dark-600">{description}</p>
      {children}
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