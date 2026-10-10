import React, { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  DollarSign,
  Package,
  RefreshCw,
  ShoppingBag,
  Tag,
  Truck,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useAdminAnalytics } from "../hooks/useAdminAnalytics";

import {
  SalesTrendChart,
  OrderStatusChart,
  PaymentMethodsChart,
  FoodRevenueChart,
  DeliveryStatusChart,
} from "./AnalyticsCharts";

const formatNaira = (value = 0) => {
  const amount = Number(value) || 0;

  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatNumber = (value = 0) => {
  return (Number(value) || 0).toLocaleString("en-NG");
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatInputDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateRange = (preset) => {
  const today = new Date();

  const start = new Date(today);
  const end = new Date(today);

  switch (preset) {
    case "today":
      break;

    case "yesterday":
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      break;

    case "7days":
      start.setDate(start.getDate() - 6);
      break;

    case "30days":
      start.setDate(start.getDate() - 29);
      break;

    case "thisMonth":
      start.setDate(1);
      break;

    case "lastMonth":
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);

      end.setDate(0);
      break;

    default:
      return null;
  }

  return {
    startDate: formatInputDate(start),
    endDate: formatInputDate(end),
  };
};

const formatLabel = (value = "") => {
  return String(value)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getDefaultDates = () => {
  const today = new Date();

  const endDate = today.toISOString().slice(0, 10);

  const start = new Date(today);
  start.setDate(start.getDate() - 30);

  const startDate = start.toISOString().slice(0, 10);

  return {
    startDate,
    endDate,
  };
};

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-dark-500">{title}</p>

          <h3 className="mt-2 text-2xl font-bold text-dark-900">{value}</h3>

          {description && (
            <p className="mt-1 text-xs text-dark-400">{description}</p>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${className}`}
    >
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Icon size={18} />
            </div>
          )}

          <div>
            <h2 className="font-semibold text-dark-900">{title}</h2>

            {description && (
              <p className="mt-0.5 text-xs text-dark-400">{description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function EmptyState({
  title = "No data available",
  description = "There is no data for the selected period.",
}) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-dark-400">
        <BarChart3 size={22} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-dark-700">{title}</h3>

      <p className="mt-1 max-w-sm text-xs text-dark-400">{description}</p>
    </div>
  );
}

function DataTable({ columns, rows, emptyTitle, emptyDescription }) {
  if (!rows?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            {columns.map((column) => (
              <th
                key={column.key}
                className="whitespace-nowrap px-3 pb-3 text-xs font-semibold uppercase tracking-wide text-dark-400 first:pl-0 last:pr-0"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row._id || row.id || row.foodId || row.couponCode || index}
              className="border-b border-gray-50 last:border-0"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="whitespace-nowrap px-3 py-3 text-sm text-dark-700 first:pl-0 last:pr-0"
                >
                  {column.render
                    ? column.render(row)
                    : (row[column.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status, tone = "default" }) {
  const tones = {
    success: "bg-green-50 text-green-700",
    danger: "bg-red-50 text-red-700",
    warning: "bg-amber-50 text-amber-700",
    info: "bg-blue-50 text-blue-700",
    default: "bg-gray-50 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        tones[tone] || tones.default
      }`}
    >
      {status}
    </span>
  );
}

function PaymentStatusRow({ label, data, tone }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <StatusBadge status={label} tone={tone} />

        <span className="text-sm text-dark-600">
          {formatNumber(data?.count)}
        </span>
      </div>

      <span className="text-sm font-semibold text-dark-900">
        {formatNaira(data?.amount)}
      </span>
    </div>
  );
}

export default function AdminAnalytics() {
  const defaults = useMemo(() => getDefaultDates(), []);

  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);

  const [selectedPreset, setSelectedPreset] = useState("30days");

  const analyticsParams = useMemo(
    () => ({
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    }),
    [startDate, endDate],
  );

  const {
    data: analytics,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminAnalytics(analyticsParams);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Analytics refreshed");
    } catch {
      toast.error("Failed to refresh analytics");
    }
  };

  const overview = analytics?.overview || {};
  const orders = overview.orders || {};
  const customers = overview.customers || {};
  const foods = overview.foods || {};
  const payments = overview.payments || {};
  const coupons = overview.coupons || {};
  const delivery = overview.delivery || {};

  const sales = analytics?.sales || {};
  const salesSummary = sales.summary || {};

  const foodAnalytics = analytics?.foods || {};

  const customerAnalytics = analytics?.customers || {};
  const customerSummary = customerAnalytics.summary || {};

  const paymentAnalytics = analytics?.payments || {};
  const paymentSummary = paymentAnalytics.summary || {};

  const couponAnalytics = analytics?.coupons || {};
  const couponSummary = couponAnalytics.summary || {};

  const deliveryAnalytics = analytics?.delivery || {};
  const deliverySummary = deliveryAnalytics.summary || {};
  const deliveryTime = deliveryAnalytics.deliveryTime || {};

  const period = analytics?.period;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 size={24} className="text-primary-600" />

              <h1 className="text-2xl font-bold text-dark-900">Analytics</h1>
            </div>

            <p className="mt-1 text-sm text-dark-500">
              Monitor sales, customers, payments, food performance, coupons and
              delivery activity.
            </p>

            {period && (
              <p className="mt-2 text-xs text-dark-400">
                Showing data from{" "}
                <span className="font-medium text-dark-600">
                  {formatDate(period.startDate)}
                </span>{" "}
                to{" "}
                <span className="font-medium text-dark-600">
                  {formatDate(period.endDate)}
                </span>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-dark-700 transition hover:border-primary-200 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Filters */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-primary-600" />

              <div>
                <h2 className="font-semibold text-dark-900">Date Range</h2>

                <p className="text-xs text-dark-400">
                  Select a reporting period.
                </p>
              </div>
            </div>

            {isFetching && !isLoading && (
              <div className="flex items-center gap-2 text-xs text-dark-400">
                <RefreshCw size={14} className="animate-spin" />
                Updating analytics...
              </div>
            )}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {[
              ["today", "Today"],
              ["yesterday", "Yesterday"],
              ["7days", "Last 7 days"],
              ["30days", "Last 30 days"],
              ["thisMonth", "This month"],
              ["lastMonth", "Last month"],
            ].map(([value, label]) => {
              const active = selectedPreset === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    const range = getDateRange(value);

                    if (!range) return;

                    setStartDate(range.startDate);
                    setEndDate(range.endDate);
                    setSelectedPreset(value);
                  }}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    active
                      ? "bg-primary-600 text-white"
                      : "border border-gray-200 bg-white text-dark-600 hover:border-primary-200 hover:text-primary-600"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="analytics-start-date"
                className="mb-1.5 block text-xs font-medium text-dark-500"
              >
                Start date
              </label>

              <input
                id="analytics-start-date"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setSelectedPreset("custom");
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label
                htmlFor="analytics-end-date"
                className="mb-1.5 block text-xs font-medium text-dark-500"
              >
                End date
              </label>

              <input
                id="analytics-end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setSelectedPreset("custom");
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-primary-600"
            />

            <p className="mt-4 text-sm font-medium text-dark-700">
              Loading analytics...
            </p>

            <p className="mt-1 text-xs text-dark-400">
              Fetching the latest admin analytics.
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <XCircle size={22} className="mt-0.5 shrink-0 text-red-600" />

              <div>
                <h2 className="font-semibold text-red-800">
                  Unable to load analytics
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong while fetching analytics."}
                </p>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  <RefreshCw size={15} />
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && analytics && (
          <>
            {/* Overview */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-dark-900">
                  Overview
                </h2>

                <p className="text-sm text-dark-500">
                  Key business metrics for the selected period.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total Orders"
                  value={formatNumber(orders.total)}
                  icon={ShoppingBag}
                  description={`${formatNumber(orders.delivered)} delivered`}
                />

                <StatCard
                  title="Revenue"
                  value={formatNaira(orders.revenue)}
                  icon={DollarSign}
                  description={`AOV ${formatNaira(orders.averageOrderValue)}`}
                />

                <StatCard
                  title="Customers"
                  value={formatNumber(customers.total)}
                  icon={Users}
                  description={`${formatNumber(customers.new)} new customers`}
                />

                <StatCard
                  title="Active Foods"
                  value={formatNumber(foods.active)}
                  icon={Package}
                  description="Currently active menu items"
                />
              </div>
            </div>

            {/* Financial overview */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard
                title="Order Financials"
                description="Revenue and additional order amounts."
                icon={DollarSign}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Revenue</p>
                    <p className="mt-1 text-lg font-semibold text-dark-900">
                      {formatNaira(orders.revenue)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Average Order Value</p>
                    <p className="mt-1 text-lg font-semibold text-dark-900">
                      {formatNaira(orders.averageOrderValue)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Discounts</p>
                    <p className="mt-1 text-lg font-semibold text-dark-900">
                      {formatNaira(orders.discount)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Delivery Fees</p>
                    <p className="mt-1 text-lg font-semibold text-dark-900">
                      {formatNaira(orders.deliveryFees)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Tax</p>
                    <p className="mt-1 text-lg font-semibold text-dark-900">
                      {formatNaira(orders.tax)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Tips</p>
                    <p className="mt-1 text-lg font-semibold text-dark-900">
                      {formatNaira(orders.tips)}
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Order Status"
                description="Current order status distribution."
                icon={ShoppingBag}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Pending", orders.status?.pending, "warning"],
                    ["Confirmed", orders.status?.confirmed, "info"],
                    ["Preparing", orders.status?.preparing, "info"],
                    ["Ready", orders.status?.ready, "success"],
                    ["Out for Delivery", orders.status?.outForDelivery, "info"],
                    ["Delivered", orders.status?.delivered, "success"],
                    ["Cancelled", orders.status?.cancelled, "danger"],
                    ["Failed", orders.status?.failed, "danger"],
                    ["Refunded", orders.status?.refunded, "warning"],
                  ].map(([label, value, tone]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                    >
                      <StatusBadge status={label} tone={tone} />

                      <span className="text-sm font-semibold text-dark-900">
                        {formatNumber(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <SalesTrendChart daily={sales.daily} />

              <OrderStatusChart orders={orders.status} />

              <PaymentMethodsChart
                methodBreakdown={paymentAnalytics.methodBreakdown}
              />

              <FoodRevenueChart foods={foodAnalytics.revenueByFood} />

              <DeliveryStatusChart delivery={delivery} />
            </div>

            {/* Sales */}
            <SectionCard
              title="Sales Performance"
              description="Sales summaries and time-based order activity."
              icon={BarChart3}
            >
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-primary-50 p-4">
                  <p className="text-xs text-primary-600">Total Orders</p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {formatNumber(salesSummary.totalOrders)}
                  </p>
                </div>

                <div className="rounded-xl bg-primary-50 p-4">
                  <p className="text-xs text-primary-600">Total Revenue</p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {formatNaira(salesSummary.totalRevenue)}
                  </p>
                </div>

                <div className="rounded-xl bg-primary-50 p-4">
                  <p className="text-xs text-primary-600">
                    Average Order Value
                  </p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {formatNaira(salesSummary.averageOrderValue)}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-dark-800">
                    Daily Sales
                  </h3>

                  <DataTable
                    rows={sales.daily}
                    emptyTitle="No daily sales"
                    emptyDescription="Daily sales will appear here when orders are recorded."
                    columns={[
                      {
                        key: "date",
                        label: "Date",
                        render: (row) => formatDate(row.date),
                      },
                      {
                        key: "orders",
                        label: "Orders",
                        render: (row) => formatNumber(row.orders),
                      },
                      {
                        key: "revenue",
                        label: "Revenue",
                        render: (row) => formatNaira(row.revenue),
                      },
                    ]}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-dark-800">
                    Weekly Sales
                  </h3>

                  <DataTable
                    rows={sales.weekly}
                    emptyTitle="No weekly sales"
                    emptyDescription="Weekly sales will appear here when orders are recorded."
                    columns={[
                      {
                        key: "week",
                        label: "Week",
                      },
                      {
                        key: "orders",
                        label: "Orders",
                        render: (row) => formatNumber(row.orders),
                      },
                      {
                        key: "revenue",
                        label: "Revenue",
                        render: (row) => formatNaira(row.revenue),
                      },
                    ]}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-dark-800">
                    Monthly Sales
                  </h3>

                  <DataTable
                    rows={sales.monthly}
                    emptyTitle="No monthly sales"
                    emptyDescription="Monthly sales will appear here when orders are recorded."
                    columns={[
                      {
                        key: "month",
                        label: "Month",
                      },
                      {
                        key: "orders",
                        label: "Orders",
                        render: (row) => formatNumber(row.orders),
                      },
                      {
                        key: "revenue",
                        label: "Revenue",
                        render: (row) => formatNaira(row.revenue),
                      },
                    ]}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Foods */}
            <div className="grid gap-6 xl:grid-cols-2">
              <SectionCard
                title="Best-Selling Foods"
                description="Foods with the highest recorded sales."
                icon={Package}
              >
                <DataTable
                  rows={foodAnalytics.bestSelling}
                  emptyTitle="No food sales yet"
                  emptyDescription="Best-selling foods will appear here after orders are recorded."
                  columns={[
                    {
                      key: "name",
                      label: "Food",
                    },
                    {
                      key: "quantitySold",
                      label: "Qty Sold",
                      render: (row) => formatNumber(row.quantitySold),
                    },
                    {
                      key: "orderCount",
                      label: "Orders",
                      render: (row) => formatNumber(row.orderCount),
                    },
                    {
                      key: "revenue",
                      label: "Revenue",
                      render: (row) => formatNaira(row.revenue),
                    },
                  ]}
                />
              </SectionCard>

              <SectionCard
                title="Least-Selling Foods"
                description="Foods with the lowest recorded sales."
                icon={Package}
              >
                <DataTable
                  rows={foodAnalytics.leastSelling}
                  emptyTitle="No food sales yet"
                  emptyDescription="Least-selling foods will appear here after orders are recorded."
                  columns={[
                    {
                      key: "name",
                      label: "Food",
                    },
                    {
                      key: "quantitySold",
                      label: "Qty Sold",
                      render: (row) => formatNumber(row.quantitySold),
                    },
                    {
                      key: "orderCount",
                      label: "Orders",
                      render: (row) => formatNumber(row.orderCount),
                    },
                    {
                      key: "revenue",
                      label: "Revenue",
                      render: (row) => formatNaira(row.revenue),
                    },
                  ]}
                />
              </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <SectionCard
                title="Revenue by Food"
                description="Revenue contribution from individual foods."
                icon={DollarSign}
              >
                <DataTable
                  rows={foodAnalytics.revenueByFood}
                  emptyTitle="No food revenue"
                  emptyDescription="Revenue by food will appear here after completed orders."
                  columns={[
                    {
                      key: "name",
                      label: "Food",
                    },
                    {
                      key: "quantitySold",
                      label: "Qty Sold",
                      render: (row) => formatNumber(row.quantitySold),
                    },
                    {
                      key: "revenue",
                      label: "Revenue",
                      render: (row) => formatNaira(row.revenue),
                    },
                  ]}
                />
              </SectionCard>

              <SectionCard
                title="Orders by Category"
                description="Order activity grouped by food category."
                icon={ShoppingBag}
              >
                <DataTable
                  rows={foodAnalytics.ordersByCategory}
                  emptyTitle="No category sales"
                  emptyDescription="Category performance will appear here after orders are recorded."
                  columns={[
                    {
                      key: "category",
                      label: "Category",
                      render: (row) =>
                        row.category || row.name || "Uncategorized",
                    },
                    {
                      key: "orders",
                      label: "Orders",
                      render: (row) =>
                        formatNumber(
                          row.orders ?? row.orderCount ?? row.quantitySold,
                        ),
                    },
                    {
                      key: "revenue",
                      label: "Revenue",
                      render: (row) => formatNaira(row.revenue),
                    },
                  ]}
                />
              </SectionCard>
            </div>

            {/* Customers */}
            <SectionCard
              title="Customer Analytics"
              description="Customer acquisition and ordering activity."
              icon={Users}
            >
              <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-dark-400">New Customers</p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {formatNumber(customerSummary.newCustomers)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-dark-400">Active Customers</p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {formatNumber(customerSummary.activeCustomers)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-dark-400">Returning Customers</p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {formatNumber(customerSummary.returningCustomers)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-dark-400">Order Frequency</p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {Number(customerSummary.orderFrequency || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-dark-800">
                    Top Customers
                  </h3>

                  <DataTable
                    rows={customerAnalytics.topCustomers}
                    emptyTitle="No customer orders"
                    emptyDescription="Top customers will appear here after customers place orders."
                    columns={[
                      {
                        key: "name",
                        label: "Customer",
                        render: (row) =>
                          row.name ||
                          row.fullName ||
                          `${row.firstName || ""} ${
                            row.lastName || ""
                          }`.trim() ||
                          row.email ||
                          "Customer",
                      },
                      {
                        key: "orders",
                        label: "Orders",
                        render: (row) =>
                          formatNumber(row.orders ?? row.orderCount),
                      },
                      {
                        key: "revenue",
                        label: "Revenue",
                        render: (row) =>
                          formatNaira(
                            row.revenue ?? row.totalSpent ?? row.totalAmount,
                          ),
                      },
                    ]}
                  />
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-dark-800">
                    Customer Order Frequency
                  </h3>

                  <DataTable
                    rows={customerAnalytics.customerOrderFrequency}
                    emptyTitle="No frequency data"
                    emptyDescription="Customer order frequency will appear here once order activity exists."
                    columns={[
                      {
                        key: "frequency",
                        label: "Frequency",
                        render: (row) =>
                          formatNumber(
                            row.frequency ?? row.orderFrequency ?? row.orders,
                          ),
                      },
                      {
                        key: "customers",
                        label: "Customers",
                        render: (row) =>
                          formatNumber(
                            row.customers ?? row.customerCount ?? row.count,
                          ),
                      },
                    ]}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Payments */}
            <div className="grid gap-6 xl:grid-cols-2">
              <SectionCard
                title="Payment Analytics"
                description="Payment status and transaction amounts."
                icon={CreditCard}
              >
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Total Payments</p>

                    <p className="mt-1 text-xl font-bold text-dark-900">
                      {formatNumber(paymentSummary.totalPayments)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Total Amount</p>

                    <p className="mt-1 text-xl font-bold text-dark-900">
                      {formatNaira(paymentSummary.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <PaymentStatusRow
                    label="Successful"
                    data={paymentAnalytics.successful}
                    tone="success"
                  />

                  <PaymentStatusRow
                    label="Pending"
                    data={paymentAnalytics.pending}
                    tone="warning"
                  />

                  <PaymentStatusRow
                    label="Processing"
                    data={paymentAnalytics.processing}
                    tone="info"
                  />

                  <PaymentStatusRow
                    label="Failed"
                    data={paymentAnalytics.failed}
                    tone="danger"
                  />

                  <PaymentStatusRow
                    label="Refunded"
                    data={paymentAnalytics.refunded}
                    tone="warning"
                  />

                  <PaymentStatusRow
                    label="Partially Refunded"
                    data={paymentAnalytics.partiallyRefunded}
                    tone="warning"
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Payment Methods"
                description="Payment activity grouped by method."
                icon={CreditCard}
              >
                {Object.keys(paymentAnalytics.methodBreakdown || {}).length ===
                0 ? (
                  <EmptyState
                    title="No payment methods"
                    description="Payment method activity will appear here once payments are recorded."
                  />
                ) : (
                  <div className="space-y-2">
                    {Object.entries(paymentAnalytics.methodBreakdown || {}).map(
                      ([method, data]) => (
                        <div
                          key={method}
                          className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-dark-800">
                              {formatLabel(method)}
                            </p>

                            <p className="mt-0.5 text-xs text-dark-400">
                              {formatNumber(data?.count)} transaction
                              {Number(data?.count) === 1 ? "" : "s"}
                            </p>
                          </div>

                          <span className="text-sm font-semibold text-dark-900">
                            {formatNaira(data?.amount)}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Coupons */}
            <SectionCard
              title="Coupon Analytics"
              description="Coupon usage, discounts and revenue."
              icon={Tag}
            >
              <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-dark-400">Total Uses</p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {formatNumber(couponSummary.totalUses)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-dark-400">Total Discount</p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {formatNaira(couponSummary.totalDiscount)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-dark-400">Coupon Revenue</p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {formatNaira(couponSummary.totalRevenue)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-dark-400">Active Coupons</p>

                  <p className="mt-1 text-xl font-bold text-dark-900">
                    {formatNumber(couponSummary.activeCoupons)}
                  </p>
                </div>
              </div>

              <DataTable
                rows={couponAnalytics.topCoupons}
                emptyTitle="No coupon usage"
                emptyDescription="Top coupons will appear here after customers use coupons."
                columns={[
                  {
                    key: "couponCode",
                    label: "Coupon",
                    render: (row) => (
                      <span className="font-semibold text-primary-600">
                        {row.couponCode || "—"}
                      </span>
                    ),
                  },
                  {
                    key: "uses",
                    label: "Uses",
                    render: (row) => formatNumber(row.uses),
                  },
                  {
                    key: "totalDiscount",
                    label: "Discount",
                    render: (row) => formatNaira(row.totalDiscount),
                  },
                  {
                    key: "revenue",
                    label: "Revenue",
                    render: (row) => formatNaira(row.revenue),
                  },
                ]}
              />
            </SectionCard>

            {/* Delivery */}
            <div className="grid gap-6 xl:grid-cols-2">
              <SectionCard
                title="Delivery Analytics"
                description="Delivery status and delivery-time performance."
                icon={Truck}
              >
                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Total Deliveries</p>

                    <p className="mt-1 text-xl font-bold text-dark-900">
                      {formatNumber(deliverySummary.totalDeliveries)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Delivered</p>

                    <p className="mt-1 text-xl font-bold text-dark-900">
                      {formatNumber(deliverySummary.delivered)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs text-dark-400">Failed</p>

                    <p className="mt-1 text-xl font-bold text-dark-900">
                      {formatNumber(deliverySummary.failed)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Unassigned", delivery.unassigned, "warning"],
                    ["Offered", delivery.offered, "info"],
                    ["Assigned", delivery.assigned, "info"],
                    ["Accepted", delivery.accepted, "success"],
                    ["Picked Up", delivery.pickedUp, "info"],
                    ["In Transit", delivery.inTransit, "info"],
                    ["Delivered", delivery.delivered, "success"],
                    ["Failed", delivery.failed, "danger"],
                  ].map(([label, value, tone]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                    >
                      <StatusBadge status={label} tone={tone} />

                      <span className="text-sm font-semibold text-dark-900">
                        {formatNumber(value)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-primary-50 p-4">
                    <Clock3 size={18} className="text-primary-600" />

                    <p className="mt-2 text-xs text-dark-500">Average</p>

                    <p className="mt-1 font-semibold text-dark-900">
                      {formatNumber(deliveryTime.averageDeliveryTimeMinutes)}{" "}
                      min
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary-50 p-4">
                    <CheckCircle2 size={18} className="text-primary-600" />

                    <p className="mt-2 text-xs text-dark-500">Fastest</p>

                    <p className="mt-1 font-semibold text-dark-900">
                      {formatNumber(deliveryTime.fastestDeliveryMinutes)} min
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary-50 p-4">
                    <Clock3 size={18} className="text-primary-600" />

                    <p className="mt-2 text-xs text-dark-500">Slowest</p>

                    <p className="mt-1 font-semibold text-dark-900">
                      {formatNumber(deliveryTime.slowestDeliveryMinutes)} min
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Driver Performance"
                description="Delivery performance by driver."
                icon={Truck}
              >
                <DataTable
                  rows={deliveryAnalytics.driverPerformance}
                  emptyTitle="No driver performance data"
                  emptyDescription="Driver performance will appear here after deliveries are completed."
                  columns={[
                    {
                      key: "driver",
                      label: "Driver",
                      render: (row) =>
                        row.driverName ||
                        row.name ||
                        `${row.firstName || ""} ${row.lastName || ""}`.trim() ||
                        "Driver",
                    },
                    {
                      key: "deliveries",
                      label: "Deliveries",
                      render: (row) =>
                        formatNumber(row.deliveries ?? row.totalDeliveries),
                    },
                    {
                      key: "completed",
                      label: "Completed",
                      render: (row) =>
                        formatNumber(row.completed ?? row.delivered),
                    },
                    {
                      key: "failed",
                      label: "Failed",
                      render: (row) => formatNumber(row.failed),
                    },
                    {
                      key: "averageDeliveryTimeMinutes",
                      label: "Avg. Time",
                      render: (row) =>
                        row.averageDeliveryTimeMinutes != null
                          ? `${formatNumber(
                              row.averageDeliveryTimeMinutes,
                            )} min`
                          : "—",
                    },
                  ]}
                />
              </SectionCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
