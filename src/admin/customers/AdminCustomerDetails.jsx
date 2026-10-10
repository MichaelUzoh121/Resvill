import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  ShieldCheck,
  ShieldX,
  MapPin,
  ShoppingBag,
  Wallet,
  Star,
  CalendarDays,
  Loader2,
  AlertCircle,
  Power,
  MoreHorizontal,
  CircleCheck,
  Clock3,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useAdminCustomerDetails,
  useUpdateAdminCustomerStatus,
} from "../hooks/useAdminCustomers";

const formatNumber = (value = 0) =>
  Number(value || 0).toLocaleString("en-NG");

const formatNaira = (value = 0) =>
  `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getCustomerName = (customer) => {
  const name = `${customer?.firstname || ""} ${
    customer?.lastname || ""
  }`.trim();

  return name || "Unnamed Customer";
};

const getInitials = (customer) => {
  const first = customer?.firstname?.[0] || "";
  const last = customer?.lastname?.[0] || "";

  return `${first}${last}`.toUpperCase() || "C";
};

const getOrderStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (
    ["delivered", "completed", "paid", "success"].includes(
      normalized,
    )
  ) {
    return "bg-success/10 text-success";
  }

  if (
    ["cancelled", "canceled", "failed", "refunded"].includes(
      normalized,
    )
  ) {
    return "bg-danger/10 text-danger";
  }

  if (
    ["pending", "processing", "preparing", "confirmed"].includes(
      normalized,
    )
  ) {
    return "bg-warning/10 text-warning";
  }

  return "bg-dark-100 text-dark-600";
};

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-50 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />

      <div className="relative">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </div>

        <p className="mt-4 text-xs font-semibold text-dark-500">
          {label}
        </p>

        <p className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-dark-900">
          {value}
        </p>

        {description && (
          <p className="mt-1.5 text-xs text-dark-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-dark-50 text-dark-500">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-dark-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function AdminCustomerDetails() {
  const { customerId } = useParams();

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdminCustomerDetails(customerId);

  const updateStatus = useUpdateAdminCustomerStatus();

  const customer = data?.customer;
  const statistics = data?.statistics || {};
  const recentOrders = data?.recentOrders || [];

  const handleStatusChange = async () => {
    if (!customer) return;

    const nextStatus = !customer.isActive;

    try {
      setUpdatingStatus(true);

      await updateStatus.mutateAsync({
        customerId,
        isActive: nextStatus,
      });

      toast.success(
        nextStatus
          ? "Customer activated successfully"
          : "Customer deactivated successfully",
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update customer status",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
            <Loader2
              size={25}
              className="animate-spin"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-dark-700">
            Loading customer...
          </p>

          <p className="mt-1 text-xs text-dark-500">
            Fetching customer profile and activity.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-dark-100 bg-white p-8 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertCircle size={28} />
          </div>

          <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-danger">
            Customer error
          </p>

          <h2 className="mt-2 font-heading text-xl font-bold text-dark-900">
            Failed to load customer
          </h2>

          <p className="mt-2 text-sm leading-6 text-dark-500">
            {error?.message ||
              "The customer could not be found."}
          </p>

          <Link
            to="/admin/customers"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white transition hover:bg-primary-600 hover:shadow-hover"
          >
            <ArrowLeft size={16} />
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  const customerName = getCustomerName(customer);
  const initials = getInitials(customer);

  return (
    <div className="space-y-8">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <section>
        <Link
          to="/admin/customers"
          className="inline-flex items-center gap-2 text-xs font-bold text-dark-500 transition hover:text-primary-500"
        >
          <ArrowLeft size={15} />
          Back to Customers
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary-500">
              Customer Management
            </p>

            <h1 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-dark-900 sm:text-3xl">
              Customer Details
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
              View customer information, activity,
              loyalty and recent order history.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStatusChange}
            disabled={updatingStatus}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
              customer.isActive
                ? "border border-danger/20 bg-danger/5 text-danger hover:bg-danger/10"
                : "bg-primary-500 text-white hover:bg-primary-600 hover:shadow-hover"
            }`}
          >
            {updatingStatus ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Power size={17} />
            )}

            {customer.isActive
              ? "Deactivate Customer"
              : "Activate Customer"}
          </button>
        </div>
      </section>

      {/* =====================================================
          PROFILE HERO
      ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-dark-950 shadow-card">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-56 w-56 rounded-full bg-primary-500/10 blur-3xl" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
              {/* Avatar */}
              {customer.profileImage ? (
                <img
                  src={customer.profileImage}
                  alt={customerName}
                  className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white/10 object-cover sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-500 font-heading text-2xl font-extrabold text-white shadow-lg sm:h-24 sm:w-24">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-2xl font-extrabold tracking-tight text-white">
                    {customerName}
                  </h2>

                  {customer.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-success">
                      <ShieldCheck size={12} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-warning">
                      <ShieldX size={12} />
                      Unverified
                    </span>
                  )}

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      customer.isActive
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {customer.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <div className="mt-3 flex flex-col gap-2 text-xs text-dark-400 sm:flex-row sm:flex-wrap sm:gap-4">
                  <span className="inline-flex items-center gap-2">
                    <Mail size={14} />
                    {customer.email || "No email"}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Phone size={14} />
                    {customer.phone || "No phone"}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} />
                    Joined {formatDate(customer.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 lg:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-dark-300">
                <User size={17} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-500">
                  Customer ID
                </p>

                <p className="mt-1 max-w-[180px] truncate text-xs font-semibold text-dark-300">
                  {customer._id || customerId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CUSTOMER METRICS
      ===================================================== */}
      <section>
        <div className="mb-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary-500">
            Customer value
          </p>

          <h2 className="mt-1 font-heading text-xl font-bold text-dark-900">
            Customer overview
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Orders"
            value={formatNumber(
              statistics.totalOrders,
            )}
            description="All orders placed"
            icon={ShoppingBag}
            iconClass="bg-info/10 text-info"
          />

          <StatCard
            label="Paid Orders"
            value={formatNumber(
              statistics.paidOrders,
            )}
            description="Successfully paid"
            icon={CircleCheck}
            iconClass="bg-success/10 text-success"
          />

          <StatCard
            label="Total Spent"
            value={formatNaira(
              statistics.totalSpent,
            )}
            description="Customer lifetime spend"
            icon={Wallet}
            iconClass="bg-primary-50 text-primary-500"
          />

          <StatCard
            label="Loyalty Points"
            value={formatNumber(
              customer.loyaltyPoints,
            )}
            description="Available loyalty balance"
            icon={Star}
            iconClass="bg-warning/10 text-warning"
          />
        </div>
      </section>

      {/* =====================================================
          CUSTOMER INFORMATION
      ===================================================== */}
      <section>
        <div className="mb-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary-500">
            Profile
          </p>

          <h2 className="mt-1 font-heading text-xl font-bold text-dark-900">
            Customer information
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact */}
          <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <User size={18} />
              </div>

              <div>
                <h3 className="font-heading text-sm font-bold text-dark-900">
                  Contact information
                </h3>

                <p className="mt-1 text-xs text-dark-500">
                  Customer contact and account details.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <InfoRow
                icon={Mail}
                label="Email"
                value={customer.email}
              />

              <InfoRow
                icon={Phone}
                label="Phone"
                value={customer.phone}
              />

              <InfoRow
                icon={CalendarDays}
                label="Joined"
                value={formatDate(
                  customer.createdAt,
                )}
              />

              <InfoRow
                icon={Clock3}
                label="Last login"
                value={formatDate(
                  customer.lastLoginAt,
                )}
              />
            </div>
          </div>

          {/* Addresses */}
          <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <MapPin size={18} />
              </div>

              <div>
                <h3 className="font-heading text-sm font-bold text-dark-900">
                  Saved addresses
                </h3>

                <p className="mt-1 text-xs text-dark-500">
                  Delivery addresses saved by this customer.
                </p>
              </div>
            </div>

            {customer.addresses?.length ? (
              <div className="mt-6 space-y-3">
                {customer.addresses.map(
                  (address, index) => (
                    <div
                      key={
                        address._id || index
                      }
                      className="rounded-2xl border border-dark-100 bg-dark-50/70 p-4 transition hover:border-primary-100 hover:bg-primary-50/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary-500 shadow-sm">
                          <MapPin size={15} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-dark-900">
                            {address.label ||
                              address.name ||
                              `Address ${
                                index + 1
                              }`}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-dark-600">
                            {[
                              address.address,
                              address.city,
                              address.state,
                            ]
                              .filter(Boolean)
                              .join(", ") ||
                              "Address details unavailable"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-dark-50 p-7 text-center">
                <MapPin
                  size={26}
                  className="mx-auto text-dark-300"
                />

                <p className="mt-2 text-sm font-semibold text-dark-600">
                  No saved addresses
                </p>

                <p className="mt-1 text-xs text-dark-400">
                  This customer has not saved a delivery address.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          RECENT ORDERS
      ===================================================== */}
      <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
        <div className="border-b border-dark-100 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary-500">
                Order activity
              </p>

              <h2 className="mt-1 font-heading text-lg font-bold text-dark-900">
                Recent orders
              </h2>

              <p className="mt-1 text-xs text-dark-500">
                Latest orders associated with this customer.
              </p>
            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500 sm:flex">
              <ShoppingBag size={18} />
            </div>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-dark-50 text-dark-300">
              <ShoppingBag size={23} />
            </div>

            <p className="mt-4 text-sm font-bold text-dark-700">
              No recent orders
            </p>

            <p className="mt-1 text-xs text-dark-500">
              This customer has no recent order activity.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50/60 text-left">
                  <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-dark-500 sm:px-6">
                    Order
                  </th>

                  <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-dark-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.12em] text-dark-500">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.12em] text-dark-500 sm:px-6">
                    Date
                  </th>

                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>

              <tbody className="divide-y divide-dark-100">
                {recentOrders.map(
                  (order, index) => {
                    const status =
                      order.status ||
                      "Unknown";

                    return (
                      <tr
                        key={
                          order._id ||
                          index
                        }
                        className="transition hover:bg-dark-50/50"
                      >
                        <td className="px-5 py-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-dark-50 text-dark-500">
                              <ShoppingBag
                                size={15}
                              />
                            </div>

                            <div>
                              <p className="max-w-[190px] truncate text-sm font-bold text-dark-900">
                                {order.orderNumber ||
                                  order._id ||
                                  `Order ${
                                    index +
                                    1
                                  }`}
                              </p>

                              <p className="mt-1 text-[10px] text-dark-400">
                                Order #{index + 1}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${getOrderStatusClass(
                              status,
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <p className="text-sm font-bold text-dark-900">
                            {formatNaira(
                              order.total ??
                                order.totalAmount ??
                                order.grandTotal,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-right sm:px-6">
                          <p className="text-xs font-medium text-dark-500">
                            {formatDate(
                              order.createdAt ||
                                order.orderDate,
                            )}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-dark-400 transition hover:bg-dark-100 hover:text-dark-700"
                            aria-label="Order actions"
                          >
                            <MoreHorizontal
                              size={17}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminCustomerDetails;