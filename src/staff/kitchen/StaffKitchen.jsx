import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuChefHat,
  LuClock3,
  LuLoaderCircle,
  LuRefreshCw,
  LuShoppingBag,
  LuUtensils,
} from "react-icons/lu";
import toast from "react-hot-toast";

import { useStaffOrders } from "../hooks/useStaffOrders";
import { useStaffOrderMutation } from "../hooks/useStaffOrderMutation";

const COLUMNS = [
  {
    status: "PENDING",
    title: "New Orders",
    description: "Waiting for confirmation",
    icon: LuShoppingBag,
    accent: "bg-yellow-50 text-yellow-700",
    border: "border-yellow-100",
  },
  {
    status: "CONFIRMED",
    title: "Confirmed",
    description: "Ready for preparation",
    icon: LuClock3,
    accent: "bg-blue-50 text-blue-700",
    border: "border-blue-100",
  },
  {
    status: "PREPARING",
    title: "Preparing",
    description: "Currently in the kitchen",
    icon: LuChefHat,
    accent: "bg-orange-50 text-orange-700",
    border: "border-orange-100",
  },
  {
    status: "READY",
    title: "Ready",
    description: "Ready for dispatch",
    icon: LuUtensils,
    accent: "bg-green-50 text-green-700",
    border: "border-green-100",
  },
];

const NEXT_STATUS = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "OUT_FOR_DELIVERY",
};

const NEXT_ACTION_LABELS = {
  PENDING: "Confirm Order",
  CONFIRMED: "Start Preparing",
  PREPARING: "Mark Ready",
  READY: "Send to Delivery",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
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

  return [];
};

const getOrderId = (order) => {
  return order?._id || order?.id;
};

const getOrderNumber = (order) => {
  return order?.orderNumber || order?.orderNo || order?.reference || null;
};

const getOrderReference = (order) => {
  const orderNumber = getOrderNumber(order);

  if (orderNumber) {
    const value = String(orderNumber);

    return value.startsWith("#") ? value : `#${value}`;
  }

  const id = getOrderId(order);

  if (!id) {
    return "#—";
  }

  return `#${String(id).slice(-6).toUpperCase()}`;
};

const getCustomerName = (order) => {
  const customer = order?.user || order?.customer;

  if (!customer) {
    return "Guest customer";
  }

  const name = [
    customer.firstname,
    customer.lastname,
    customer.firstName,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || customer.name || customer.email || "Customer";
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

const getTotalValue = (order) => {
  const value = Number(
    order?.totalAmount ?? order?.total ?? order?.grandTotal ?? 0,
  );

  return Number.isFinite(value) ? value : 0;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

const formatTime = (date) => {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
};

function KitchenOrderCard({ order, onStatusChange, updatingOrderId }) {
  const status = order?.status;
  const orderId = getOrderId(order);

  const nextStatus = NEXT_STATUS[status];
  const nextAction = NEXT_ACTION_LABELS[status];

  const itemCount = getItemCount(order);
  const total = getTotalValue(order);
  const customerName = getCustomerName(order);

  const createdAt = order?.createdAt || order?.orderDate || order?.created_at;

  const isUpdating = updatingOrderId === orderId;

  const scheduledFor = order?.scheduledFor
    ? new Date(order.scheduledFor)
    : null;

  const isScheduledOrder =
    scheduledFor && !Number.isNaN(scheduledFor.getTime());

  const isBeforeScheduledTime = isScheduledOrder && scheduledFor > new Date();

  return (
    <article className="rounded-2xl border border-dark-100 bg-white p-4 shadow-soft transition hover:border-dark-200 hover:shadow-card">
      {/* Order heading */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/staff/orders/${orderId}`}
            className="font-heading text-sm font-bold text-dark-900 transition hover:text-primary-600"
          >
            {getOrderReference(order)}
          </Link>

          <p className="mt-1 truncate text-sm text-dark-600">{customerName}</p>
        </div>

        <span className="shrink-0 rounded-full bg-dark-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-dark-500">
          {STATUS_LABELS[status] || status || "Unknown"}
        </span>
      </div>

      {/* Order summary */}
      <div className="mt-4 grid grid-cols-2 divide-x divide-dark-100 rounded-xl border border-dark-100 bg-dark-50">
        <div className="px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-dark-400">
            Items
          </p>

          <p className="mt-1 font-heading text-sm font-bold text-dark-800">
            {itemCount}
          </p>
        </div>

        <div className="px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-dark-400">
            Total
          </p>

          <p className="mt-1 font-heading text-sm font-bold text-dark-800">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      {/* Time */}
      {/* <div className="mt-3 flex items-center gap-2 text-xs text-dark-400">
        <LuClock3 size={14} />
        <span>{formatTime(createdAt)}</span>
      </div> */}

      {/* Time */}
      <div className="mt-3 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-dark-400">
          <LuClock3 size={14} />
          <span>Placed {formatTime(createdAt)}</span>
        </div>

        {isScheduledOrder && (
          <div
            className={`rounded-xl px-3 py-2 ${
              isBeforeScheduledTime
                ? "border border-amber-200 bg-amber-50 text-amber-800"
                : "border border-green-200 bg-green-50 text-green-700"
            }`}
          >
            <p className="font-bold uppercase tracking-wide">Scheduled order</p>

            <p className="mt-0.5">
              {isBeforeScheduledTime
                ? `Starts at ${new Intl.DateTimeFormat("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(scheduledFor)}`
                : "Scheduled time reached"}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          to={`/staff/orders/${orderId}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3 py-2.5 text-xs font-semibold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50"
        >
          View order
          <LuArrowRight size={14} />
        </Link>

        {nextStatus ? (
          <button
            type="button"
            disabled={isUpdating || isBeforeScheduledTime}
            onClick={() => onStatusChange(orderId, nextStatus)}
            // className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isBeforeScheduledTime
                ? "cursor-not-allowed bg-dark-100 text-dark-400"
                : "bg-primary-500 text-white hover:bg-primary-600"
            }`}
          >
            {isUpdating ? (
              <LuLoaderCircle size={14} className="animate-spin" />
            ) : null}

            <span className="truncate">
              {isUpdating
                ? "Updating..."
                : isBeforeScheduledTime
                  ? "Waiting for scheduled time"
                  : nextAction}
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-center rounded-xl bg-dark-50 px-3 py-2.5 text-xs font-semibold text-dark-400">
            Workflow complete
          </div>
        )}
      </div>
    </article>
  );
}

function KitchenColumn({ column, orders, onStatusChange, updatingOrderId }) {
  const Icon = column.icon;

  return (
    <section
      className={[
        "flex min-w-0 flex-col rounded-2xl border bg-dark-50/70 p-3",
        column.border,
      ].join(" ")}
    >
      {/* Column header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              column.accent,
            ].join(" ")}
          >
            <Icon size={19} />
          </div>

          <div className="min-w-0">
            <h2 className="font-heading text-sm font-bold text-dark-900">
              {column.title}
            </h2>

            <p className="mt-0.5 text-xs leading-relaxed text-dark-500">
              {column.description}
            </p>
          </div>
        </div>

        <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full border border-dark-100 bg-white px-2 text-xs font-bold text-dark-700 shadow-sm">
          {orders.length}
        </span>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-dark-200 bg-white px-4 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-50 text-dark-300">
              <Icon size={17} />
            </div>

            <p className="mt-3 text-sm font-semibold text-dark-500">
              No orders
            </p>

            <p className="mt-1 max-w-[180px] text-xs leading-relaxed text-dark-400">
              This queue is currently clear.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const orderId = getOrderId(order);

            return (
              <KitchenOrderCard
                key={orderId}
                order={order}
                onStatusChange={onStatusChange}
                updatingOrderId={updatingOrderId}
              />
            );
          })
        )}
      </div>
    </section>
  );
}

function KitchenColumnSkeleton() {
  return (
    <div className="rounded-2xl border border-dark-100 bg-dark-50/70 p-3">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-dark-100" />

        <div className="flex-1">
          <div className="h-4 w-28 animate-pulse rounded bg-dark-100" />
          <div className="mt-2 h-3 w-36 animate-pulse rounded bg-dark-100" />
        </div>

        <div className="h-7 w-7 animate-pulse rounded-full bg-dark-100" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-48 animate-pulse rounded-2xl bg-dark-100"
          />
        ))}
      </div>
    </div>
  );
}

function StaffKitchen() {
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const pendingQuery = useStaffOrders({
    status: "PENDING",
  });

  const confirmedQuery = useStaffOrders({
    status: "CONFIRMED",
  });

  const preparingQuery = useStaffOrders({
    status: "PREPARING",
  });

  const readyQuery = useStaffOrders({
    status: "READY",
  });

  const updateStatus = useStaffOrderMutation();

  const pendingOrders = useMemo(
    () => getOrdersArray(pendingQuery.data),
    [pendingQuery.data],
  );

  const confirmedOrders = useMemo(
    () => getOrdersArray(confirmedQuery.data),
    [confirmedQuery.data],
  );

  const preparingOrders = useMemo(
    () => getOrdersArray(preparingQuery.data),
    [preparingQuery.data],
  );

  const readyOrders = useMemo(
    () => getOrdersArray(readyQuery.data),
    [readyQuery.data],
  );

  const columns = useMemo(
    () => [
      {
        ...COLUMNS[0],
        orders: pendingOrders,
      },
      {
        ...COLUMNS[1],
        orders: confirmedOrders,
      },
      {
        ...COLUMNS[2],
        orders: preparingOrders,
      },
      {
        ...COLUMNS[3],
        orders: readyOrders,
      },
    ],
    [pendingOrders, confirmedOrders, preparingOrders, readyOrders],
  );

  const isLoading =
    pendingQuery.isLoading ||
    confirmedQuery.isLoading ||
    preparingQuery.isLoading ||
    readyQuery.isLoading;

  const isFetching =
    pendingQuery.isFetching ||
    confirmedQuery.isFetching ||
    preparingQuery.isFetching ||
    readyQuery.isFetching;

  const hasError =
    pendingQuery.isError ||
    confirmedQuery.isError ||
    preparingQuery.isError ||
    readyQuery.isError;

  const refreshAll = async () => {
    await Promise.all([
      pendingQuery.refetch(),
      confirmedQuery.refetch(),
      preparingQuery.refetch(),
      readyQuery.refetch(),
    ]);
  };

  const handleStatusChange = async (orderId, nextStatus) => {
    setUpdatingOrderId(orderId);

    try {
      await updateStatus.mutateAsync({
        orderId,
        status: nextStatus,
      });

      toast.success(
        `Order moved to ${STATUS_LABELS[nextStatus] || nextStatus}`,
      );

      await refreshAll();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to update order status.",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-4 w-28 animate-pulse rounded bg-dark-100" />

          <div className="mt-2 h-8 w-56 animate-pulse rounded bg-dark-100" />

          <div className="mt-2 h-4 w-full max-w-xl animate-pulse rounded bg-dark-100" />
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <KitchenColumnSkeleton key={item} />
          ))}
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-soft">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <LuChefHat size={21} />
          </div>

          <h2 className="mt-4 font-heading text-lg font-bold text-dark-900">
            Unable to load kitchen orders
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-dark-500">
            We couldn't retrieve the current kitchen queues. Please try again.
          </p>

          <button
            type="button"
            onClick={refreshAll}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            <LuRefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const totalActiveOrders =
    pendingOrders.length +
    confirmedOrders.length +
    preparingOrders.length +
    readyOrders.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-600">
            Kitchen Operations
          </p>

          <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
            Order Board
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-dark-500">
            Monitor active orders and move them through the kitchen workflow.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshAll}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 shadow-sm transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LuRefreshCw size={17} className={isFetching ? "animate-spin" : ""} />

          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => {
          const Icon = column.icon;

          return (
            <div
              key={column.status}
              className="flex items-center justify-between rounded-2xl border border-dark-100 bg-white px-4 py-3.5 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${column.accent}`}
                >
                  <Icon size={17} />
                </div>

                <div>
                  <p className="text-xs font-medium text-dark-500">
                    {column.title}
                  </p>

                  <p className="mt-0.5 font-heading text-lg font-bold text-dark-900">
                    {column.orders.length}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-dark-300">
                Orders
              </span>
            </div>
          );
        })}
      </div>

      {/* Workflow notice */}
      <div className="rounded-2xl border border-primary-100 bg-primary-50/70 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
            <LuChefHat size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-dark-800">
              Live kitchen workflow
            </p>

            <p className="mt-1 text-xs leading-relaxed text-dark-600">
              {totalActiveOrders} active{" "}
              {totalActiveOrders === 1 ? "order" : "orders"} are currently
              moving through the kitchen. Use the action on each order to
              advance it to the next backend-approved status.
            </p>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => (
          <KitchenColumn
            key={column.status}
            column={column}
            orders={column.orders}
            onStatusChange={handleStatusChange}
            updatingOrderId={updatingOrderId}
          />
        ))}
      </div>
    </div>
  );
}

export default StaffKitchen;
