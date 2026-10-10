import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuCheck,
  LuChevronDown,
  LuClock3,
  LuCreditCard,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuRefreshCw,
  LuUserRound,
  LuX,
  LuClipboardList,
} from "react-icons/lu";
import toast from "react-hot-toast";

import { useStaffOrder } from "../hooks/useStaffOrder";
import { useStaffOrderMutation } from "../hooks/useStaffOrderMutation";

const STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "PREPARING",
    label: "Preparing",
  },
  {
    value: "READY",
    label: "Ready",
  },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for delivery",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
  },
];

const STATUS_STYLES = {
  PENDING: "bg-warning/10 text-warning",
  CONFIRMED: "bg-info/10 text-info",
  PREPARING: "bg-orange-50 text-orange-700",
  READY: "bg-success/10 text-success",
  OUT_FOR_DELIVERY: "bg-primary-50 text-primary-600",
  DELIVERED: "bg-success/10 text-success",
};

const STATUS_DOT_STYLES = {
  PENDING: "bg-warning",
  CONFIRMED: "bg-info",
  PREPARING: "bg-orange-500",
  READY: "bg-success",
  OUT_FOR_DELIVERY: "bg-primary-500",
  DELIVERED: "bg-success",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
};

const PAYMENT_STYLES = {
  PAID: "bg-success/10 text-success",
  PENDING: "bg-warning/10 text-warning",
  FAILED: "bg-danger/10 text-danger",
  REFUNDED: "bg-purple-50 text-purple-700",
};

const PAYMENT_LABELS = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

const getOrder = (data) => {
  if (!data) {
    return null;
  }

  if (data?.order) {
    return data.order;
  }

  return data;
};

const getCustomer = (order) => {
  return (
    order?.user ||
    order?.customer ||
    order?.guestCustomer ||
    order?.guestDetails ||
    null
  );
};

const getCustomerName = (order) => {
  const customer = getCustomer(order);

  if (!customer) {
    return "Guest customer";
  }

  const name = [customer.firstname, customer.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    name || customer.name || customer.fullName || customer.email || "Customer"
  );
};

const getCustomerInitials = (order) => {
  const name = getCustomerName(order);

  if (!name || name === "Guest customer" || name === "Customer") {
    return "G";
  }

  const parts = name.split(" ").filter(Boolean).slice(0, 2);

  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
};

const getOrderId = (order) => {
  return order?._id || order?.id;
};

const getOrderReference = (order) => {
  const id = getOrderId(order);

  if (!id) {
    return "—";
  }

  if (order?.orderNumber) {
    return `#${order.orderNumber}`;
  }

  return `#${String(id).slice(-6).toUpperCase()}`;
};

const getItemName = (item) => {
  return item?.food?.name || item?.foodName || item?.name || "Food item";
};

const getItemPrice = (item) => {
  const price = item?.price ?? item?.unitPrice ?? item?.food?.price ?? 0;

  const value = Number(price);

  return Number.isFinite(value) ? value : 0;
};

const getItemQuantity = (item) => {
  return Number(item?.quantity) || 0;
};

const getItemCustomizationText = (item) => {
  const customizations =
    item?.customizations || item?.customization || item?.selectedOptions;

  if (!customizations) {
    return null;
  }

  if (typeof customizations === "string") {
    return customizations;
  }

  if (Array.isArray(customizations)) {
    const values = customizations
      .map((entry) => {
        if (typeof entry === "string") {
          return entry;
        }

        return entry?.name || entry?.label || entry?.value || null;
      })
      .filter(Boolean);

    return values.length ? values.join(", ") : null;
  }

  if (typeof customizations === "object") {
    const values = Object.entries(customizations)
      .map(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          return null;
        }

        if (typeof value === "object") {
          return `${key}: ${value?.name || value?.label || value?.value || ""}`;
        }

        return `${key}: ${value}`;
      })
      .filter(Boolean);

    return values.length ? values.join(" • ") : null;
  }

  return null;
};

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "₦0";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
};

const getAddressText = (order) => {
  const address =
    order?.deliveryAddress || order?.address || order?.shippingAddress;

  if (!address) {
    return null;
  }

  if (typeof address === "string") {
    return address;
  }

  return [
    address.address,
    address.street,
    address.area,
    address.city,
    address.state,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const getOrderNotes = (order) => {
  return (
    order?.specialInstructions ||
    order?.deliveryInstructions ||
    order?.instructions ||
    order?.note ||
    order?.notes ||
    null
  );
};

function StatusBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
        "text-xs font-bold",
        STATUS_STYLES[status] || "bg-dark-50 text-dark-600",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          STATUS_DOT_STYLES[status] || "bg-dark-400",
        ].join(" ")}
      />

      {STATUS_LABELS[status] || status || "Unknown"}
    </span>
  );
}

function PaymentBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1.5",
        "text-xs font-bold",
        PAYMENT_STYLES[status] || "bg-dark-50 text-dark-600",
      ].join(" ")}
    >
      {PAYMENT_LABELS[status] || status || "Unknown"}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-sm text-dark-500">{label}</span>

      <span className="max-w-[60%] text-right text-sm font-semibold text-dark-800">
        {value}
      </span>
    </div>
  );
}

function StaffOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, refetch } =
    useStaffOrder(orderId);

  const updateStatus = useStaffOrderMutation();

  const order = useMemo(() => getOrder(data), [data]);

  const customer = useMemo(() => getCustomer(order), [order]);

  const items = Array.isArray(order?.items) ? order.items : [];

  const currentStatus = order?.status || "PENDING";

  const scheduledFor = order?.scheduledFor
    ? new Date(order.scheduledFor)
    : null;

  const isScheduledOrder =
    scheduledFor && !Number.isNaN(scheduledFor.getTime());

  const isBeforeScheduledTime = isScheduledOrder && scheduledFor > new Date();

  const paymentStatus =
    order?.paymentStatus || order?.payment?.status || "PENDING";

  const subtotal = order?.subtotal ?? order?.subTotal ?? null;

  const deliveryFee = order?.deliveryFee ?? order?.deliveryCharge ?? null;

  const discount = order?.discount ?? order?.discountAmount ?? null;

  const total = order?.totalAmount ?? order?.total ?? order?.grandTotal ?? 0;

  const notes = getOrderNotes(order);

  const currentStatusIndex = STATUS_OPTIONS.findIndex(
    (option) => option.value === currentStatus,
  );

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value;

    if (!nextStatus || nextStatus === currentStatus) {
      return;
    }

    try {
      await updateStatus.mutateAsync({
        orderId,
        status: nextStatus,
      });

      toast.success(
        `Order status updated to ${STATUS_LABELS[nextStatus] || nextStatus}`,
      );

      await refetch();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to update order status.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 w-28 rounded bg-dark-100" />

          <div className="mt-4 h-8 w-56 rounded-lg bg-dark-100" />

          <div className="mt-2 h-4 w-40 rounded bg-dark-100" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">
          <div className="space-y-6">
            <div className="h-24 animate-pulse rounded-2xl bg-white" />
            <div className="h-96 animate-pulse rounded-2xl bg-white" />
          </div>

          <div className="space-y-6">
            <div className="h-56 animate-pulse rounded-2xl bg-white" />
            <div className="h-48 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-danger/20 bg-white p-7 text-center shadow-soft">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <LuX size={24} />
          </div>

          <h2 className="mt-5 font-heading text-lg font-bold text-dark-900">
            Unable to load order
          </h2>

          <p className="mt-2 text-sm leading-6 text-dark-500">
            The order could not be loaded. Please try again or return to the
            order queue.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              <LuRefreshCw size={16} />
              Try again
            </button>

            <button
              type="button"
              onClick={() => navigate("/staff/orders")}
              className="inline-flex items-center justify-center rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
            >
              Back to orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            to="/staff/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition hover:text-primary-600"
          >
            <LuArrowLeft size={16} />
            Back to orders
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
              Order {getOrderReference(order)}
            </h1>

            <StatusBadge status={currentStatus} />
          </div>

          <p className="mt-2 text-sm text-dark-500">
            Placed{" "}
            <span className="font-medium text-dark-700">
              {formatDate(order?.createdAt || order?.orderDate)}
            </span>
          </p>

          {isScheduledOrder && (
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                isBeforeScheduledTime
                  ? "border border-amber-200 bg-amber-50 text-amber-800"
                  : "border border-green-200 bg-green-50 text-green-700"
              }`}
            >
              <LuClock3 size={14} />

              {isBeforeScheduledTime
                ? `Scheduled for ${formatDate(scheduledFor)}`
                : "Scheduled time reached"}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 shadow-sm transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
        >
          <LuRefreshCw size={17} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Status control */}
      <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <LuClipboardIcon />
            </div>

            <div>
              <h2 className="font-heading text-base font-bold text-dark-900">
                Order status
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                Update the order as it moves through operations.
              </p>
            </div>
          </div>

          <div className="relative w-full lg:w-72">
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              disabled={updateStatus.isPending || isBeforeScheduledTime}
              // className="h-11 w-full appearance-none rounded-xl border border-dark-200 bg-white px-4 pr-10 text-sm font-semibold text-dark-800 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
              className={`h-11 w-full appearance-none rounded-xl border px-4 pr-10 text-sm font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isBeforeScheduledTime
                  ? "cursor-not-allowed border-amber-200 bg-amber-50 text-amber-700"
                  : "border-dark-200 bg-white text-dark-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              }`}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {isBeforeScheduledTime && (
              <p className="mt-2 text-xs font-medium text-amber-700">
                This order cannot be processed until {formatDate(scheduledFor)}.
              </p>
            )}

            <LuChevronDown
              size={17}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dark-400"
            />

            {updateStatus.isPending && (
              <LuRefreshCw
                size={17}
                className="absolute right-9 top-1/2 -translate-y-1/2 animate-spin text-primary-500"
              />
            )}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">
        <div className="space-y-6">
          {/* Order items */}
          <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
            <div className="flex items-center justify-between gap-4 border-b border-dark-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <LuPackage size={19} />
                </div>

                <div>
                  <h2 className="font-heading text-lg font-bold text-dark-900">
                    Order items
                  </h2>

                  <p className="mt-0.5 text-xs text-dark-500">
                    {items.length} item
                    {items.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="px-5 py-12 text-center sm:px-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-dark-50 text-dark-300">
                  <LuPackage size={23} />
                </div>

                <p className="mt-3 text-sm font-semibold text-dark-700">
                  No items found
                </p>

                <p className="mt-1 text-xs text-dark-400">
                  This order does not contain any item details.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-dark-100">
                {items.map((item, index) => {
                  const quantity = getItemQuantity(item);

                  const price = getItemPrice(item);

                  const customization = getItemCustomizationText(item);

                  return (
                    <div
                      key={
                        item?._id || item?.id || `${getItemName(item)}-${index}`
                      }
                      className="p-5 transition hover:bg-dark-50/40 sm:px-6"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-bold text-primary-600">
                          {quantity}×
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-bold text-dark-900">
                                {getItemName(item)}
                              </p>

                              {customization && (
                                <p className="mt-1.5 max-w-xl text-xs leading-5 text-dark-500">
                                  {customization}
                                </p>
                              )}
                            </div>

                            <p className="text-sm font-bold text-dark-900">
                              {formatCurrency(price * quantity)}
                            </p>
                          </div>

                          <p className="mt-2 text-xs text-dark-400">
                            {formatCurrency(price)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Totals */}
            <div className="border-t border-dark-100 bg-dark-50/50 px-5 py-5 sm:px-6">
              <div className="ml-auto max-w-sm">
                {subtotal !== null && (
                  <DetailRow
                    label="Subtotal"
                    value={formatCurrency(subtotal)}
                  />
                )}

                {deliveryFee !== null && (
                  <DetailRow
                    label="Delivery fee"
                    value={formatCurrency(deliveryFee)}
                  />
                )}

                {discount !== null && Number(discount) > 0 && (
                  <div className="flex items-start justify-between gap-4 py-2.5">
                    <span className="text-sm text-dark-500">Discount</span>

                    <span className="text-right text-sm font-semibold text-success">
                      -{formatCurrency(discount)}
                    </span>
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between gap-4 border-t border-dark-200 pt-4">
                  <span className="font-heading text-base font-bold text-dark-900">
                    Total
                  </span>

                  <span className="font-heading text-lg font-bold text-dark-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Order progress */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuClock3 size={19} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-900">
                  Order progress
                </h2>

                <p className="mt-1 text-sm text-dark-500">
                  Current position in the operational workflow.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute left-[8%] right-[8%] top-4 h-px bg-dark-200" />

                  <div
                    className="absolute left-[8%] top-4 h-px bg-primary-500 transition-all"
                    style={{
                      width:
                        currentStatusIndex <= 0
                          ? "0%"
                          : `${
                              (currentStatusIndex /
                                (STATUS_OPTIONS.length - 1)) *
                              84
                            }%`,
                    }}
                  />

                  <div className="relative grid grid-cols-6">
                    {STATUS_OPTIONS.map((option, index) => {
                      const completed = currentStatusIndex >= index;

                      const current = currentStatus === option.value;

                      return (
                        <div
                          key={option.value}
                          className="flex flex-col items-center text-center"
                        >
                          <div
                            className={[
                              "flex h-8 w-8 items-center justify-center rounded-full border-2 transition",
                              completed
                                ? "border-primary-500 bg-primary-500 text-white"
                                : "border-dark-200 bg-white text-dark-400",
                              current ? "ring-4 ring-primary-100" : "",
                            ].join(" ")}
                          >
                            {completed ? (
                              <LuCheck size={14} />
                            ) : (
                              <span className="text-[11px] font-bold">
                                {index + 1}
                              </span>
                            )}
                          </div>

                          <p
                            className={[
                              "mt-3 max-w-[100px] text-[11px] font-semibold leading-4",
                              current
                                ? "text-primary-600"
                                : completed
                                  ? "text-dark-700"
                                  : "text-dark-400",
                            ].join(" ")}
                          >
                            {option.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-3 lg:hidden">
                {STATUS_OPTIONS.map((option, index) => {
                  const completed = currentStatusIndex >= index;

                  const current = currentStatus === option.value;

                  return (
                    <div
                      key={option.value}
                      className={[
                        "flex items-center gap-3 rounded-xl border p-3",
                        current
                          ? "border-primary-200 bg-primary-50"
                          : "border-dark-100",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          completed
                            ? "bg-primary-500 text-white"
                            : "bg-dark-100 text-dark-400",
                        ].join(" ")}
                      >
                        {completed ? (
                          <LuCheck size={14} />
                        ) : (
                          <span className="text-[11px] font-bold">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <span
                        className={[
                          "text-sm font-semibold",
                          current
                            ? "text-primary-700"
                            : completed
                              ? "text-dark-700"
                              : "text-dark-400",
                        ].join(" ")}
                      >
                        {option.label}
                      </span>

                      {current && (
                        <span className="ml-auto rounded-full bg-primary-500 px-2 py-1 text-[10px] font-bold text-white">
                          Current
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Notes */}
          {notes && (
            <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <LuClipboardIcon />
                </div>

                <div className="min-w-0">
                  <h2 className="font-heading text-base font-bold text-dark-900">
                    Order instructions
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-dark-600">
                    {notes}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Customer */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuUserRound size={19} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-900">
                  Customer
                </h2>

                <p className="text-xs text-dark-500">Order customer details</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-dark-50 p-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                {getCustomerInitials(order)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-dark-900">
                  {getCustomerName(order)}
                </p>

                {customer?.email && (
                  <p className="mt-0.5 truncate text-xs text-dark-500">
                    {customer.email}
                  </p>
                )}
              </div>
            </div>

            {customer?.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="mt-3 flex items-center gap-3 rounded-xl border border-dark-100 px-3.5 py-3 text-sm font-medium text-dark-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
              >
                <LuPhone size={16} />
                {customer.phone}
              </a>
            )}
          </section>

          {/* Delivery */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuMapPin size={19} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-900">
                  Delivery
                </h2>

                <p className="text-xs text-dark-500">
                  Where the order is going
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-dark-100 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                Delivery address
              </p>

              <p className="mt-2 text-sm leading-6 text-dark-700">
                {getAddressText(order) || "No delivery address provided."}
              </p>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuCreditCard size={19} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-900">
                  Payment
                </h2>

                <p className="text-xs text-dark-500">Payment information</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-dark-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-dark-500">Status</span>

                <PaymentBadge status={paymentStatus} />
              </div>

              {order?.payment?.reference && (
                <div className="mt-4 border-t border-dark-200 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                    Reference
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-dark-700">
                    {order.payment.reference}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Order summary */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <h2 className="font-heading text-lg font-bold text-dark-900">
              Order summary
            </h2>

            <div className="mt-4 divide-y divide-dark-100">
              <DetailRow label="Order" value={getOrderReference(order)} />

              <DetailRow
                label="Items"
                value={`${items.length} ${
                  items.length === 1 ? "item" : "items"
                }`}
              />

              <DetailRow label="Total" value={formatCurrency(total)} />

              <DetailRow
                label="Status"
                value={STATUS_LABELS[currentStatus] || currentStatus}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function LuClipboardIcon() {
  return <LuClipboardList size={19} />;
}

export default StaffOrderDetails;
