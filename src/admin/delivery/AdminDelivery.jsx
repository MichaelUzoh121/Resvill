import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  PackageCheck,
  RefreshCw,
  Truck,
  UserRound,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useAdminDeliveries,
  useAdminDeliveryOverview,
} from "../hooks/useAdminDelivery";

// ======================================================
// HELPERS
// ======================================================

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusClasses = (status) => {
  switch (status) {
    case "unassigned":
      return "bg-warning/10 text-warning";

    case "offered":
      return "bg-info/10 text-info";

    case "assigned":
      return "bg-primary-50 text-primary-600";

    case "accepted":
      return "bg-primary-100 text-primary-700";

    case "picked_up":
      return "bg-info/10 text-info";

    case "in_transit":
      return "bg-warning/10 text-warning";

    case "delivered":
      return "bg-success/10 text-success";

    case "failed":
      return "bg-danger/10 text-danger";

    default:
      return "bg-dark-100 text-dark-600";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "delivered":
      return CheckCircle2;

    case "failed":
      return XCircle;

    case "in_transit":
      return MapPin;

    case "picked_up":
      return PackageCheck;

    case "unassigned":
      return Clock3;

    default:
      return Truck;
  }
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getId = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    return value;
  }

  return value._id || value.id || null;
};

const getCustomerName = (delivery) => {
  const customer =
    delivery?.order?.user ||
    delivery?.order?.customer ||
    delivery?.customer;

  if (!customer) {
    return delivery?.order?.customerName || "Guest customer";
  }

  const firstName =
    customer.firstname ||
    customer.firstName ||
    "";

  const lastName =
    customer.lastname ||
    customer.lastName ||
    "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  return (
    fullName ||
    customer.name ||
    customer.email ||
    "Guest customer"
  );
};

const getCustomerInitials = (delivery) => {
  const name = getCustomerName(delivery);

  if (!name || name === "Guest customer") {
    return "G";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getDriverName = (delivery) => {
  const driver = delivery?.driver;

  if (!driver) {
    return null;
  }

  const firstName =
    driver.firstname ||
    driver.firstName ||
    "";

  const lastName =
    driver.lastname ||
    driver.lastName ||
    "";

  return (
    `${firstName} ${lastName}`.trim() ||
    driver.name ||
    driver.email ||
    "Assigned driver"
  );
};

// ======================================================
// STAT CARD
// ======================================================

function DeliveryStat({
  label,
  value,
  icon: Icon,
  description,
}) {
  return (
    <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-dark-500">
            {label}
          </p>

          <p className="mt-2 font-heading text-2xl font-bold text-dark-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-dark-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

// ======================================================
// PAGE
// ======================================================

function AdminDelivery() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const limit = 20;

  const {
    data: overview,
    isLoading: overviewLoading,
    isError: overviewError,
    refetch: refetchOverview,
  } = useAdminDeliveryOverview();

  const {
    data: deliveryData,
    isLoading: deliveriesLoading,
    isError: deliveriesError,
    error: deliveriesErrorObject,
    refetch: refetchDeliveries,
  } = useAdminDeliveries({
    status: statusFilter,
    page,
    limit,
  });

  // ====================================================
  // NORMALIZE BACKEND RESPONSE
  // ====================================================

  const deliveries = useMemo(() => {
    if (!deliveryData) return [];

    if (Array.isArray(deliveryData)) {
      return deliveryData;
    }

    return (
      deliveryData.deliveries ||
      deliveryData.items ||
      deliveryData.results ||
      []
    );
  }, [deliveryData]);

  const pagination = useMemo(() => {
    if (!deliveryData?.pagination) {
      return {
        page,
        limit,
        total: deliveries.length,
        totalPages:
          deliveries.length === limit
            ? page + 1
            : page,
      };
    }

    const backendPagination =
      deliveryData.pagination;

    return {
      page:
        Number(backendPagination.page) ||
        page,

      limit:
        Number(backendPagination.limit) ||
        limit,

      total:
        Number(backendPagination.total) ||
        0,

      totalPages:
        Number(
          backendPagination.totalPages ??
            backendPagination.pages
        ) || 1,
    };
  }, [deliveryData, deliveries.length, page]);

  // ====================================================
  // REFRESH
  // ====================================================

  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchOverview(),
        refetchDeliveries(),
      ]);

      toast.success("Delivery data refreshed.");
    } catch {
      toast.error(
        "Unable to refresh delivery data."
      );
    }
  };

  // ====================================================
  // FILTER
  // ====================================================

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  // ====================================================
  // LOADING
  // ====================================================

  const initialLoading =
    overviewLoading && deliveriesLoading;

  if (initialLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-dark-500">
          <LoaderCircle
            size={20}
            className="animate-spin text-primary-500"
          />

          Loading delivery management...
        </div>
      </div>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary-600">
            Operations
          </p>

          <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
            Delivery
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-dark-500">
            Monitor deliveries, assignments, drivers and
            delivery progress from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 hover:text-dark-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Overview */}
      {overviewError ? (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <XCircle size={20} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-dark-900">
                Unable to load delivery overview
              </h3>

              <p className="mt-1 text-sm text-dark-500">
                Delivery summary information could not
                be loaded.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <DeliveryStat
            label="Active Deliveries"
            value={
              overview?.activeDeliveries ?? 0
            }
            icon={Truck}
            description="Currently active"
          />

          <DeliveryStat
            label="Pending Assignments"
            value={
              overview?.pendingAssignments ?? 0
            }
            icon={Clock3}
            description="Waiting for a driver"
          />

          <DeliveryStat
            label="In Transit"
            value={
              overview?.inTransitDeliveries ?? 0
            }
            icon={MapPin}
            description="Currently on the road"
          />

          <DeliveryStat
            label="Completed"
            value={
              overview?.completedDeliveries ?? 0
            }
            icon={CheckCircle2}
            description="Successfully delivered"
          />

          <DeliveryStat
            label="Failed"
            value={
              overview?.failedDeliveries ?? 0
            }
            icon={XCircle}
            description="Delivery failures"
          />
        </div>
      )}

      {/* Delivery List */}
      <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-dark-100 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-base font-semibold text-dark-900">
              Deliveries
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              View and monitor delivery assignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-medium text-dark-700 outline-none transition hover:border-dark-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
            >
              <option value="all">
                All deliveries
              </option>

              <option value="active">
                Active
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="in_transit">
                In transit
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="failed">
                Failed
              </option>
            </select>
          </div>
        </div>

        {/* Error */}
        {deliveriesError ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <XCircle size={25} />
            </div>

            <h3 className="mt-4 font-heading text-sm font-semibold text-dark-900">
              Unable to load deliveries
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-dark-500">
              {deliveriesErrorObject?.response?.data
                ?.message ||
                "Something went wrong while loading delivery data."}
            </p>

            <button
              type="button"
              onClick={() => refetchDeliveries()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : deliveriesLoading ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-medium text-dark-500">
              <LoaderCircle
                size={20}
                className="animate-spin text-primary-500"
              />

              Loading deliveries...
            </div>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-dark-50 text-dark-400">
              <PackageCheck size={26} />
            </div>

            <h3 className="mt-4 font-heading text-sm font-semibold text-dark-900">
              No deliveries found
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-dark-500">
              There are no deliveries matching the
              selected filter.
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-dark-100 bg-dark-50/70">
                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-dark-500">
                      Delivery
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-dark-500">
                      Customer
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-dark-500">
                      Driver
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-dark-500">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.06em] text-dark-500">
                      Created
                    </th>

                    <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-[0.06em] text-dark-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {deliveries.map((delivery) => {
                    const deliveryId =
                      getId(delivery);

                    const order =
                      delivery?.order;

                    const orderId =
                      getId(order);

                    const driverName =
                      getDriverName(delivery);

                    const StatusIcon =
                      getStatusIcon(
                        delivery?.status
                      );

                    return (
                      <tr
                        key={
                          deliveryId ||
                          orderId ||
                          Math.random()
                        }
                        className="border-b border-dark-100 last:border-0 transition hover:bg-dark-50/50"
                      >
                        {/* Delivery */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                              <Truck size={18} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-dark-900">
                                {delivery?.deliveryNumber ||
                                  delivery?.trackingNumber ||
                                  (deliveryId
                                    ? `#${deliveryId.slice(
                                        -8
                                      )}`
                                    : "Delivery")}
                              </p>

                              {order?.orderNumber && (
                                <p className="mt-0.5 text-xs text-dark-400">
                                  Order{" "}
                                  {order.orderNumber}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
                              {getCustomerInitials(
                                delivery
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-dark-800">
                                {getCustomerName(
                                  delivery
                                )}
                              </p>

                              {order?.customerType && (
                                <p className="mt-0.5 text-xs capitalize text-dark-400">
                                  {
                                    order.customerType
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Driver */}
                        <td className="px-5 py-4">
                          {driverName ? (
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dark-50 text-dark-500">
                                <UserRound size={15} />
                              </div>

                              <div>
                                <p className="text-sm font-medium text-dark-800">
                                  {driverName}
                                </p>

                                {delivery?.driver
                                  ?.vehicleType && (
                                  <p className="mt-0.5 text-xs capitalize text-dark-400">
                                    {
                                      delivery
                                        .driver
                                        .vehicleType
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10 text-warning">
                                <UserRound
                                  size={14}
                                />
                              </div>

                              <span className="text-sm font-medium text-dark-400">
                                Unassigned
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-bold ${getStatusClasses(
                              delivery?.status
                            )}`}
                          >
                            <StatusIcon size={13} />

                            {formatStatus(
                              delivery?.status
                            )}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <p className="text-sm text-dark-600">
                            {formatDate(
                              delivery?.createdAt
                            )}
                          </p>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">
                          {deliveryId ? (
                            <Link
                              to={`/admin/delivery/${deliveryId}`}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 hover:text-primary-700"
                            >
                              View
                              <ArrowRight
                                size={15}
                              />
                            </Link>
                          ) : (
                            <span className="text-xs text-dark-400">
                              —
                            </span>
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
                Showing page{" "}
                <span className="font-semibold text-dark-700">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-dark-700">
                  {pagination.totalPages}
                </span>

                {pagination.total > 0 && (
                  <>
                    {" "}
                    ·{" "}
                    <span className="font-semibold text-dark-700">
                      {pagination.total}
                    </span>{" "}
                    total
                  </>
                )}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(
                        current - 1,
                        1
                      )
                    )
                  }
                  className="rounded-xl border border-dark-200 bg-white px-3.5 py-2 text-sm font-semibold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    page >=
                    pagination.totalPages
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        current + 1
                    )
                  }
                  className="rounded-xl border border-dark-200 bg-white px-3.5 py-2 text-sm font-semibold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default AdminDelivery;