import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAdminPayments } from "../hooks/useAdminPayments";
import { PAYMENT_STATUSES } from "../../constants/paymentStatuses";

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  {
    value: PAYMENT_STATUSES.PENDING,
    label: "Pending",
  },
  {
    value: PAYMENT_STATUSES.PROCESSING,
    label: "Processing",
  },
  {
    value: PAYMENT_STATUSES.SUCCESS,
    label: "Success",
  },
  {
    value: PAYMENT_STATUSES.FAILED,
    label: "Failed",
  },
  {
    value: PAYMENT_STATUSES.REFUNDED,
    label: "Refunded",
  },
  {
    value: PAYMENT_STATUSES.PARTIALLY_REFUNDED,
    label: "Partially refunded",
  },
];

const statusClasses = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  failed: "bg-danger/10 text-danger",
  refunded: "bg-purple-50 text-purple-700",
  partially_refunded: "bg-orange-50 text-orange-700",
};

const formatStatus = (status = "") => {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatCurrency = (amount, currency = "NGN") => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "—";
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency} ${numericAmount.toLocaleString()}`;
  }
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getCustomerName = (payment) => {
  const user = payment?.user;

  if (!user) {
    return "Guest";
  }

  const fullName = [user.firstname, user.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    user.name ||
    user.email ||
    user.phone ||
    "Customer"
  );
};

const getCustomerInitials = (payment) => {
  const name = getCustomerName(payment);

  if (!name || name === "Guest") {
    return "G";
  }

  const parts = name.split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0].slice(0, 1)}${parts[
    parts.length - 1
  ].slice(0, 1)}`.toUpperCase();
};

const getOrderReference = (payment) => {
  if (!payment?.order) {
    return "—";
  }

  if (typeof payment.order === "string") {
    return payment.order;
  }

  return (
    payment.order.orderNumber ||
    payment.order.reference ||
    payment.order._id ||
    payment.order.id ||
    "—"
  );
};

const getPaymentId = (payment) => {
  return (
    payment?._id ||
    payment?.id ||
    payment?.reference
  );
};

function AdminPayments() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: status || undefined,
      page,
      limit: 20,
    }),
    [search, status, page]
  );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminPayments(queryParams);

  const payments = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }

    return Array.isArray(data?.payments)
      ? data.payments
      : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.results)
          ? data.results
          : [];
  }, [data]);

  const pagination = data?.pagination || {};

  const currentPage =
    Number(pagination.page) || page;

  const totalPages = Math.max(
    Number(
      pagination.totalPages ??
        pagination.pages ??
        Math.ceil(
          Number(
            pagination.total ??
              data?.total ??
              payments.length
          ) / 20
        )
    ) || 1,
    1
  );

  const totalPayments = Number(
    pagination.total ??
      pagination.totalPayments ??
      data?.total ??
      payments.length
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const hasFilters = Boolean(search.trim() || status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <CreditCard size={21} />
            </div>

            <div>
              <h1 className="font-heading text-2xl font-bold text-dark-900">
                Payments
              </h1>

              <p className="mt-0.5 text-sm text-dark-500">
                Monitor and review customer payment
                transactions.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 text-sm font-semibold text-dark-700 shadow-sm transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <section className="rounded-2xl border border-dark-100 bg-white p-4 shadow-soft sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-50 text-dark-600">
              <Filter size={15} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-dark-800">
                Payment Filters
              </h2>

              <p className="text-xs text-dark-500">
                Search and filter payment transactions.
              </p>
            </div>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-dark-500 transition hover:text-primary-600 sm:self-auto"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(280px,1fr)_220px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search reference, customer or order..."
              className="h-11 w-full rounded-xl border border-dark-200 bg-white pl-10 pr-4 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
            />
          </div>

          <select
            value={status}
            onChange={handleStatusChange}
            className="h-11 rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
          >
            {PAYMENT_STATUS_OPTIONS.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Error */}
      {isError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <AlertCircle size={18} />
            </div>

            <div>
              <h3 className="font-semibold text-dark-900">
                Failed to load payments
              </h3>

              <p className="mt-1 text-sm text-dark-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong while loading payments."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 text-sm font-semibold text-primary-600 transition hover:text-primary-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <Loader2
                size={24}
                className="animate-spin text-primary-500"
              />
            </div>

            <p className="text-sm font-medium text-dark-500">
              Loading payments...
            </p>
          </div>
        </div>
      )}

      {/* Payments */}
      {!isLoading && !isError && (
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          {/* Table Header */}
          <div className="flex flex-col gap-2 border-b border-dark-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-base font-bold text-dark-900">
                Payment Transactions
              </h2>

              <p className="mt-0.5 text-xs text-dark-500">
                {totalPayments.toLocaleString("en-NG")} payment
                {totalPayments === 1 ? "" : "s"} found
              </p>
            </div>

            {isFetching && !isLoading && (
              <div className="flex items-center gap-2 text-xs font-medium text-dark-500">
                <Loader2
                  size={14}
                  className="animate-spin text-primary-500"
                />
                Updating...
              </div>
            )}
          </div>

          {payments.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-dark-50 text-dark-400">
                <CreditCard size={28} />
              </div>

              <h3 className="mt-5 font-heading text-base font-bold text-dark-800">
                No payments found
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-dark-500">
                There are no payment transactions matching
                your current search and filters.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-[1250px] w-full">
                  <thead>
                    <tr className="border-b border-dark-100 bg-dark-50/70">
                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Reference
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Customer
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Order
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Amount
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Provider
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Method
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Paid At
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                        Created
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-dark-100">
                    {payments.map((payment) => {
                      const paymentId =
                        getPaymentId(payment);

                      const paymentStatus = String(
                        payment?.status || ""
                      ).toLowerCase();

                      const orderId =
                        payment?.order?._id ||
                        payment?.order?.id;

                      return (
                        <tr
                          key={paymentId}
                          className="transition hover:bg-dark-50/40"
                        >
                          {/* Reference */}
                          <td className="px-5 py-4">
                            <div className="min-w-[150px]">
                              <p className="font-mono text-xs font-semibold text-dark-800">
                                {payment?.reference || "—"}
                              </p>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="px-5 py-4">
                            <div className="flex min-w-[190px] items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
                                {getCustomerInitials(
                                  payment
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-dark-800">
                                  {getCustomerName(payment)}
                                </p>

                                {payment?.user?.email && (
                                  <p className="mt-0.5 max-w-[180px] truncate text-xs text-dark-500">
                                    {payment.user.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Order */}
                          <td className="px-5 py-4">
                            {orderId ? (
                              <Link
                                to={`/admin/orders/${orderId}`}
                                className="text-sm font-semibold text-primary-600 transition hover:text-primary-700"
                              >
                                {getOrderReference(payment)}
                              </Link>
                            ) : (
                              <span className="text-sm text-dark-500">
                                {getOrderReference(payment)}
                              </span>
                            )}
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-4">
                            <span className="whitespace-nowrap text-sm font-bold text-dark-800">
                              {formatCurrency(
                                payment?.amount,
                                payment?.currency || "NGN"
                              )}
                            </span>
                          </td>

                          {/* Provider */}
                          <td className="px-5 py-4">
                            <span className="text-sm capitalize text-dark-700">
                              {payment?.provider || "—"}
                            </span>
                          </td>

                          {/* Method */}
                          <td className="px-5 py-4">
                            <span className="text-sm capitalize text-dark-700">
                              {payment?.method || "—"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                statusClasses[paymentStatus] ||
                                "bg-dark-50 text-dark-600"
                              }`}
                            >
                              {formatStatus(
                                paymentStatus
                              ) || "Unknown"}
                            </span>
                          </td>

                          {/* Paid At */}
                          <td className="whitespace-nowrap px-5 py-4 text-sm text-dark-600">
                            {formatDate(payment?.paidAt)}
                          </td>

                          {/* Created */}
                          <td className="whitespace-nowrap px-5 py-4 text-sm text-dark-600">
                            {formatDate(
                              payment?.createdAt
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-dark-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-dark-500">
                  Page{" "}
                  <span className="font-semibold text-dark-700">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-dark-700">
                    {totalPages}
                  </span>

                  {pagination.total !== undefined && (
                    <>
                      <span className="mx-1.5 text-dark-300">
                        ·
                      </span>
                      {Number(
                        pagination.total
                      ).toLocaleString("en-NG")}{" "}
                      total payments
                    </>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={
                      currentPage <= 1 || isFetching
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-dark-200 bg-white px-3 text-sm font-semibold text-dark-700 transition hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={
                      currentPage >= totalPages ||
                      isFetching
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-dark-200 bg-white px-3 text-sm font-semibold text-dark-700 transition hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default AdminPayments;