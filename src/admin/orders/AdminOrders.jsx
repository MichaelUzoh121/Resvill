import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAdminOrders } from "../hooks/useAdminOrders";

const ORDER_STATUSES = [
  { value: "", label: "All order statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY", label: "Ready" },
  { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { value: "DELIVERED", label: "Delivered" },
];

const PAYMENT_STATUSES = [
  { value: "", label: "All payment statuses" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "partially_refunded", label: "Partially refunded" },
];

const CUSTOMER_TYPES = [
  { value: "", label: "All customers" },
  { value: "registered", label: "Registered" },
  { value: "guest", label: "Guest" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest" },
  { value: "total", label: "Total" },
  { value: "status", label: "Status" },
];

const PAGE_LIMIT = 20;

const formatCurrency = (value) => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatStatus = (status) => {
  if (!status) return "—";

  return status
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStatusClasses = (status) => {
  switch (status) {
    case "PENDING":
      return "border-warning/20 bg-warning/10 text-amber-700";

    case "CONFIRMED":
      return "border-info/20 bg-info/10 text-blue-700";

    case "PREPARING":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "READY":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "OUT_FOR_DELIVERY":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";

    case "DELIVERED":
      return "border-success/20 bg-success/10 text-green-700";

    default:
      return "border-dark-200 bg-dark-50 text-dark-600";
  }
};

const getPaymentStatusClasses = (status) => {
  switch (status) {
    case "paid":
      return "border-success/20 bg-success/10 text-green-700";

    case "pending":
      return "border-warning/20 bg-warning/10 text-amber-700";

    case "failed":
      return "border-danger/20 bg-danger/10 text-red-700";

    case "refunded":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "partially_refunded":
      return "border-orange-200 bg-orange-50 text-orange-700";

    default:
      return "border-dark-200 bg-dark-50 text-dark-600";
  }
};

const getOrderId = (order) => {
  return order?._id || order?.id;
};

const getOrderNumber = (order) => {
  return (
    order?.orderNumber ||
    order?.orderId ||
    getOrderId(order)?.slice(-8)?.toUpperCase() ||
    "—"
  );
};

const getCustomerName = (order) => {
  if (order?.customer?.name) return order.customer.name;

  if (order?.customer) {
    const firstName =
      order.customer.firstname || order.customer.firstName || "";
    const lastName =
      order.customer.lastname || order.customer.lastName || "";

    const name = `${firstName} ${lastName}`.trim();

    if (name) return name;

    if (order.customer.email) return order.customer.email;
  }

  if (order?.user?.name) return order.user.name;

  if (order?.user) {
    const firstName = order.user.firstname || order.user.firstName || "";
    const lastName = order.user.lastname || order.user.lastName || "";

    const name = `${firstName} ${lastName}`.trim();

    if (name) return name;

    if (order.user.email) return order.user.email;
  }

  if (order?.guestDetails?.name) return order.guestDetails.name;

  if (order?.guestName) return order.guestName;

  return "Guest customer";
};

const getCustomerEmail = (order) => {
  return (
    order?.customer?.email ||
    order?.user?.email ||
    order?.guestDetails?.email ||
    order?.guestEmail ||
    ""
  );
};

const getCustomerType = (order) => {
  if (order?.customerType) return order.customerType;

  if (order?.customer || order?.user) return "registered";

  return "guest";
};

const getOrderTotal = (order) => {
  return (
    order?.total ??
    order?.totalAmount ??
    order?.pricing?.total ??
    order?.amount ??
    0
  );
};

const getPaymentStatus = (order) => {
  return (
    order?.paymentStatus ||
    order?.payment?.status ||
    "pending"
  ).toLowerCase();
};

const getDeliveryStatus = (order) => {
  return order?.deliveryStatus || order?.delivery?.status || "";
};

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-dark-500">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 pr-9 text-sm font-medium text-dark-700 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dark-400"
        />
      </div>
    </div>
  );
}

function AdminOrders() {
  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    customerType: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      search: searchInput.trim() || undefined,
      status: filters.status || undefined,
      paymentStatus: filters.paymentStatus || undefined,
      customerType: filters.customerType || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      sortBy: filters.sortBy || undefined,
      sortOrder: filters.sortOrder || undefined,
    }),
    [page, searchInput, filters]
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminOrders(queryParams);

  const orders = useMemo(() => {
    if (Array.isArray(data)) return data;

    return data?.orders || data?.items || data?.results || [];
  }, [data]);

  const pagination = data?.pagination || {};

  const totalPages = Math.max(
    Number(
      pagination?.totalPages ??
        pagination?.pages ??
        Math.ceil(
          Number(
            pagination?.total ??
              data?.total ??
              orders.length
          ) / PAGE_LIMIT
        )
    ) || 1,
    1
  );

  const totalOrders = Number(
    pagination?.total ??
      pagination?.totalOrders ??
      data?.total ??
      orders.length
  );

  const activeFilterCount = [
    filters.status,
    filters.paymentStatus,
    filters.customerType,
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  const hasActiveFilters =
    activeFilterCount > 0 ||
    Boolean(searchInput.trim()) ||
    filters.sortBy !== "createdAt" ||
    filters.sortOrder !== "desc";

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));

    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");

    setFilters({
      status: "",
      paymentStatus: "",
      customerType: "",
      dateFrom: "",
      dateTo: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    setPage(1);
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Orders refreshed");
    } catch {
      toast.error("Unable to refresh orders");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-7">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary-50 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-600">
              <ShoppingBag size={14} />
              Order Management
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
              Orders
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
              Manage customer orders, monitor payment status and track
              delivery progress from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-dark-100 bg-dark-50 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-dark-400">
                Total Orders
              </p>

              <p className="mt-0.5 font-heading text-xl font-bold text-dark-900">
                {isLoading ? "—" : totalOrders.toLocaleString("en-NG")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm font-bold text-dark-700 shadow-sm transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Search + Filter Toolbar */}
      <section className="rounded-2xl border border-dark-100 bg-white p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <form
            onSubmit={handleSearchSubmit}
            className="flex min-w-0 flex-1 gap-3"
          >
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
              />

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search order number, customer name or email..."
                className="w-full rounded-xl border border-dark-200 bg-dark-50 py-3 pl-11 pr-10 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-50"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-dark-400 transition hover:bg-dark-100 hover:text-dark-700"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-600 hover:shadow-hover"
            >
              <Search size={17} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${
              showFilters || activeFilterCount > 0
                ? "border-primary-200 bg-primary-50 text-primary-600"
                : "border-dark-200 bg-white text-dark-700 hover:bg-dark-50"
            }`}
          >
            <SlidersHorizontal size={17} />
            Filters

            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 text-[11px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dark-100 pt-4">
            <span className="mr-1 text-xs font-bold uppercase tracking-wide text-dark-400">
              Active:
            </span>

            {filters.status && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-600">
                {formatStatus(filters.status)}
                <button
                  type="button"
                  onClick={() => handleFilterChange("status", "")}
                  className="rounded-full hover:bg-primary-100"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.paymentStatus && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-600">
                Payment: {formatStatus(filters.paymentStatus)}
                <button
                  type="button"
                  onClick={() =>
                    handleFilterChange("paymentStatus", "")
                  }
                  className="rounded-full hover:bg-primary-100"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.customerType && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-600">
                {formatStatus(filters.customerType)}
                <button
                  type="button"
                  onClick={() =>
                    handleFilterChange("customerType", "")
                  }
                  className="rounded-full hover:bg-primary-100"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {(filters.dateFrom || filters.dateTo) && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-600">
                Date range
                <button
                  type="button"
                  onClick={() => {
                    setFilters((current) => ({
                      ...current,
                      dateFrom: "",
                      dateTo: "",
                    }));
                    setPage(1);
                  }}
                  className="rounded-full hover:bg-primary-100"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {(filters.sortBy !== "createdAt" ||
              filters.sortOrder !== "desc") && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-dark-100 px-3 py-1.5 text-xs font-semibold text-dark-600">
                Sorted:{" "}
                {SORT_OPTIONS.find(
                  (option) => option.value === filters.sortBy
                )?.label || "Custom"}
              </span>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 text-xs font-bold text-primary-600 transition hover:text-primary-700"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-5 border-t border-dark-100 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-primary-500" />

                <h2 className="text-sm font-bold text-dark-800">
                  Filter Orders
                </h2>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-dark-500 transition hover:text-primary-600"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <FilterSelect
                label="Order Status"
                value={filters.status}
                onChange={(event) =>
                  handleFilterChange("status", event.target.value)
                }
                options={ORDER_STATUSES}
              />

              <FilterSelect
                label="Payment Status"
                value={filters.paymentStatus}
                onChange={(event) =>
                  handleFilterChange(
                    "paymentStatus",
                    event.target.value
                  )
                }
                options={PAYMENT_STATUSES}
              />

              <FilterSelect
                label="Customer Type"
                value={filters.customerType}
                onChange={(event) =>
                  handleFilterChange(
                    "customerType",
                    event.target.value
                  )
                }
                options={CUSTOMER_TYPES}
              />

              <FilterSelect
                label="Sort By"
                value={filters.sortBy}
                onChange={(event) =>
                  handleFilterChange("sortBy", event.target.value)
                }
                options={SORT_OPTIONS}
              />

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-dark-500">
                  From Date
                </label>

                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(event) =>
                    handleFilterChange(
                      "dateFrom",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm font-medium text-dark-700 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-dark-500">
                  To Date
                </label>

                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(event) =>
                    handleFilterChange(
                      "dateTo",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm font-medium text-dark-700 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-50"
                />
              </div>

              <FilterSelect
                label="Direction"
                value={filters.sortOrder}
                onChange={(event) =>
                  handleFilterChange(
                    "sortOrder",
                    event.target.value
                  )
                }
                options={[
                  { value: "desc", label: "Descending" },
                  { value: "asc", label: "Ascending" },
                ]}
              />

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-bold text-dark-600 transition hover:border-dark-300 hover:bg-dark-50"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Error */}
      {isError && (
        <div className="rounded-2xl border border-danger/20 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <AlertCircle size={19} className="text-danger" />
            </div>

            <div>
              <h3 className="font-bold text-red-700">
                Unable to load orders
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong while loading orders."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-red-700 transition hover:text-red-800"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders */}
      <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
        <div className="flex flex-col gap-3 border-b border-dark-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-base font-bold text-dark-900">
                All Orders
              </h2>

              {!isLoading && (
                <span className="rounded-full bg-dark-100 px-2.5 py-1 text-xs font-bold text-dark-600">
                  {totalOrders.toLocaleString("en-NG")}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-dark-400">
              Review and manage customer orders.
            </p>
          </div>

          {isFetching && !isLoading && (
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary-500">
              <Loader2 size={15} className="animate-spin" />
              Updating...
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="p-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-dark-100 p-4"
                >
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-7">
                    <div className="h-10 rounded-lg bg-dark-100" />
                    <div className="h-10 rounded-lg bg-dark-100" />
                    <div className="h-10 rounded-lg bg-dark-100" />
                    <div className="h-10 rounded-lg bg-dark-100" />
                    <div className="h-10 rounded-lg bg-dark-100" />
                    <div className="h-10 rounded-lg bg-dark-100" />
                    <div className="h-10 rounded-lg bg-dark-100" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 pt-5 text-sm text-dark-500">
              <Loader2
                size={17}
                className="animate-spin text-primary-500"
              />
              Loading orders...
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center px-5 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
              <ShoppingBag
                size={28}
                className="text-primary-500"
              />
            </div>

            <h3 className="mt-5 font-heading text-lg font-bold text-dark-900">
              No orders found
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-dark-500">
              No orders match your current search or filter criteria.
              Try adjusting your search or clearing the filters.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600"
              >
                <X size={15} />
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[1180px] w-full">
                <thead>
                  <tr className="border-b border-dark-100 bg-dark-50/70">
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-500">
                      Order
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-500">
                      Customer
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-500">
                      Total
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-500">
                      Payment
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-500">
                      Status
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-500">
                      Delivery
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-dark-500">
                      Date
                    </th>

                    <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-dark-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-dark-100">
                  {orders.map((order) => {
                    const orderId = getOrderId(order);
                    const orderStatus = order?.status || "";
                    const paymentStatus = getPaymentStatus(order);
                    const deliveryStatus = getDeliveryStatus(order);
                    const customerType = getCustomerType(order);

                    return (
                      <tr
                        key={orderId}
                        className="group transition hover:bg-primary-50/30"
                      >
                        {/* Order */}
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/orders/${orderId}`}
                            className="inline-flex items-center gap-1 font-bold text-primary-600 transition hover:text-primary-700"
                          >
                            #{getOrderNumber(order)}
                          </Link>

                          <div className="mt-1">
                            <span
                              className={`text-[11px] font-semibold ${
                                customerType === "guest"
                                  ? "text-dark-400"
                                  : "text-dark-500"
                              }`}
                            >
                              {customerType === "guest"
                                ? "Guest order"
                                : "Registered customer"}
                            </span>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="max-w-[250px] px-6 py-4">
                          <p className="truncate font-semibold text-dark-800">
                            {getCustomerName(order)}
                          </p>

                          {getCustomerEmail(order) && (
                            <p className="mt-1 truncate text-xs text-dark-400">
                              {getCustomerEmail(order)}
                            </p>
                          )}
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4">
                          <span className="whitespace-nowrap font-heading text-sm font-bold text-dark-900">
                            {formatCurrency(getOrderTotal(order))}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1.5 text-[11px] font-bold ${getPaymentStatusClasses(
                              paymentStatus
                            )}`}
                          >
                            {formatStatus(paymentStatus)}
                          </span>
                        </td>

                        {/* Order status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1.5 text-[11px] font-bold ${getStatusClasses(
                              orderStatus
                            )}`}
                          >
                            {formatStatus(orderStatus)}
                          </span>
                        </td>

                        {/* Delivery */}
                        <td className="px-6 py-4">
                          {deliveryStatus ? (
                            <span className="text-sm font-medium text-dark-600">
                              {formatStatus(deliveryStatus)}
                            </span>
                          ) : (
                            <span className="text-sm text-dark-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="text-xs font-medium text-dark-500">
                            {formatDate(
                              order?.createdAt ||
                                order?.orderDate ||
                                order?.created
                            )}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/admin/orders/${orderId}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-3.5 py-2 text-xs font-bold text-dark-600 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
                          >
                            <Eye size={14} />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-dark-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-sm text-dark-500">
                  Page{" "}
                  <span className="font-bold text-dark-800">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-dark-800">
                    {totalPages}
                  </span>
                </p>

                <p className="mt-0.5 text-xs text-dark-400">
                  Showing up to {PAGE_LIMIT} orders per page
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isFetching}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(current - 1, 1)
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm font-bold text-dark-600 transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    page >= totalPages || isFetching
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(current + 1, totalPages)
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-dark-200 bg-white px-3.5 py-2.5 text-sm font-bold text-dark-600 transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default AdminOrders;