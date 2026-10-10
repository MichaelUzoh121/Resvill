import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Info,
  Pencil,
  Power,
  PowerOff,
  Ticket,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useAdminCoupon,
  useAdminCouponUsage,
  useDeleteAdminCoupon,
  useUpdateAdminCouponStatus,
} from "../hooks/useAdminCoupons";

const formatDateTime = (date) => {
  if (!date) return "—";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "—";
  }

  return value.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatMoney = (value) => {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
};

const getCouponStatus = (coupon) => {
  if (!coupon) return null;

  const now = new Date();
  const startsAt = new Date(coupon.startsAt);
  const expiresAt = new Date(coupon.expiresAt);

  if (!coupon.isActive) {
    return {
      label: "Inactive",
      className: "bg-dark-100 text-dark-600",
      icon: PowerOff,
    };
  }

  if (startsAt > now) {
    return {
      label: "Upcoming",
      className: "bg-info/10 text-info",
      icon: Clock3,
    };
  }

  if (expiresAt < now) {
    return {
      label: "Expired",
      className: "bg-danger/10 text-danger",
      icon: Clock3,
    };
  }

  return {
    label: "Active",
    className: "bg-success/10 text-success",
    icon: CheckCircle2,
  };
};

const getDiscountText = (coupon) => {
  if (coupon.type === "percentage") {
    return `${coupon.value}%`;
  }

  if (coupon.type === "fixed") {
    return formatMoney(coupon.value);
  }

  return "Free Delivery";
};

const getTypeLabel = (type) => {
  if (!type) return "—";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getCustomerName = (user) => {
  if (!user) return "Unknown User";

  const name = `${user.firstname || ""} ${user.lastname || ""}`.trim();

  return name || "Unknown User";
};

const getInitials = (user) => {
  const name = getCustomerName(user);

  if (name === "Unknown User") return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

function AdminCouponDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdminCoupon(id);

  const {
    data: usageData,
    isLoading: usageLoading,
  } = useAdminCouponUsage(id);

  const updateStatus = useUpdateAdminCouponStatus();
  const deleteCoupon = useDeleteAdminCoupon();

  const coupon = data;
  const usage = usageData?.usage;

  const handleToggleStatus = () => {
    if (!coupon) return;

    updateStatus.mutate(
      {
        couponId: id,
        isActive: !coupon.isActive,
      },
      {
        onSuccess: () => {
          toast.success(
            coupon.isActive
              ? "Coupon deactivated"
              : "Coupon activated"
          );
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.message ||
              "Failed to update coupon status"
          );
        },
      }
    );
  };

  const handleDelete = () => {
    if (!coupon) return;

    if (coupon.usageCount > 0) {
      toast.error(
        "This coupon has existing usage. Deactivate it instead."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete coupon "${coupon.code}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    deleteCoupon.mutate(id, {
      onSuccess: () => {
        toast.success("Coupon deleted");
        navigate("/admin/coupons");
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message ||
            "Failed to delete coupon"
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-dark-100" />
          <div className="space-y-2">
            <div className="h-6 w-40 animate-pulse rounded-lg bg-dark-100" />
            <div className="h-4 w-64 animate-pulse rounded-lg bg-dark-100" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-dark-100"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-2xl bg-dark-100" />
          <div className="h-72 animate-pulse rounded-2xl bg-dark-100" />
        </div>

        <div className="h-80 animate-pulse rounded-2xl bg-dark-100" />
      </div>
    );
  }

  if (isError || !coupon) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => navigate("/admin/coupons")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition hover:text-dark-900"
        >
          <ArrowLeft size={18} />
          Back to Coupons
        </button>

        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <Info size={20} />
            </div>

            <div>
              <h2 className="font-heading font-semibold text-dark-900">
                Unable to load coupon
              </h2>

              <p className="mt-1 text-sm text-dark-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Coupon could not be loaded."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const status = getCouponStatus(coupon);
  const StatusIcon = status?.icon || Info;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/coupons")}
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-100 bg-white text-dark-500 transition hover:border-dark-200 hover:bg-dark-50 hover:text-dark-900"
            aria-label="Back to coupons"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <Ticket size={19} />
              </div>

              <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900">
                {coupon.code}
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
              >
                <StatusIcon size={13} />
                {status.label}
              </span>
            </div>

            <p className="mt-2 text-sm text-dark-500">
              Coupon details, conditions and usage information.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/admin/coupons/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 hover:text-dark-900"
          >
            <Pencil size={16} />
            Edit
          </Link>

          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={updateStatus.isPending}
            className="inline-flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 hover:text-dark-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {coupon.isActive ? (
              <PowerOff size={16} />
            ) : (
              <Power size={16} />
            )}

            {coupon.isActive ? "Deactivate" : "Activate"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={
              deleteCoupon.isPending ||
              coupon.usageCount > 0
            }
            title={
              coupon.usageCount > 0
                ? "Coupons with existing usage cannot be deleted"
                : "Delete coupon"
            }
            className="inline-flex items-center gap-2 rounded-xl border border-danger/20 bg-white px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-dark-500">
                Discount
              </p>

              <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
                {getDiscountText(coupon)}
              </p>

              <p className="mt-1 text-xs text-dark-400">
                {getTypeLabel(coupon.type)}
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <Ticket size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-dark-500">
                Minimum Order
              </p>

              <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
                {formatMoney(coupon.minimumOrderAmount)}
              </p>

              <p className="mt-1 text-xs text-dark-400">
                Required cart value
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <CircleDollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-dark-500">
                Usage
              </p>

              <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
                {coupon.usageCount || 0}
                <span className="ml-1 text-base font-semibold text-dark-400">
                  /
                  {coupon.usageLimit == null
                    ? "∞"
                    : coupon.usageLimit}
                </span>
              </p>

              <p className="mt-1 text-xs text-dark-400">
                Total coupon uses
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-dark-500">
                Per User Limit
              </p>

              <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
                {coupon.perUserLimit ?? "—"}
              </p>

              <p className="mt-1 text-xs text-dark-400">
                Maximum uses per customer
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <Clock3 size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Coupon Information */}
        <div className="rounded-2xl border border-dark-100 bg-white shadow-soft xl:col-span-2">
          <div className="border-b border-dark-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                <Ticket size={18} />
              </div>

              <div>
                <h2 className="font-heading font-semibold text-dark-900">
                  Coupon Information
                </h2>

                <p className="mt-0.5 text-xs text-dark-500">
                  Rules and configuration for this coupon.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-dark-400">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-dark-700">
                {coupon.description || "No description provided."}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-dark-400">
                Coupon Type
              </p>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {getTypeLabel(coupon.type)}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-dark-400">
                Discount Value
              </p>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {getDiscountText(coupon)}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-dark-400">
                Minimum Order
              </p>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {formatMoney(coupon.minimumOrderAmount)}
              </p>
            </div>

            {coupon.type === "percentage" &&
              coupon.maximumDiscountAmount != null && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-dark-400">
                    Maximum Discount
                  </p>

                  <p className="mt-2 text-sm font-semibold text-dark-800">
                    {formatMoney(
                      coupon.maximumDiscountAmount
                    )}
                  </p>
                </div>
              )}

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-dark-400">
                Usage Limit
              </p>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {coupon.usageLimit == null
                  ? "Unlimited"
                  : coupon.usageLimit}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                <CalendarDays size={18} />
              </div>

              <div>
                <h2 className="font-heading font-semibold text-dark-900">
                  Schedule
                </h2>

                <p className="mt-0.5 text-xs text-dark-500">
                  Coupon availability window.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-dark-100">
            <div className="px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-dark-400">
                Starts At
              </p>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {formatDateTime(coupon.startsAt)}
              </p>
            </div>

            <div className="px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-dark-400">
                Expires At
              </p>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {formatDateTime(coupon.expiresAt)}
              </p>
            </div>

            <div className="px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-dark-400">
                Created At
              </p>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {formatDateTime(coupon.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
        <div className="flex flex-col gap-2 border-b border-dark-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading font-semibold text-dark-900">
              Coupon Usage
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Customers who have used this coupon.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-600">
            <Users size={14} />
            {coupon.usageCount || 0} use
            {coupon.usageCount === 1 ? "" : "s"}
          </div>
        </div>

        {usageLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-dark-50"
              />
            ))}
          </div>
        ) : !usage?.usedBy?.length ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-dark-50 text-dark-300">
              <Users size={25} />
            </div>

            <p className="mt-4 font-semibold text-dark-800">
              No usage yet
            </p>

            <p className="mx-auto mt-1 max-w-sm text-sm text-dark-500">
              Customers who use this coupon will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50/70">
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-dark-500">
                    Customer
                  </th>

                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-dark-500">
                    Email
                  </th>

                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-dark-500">
                    Used At
                  </th>
                </tr>
              </thead>

              <tbody>
                {usage.usedBy.map((entry, index) => {
                  const user = entry.user;

                  return (
                    <tr
                      key={
                        entry._id ||
                        `${user?._id || "user"}-${index}`
                      }
                      className="border-b border-dark-100 last:border-0 hover:bg-dark-50/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
                            {getInitials(user)}
                          </div>

                          <span className="text-sm font-semibold text-dark-800">
                            {getCustomerName(user)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-dark-600">
                        {user?.email || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-dark-600">
                        {formatDateTime(entry.usedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCouponDetails;