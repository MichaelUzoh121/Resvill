import React, { useMemo } from "react";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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

const formatLabel = (value = "") => {
  return String(value)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

function ChartCard({
  title,
  description,
  icon: Icon,
  children,
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <Icon size={18} />
          </div>

          <div>
            <h2 className="font-semibold text-dark-900">
              {title}
            </h2>

            {description && (
              <p className="mt-0.5 text-xs text-dark-400">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="flex h-[320px] items-center justify-center rounded-xl bg-gray-50 text-center">
      <div>
        <BarChart3
          size={28}
          className="mx-auto text-dark-300"
        />

        <p className="mt-3 text-sm font-medium text-dark-600">
          No chart data available
        </p>

        <p className="mt-1 text-xs text-dark-400">
          {message}
        </p>
      </div>
    </div>
  );
}

function CurrencyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
      <p className="mb-2 text-xs font-semibold text-dark-700">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-6 text-xs"
        >
          <span className="text-dark-500">
            {item.name}
          </span>

          <span className="font-semibold text-dark-800">
            {item.dataKey === "revenue"
              ? formatNaira(item.value)
              : formatNumber(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function SimpleTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
      <p className="mb-2 text-xs font-semibold text-dark-700">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-6 text-xs"
        >
          <span className="text-dark-500">
            {item.name}
          </span>

          <span className="font-semibold text-dark-800">
            {formatNumber(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SalesTrendChart({ daily = [] }) {
  const data = useMemo(
    () =>
      daily.map((item) => ({
        ...item,
        label: item.date
          ? new Date(item.date).toLocaleDateString(
              "en-NG",
              {
                day: "numeric",
                month: "short",
              }
            )
          : "—",
        orders: Number(item.orders) || 0,
        revenue: Number(item.revenue) || 0,
      })),
    [daily]
  );

  return (
    <ChartCard
      title="Sales Trend"
      description="Daily order volume and revenue."
      icon={TrendingUp}
    >
      {!data.length ? (
        <EmptyChart message="Sales data will appear here after orders are recorded." />
      ) : (
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                yAxisId="orders"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />

              <YAxis
                yAxisId="revenue"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `₦${Number(value).toLocaleString("en-NG")}`
                }
              />

              <Tooltip content={<CurrencyTooltip />} />

              <Area
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                name="Orders"
                fill="currentColor"
                fillOpacity={0.08}
                stroke="currentColor"
                className="text-primary-500"
              />

              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                fill="currentColor"
                fillOpacity={0.05}
                stroke="currentColor"
                className="text-primary-700"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}

export function OrderStatusChart({ orders = {} }) {
  const data = useMemo(
    () => [
      ["Pending", orders.pending],
      ["Confirmed", orders.confirmed],
      ["Preparing", orders.preparing],
      ["Ready", orders.ready],
      ["Out for Delivery", orders.outForDelivery],
      ["Delivered", orders.delivered],
      ["Cancelled", orders.cancelled],
      ["Failed", orders.failed],
      ["Refunded", orders.refunded],
    ]
      .map(([name, value]) => ({
        name,
        value: Number(value) || 0,
      }))
      .filter((item) => item.value > 0),
    [orders]
  );

  return (
    <ChartCard
      title="Order Status"
      description="Distribution of orders by status."
      icon={PieChartIcon}
    >
      {!data.length ? (
        <EmptyChart message="Order status data will appear here after orders are recorded." />
      ) : (
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={115}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                  />
                ))}
              </Pie>

              <Tooltip content={<SimpleTooltip />} />

              <Legend
                verticalAlign="bottom"
                height={40}
                formatter={(value) => (
                  <span className="text-xs text-dark-600">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}

export function PaymentMethodsChart({
  methodBreakdown = {},
}) {
  const data = useMemo(
    () =>
      Object.entries(methodBreakdown)
        .map(([method, value]) => ({
          name: formatLabel(method),
          value: Number(value?.amount) || 0,
          count: Number(value?.count) || 0,
        }))
        .filter((item) => item.value > 0),
    [methodBreakdown]
  );

  return (
    <ChartCard
      title="Payment Methods"
      description="Revenue generated by payment method."
      icon={PieChartIcon}
    >
      {!data.length ? (
        <EmptyChart message="Payment method data will appear here after payments are recorded." />
      ) : (
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 10,
                right: 20,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
              />

              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `₦${Number(value).toLocaleString("en-NG")}`
                }
              />

              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={100}
              />

              <Tooltip
                formatter={(value) => formatNaira(value)}
              />

              <Bar
                dataKey="value"
                name="Amount"
                fill="currentColor"
                radius={[0, 6, 6, 0]}
                className="text-primary-500"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}

export function FoodRevenueChart({ foods = [] }) {
  const data = useMemo(
    () =>
      foods
        .map((food) => ({
          name: food.name || "Unknown",
          revenue: Number(food.revenue) || 0,
          quantitySold:
            Number(food.quantitySold) || 0,
        }))
        .filter(
          (food) =>
            food.revenue > 0 ||
            food.quantitySold > 0
        )
        .slice(0, 10),
    [foods]
  );

  return (
    <ChartCard
      title="Food Revenue"
      description="Revenue generated by food items."
      icon={BarChart3}
    >
      {!data.length ? (
        <EmptyChart message="Food revenue will appear here after orders are recorded." />
      ) : (
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 45,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                angle={-35}
                textAnchor="end"
                interval={0}
              />

              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `₦${Number(value).toLocaleString("en-NG")}`
                }
              />

              <Tooltip
                formatter={(value) => formatNaira(value)}
              />

              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="currentColor"
                radius={[6, 6, 0, 0]}
                className="text-primary-500"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}

export function DeliveryStatusChart({
  delivery = {},
}) {
  const data = useMemo(
    () => [
      ["Unassigned", delivery.unassigned],
      ["Offered", delivery.offered],
      ["Assigned", delivery.assigned],
      ["Accepted", delivery.accepted],
      ["Picked Up", delivery.pickedUp],
      ["In Transit", delivery.inTransit],
      ["Delivered", delivery.delivered],
      ["Failed", delivery.failed],
    ]
      .map(([name, value]) => ({
        name,
        value: Number(value) || 0,
      }))
      .filter((item) => item.value > 0),
    [delivery]
  );

  return (
    <ChartCard
      title="Delivery Status"
      description="Distribution of deliveries by status."
      icon={BarChart3}
    >
      {!data.length ? (
        <EmptyChart message="Delivery status data will appear here after deliveries are recorded." />
      ) : (
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                angle={-30}
                textAnchor="end"
                interval={0}
              />

              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />

              <Tooltip content={<SimpleTooltip />} />

              <Bar
                dataKey="value"
                name="Deliveries"
                fill="currentColor"
                radius={[6, 6, 0, 0]}
                className="text-primary-500"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}

