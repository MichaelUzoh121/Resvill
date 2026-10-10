import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  DollarSign,
  Package,
  ShoppingBag,
  Truck,
  Users,
  UtensilsCrossed,
  WalletCards,
  Tag,
  TrendingUp,
  CircleDollarSign,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminDashboard } from "../hooks/useAdminDashboard";

const PRIMARY_COLOR = "#eb0029";

const formatNaira = (value = 0) =>
  `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatNumber = (value = 0) =>
  Number(value || 0).toLocaleString("en-NG");

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function SectionHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary-500">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-1 font-heading text-xl font-bold text-dark-900">
        {title}
      </h2>

      {description && (
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-dark-500">
          {description}
        </p>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass = "bg-primary-50 text-primary-500",
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-50 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-dark-500">
            {title}
          </p>

          <p className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-dark-900">
            {value}
          </p>

          {description && (
            <p className="mt-1.5 text-xs text-dark-500">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl border border-dark-100 bg-dark-50/70 p-3.5">
      <div className="flex items-center gap-2 text-dark-500">
        <Icon size={15} />

        <span className="text-[11px] font-semibold">
          {label}
        </span>
      </div>

      <p className="mt-2 font-heading text-base font-bold text-dark-900">
        {value}
      </p>
    </div>
  );
}

function OverviewCard({
  title,
  description,
  children,
  icon: Icon,
  iconClass = "bg-primary-50 text-primary-500",
}) {
  return (
    <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={18} />
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold text-dark-900">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-xs leading-5 text-dark-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

function StatusRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between border-b border-dark-100 py-2.5 last:border-0">
      <span className="text-xs font-medium text-dark-500">
        {label}
      </span>

      <span className="text-sm font-bold text-dark-900">
        {formatNumber(value)}
      </span>
    </div>
  );
}

function FoodTable({
  foods = [],
  title,
  description,
  accent = "primary",
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
      <div className="border-b border-dark-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-sm font-bold text-dark-900">
              {title}
            </h3>

            {description && (
              <p className="mt-1 text-xs text-dark-500">
                {description}
              </p>
            )}
          </div>

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              accent === "success"
                ? "bg-success/10 text-success"
                : "bg-primary-50 text-primary-500"
            }`}
          >
            <UtensilsCrossed size={16} />
          </div>
        </div>
      </div>

      {foods.length === 0 ? (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-50 text-dark-300">
            <UtensilsCrossed size={20} />
          </div>

          <p className="mt-3 text-sm font-semibold text-dark-700">
            No food data available
          </p>

          <p className="mt-1 text-xs text-dark-500">
            Food performance will appear here once data is available.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-dark-100">
          {foods.map((food, index) => (
            <div
              key={
                food.foodId ||
                food._id ||
                `${food.name}-${index}`
              }
              className="flex items-center gap-3 p-4 transition hover:bg-dark-50/60 sm:gap-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dark-50 text-xs font-bold text-dark-500">
                {index + 1}
              </div>

              {food.image ? (
                <img
                  src={food.image}
                  alt={food.name || "Food"}
                  className="h-11 w-11 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dark-50 text-dark-300">
                  <UtensilsCrossed size={17} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-dark-900">
                  {food.name || "Unknown Food"}
                </p>

                <p className="mt-1 truncate text-xs text-dark-500">
                  {food.category?.name || "Uncategorized"}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-dark-800">
                  {formatNumber(food.quantitySold)} sold
                </p>

                <p className="mt-1 text-xs font-semibold text-primary-500">
                  {formatNaira(food.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SalesTable({
  title,
  data = [],
  type,
}) {
  const getLabel = (item) => {
    if (type === "daily") {
      return formatDate(item.date);
    }

    if (type === "weekly") {
      return item.week || "—";
    }

    return item.month || "—";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
      <div className="border-b border-dark-100 p-5">
        <h3 className="font-heading text-sm font-bold text-dark-900">
          {title}
        </h3>
      </div>

      {data.length === 0 ? (
        <div className="p-8 text-center text-sm text-dark-500">
          No sales data available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-dark-100 bg-dark-50/60 text-left">
                <th className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-dark-500">
                  Period
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.12em] text-dark-500">
                  Orders
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.12em] text-dark-500">
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-100">
              {data.map((item, index) => (
                <tr
                  key={`${type}-${index}`}
                  className="transition hover:bg-dark-50/50"
                >
                  <td className="px-5 py-3 text-sm font-semibold text-dark-900">
                    {getLabel(item)}
                  </td>

                  <td className="px-5 py-3 text-right text-sm text-dark-600">
                    {formatNumber(item.orders)}
                  </td>

                  <td className="px-5 py-3 text-right text-sm font-bold text-dark-900">
                    {formatNaira(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-3 w-28 animate-pulse rounded bg-dark-100" />

          <div className="mt-3 h-9 w-48 animate-pulse rounded-lg bg-dark-100" />

          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-dark-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-dark-100"
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-2xl bg-dark-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-danger/20 bg-white p-8 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertCircle size={28} />
          </div>

          <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-danger">
            Dashboard error
          </p>

          <h2 className="mt-2 font-heading text-xl font-bold text-dark-900">
            Failed to load dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-dark-500">
            {error?.message ||
              "Something went wrong while loading the dashboard."}
          </p>
        </div>
      </div>
    );
  }

  const period = data?.period || {};
  const overview = data?.overview || {};
  const sales = data?.sales || {};

  const orders = overview.orders || {};
  const customers = overview.customers || {};
  const foods = overview.foods || {};
  const payments = overview.payments || {};
  const coupons = overview.coupons || {};
  const delivery = overview.delivery || {};

  return (
    <div className="space-y-10">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-dark-950 p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-primary-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />

              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-dark-300">
                Admin Overview
              </p>
            </div>

            <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-dark-400">
              Monitor your restaurant&apos;s orders, revenue,
              customers, payments and delivery activity.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-400">
              Reporting period
            </p>

            <p className="mt-1 text-sm font-bold text-white">
              {formatDate(period.startDate)}
              <span className="mx-2 text-dark-500">
                —
              </span>
              {formatDate(period.endDate)}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          KEY METRICS
      ========================================================= */}
      <section>
        <SectionHeader
          eyebrow="Performance"
          title="Key metrics"
          description="A quick look at the most important numbers for the selected period."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={formatNumber(orders.total)}
            description={`${formatNumber(
              orders.status?.pending,
            )} pending`}
            icon={ShoppingBag}
          />

          <StatCard
            title="Revenue"
            value={formatNaira(orders.revenue)}
            description={`AOV ${formatNaira(
              orders.averageOrderValue,
            )}`}
            icon={CircleDollarSign}
            iconClass="bg-success/10 text-success"
          />

          <StatCard
            title="Customers"
            value={formatNumber(customers.total)}
            description={`${formatNumber(
              customers.new,
            )} new customers`}
            icon={Users}
            iconClass="bg-info/10 text-info"
          />

          <StatCard
            title="Active Foods"
            value={formatNumber(foods.active)}
            description="Currently available"
            icon={UtensilsCrossed}
            iconClass="bg-accent-400/15 text-accent-600"
          />

          <StatCard
            title="Successful Payments"
            value={formatNumber(
              payments.success?.count,
            )}
            description={formatNaira(
              payments.success?.amount,
            )}
            icon={CheckCircle2}
            iconClass="bg-success/10 text-success"
          />

          <StatCard
            title="Active Coupons"
            value={formatNumber(coupons.active)}
            description={`${formatNumber(
              coupons.totalUses,
            )} total uses`}
            icon={Tag}
            iconClass="bg-primary-50 text-primary-500"
          />

          <StatCard
            title="Deliveries"
            value={formatNumber(delivery.total)}
            description={`${formatNumber(
              delivery.delivered,
            )} delivered`}
            icon={Truck}
            iconClass="bg-info/10 text-info"
          />

          <StatCard
            title="Avg. Delivery Time"
            value={`${Number(
              delivery.averageDeliveryTimeMinutes || 0,
            ).toFixed(0)} min`}
            description={`${formatNumber(
              delivery.inTransit,
            )} currently in transit`}
            icon={Clock3}
            iconClass="bg-warning/10 text-warning"
          />
        </div>
      </section>

      {/* =========================================================
          OPERATIONAL OVERVIEW
      ========================================================= */}
      <section>
        <SectionHeader
          eyebrow="Operations"
          title="Operational overview"
          description="Current order, payment, customer and delivery activity."
        />

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Orders */}
          <OverviewCard
            title="Orders"
            description="Current order status breakdown."
            icon={ShoppingBag}
          >
            <div>
              <StatusRow
                label="Pending"
                value={orders.status?.pending}
              />

              <StatusRow
                label="Confirmed"
                value={orders.status?.confirmed}
              />

              <StatusRow
                label="Preparing"
                value={orders.status?.preparing}
              />

              <StatusRow
                label="Ready"
                value={orders.status?.ready}
              />

              <StatusRow
                label="Out for delivery"
                value={orders.status?.outForDelivery}
              />

              <StatusRow
                label="Delivered"
                value={orders.status?.delivered}
              />

              <StatusRow
                label="Cancelled"
                value={orders.status?.cancelled}
              />

              <StatusRow
                label="Failed"
                value={orders.status?.failed}
              />

              <StatusRow
                label="Refunded"
                value={orders.status?.refunded}
              />
            </div>
          </OverviewCard>

          {/* Payments */}
          <OverviewCard
            title="Payments"
            description="Payment activity across the selected period."
            icon={WalletCards}
            iconClass="bg-success/10 text-success"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <MiniMetric
                label="Successful"
                value={formatNaira(
                  payments.success?.amount,
                )}
                icon={CheckCircle2}
              />

              <MiniMetric
                label="Pending"
                value={formatNaira(
                  payments.pending?.amount,
                )}
                icon={Clock3}
              />

              <MiniMetric
                label="Processing"
                value={formatNaira(
                  payments.processing?.amount,
                )}
                icon={Clock3}
              />

              <MiniMetric
                label="Failed"
                value={formatNaira(
                  payments.failed?.amount,
                )}
                icon={AlertCircle}
              />

              <MiniMetric
                label="Refunded"
                value={formatNaira(
                  payments.refunded?.amount,
                )}
                icon={ArrowDownRight}
              />

              <MiniMetric
                label="Partial refunds"
                value={formatNaira(
                  payments.partiallyRefunded?.amount,
                )}
                icon={ArrowDownRight}
              />
            </div>
          </OverviewCard>

          {/* Delivery */}
          <OverviewCard
            title="Delivery"
            description="Live delivery status breakdown."
            icon={Truck}
            iconClass="bg-info/10 text-info"
          >
            <div>
              <StatusRow
                label="Unassigned"
                value={delivery.unassigned}
              />

              <StatusRow
                label="Offered"
                value={delivery.offered}
              />

              <StatusRow
                label="Assigned"
                value={delivery.assigned}
              />

              <StatusRow
                label="Accepted"
                value={delivery.accepted}
              />

              <StatusRow
                label="Picked up"
                value={delivery.pickedUp}
              />

              <StatusRow
                label="In transit"
                value={delivery.inTransit}
              />

              <StatusRow
                label="Delivered"
                value={delivery.delivered}
              />

              <StatusRow
                label="Failed"
                value={delivery.failed}
              />
            </div>
          </OverviewCard>

          {/* Customers */}
          <OverviewCard
            title="Customers"
            description="Customer activity during this period."
            icon={Users}
            iconClass="bg-info/10 text-info"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniMetric
                label="Total"
                value={formatNumber(
                  customers.total,
                )}
                icon={Users}
              />

              <MiniMetric
                label="New"
                value={formatNumber(
                  customers.new,
                )}
                icon={ArrowUpRight}
              />

              <MiniMetric
                label="Active"
                value={formatNumber(
                  customers.active,
                )}
                icon={CheckCircle2}
              />
            </div>
          </OverviewCard>

          {/* Coupons */}
          <OverviewCard
            title="Coupons"
            description="Coupon usage and discount activity."
            icon={Tag}
            iconClass="bg-primary-50 text-primary-500"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniMetric
                label="Active"
                value={formatNumber(
                  coupons.active,
                )}
                icon={CheckCircle2}
              />

              <MiniMetric
                label="Uses"
                value={formatNumber(
                  coupons.totalUses,
                )}
                icon={Tag}
              />

              <MiniMetric
                label="Discount"
                value={formatNaira(
                  coupons.totalDiscount,
                )}
                icon={ArrowDownRight}
              />
            </div>
          </OverviewCard>

          {/* Order value */}
          <OverviewCard
            title="Order value"
            description="Financial breakdown of completed orders."
            icon={DollarSign}
            iconClass="bg-warning/10 text-warning"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <MiniMetric
                label="Revenue"
                value={formatNaira(
                  orders.revenue,
                )}
                icon={DollarSign}
              />

              <MiniMetric
                label="Avg. order"
                value={formatNaira(
                  orders.averageOrderValue,
                )}
                icon={ShoppingBag}
              />

              <MiniMetric
                label="Discounts"
                value={formatNaira(
                  orders.discount,
                )}
                icon={ArrowDownRight}
              />

              <MiniMetric
                label="Delivery fees"
                value={formatNaira(
                  orders.deliveryFees,
                )}
                icon={Truck}
              />

              <MiniMetric
                label="Tax"
                value={formatNaira(
                  orders.tax,
                )}
                icon={DollarSign}
              />

              <MiniMetric
                label="Tips"
                value={formatNaira(
                  orders.tips,
                )}
                icon={DollarSign}
              />
            </div>
          </OverviewCard>
        </div>
      </section>

      {/* =========================================================
          SALES PERFORMANCE
      ========================================================= */}
      <section>
        <SectionHeader
          eyebrow="Revenue"
          title="Sales performance"
          description="Revenue and order activity for the selected reporting period."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Sales"
            value={formatNaira(
              sales.summary?.totalRevenue,
            )}
            description={`${formatNumber(
              sales.summary?.totalOrders,
            )} orders`}
            icon={TrendingUp}
            iconClass="bg-success/10 text-success"
          />

          <StatCard
            title="Sales Orders"
            value={formatNumber(
              sales.summary?.totalOrders,
            )}
            description="Orders in this period"
            icon={ShoppingBag}
            iconClass="bg-info/10 text-info"
          />

          <StatCard
            title="Average Order Value"
            value={formatNaira(
              sales.summary?.averageOrderValue,
            )}
            description="Average revenue per order"
            icon={Package}
            iconClass="bg-primary-50 text-primary-500"
          />
        </div>

        {/* Revenue chart */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-heading text-sm font-bold text-dark-900">
                  Daily revenue
                </h3>

                <p className="mt-1 text-xs text-dark-500">
                  Revenue generated across the selected period.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary-500" />

                <span className="text-xs font-semibold text-dark-500">
                  Revenue
                </span>
              </div>
            </div>
          </div>

          {sales.daily?.length > 0 ? (
            <div className="h-[340px] w-full p-4 sm:p-6">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={sales.daily}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={PRIMARY_COLOR}
                        stopOpacity={0.22}
                      />

                      <stop
                        offset="100%"
                        stopColor={PRIMARY_COLOR}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e9ecef"
                  />

                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#6c757d",
                    }}
                  />

                  <YAxis
                    tickFormatter={(value) =>
                      `₦${Number(
                        value || 0,
                      ).toLocaleString("en-NG")}`
                    }
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fill: "#6c757d",
                    }}
                    width={85}
                  />

                  <Tooltip
                    cursor={{
                      stroke: "#dee2e6",
                    }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e9ecef",
                      boxShadow:
                        "0 10px 30px rgba(15, 23, 42, 0.08)",
                    }}
                    formatter={(value) => [
                      formatNaira(value),
                      "Revenue",
                    ]}
                    labelFormatter={formatDate}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={PRIMARY_COLOR}
                    fill="url(#salesGradient)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: PRIMARY_COLOR,
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[340px] items-center justify-center p-6">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-dark-50 text-dark-300">
                  <DollarSign size={23} />
                </div>

                <p className="mt-4 text-sm font-bold text-dark-700">
                  No sales data available
                </p>

                <p className="mt-1 text-xs text-dark-500">
                  Sales will appear here once orders are completed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sales tables */}
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <SalesTable
            title="Weekly sales"
            data={sales.weekly}
            type="weekly"
          />

          <SalesTable
            title="Monthly sales"
            data={sales.monthly}
            type="monthly"
          />
        </div>
      </section>

      {/* =========================================================
          FOOD PERFORMANCE
      ========================================================= */}
      <section>
        <SectionHeader
          eyebrow="Menu"
          title="Food performance"
          description="Understand which foods are driving sales and which need attention."
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <FoodTable
            title="Popular foods"
            description="Your highest-performing menu items."
            foods={data?.popularFoods || []}
          />

          <FoodTable
            title="Least-selling foods"
            description="Menu items with the lowest sales volume."
            foods={data?.leastSellingFoods || []}
            accent="success"
          />
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;