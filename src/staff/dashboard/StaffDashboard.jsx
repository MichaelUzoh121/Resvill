import React, { useMemo } from "react";
import {
  LuArrowRight,
  LuChefHat,
  LuCircleCheck,
  LuClipboardList,
  LuClock3,
  LuRefreshCw,
  LuTruck,
  LuUsers,
} from "react-icons/lu";
import { Link } from "react-router-dom";

import { useStaffOrders } from "../hooks/useStaffOrders";
import { useStaffDrivers } from "../hooks/useStaffDrivers";

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
};

const STATUS_CLASSES = {
  PENDING: "bg-warning/10 text-warning",
  CONFIRMED: "bg-info/10 text-info",
  PREPARING: "bg-orange-50 text-orange-700",
  READY: "bg-success/10 text-success",
  OUT_FOR_DELIVERY: "bg-primary-50 text-primary-600",
  DELIVERED: "bg-success/10 text-success",
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

const getDriversArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.drivers)) {
    return data.drivers;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data?.drivers)) {
    return data.data.drivers;
  }

  return [];
};

const getOrderKey = (order) => order?._id || order?.id;

const formatOrderId = (order) => {
  const id = getOrderKey(order);

  if (!id) {
    return "—";
  }

  if (order?.orderNumber) {
    return `#${order.orderNumber}`;
  }

  return `#${String(id).slice(-6).toUpperCase()}`;
};

const getCustomerName = (order) => {
  const customer =
    order?.user ||
    order?.customer ||
    order?.guestCustomer;

  if (!customer) {
    return "Guest customer";
  }

  const name = [
    customer.firstname,
    customer.lastname,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    name ||
    customer.name ||
    customer.fullName ||
    customer.email ||
    "Customer"
  );
};

const formatAmount = (amount) => {
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
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
};

const getInitials = (name) => {
  if (!name) {
    return "G";
  }

  const parts = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2);

  return parts
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "primary",
}) {
  const iconClasses = {
    primary: "bg-primary-50 text-primary-600",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
    success: "bg-success/10 text-success",
  };

  return (
    <div className="group rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-dark-500">
            {title}
          </p>

          <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-dark-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-dark-400">
            {description}
          </p>
        </div>

        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition",
            "group-hover:scale-105",
            iconClasses[tone] || iconClasses.primary,
          ].join(" ")}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="font-heading text-lg font-bold text-dark-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-dark-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function StaffDashboard() {
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isFetching: ordersFetching,
    isError: ordersError,
    refetch: refetchOrders,
  } = useStaffOrders();

  const {
    data: driversData,
    isLoading: driversLoading,
    isError: driversError,
    refetch: refetchDrivers,
  } = useStaffDrivers();

  const orders = useMemo(
    () => getOrdersArray(ordersData),
    [ordersData]
  );

  const drivers = useMemo(
    () => getDriversArray(driversData),
    [driversData]
  );

  const stats = useMemo(() => {
    const pending = orders.filter(
      (order) => order?.status === "PENDING"
    ).length;

    const confirmed = orders.filter(
      (order) => order?.status === "CONFIRMED"
    ).length;

    const preparing = orders.filter(
      (order) => order?.status === "PREPARING"
    ).length;

    const ready = orders.filter(
      (order) => order?.status === "READY"
    ).length;

    const outForDelivery = orders.filter(
      (order) => order?.status === "OUT_FOR_DELIVERY"
    ).length;

    const delivered = orders.filter(
      (order) => order?.status === "DELIVERED"
    ).length;

    return {
      total: orders.length,
      pending,
      confirmed,
      preparing,
      ready,
      outForDelivery,
      delivered,
      active:
        pending +
        confirmed +
        preparing +
        ready +
        outForDelivery,
    };
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const first = new Date(
          a?.createdAt ||
            a?.orderDate ||
            a?.created_at ||
            0
        ).getTime();

        const second = new Date(
          b?.createdAt ||
            b?.orderDate ||
            b?.created_at ||
            0
        ).getTime();

        return second - first;
      })
      .slice(0, 6);
  }, [orders]);

  const handleRefresh = async () => {
    await Promise.all([
      refetchOrders(),
      refetchDrivers(),
    ]);
  };

  const loading = ordersLoading || driversLoading;

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
            Staff Dashboard
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm text-dark-500">
            Monitor orders, kitchen activity, and delivery
            operations from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={ordersFetching}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 shadow-sm transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <LuRefreshCw
            size={17}
            className={
              ordersFetching ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Error */}
      {(ordersError || driversError) && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <LuRefreshCw size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-danger">
                Some dashboard data could not be loaded.
              </p>

              <p className="mt-1 text-sm text-dark-500">
                Refresh the dashboard to try loading the latest
                operational data again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Orders"
          value={loading ? "—" : stats.total}
          description="Orders in the system response"
          icon={LuClipboardList}
          tone="primary"
        />

        <StatCard
          title="Pending"
          value={loading ? "—" : stats.pending}
          description="Awaiting confirmation"
          icon={LuClock3}
          tone="warning"
        />

        <StatCard
          title="Preparing"
          value={loading ? "—" : stats.preparing}
          description="Currently in kitchen"
          icon={LuChefHat}
          tone="info"
        />

        <StatCard
          title="Ready"
          value={loading ? "—" : stats.ready}
          description="Ready for dispatch"
          icon={LuCircleCheck}
          tone="success"
        />

        <StatCard
          title="Out for Delivery"
          value={loading ? "—" : stats.outForDelivery}
          description="Currently being delivered"
          icon={LuTruck}
          tone="primary"
        />
      </div>

      {/* Main operations */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
        {/* Active Orders */}
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 p-5 sm:p-6">
            <SectionHeader
              title="Active Orders"
              description="Orders currently requiring operational attention."
              action={
                <Link
                  to="/staff/orders"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition hover:text-primary-700"
                >
                  View all
                  <LuArrowRight size={16} />
                </Link>
              }
            />
          </div>

          <div className="p-4 sm:p-5">
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-xl border border-dark-100 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-1 items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-dark-100" />

                        <div className="flex-1">
                          <div className="h-3 w-24 rounded bg-dark-100" />
                          <div className="mt-2 h-3 w-40 rounded bg-dark-100" />
                        </div>
                      </div>

                      <div className="h-4 w-20 rounded bg-dark-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-dark-200 px-4 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-dark-50 text-dark-300">
                  <LuClipboardList size={24} />
                </div>

                <p className="mt-4 text-sm font-semibold text-dark-700">
                  No orders found
                </p>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-dark-400">
                  New operational orders will appear here
                  automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentOrders.map((order) => {
                  const orderId = getOrderKey(order);
                  const status = order?.status;

                  const statusClass =
                    STATUS_CLASSES[status] ||
                    "bg-dark-50 text-dark-600";

                  const customerName =
                    getCustomerName(order);

                  return (
                    <Link
                      key={orderId}
                      to={`/staff/orders/${orderId}`}
                      className="group block rounded-xl border border-dark-100 p-4 transition hover:border-primary-200 hover:bg-primary-50/30"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xs font-bold text-primary-600">
                            {getInitials(customerName)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-dark-900">
                                {formatOrderId(order)}
                              </span>

                              <span
                                className={[
                                  "rounded-full px-2.5 py-1 text-[10px] font-bold",
                                  statusClass,
                                ].join(" ")}
                              >
                                {STATUS_LABELS[status] ||
                                  status ||
                                  "Unknown"}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-sm text-dark-600">
                              {customerName}
                            </p>

                            <p className="mt-1 text-xs text-dark-400">
                              {formatDate(
                                order?.createdAt ||
                                  order?.orderDate
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                          <div>
                            <p className="text-sm font-bold text-dark-900">
                              {formatAmount(
                                order?.totalAmount ??
                                  order?.total ??
                                  order?.grandTotal
                              )}
                            </p>

                            <p className="mt-1 text-xs font-medium text-primary-600">
                              Open order
                            </p>
                          </div>

                          <LuArrowRight
                            size={16}
                            className="text-dark-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500 sm:hidden"
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Delivery */}
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
          <SectionHeader
            title="Delivery Operations"
            description="Current driver availability."
          />

          <div className="mt-6 rounded-2xl bg-dark-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-dark-500">
                  Available drivers
                </p>

                <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-dark-900">
                  {driversLoading ? "—" : drivers.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuUsers size={21} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-dark-500">
              <span className="h-2 w-2 rounded-full bg-success" />
              Driver availability from the operations system
            </div>
          </div>

          {driversError && (
            <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 p-3">
              <p className="text-xs font-medium text-danger">
                Driver availability could not be loaded.
              </p>
            </div>
          )}

          <Link
            to="/staff/deliveries"
            className="mt-4 flex items-center justify-between rounded-xl border border-dark-100 px-4 py-3.5 text-sm font-semibold text-dark-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
          >
            Manage deliveries

            <LuArrowRight size={16} />
          </Link>
        </section>
      </div>

      {/* Workflow */}
      <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
        <SectionHeader
          title="Order Workflow"
          description="Current order distribution across the operational workflow."
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              status: "PENDING",
              count: stats.pending,
              icon: LuClock3,
              tone: "warning",
            },
            {
              status: "CONFIRMED",
              count: stats.confirmed,
              icon: LuClipboardList,
              tone: "info",
            },
            {
              status: "PREPARING",
              count: stats.preparing,
              icon: LuChefHat,
              tone: "primary",
            },
            {
              status: "READY",
              count: stats.ready,
              icon: LuCircleCheck,
              tone: "success",
            },
            {
              status: "OUT_FOR_DELIVERY",
              count: stats.outForDelivery,
              icon: LuTruck,
              tone: "primary",
            },
          ].map(
            ({
              status,
              count,
              icon: Icon,
              tone,
            }) => {
              const toneClasses = {
                primary:
                  "bg-primary-50 text-primary-600",
                warning:
                  "bg-warning/10 text-warning",
                info: "bg-info/10 text-info",
                success:
                  "bg-success/10 text-success",
              };

              return (
                <div
                  key={status}
                  className="rounded-xl border border-dark-100 p-4 transition hover:border-dark-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                      {STATUS_LABELS[status]}
                    </span>

                    <div
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        toneClasses[tone],
                      ].join(" ")}
                    >
                      <Icon size={15} />
                    </div>
                  </div>

                  <p className="mt-4 font-heading text-2xl font-bold text-dark-900">
                    {loading ? "—" : count}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Operational summary */}
      <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
        <SectionHeader
          title="Operational Summary"
          description="A quick view of the current order pipeline."
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-dark-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-dark-400">
              Active Orders
            </p>

            <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
              {loading ? "—" : stats.active}
            </p>

            <p className="mt-1 text-xs text-dark-400">
              Requiring operational attention
            </p>
          </div>

          <div className="rounded-xl bg-dark-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-dark-400">
              Confirmed
            </p>

            <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
              {loading ? "—" : stats.confirmed}
            </p>

            <p className="mt-1 text-xs text-dark-400">
              Confirmed and moving forward
            </p>
          </div>

          <div className="rounded-xl bg-dark-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-dark-400">
              Delivered
            </p>

            <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
              {loading ? "—" : stats.delivered}
            </p>

            <p className="mt-1 text-xs text-dark-400">
              Completed deliveries
            </p>
          </div>

          <div className="rounded-xl bg-primary-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
              Driver Availability
            </p>

            <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
              {driversLoading ? "—" : drivers.length}
            </p>

            <p className="mt-1 text-xs text-dark-500">
              Drivers currently returned by the system
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StaffDashboard;