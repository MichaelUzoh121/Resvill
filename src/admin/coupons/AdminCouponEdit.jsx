import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CircleDollarSign,
  Info,
  Save,
  Ticket,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useAdminCoupon,
  useUpdateAdminCoupon,
} from "../hooks/useAdminCoupons";

const formatDateTimeLocal = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const offset = value.getTimezoneOffset();

  return new Date(value.getTime() - offset * 60 * 1000)
    .toISOString()
    .slice(0, 16);
};

function AdminCouponEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdminCoupon(id);

  const updateCoupon = useUpdateAdminCoupon();

  const [form, setForm] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    minimumOrderAmount: "",
    maximumDiscountAmount: "",
    usageLimit: "",
    perUserLimit: "1",
    startsAt: "",
    expiresAt: "",
    isActive: true,
  });

  useEffect(() => {
    const coupon = data;

    if (!coupon) return;

    setForm({
      code: coupon.code || "",
      description: coupon.description || "",
      type: coupon.type || "percentage",
      value:
        coupon.value !== undefined && coupon.value !== null
          ? String(coupon.value)
          : "",
      minimumOrderAmount:
        coupon.minimumOrderAmount !== undefined &&
        coupon.minimumOrderAmount !== null
          ? String(coupon.minimumOrderAmount)
          : "",
      maximumDiscountAmount:
        coupon.maximumDiscountAmount !== undefined &&
        coupon.maximumDiscountAmount !== null
          ? String(coupon.maximumDiscountAmount)
          : "",
      usageLimit:
        coupon.usageLimit !== undefined &&
        coupon.usageLimit !== null
          ? String(coupon.usageLimit)
          : "",
      perUserLimit:
        coupon.perUserLimit !== undefined &&
        coupon.perUserLimit !== null
          ? String(coupon.perUserLimit)
          : "1",
      startsAt: formatDateTimeLocal(coupon.startsAt),
      expiresAt: formatDateTimeLocal(coupon.expiresAt),
      isActive: Boolean(coupon.isActive),
    });
  }, [data]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;

    setForm((current) => ({
      ...current,
      type,
      value:
        type === "free_delivery"
          ? "0"
          : current.type === "free_delivery"
            ? ""
            : current.value,
      maximumDiscountAmount:
        type === "percentage"
          ? current.maximumDiscountAmount
          : "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.code.trim()) {
      toast.error("Coupon code is required.");
      return;
    }

    if (form.code.trim().length < 3) {
      toast.error("Coupon code must be at least 3 characters.");
      return;
    }

    if (!form.expiresAt) {
      toast.error("Expiration date is required.");
      return;
    }

    if (
      form.type !== "free_delivery" &&
      (!form.value || Number(form.value) <= 0)
    ) {
      toast.error("Enter a valid coupon value.");
      return;
    }

    if (
      form.type === "percentage" &&
      Number(form.value) > 100
    ) {
      toast.error("Percentage discount cannot exceed 100%.");
      return;
    }

    if (
      form.type === "free_delivery" &&
      Number(form.value || 0) !== 0
    ) {
      toast.error(
        "Free delivery coupons must have a value of 0."
      );
      return;
    }

    const startsAt = form.startsAt
      ? new Date(form.startsAt)
      : new Date();

    const expiresAt = new Date(form.expiresAt);

    if (expiresAt <= startsAt) {
      toast.error(
        "Expiration date must be after the start date."
      );
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      type: form.type,
      value:
        form.type === "free_delivery"
          ? 0
          : Number(form.value),
      minimumOrderAmount:
        form.minimumOrderAmount === ""
          ? 0
          : Number(form.minimumOrderAmount),
      maximumDiscountAmount:
        form.type === "percentage" &&
        form.maximumDiscountAmount !== ""
          ? Number(form.maximumDiscountAmount)
          : null,
      usageLimit:
        form.usageLimit === ""
          ? null
          : Number(form.usageLimit),
      perUserLimit:
        form.perUserLimit === ""
          ? 1
          : Number(form.perUserLimit),
      startsAt: startsAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isActive: Boolean(form.isActive),
    };

    updateCoupon.mutate(
      {
        couponId: id,
        couponData: payload,
      },
      {
        onSuccess: () => {
          toast.success("Coupon updated successfully.");
          navigate(`/admin/coupons/${id}`);
        },

        onError: (err) => {
          toast.error(
            err?.response?.data?.message ||
              "Failed to update coupon."
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-dark-100" />

          <div className="space-y-2">
            <div className="h-6 w-40 animate-pulse rounded-lg bg-dark-100" />
            <div className="h-4 w-64 animate-pulse rounded-lg bg-dark-100" />
          </div>
        </div>

        <div className="h-[620px] animate-pulse rounded-2xl bg-dark-100" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
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

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() =>
            navigate(`/admin/coupons/${id}`)
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-100 bg-white text-dark-500 transition hover:border-dark-200 hover:bg-dark-50 hover:text-dark-900"
          aria-label="Back to coupon"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <Ticket size={19} />
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900">
              Edit Coupon
            </h1>
          </div>

          <p className="mt-2 text-sm text-dark-500">
            Update the settings for{" "}
            <span className="font-semibold text-dark-700">
              {data.code}
            </span>
            .
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                <Ticket size={18} />
              </div>

              <div>
                <h2 className="font-heading font-semibold text-dark-900">
                  Basic Information
                </h2>

                <p className="mt-0.5 text-xs text-dark-500">
                  Update the coupon code and discount configuration.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            {/* Code */}
            <div>
              <label
                htmlFor="coupon-code"
                className="mb-2 block text-sm font-semibold text-dark-700"
              >
                Coupon Code
              </label>

              <input
                id="coupon-code"
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                maxLength={50}
                autoComplete="off"
                className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm font-semibold uppercase text-dark-900 outline-none transition placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
              />

              <p className="mt-1.5 text-xs text-dark-400">
                Letters, numbers, underscores and hyphens only.
              </p>
            </div>

            {/* Type */}
            <div>
              <label
                htmlFor="coupon-type"
                className="mb-2 block text-sm font-semibold text-dark-700"
              >
                Coupon Type
              </label>

              <select
                id="coupon-type"
                name="type"
                value={form.type}
                onChange={handleTypeChange}
                className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm text-dark-800 outline-none transition hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
              >
                <option value="percentage">
                  Percentage Discount
                </option>

                <option value="fixed">
                  Fixed Amount Discount
                </option>

                <option value="free_delivery">
                  Free Delivery
                </option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="coupon-description"
                className="mb-2 block text-sm font-semibold text-dark-700"
              >
                Description
              </label>

              <textarea
                id="coupon-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                rows={4}
                placeholder="Describe what this coupon offers..."
                className="w-full resize-none rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
              />

              <div className="mt-1.5 flex justify-end">
                <span className="text-xs text-dark-400">
                  {form.description.length}/500
                </span>
              </div>
            </div>

            {/* Value */}
            <div>
              <label
                htmlFor="coupon-value"
                className="mb-2 block text-sm font-semibold text-dark-700"
              >
                {form.type === "percentage"
                  ? "Discount Percentage"
                  : form.type === "fixed"
                    ? "Discount Amount"
                    : "Coupon Value"}
              </label>

              <div className="relative">
                {form.type === "fixed" && (
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-dark-400">
                    ₦
                  </span>
                )}

                <input
                  id="coupon-value"
                  type="number"
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  min="0"
                  max={
                    form.type === "percentage"
                      ? "100"
                      : undefined
                  }
                  step={
                    form.type === "percentage"
                      ? "1"
                      : "0.01"
                  }
                  disabled={form.type === "free_delivery"}
                  placeholder={
                    form.type === "free_delivery"
                      ? "0"
                      : form.type === "percentage"
                        ? "e.g. 10"
                        : "e.g. 2000"
                  }
                  className={`w-full rounded-xl border border-dark-200 bg-white py-3 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 disabled:cursor-not-allowed disabled:bg-dark-50 disabled:text-dark-400 ${
                    form.type === "fixed"
                      ? "pl-9 pr-3.5"
                      : "px-3.5"
                  }`}
                />
              </div>
            </div>

            {/* Maximum Discount */}
            {form.type === "percentage" && (
              <div>
                <label
                  htmlFor="maximum-discount"
                  className="mb-2 block text-sm font-semibold text-dark-700"
                >
                  Maximum Discount
                  <span className="ml-1 font-normal text-dark-400">
                    (Optional)
                  </span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-dark-400">
                    ₦
                  </span>

                  <input
                    id="maximum-discount"
                    type="number"
                    name="maximumDiscountAmount"
                    value={form.maximumDiscountAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="No maximum"
                    className="w-full rounded-xl border border-dark-200 bg-white py-3 pl-9 pr-3.5 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                  />
                </div>

                <p className="mt-1.5 text-xs text-dark-400">
                  Limits the amount saved when using a percentage coupon.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Conditions */}
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                <Users size={18} />
              </div>

              <div>
                <h2 className="font-heading font-semibold text-dark-900">
                  Coupon Conditions
                </h2>

                <p className="mt-0.5 text-xs text-dark-500">
                  Configure order and usage restrictions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">
            {/* Minimum Order */}
            <div>
              <label
                htmlFor="minimum-order"
                className="mb-2 block text-sm font-semibold text-dark-700"
              >
                Minimum Order
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-dark-400">
                  ₦
                </span>

                <input
                  id="minimum-order"
                  type="number"
                  name="minimumOrderAmount"
                  value={form.minimumOrderAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="w-full rounded-xl border border-dark-200 bg-white py-3 pl-9 pr-3.5 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                />
              </div>
            </div>

            {/* Usage Limit */}
            <div>
              <label
                htmlFor="usage-limit"
                className="mb-2 block text-sm font-semibold text-dark-700"
              >
                Total Usage Limit
                <span className="ml-1 font-normal text-dark-400">
                  (Optional)
                </span>
              </label>

              <input
                id="usage-limit"
                type="number"
                name="usageLimit"
                value={form.usageLimit}
                onChange={handleChange}
                min="1"
                step="1"
                placeholder="Unlimited"
                className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
              />
            </div>

            {/* Per User */}
            <div>
              <label
                htmlFor="per-user-limit"
                className="mb-2 block text-sm font-semibold text-dark-700"
              >
                Uses Per User
              </label>

              <input
                id="per-user-limit"
                type="number"
                name="perUserLimit"
                value={form.perUserLimit}
                onChange={handleChange}
                min="1"
                step="1"
                className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
              />
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                <CalendarDays size={18} />
              </div>

              <div>
                <h2 className="font-heading font-semibold text-dark-900">
                  Coupon Schedule
                </h2>

                <p className="mt-0.5 text-xs text-dark-500">
                  Define when this coupon becomes valid and expires.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="starts-at"
                className="mb-2 block text-sm font-semibold text-dark-700"
              >
                Starts At
              </label>

              <input
                id="starts-at"
                type="datetime-local"
                name="startsAt"
                value={form.startsAt}
                onChange={handleChange}
                className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm text-dark-800 outline-none transition hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
              />

              <p className="mt-1.5 text-xs text-dark-400">
                The coupon cannot be used before this time.
              </p>
            </div>

            <div>
              <label
                htmlFor="expires-at"
                className="mb-2 block text-sm font-semibold text-dark-700"
              >
                Expires At
              </label>

              <input
                id="expires-at"
                type="datetime-local"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
                min={form.startsAt || undefined}
                className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm text-dark-800 outline-none transition hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
              />

              <p className="mt-1.5 text-xs text-dark-400">
                The coupon will stop being valid after this time.
              </p>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 px-6 py-5">
            <h2 className="font-heading font-semibold text-dark-900">
              Coupon Status
            </h2>

            <p className="mt-0.5 text-xs text-dark-500">
              Control whether this coupon is available for use.
            </p>
          </div>

          <div className="p-6">
            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-dark-100 bg-dark-50/50 p-4 transition hover:border-primary-200 hover:bg-primary-50/30">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                  form.isActive
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-dark-300 bg-white"
                }`}
              >
                {form.isActive && <Check size={14} strokeWidth={3} />}
              </span>

              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="sr-only"
              />

              <span>
                <span className="block text-sm font-semibold text-dark-800">
                  Coupon is active
                </span>

                <span className="mt-1 block text-sm leading-5 text-dark-500">
                  Active coupons can be used when they are within their
                  scheduled validity period.
                </span>
              </span>
            </label>
          </div>
        </section>

        {/* Current configuration summary */}
        <section className="rounded-2xl border border-primary-100 bg-primary-50/50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-500 shadow-sm">
              <CircleDollarSign size={18} />
            </div>

            <div className="min-w-0">
              <h3 className="font-heading text-sm font-semibold text-dark-900">
                Update summary
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-dark-500">
                    Code
                  </p>
                  <p className="mt-0.5 font-semibold text-dark-800">
                    {form.code || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-dark-500">
                    Discount
                  </p>
                  <p className="mt-0.5 font-semibold text-dark-800">
                    {form.type === "percentage"
                      ? `${form.value || 0}%`
                      : form.type === "fixed"
                        ? `₦${Number(
                            form.value || 0
                          ).toLocaleString("en-NG")}`
                        : "Free Delivery"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-dark-500">
                    Status
                  </p>
                  <p className="mt-0.5 font-semibold text-dark-800">
                    {form.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-dark-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate(`/admin/coupons/${id}`)
            }
            className="rounded-xl border border-dark-200 bg-white px-5 py-3 text-sm font-semibold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 hover:text-dark-900"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updateCoupon.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {updateCoupon.isPending
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCouponEdit;