import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Info,
  Loader2,
  Percent,
  Plus,
  Save,
  Ticket,
  WalletCards,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCreateAdminCoupon } from "../hooks/useAdminCoupons";

const INITIAL_FORM = {
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
};

const toDateTimeLocal = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const offset = value.getTimezoneOffset();

  const localDate = new Date(
    value.getTime() - offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
};

const formatNaira = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₦0";
  }

  return `₦${amount.toLocaleString("en-NG", {
    maximumFractionDigits: 2,
  })}`;
};

function FieldLabel({
  children,
  optional = false,
}) {
  return (
    <label className="mb-2 block text-sm font-semibold text-dark-700">
      {children}

      {optional && (
        <span className="ml-1 font-normal text-dark-400">
          (Optional)
        </span>
      )}
    </label>
  );
}

function AdminCouponCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    startsAt: toDateTimeLocal(new Date()),
  }));

  const createCoupon = useCreateAdminCoupon();

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox" ? checked : value,
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
      toast.error(
        "Coupon code must be at least 3 characters."
      );
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
      toast.error(
        "Percentage discount cannot exceed 100%."
      );
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

    createCoupon.mutate(payload, {
      onSuccess: () => {
        toast.success("Coupon created successfully.");
        navigate("/admin/coupons");
      },

      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            "Failed to create coupon."
        );
      },
    });
  };

  const previewDiscount = useMemo(() => {
    if (form.type === "free_delivery") {
      return "Free Delivery";
    }

    if (!form.value) {
      return "—";
    }

    if (form.type === "percentage") {
      return `${Number(form.value) || 0}% OFF`;
    }

    return `${formatNaira(form.value)} OFF`;
  }, [form.type, form.value]);

  const previewMinimum = useMemo(() => {
    if (!form.minimumOrderAmount) {
      return "No minimum";
    }

    return `Minimum ${formatNaira(
      form.minimumOrderAmount
    )}`;
  }, [form.minimumOrderAmount]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/coupons")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition hover:text-primary-600"
          >
            <ArrowLeft size={17} />
            Back to Coupons
          </button>

          <div className="flex items-start gap-3">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 sm:flex">
              <Ticket size={21} />
            </div>

            <div>
              <h1 className="font-heading text-2xl font-bold text-dark-900">
                Create Coupon
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-dark-500">
                Create a promotional coupon with its discount,
                usage limits, and validity period.
              </p>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 sm:min-w-[220px]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary-600">
            Coupon Preview
          </p>

          <p className="mt-1 font-mono text-base font-bold uppercase text-dark-900">
            {form.code.trim() || "YOURCODE"}
          </p>

          <div className="mt-1 flex items-center justify-between gap-4">
            <span className="text-xs text-dark-500">
              {previewMinimum}
            </span>

            <span className="text-sm font-bold text-primary-600">
              {previewDiscount}
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Ticket size={17} />
              </div>

              <div>
                <h2 className="font-heading text-sm font-bold text-dark-900">
                  Basic Information
                </h2>

                <p className="text-xs text-dark-500">
                  Define the coupon code and discount.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Code */}
              <div>
                <FieldLabel>
                  Coupon Code
                </FieldLabel>

                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  maxLength={50}
                  placeholder="e.g. WELCOME20"
                  className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm font-medium uppercase text-dark-800 outline-none transition placeholder:normal-case placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                />

                <p className="mt-1.5 text-xs text-dark-400">
                  Letters, numbers, underscores and hyphens
                  only.
                </p>
              </div>

              {/* Type */}
              <div>
                <FieldLabel>
                  Coupon Type
                </FieldLabel>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleTypeChange}
                  className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
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
                <FieldLabel optional>
                  Description
                </FieldLabel>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={500}
                  rows={3}
                  placeholder="Describe what this coupon is for..."
                  className="w-full resize-none rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm text-dark-700 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                />

                <div className="mt-1.5 flex justify-end text-xs text-dark-400">
                  {form.description.length}/500
                </div>
              </div>

              {/* Value */}
              <div>
                <FieldLabel>
                  {form.type === "percentage"
                    ? "Discount Percentage"
                    : form.type === "fixed"
                      ? "Discount Amount"
                      : "Coupon Value"}
                </FieldLabel>

                <div className="relative">
                  {form.type === "fixed" && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-dark-400">
                      ₦
                    </span>
                  )}

                  {form.type === "percentage" && (
                    <Percent
                      size={16}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400"
                    />
                  )}

                  <input
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
                    disabled={
                      form.type === "free_delivery"
                    }
                    placeholder={
                      form.type === "percentage"
                        ? "20"
                        : "5000"
                    }
                    className={[
                      "h-11 w-full rounded-xl border border-dark-200 bg-white py-2.5 text-sm text-dark-800 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50",
                      form.type === "fixed"
                        ? "pl-8 pr-10"
                        : "px-3.5 pr-10",
                      "disabled:cursor-not-allowed disabled:bg-dark-50 disabled:text-dark-400",
                    ].join(" ")}
                  />
                </div>
              </div>

              {/* Maximum Discount */}
              {form.type === "percentage" && (
                <div>
                  <FieldLabel optional>
                    Maximum Discount
                  </FieldLabel>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-dark-400">
                      ₦
                    </span>

                    <input
                      type="number"
                      name="maximumDiscountAmount"
                      value={
                        form.maximumDiscountAmount
                      }
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="No maximum"
                      className="h-11 w-full rounded-xl border border-dark-200 bg-white py-2.5 pl-8 pr-3.5 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Conditions */}
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <WalletCards size={17} />
              </div>

              <div>
                <h2 className="font-heading text-sm font-bold text-dark-900">
                  Coupon Conditions
                </h2>

                <p className="text-xs text-dark-500">
                  Define order and usage restrictions.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-3">
              {/* Minimum Order */}
              <div>
                <FieldLabel>
                  Minimum Order
                </FieldLabel>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-dark-400">
                    ₦
                  </span>

                  <input
                    type="number"
                    name="minimumOrderAmount"
                    value={form.minimumOrderAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0"
                    className="h-11 w-full rounded-xl border border-dark-200 bg-white py-2.5 pl-8 pr-3.5 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                  />
                </div>

                <p className="mt-1.5 text-xs text-dark-400">
                  Leave at 0 if there is no minimum.
                </p>
              </div>

              {/* Usage Limit */}
              <div>
                <FieldLabel optional>
                  Total Usage Limit
                </FieldLabel>

                <input
                  type="number"
                  name="usageLimit"
                  value={form.usageLimit}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  placeholder="Unlimited"
                  className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                />

                <p className="mt-1.5 text-xs text-dark-400">
                  Leave empty for unlimited usage.
                </p>
              </div>

              {/* Per User */}
              <div>
                <FieldLabel>
                  Uses Per User
                </FieldLabel>

                <input
                  type="number"
                  name="perUserLimit"
                  value={form.perUserLimit}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-800 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                />

                <p className="mt-1.5 text-xs text-dark-400">
                  Maximum number of uses by one customer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <CalendarClock size={17} />
              </div>

              <div>
                <h2 className="font-heading text-sm font-bold text-dark-900">
                  Coupon Schedule
                </h2>

                <p className="text-xs text-dark-500">
                  Choose when the coupon becomes valid and
                  when it expires.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Starts */}
              <div>
                <FieldLabel>
                  Starts At
                </FieldLabel>

                <input
                  type="datetime-local"
                  name="startsAt"
                  value={form.startsAt}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                />

                <p className="mt-1.5 text-xs text-dark-400">
                  The coupon becomes eligible from this time.
                </p>
              </div>

              {/* Expires */}
              <div>
                <FieldLabel>
                  Expires At
                </FieldLabel>

                <input
                  type="datetime-local"
                  name="expiresAt"
                  value={form.expiresAt}
                  onChange={handleChange}
                  min={form.startsAt || undefined}
                  className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                />

                <p className="mt-1.5 text-xs text-dark-400">
                  Must be later than the start date.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Activation */}
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
          <label className="flex cursor-pointer items-start gap-4">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="peer sr-only"
              />

              <div className="h-6 w-11 rounded-full bg-dark-200 transition peer-checked:bg-primary-500" />

              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
            </div>

            <span>
              <span className="flex items-center gap-2 text-sm font-bold text-dark-800">
                Activate coupon immediately

                {form.isActive && (
                  <CheckCircle2
                    size={15}
                    className="text-success"
                  />
                )}
              </span>

              <span className="mt-1 block text-sm leading-6 text-dark-500">
                The coupon can be used once its start date is
                reached.
              </span>
            </span>
          </label>
        </section>

        {/* Information Notice */}
        <div className="flex items-start gap-3 rounded-2xl border border-info/20 bg-info/5 p-4">
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-info"
          />

          <div>
            <p className="text-sm font-semibold text-dark-800">
              Before creating this coupon
            </p>

            <p className="mt-1 text-sm leading-6 text-dark-600">
              Make sure the discount value, usage limits and
              validity period match the promotion you want to
              offer. The backend will validate the submitted
              coupon data.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-dark-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/coupons")}
            disabled={createCoupon.isPending}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-dark-200 bg-white px-5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createCoupon.isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createCoupon.isPending ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                <Save size={17} />
                Create Coupon
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCouponCreate;