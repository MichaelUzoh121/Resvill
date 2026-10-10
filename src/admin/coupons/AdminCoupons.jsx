import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  Ticket,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useAdminCoupons,
  useUpdateAdminCouponStatus,
  useDeleteAdminCoupon,
} from "../hooks/useAdminCoupons";

const COUPON_TYPES = [
  { value: "", label: "All Types" },
  { value: "percentage", label: "Percentage" },
  { value: "fixed", label: "Fixed Amount" },
  { value: "free_delivery", label: "Free Delivery" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "valid", label: "Valid" },
  { value: "expired", label: "Expired" },
  { value: "upcoming", label: "Upcoming" },
];

const PAGE_LIMIT = 20;

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDiscount = (coupon) => {
  if (coupon.type === "percentage") {
    return `${Number(coupon.value || 0)}%`;
  }

  if (coupon.type === "fixed") {
    return `₦${Number(coupon.value || 0).toLocaleString(
      "en-NG"
    )}`;
  }

  return "Free Delivery";
};

const formatAmount = (value) => {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
};

const getStatus = (coupon) => {
  const now = new Date();

  const startsAt = coupon.startsAt
    ? new Date(coupon.startsAt)
    : null;

  const expiresAt = coupon.expiresAt
    ? new Date(coupon.expiresAt)
    : null;

  if (!coupon.isActive) {
    return {
      label: "Inactive",
      className: "bg-dark-100 text-dark-600",
      dotClassName: "bg-dark-400",
    };
  }

  if (startsAt && startsAt > now) {
    return {
      label: "Upcoming",
      className: "bg-info/10 text-info",
      dotClassName: "bg-info",
    };
  }

  if (expiresAt && expiresAt < now) {
    return {
      label: "Expired",
      className: "bg-danger/10 text-danger",
      dotClassName: "bg-danger",
    };
  }

  return {
    label: "Active",
    className: "bg-success/10 text-success",
    dotClassName: "bg-success",
  };
};

const getCouponId = (coupon) => {
  return coupon?._id || coupon?.id;
};

function AdminCoupons() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminCoupons({
    search: search.trim() || undefined,
    status,
    type: type || undefined,
    page,
    limit: PAGE_LIMIT,
  });

  const updateStatus = useUpdateAdminCouponStatus();
  const deleteCoupon = useDeleteAdminCoupon();

  const coupons = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }

    return Array.isArray(data?.coupons)
      ? data.coupons
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
              coupons.length
          ) / PAGE_LIMIT
        )
    ) || 1,
    1
  );

  const totalCoupons = Number(
    pagination.total ??
      pagination.totalCoupons ??
      data?.total ??
      coupons.length
  );

  const hasFilters = Boolean(
    search.trim() ||
      status !== "all" ||
      type
  );

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setType("");
    setPage(1);
  };

  const handleToggleStatus = (coupon) => {
    const couponId = getCouponId(coupon);

    if (!couponId) {
      toast.error("Coupon ID is missing.");
      return;
    }

    updateStatus.mutate(
      {
        couponId,
        isActive: !coupon.isActive,
      },
      {
        onSuccess: () => {
          toast.success(
            coupon.isActive
              ? "Coupon deactivated."
              : "Coupon activated."
          );
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to update coupon status."
          );
        },
      }
    );
  };

  const handleDelete = (coupon) => {
    const couponId = getCouponId(coupon);

    if (!couponId) {
      toast.error("Coupon ID is missing.");
      return;
    }

    if (Number(coupon.usageCount || 0) > 0) {
      toast.error(
        "This coupon has been used and cannot be deleted. Deactivate it instead."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete coupon "${coupon.code}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    deleteCoupon.mutate(couponId, {
      onSuccess: () => {
        toast.success("Coupon deleted.");
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to delete coupon."
        );
      },
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-start gap-3">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 sm:flex">
              <Ticket size={21} />
            </div>

            <div>
              <h1 className="font-heading text-2xl font-bold text-dark-900">
                Coupons
              </h1>

              <p className="mt-1 text-sm leading-6 text-dark-500">
                Create, manage and monitor promotional
                coupons and discounts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 text-sm font-semibold text-dark-700 shadow-sm transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                isFetching ? "animate-spin" : ""
              }
            />
            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>

          <Link
            to="/admin/coupons/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
          >
            <Plus size={17} />
            Create Coupon
          </Link>
        </div>
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
                Coupon Filters
              </h2>

              <p className="text-xs text-dark-500">
                Search and filter your promotional coupons.
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

        <div className="grid gap-3 md:grid-cols-[minmax(280px,1fr)_220px_220px]">
          {/* Search */}
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search coupon code..."
              className="h-11 w-full rounded-xl border border-dark-200 bg-white pl-10 pr-4 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={handleStatusChange}
            className="h-11 rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            value={type}
            onChange={handleTypeChange}
            className="h-11 rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
          >
            {COUPON_TYPES.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
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
                Failed to load coupons
              </h3>

              <p className="mt-1 text-sm text-dark-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong while loading coupons."}
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

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
        <div className="flex flex-col gap-2 border-b border-dark-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-base font-bold text-dark-900">
              Promotional Coupons
            </h2>

            <p className="mt-0.5 text-xs text-dark-500">
              {totalCoupons.toLocaleString("en-NG")} coupon
              {totalCoupons === 1 ? "" : "s"} found
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

        <div className="overflow-x-auto">
          <table className="min-w-[1150px] w-full">
            <thead>
              <tr className="border-b border-dark-100 bg-dark-50/70">
                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                  Coupon
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                  Discount
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                  Minimum Order
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                  Usage
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                  Validity
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-dark-500">
                  Status
                </th>

                <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-dark-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-dark-100">
              {/* Loading */}
              {isLoading &&
                Array.from({ length: 6 }).map(
                  (_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: 7 }).map(
                        (_, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-5 py-5"
                          >
                            <div
                              className={[
                                "h-4 animate-pulse rounded bg-dark-100",
                                cellIndex === 0
                                  ? "w-32"
                                  : cellIndex === 6
                                    ? "ml-auto w-28"
                                    : "w-24",
                              ].join(" ")}
                            />
                          </td>
                        )
                      )}
                    </tr>
                  )
                )}

              {/* Empty */}
              {!isLoading && coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                        <Ticket size={28} />
                      </div>

                      <h3 className="mt-5 font-heading text-base font-bold text-dark-800">
                        No coupons found
                      </h3>

                      <p className="mt-1 max-w-md text-sm leading-6 text-dark-500">
                        {hasFilters
                          ? "No coupons match your current search and filters."
                          : "Create your first coupon to start offering promotions."}
                      </p>

                      {hasFilters ? (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-4 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
                        >
                          Clear filters
                        </button>
                      ) : (
                        <Link
                          to="/admin/coupons/create"
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
                        >
                          <Plus size={16} />
                          Create Coupon
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Data */}
              {!isLoading &&
                coupons.map((coupon) => {
                  const couponId = getCouponId(coupon);
                  const couponStatus = getStatus(coupon);

                  const usageCount = Number(
                    coupon.usageCount || 0
                  );

                  const usageLimit =
                    coupon.usageLimit == null
                      ? null
                      : Number(coupon.usageLimit);

                  const usagePercentage =
                    usageLimit && usageLimit > 0
                      ? Math.min(
                          (usageCount / usageLimit) * 100,
                          100
                        )
                      : 0;

                  return (
                    <tr
                      key={couponId}
                      className="group transition hover:bg-dark-50/40"
                    >
                      {/* Coupon */}
                      <td className="px-5 py-4">
                        <div className="min-w-[220px]">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                              <Ticket size={16} />
                            </div>

                            <div className="min-w-0">
                              <p className="font-mono text-sm font-bold uppercase text-dark-900">
                                {coupon.code || "—"}
                              </p>

                              {coupon.description && (
                                <p className="mt-1 max-w-[220px] truncate text-xs text-dark-500">
                                  {coupon.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-primary-600">
                          {formatDiscount(coupon)}
                        </span>

                        {coupon.maximumDiscountAmount !=
                          null &&
                          coupon.type ===
                            "percentage" && (
                            <p className="mt-1 text-xs text-dark-400">
                              Max{" "}
                              {formatAmount(
                                coupon.maximumDiscountAmount
                              )}
                            </p>
                          )}
                      </td>

                      {/* Minimum */}
                      <td className="px-5 py-4">
                        <span className="whitespace-nowrap text-sm font-semibold text-dark-700">
                          {formatAmount(
                            coupon.minimumOrderAmount
                          )}
                        </span>
                      </td>

                      {/* Usage */}
                      <td className="px-5 py-4">
                        <div className="min-w-[120px]">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-dark-800">
                              {usageCount.toLocaleString(
                                "en-NG"
                              )}
                            </span>

                            <span className="text-xs text-dark-400">
                              {usageLimit == null
                                ? "∞"
                                : usageLimit.toLocaleString(
                                    "en-NG"
                                  )}
                            </span>
                          </div>

                          {usageLimit != null && (
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-dark-100">
                              <div
                                className="h-full rounded-full bg-primary-500 transition-all"
                                style={{
                                  width: `${usagePercentage}%`,
                                }}
                              />
                            </div>
                          )}

                          {coupon.perUserLimit != null && (
                            <p className="mt-1.5 text-xs text-dark-400">
                              {coupon.perUserLimit} per user
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Validity */}
                      <td className="px-5 py-4">
                        <div className="min-w-[145px]">
                          <p className="text-sm font-medium text-dark-700">
                            {formatDate(coupon.startsAt)}
                          </p>

                          <p className="mt-1 text-xs text-dark-400">
                            → {formatDate(coupon.expiresAt)}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${couponStatus.className}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${couponStatus.dotClassName}`}
                          />

                          {couponStatus.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/coupons/${couponId}`}
                            title="View coupon"
                            className="rounded-lg p-2 text-dark-500 transition hover:bg-dark-100 hover:text-dark-900"
                          >
                            <Eye size={17} />
                          </Link>

                          <Link
                            to={`/admin/coupons/${couponId}/edit`}
                            title="Edit coupon"
                            className="rounded-lg p-2 text-dark-500 transition hover:bg-primary-50 hover:text-primary-600"
                          >
                            <Pencil size={17} />
                          </Link>

                          <button
                            type="button"
                            title={
                              coupon.isActive
                                ? "Deactivate coupon"
                                : "Activate coupon"
                            }
                            disabled={
                              updateStatus.isPending
                            }
                            onClick={() =>
                              handleToggleStatus(coupon)
                            }
                            className={[
                              "rounded-lg p-2 transition disabled:cursor-not-allowed disabled:opacity-40",
                              coupon.isActive
                                ? "text-dark-500 hover:bg-warning/10 hover:text-warning"
                                : "text-dark-500 hover:bg-success/10 hover:text-success",
                            ].join(" ")}
                          >
                            {coupon.isActive ? (
                              <PowerOff size={17} />
                            ) : (
                              <Power size={17} />
                            )}
                          </button>

                          <button
                            type="button"
                            title={
                              usageCount > 0
                                ? "Used coupons cannot be deleted"
                                : "Delete coupon"
                            }
                            disabled={
                              deleteCoupon.isPending ||
                              usageCount > 0
                            }
                            onClick={() =>
                              handleDelete(coupon)
                            }
                            className="rounded-lg p-2 text-dark-500 transition hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading &&
          coupons.length > 0 && (
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
                    total coupons
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
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-dark-200 bg-white px-3 text-sm font-semibold text-dark-700 transition hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-dark-200 bg-white px-3 text-sm font-semibold text-dark-700 transition hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
      </section>
    </div>
  );
}

export default AdminCoupons;