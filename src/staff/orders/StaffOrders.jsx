import React, { useMemo, useState } from "react";
import {
  LuArrowRight,
  LuClipboardList,
  LuPlus,
  LuRefreshCw,
  LuSearch,
  LuSlidersHorizontal,
  LuX,
} from "react-icons/lu";
import { Link } from "react-router-dom";

import { useStaffOrders } from "../hooks/useStaffOrders";

const ACTIVE_ORDER_STATUSES = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY", label: "Ready" },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for delivery",
  },
  { value: "DELIVERED", label: "Delivered" },
];

const PAYMENT_STATUSES = [
  { value: "all", label: "All payments" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

const STATUS_STYLES = {
  PENDING: "bg-warning/10 text-warning",
  CONFIRMED: "bg-info/10 text-info",
  PREPARING: "bg-orange-50 text-orange-700",
  READY: "bg-success/10 text-success",
  OUT_FOR_DELIVERY: "bg-primary-50 text-primary-600",
  DELIVERED: "bg-success/10 text-success",
};

const PAYMENT_STYLES = {
  PAID: "bg-success/10 text-success",
  PENDING: "bg-warning/10 text-warning",
  FAILED: "bg-danger/10 text-danger",
  REFUNDED: "bg-purple-50 text-purple-700",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
};

const PAYMENT_LABELS = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

const getOrdersArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.orders)) {
    return data.orders;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data?.orders)) {
    return data.data.orders;
  }

  return [];
};

const getCustomerName = (order) => {
  const customer = order?.user || order?.customer || order?.guestCustomer;

  if (!customer) {
    return "Guest customer";
  }

  const fullName = [customer.firstname, customer.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    customer.name ||
    customer.fullName ||
    customer.email ||
    "Customer"
  );
};

const getCustomerInitials = (order) => {
  const name = getCustomerName(order);

  if (!name || name === "Guest customer") {
    return "G";
  }

  const parts = name.split(" ").filter(Boolean).slice(0, 2);

  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
};

const getOrderTotal = (order) => {
  const amount = order?.totalAmount ?? order?.total ?? order?.grandTotal ?? 0;

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "₦0";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

const getItemCount = (order) => {
  if (!Array.isArray(order?.items)) {
    return 0;
  }

  return order.items.reduce(
    (total, item) => total + (Number(item?.quantity) || 0),
    0,
  );
};

const getScheduledOrderInfo = (order) => {
  if (!order?.scheduledFor) {
    return null;
  }

  const scheduledDate = new Date(order.scheduledFor);

  if (Number.isNaN(scheduledDate.getTime())) {
    return null;
  }

  const isBeforeScheduledTime = scheduledDate > new Date();

  return {
    scheduledDate,
    isBeforeScheduledTime,
  };
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

const getShortOrderId = (order) => {
  const id = order?._id || order?.id;

  if (!id) {
    return "—";
  }

  if (order?.orderNumber) {
    return `#${order.orderNumber}`;
  }

  return `#${String(id).slice(-6).toUpperCase()}`;
};

function StatusBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-[11px] font-bold",
        STATUS_STYLES[status] || "bg-dark-50 text-dark-600",
      ].join(" ")}
    >
      {STATUS_LABELS[status] || status || "Unknown"}
    </span>
  );
}

function PaymentBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-[11px] font-bold",
        PAYMENT_STYLES[status] || "bg-dark-50 text-dark-600",
      ].join(" ")}
    >
      {PAYMENT_LABELS[status] || status || "Unknown"}
    </span>
  );
}

function StaffOrders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");

  const queryParams = useMemo(() => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (status !== "all") {
      params.status = status;
    }

    if (paymentStatus !== "all") {
      params.paymentStatus = paymentStatus;
    }

    return params;
  }, [search, status, paymentStatus]);

  const { data, isLoading, isFetching, isError, refetch } =
    useStaffOrders(queryParams);

  const orders = useMemo(() => getOrdersArray(data), [data]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPaymentStatus("all");
  };

  const hasFilters =
    Boolean(search.trim()) || status !== "all" || paymentStatus !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-500" />

            <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
              Operations
            </span>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm text-dark-500">
            Manage incoming orders and monitor their progress through the
            operational workflow.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Link
            to="/staff/orders/create"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 sm:w-auto"
          >
            <LuPlus size={17} />
            Create Custom Order
          </Link>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 shadow-sm transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <LuRefreshCw
              size={17}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-dark-100 bg-white p-4 shadow-soft sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <LuSlidersHorizontal size={17} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-dark-900">Order Filters</h2>

              <p className="text-xs text-dark-400">
                Narrow down the operational order queue.
              </p>
            </div>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 transition hover:text-primary-700"
            >
              <LuX size={14} />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          {/* Search */}
          <div className="relative">
            <LuSearch
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders..."
              className="h-11 w-full rounded-xl border border-dark-200 bg-white pl-10 pr-4 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Order status */}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            {/* {ORDER_STATUSES.map((option) => ( */}
            {ACTIVE_ORDER_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Payment status */}
          <select
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value)}
            className="h-11 rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            {PAYMENT_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Error */}
      {isError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <LuRefreshCw size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-danger">
                Unable to load orders.
              </p>

              <p className="mt-1 text-sm text-dark-500">
                Refresh the order queue and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order queue */}
      <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
        <div className="flex flex-col gap-3 border-b border-dark-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <LuClipboardList size={19} />
            </div>

            <div>
              <h2 className="font-heading text-lg font-bold text-dark-900">
                Order Queue
              </h2>

              <p className="mt-0.5 text-xs text-dark-500">
                {isLoading
                  ? "Loading orders..."
                  : `${orders.length} order${
                      orders.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>
          </div>

          {isFetching && !isLoading && (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-dark-400">
              <LuRefreshCw size={14} className="animate-spin" />
              Updating...
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="divide-y divide-dark-100">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-dark-100" />

                  <div className="flex-1">
                    <div className="h-3 w-28 rounded bg-dark-100" />

                    <div className="mt-2 h-3 w-44 rounded bg-dark-100" />

                    <div className="mt-2 h-3 w-24 rounded bg-dark-100" />
                  </div>

                  <div className="hidden h-4 w-20 rounded bg-dark-100 sm:block" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty */
          <div className="px-5 py-16 text-center sm:px-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-dark-50 text-dark-300">
              <LuClipboardList size={28} />
            </div>

            <h3 className="mt-4 font-heading text-base font-bold text-dark-800">
              No orders found
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-dark-500">
              {hasFilters
                ? "No orders match the selected filters. Try adjusting your search or status filters."
                : "There are currently no operational orders available."}
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                <LuX size={16} />
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-dark-100 bg-dark-50/70">
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                      Order
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                      Customer
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                      Items
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                      Total
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                      Payment
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                      Status
                    </th>

                    <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-dark-100">
                  {orders.map((order) => {
                    const orderId = order?._id || order?.id;

                    const orderStatus = order?.status || "PENDING";

                    const scheduledInfo = getScheduledOrderInfo(order);

                    const paymentStatus =
                      order?.paymentStatus ||
                      order?.payment?.status ||
                      "PENDING";

                    const customerName = getCustomerName(order);

                    const itemCount = getItemCount(order);

                    return (
                      <tr
                        key={orderId}
                        className="group transition hover:bg-dark-50/60"
                      >
                        {/* Order */}
                        <td className="px-6 py-4">
                          <Link
                            to={`/staff/orders/${orderId}`}
                            className="block"
                          >
                            <p className="text-sm font-bold text-dark-900 transition group-hover:text-primary-600">
                              {getShortOrderId(order)}
                            </p>

                            <p className="mt-1 text-xs text-dark-400">
                              {formatDate(order?.createdAt || order?.orderDate)}
                            </p>

                            {scheduledInfo && (
                              <div className="mt-2">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold ${
                                    scheduledInfo.isBeforeScheduledTime
                                      ? "bg-warning/10 text-warning"
                                      : "bg-success/10 text-success"
                                  }`}
                                >
                                  {scheduledInfo.isBeforeScheduledTime
                                    ? `Scheduled · ${formatDate(scheduledInfo.scheduledDate)}`
                                    : "Scheduled time reached"}
                                </span>
                              </div>
                            )}
                          </Link>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-600">
                              {getCustomerInitials(order)}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-sm font-semibold text-dark-800">
                                {customerName}
                              </p>

                              {!order?.user && !order?.customer && (
                                <p className="mt-0.5 text-[11px] text-dark-400">
                                  Guest order
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Items */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-dark-600">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-dark-900">
                            {getOrderTotal(order)}
                          </p>
                        </td>

                        {/* Payment */}
                        <td className="px-6 py-4">
                          <PaymentBadge status={paymentStatus} />
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge status={orderStatus} />
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/staff/orders/${orderId}`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
                          >
                            View
                            <LuArrowRight size={15} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-dark-100 lg:hidden">
              {orders.map((order) => {
                const orderId = order?._id || order?.id;

                const orderStatus = order?.status || "PENDING";

                const paymentStatus =
                  order?.paymentStatus || order?.payment?.status || "PENDING";

                const customerName = getCustomerName(order);

                const itemCount = getItemCount(order);

                return (
                  <Link
                    key={orderId}
                    to={`/staff/orders/${orderId}`}
                    className="group block p-5 transition hover:bg-dark-50/60"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xs font-bold text-primary-600">
                          {getCustomerInitials(order)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-dark-900">
                            {getShortOrderId(order)}
                          </p>

                          <p className="mt-1 truncate text-sm text-dark-600">
                            {customerName}
                          </p>
                        </div>
                      </div>

                      <LuArrowRight
                        size={17}
                        className="mt-1 shrink-0 text-dark-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500"
                      />
                    </div>

                    {/* Date */}
                    <p className="mt-3 text-xs text-dark-400">
                      {formatDate(order?.createdAt || order?.orderDate)}
                    </p>

                    {/* Badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusBadge status={orderStatus} />

                      <PaymentBadge status={paymentStatus} />
                    </div>

                    {/* Bottom */}
                    <div className="mt-4 flex items-center justify-between border-t border-dark-100 pt-4">
                      <span className="text-xs font-medium text-dark-500">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </span>

                      <span className="text-sm font-bold text-dark-900">
                        {getOrderTotal(order)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default StaffOrders;
