import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useStaffDelivery,
  useStaffDeliveryHistory,
} from "../hooks/useStaffDeliveries";

const STATUS_META = {
  PENDING: {
    label: "Pending",
    icon: Clock3,
    className: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
  ASSIGNED: {
    label: "Assigned",
    icon: User,
    className: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
  PICKED_UP: {
    label: "Picked Up",
    icon: Package,
    className: "bg-orange-50 text-orange-700 border-orange-100",
  },
  IN_TRANSIT: {
    label: "In Transit",
    icon: Truck,
    className: "bg-purple-50 text-purple-700 border-purple-100",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-100",
  },
  DECLINED: {
    label: "Declined",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-100",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-dark-100 text-dark-600 border-dark-200",
  },
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return String(status)
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatNaira = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₦0";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getId = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    return value;
  }

  return value._id || value.id || null;
};

const getDisplayName = (user) => {
  if (!user) return "Unassigned";

  const name = [user.firstname, user.lastname, user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || user.name || user.fullName || user.email || "Assigned Driver";
};

const getPhone = (user) => {
  if (!user) return null;

  return user.phone || user.phoneNumber || null;
};

// const getCustomerName = (order) => {
//   if (!order) return "Customer";

//   return (
//     order?.deliveryAddress?.fullName ||
//     order?.guestDetails?.name ||
//     getDisplayName(order?.customer || order?.user)
//   );
// };

const getCustomerName = (order) => {
  if (!order) return "Customer";

  const guestName = [
    order?.guestDetails?.firstname,
    order?.guestDetails?.lastname,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    order?.deliveryAddress?.fullName ||
    guestName ||
    getDisplayName(order?.customer || order?.user) ||
    "Customer"
  );
};

const getCustomerPhone = (order) => {
  return (
    order?.deliveryAddress?.phone ||
    order?.guestDetails?.phone ||
    order?.customer?.phone ||
    order?.user?.phone ||
    order?.customer?.phoneNumber ||
    order?.user?.phoneNumber ||
    null
  );
};

const getCustomerEmail = (order) => {
  return (
    order?.guestDetails?.email ||
    order?.customer?.email ||
    order?.user?.email ||
    null
  );
};

const getAddressLines = (address) => {
  if (!address) {
    return [];
  }

  if (typeof address === "string") {
    return [address];
  }

  return [
    address.addressText,
    address.address,
    address.street,
    address.area,
    address.city
      ? `${address.city}${address.state ? `, ${address.state}` : ""}`
      : null,
    address.landmark ? `Landmark: ${address.landmark}` : null,
  ].filter(Boolean);
};

function InfoCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Icon size={19} />
        </div>

        <div>
          <h2 className="font-heading text-base font-bold text-dark-900">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-xs text-dark-500">{description}</p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

function DetailItem({ label, children }) {
  return (
    <div>
      <p className="text-xs font-medium text-dark-400">{label}</p>

      <div className="mt-1.5 text-sm text-dark-700">{children}</div>
    </div>
  );
}

function StaffDeliveryDetails() {
  const { deliveryId } = useParams();

  const {
    data: deliveryResponse,
    isLoading: deliveryLoading,
    isError: deliveryError,
    error: deliveryRequestError,
    refetch: refetchDelivery,
    isFetching: deliveryFetching,
  } = useStaffDelivery(deliveryId);

  const {
    data: historyResponse,
    isLoading: historyLoading,
    isError: historyError,
    error: historyRequestError,
    refetch: refetchHistory,
    isFetching: historyFetching,
  } = useStaffDeliveryHistory(deliveryId);

  const delivery = useMemo(() => {
    if (!deliveryResponse) {
      return null;
    }

    return (
      deliveryResponse?.delivery || deliveryResponse?.data || deliveryResponse
    );
  }, [deliveryResponse]);

  // const history = useMemo(() => {
  //   if (!historyResponse) {
  //     return [];
  //   }

  //   const value =
  //     historyResponse?.history || historyResponse?.data || historyResponse;

  //   if (Array.isArray(value)) {
  //     return value;
  //   }

  //   return value?.history || value?.items || value?.events || [];
  // }, [historyResponse]);

  const history = useMemo(() => {
    if (!historyResponse) {
      return [];
    }

    const value =
      historyResponse?.delivery?.history ||
      historyResponse?.history ||
      historyResponse?.data?.delivery?.history ||
      historyResponse?.data ||
      historyResponse;

    if (Array.isArray(value)) {
      return value;
    }

    return value?.history || value?.items || value?.events || [];
  }, [historyResponse]);

  const order = delivery?.order || null;

  const driver = delivery?.driver || delivery?.assignedDriver || null;

  const deliveryAddress =
    order?.deliveryAddress ||
    delivery?.deliveryAddress ||
    order?.address ||
    null;

  const currentStatus =
    delivery?.status || delivery?.deliveryStatus || "PENDING";

  const statusMeta = STATUS_META[currentStatus] || {
    label: formatStatus(currentStatus),
    icon: Truck,
    className: "bg-dark-50 text-dark-600 border-dark-100",
  };

  const StatusIcon = statusMeta.icon;

  const orderId = getId(order) || delivery?.orderId || null;

  const orderNumber = order?.orderNumber || delivery?.orderNumber || "Order";

  const driverName = getDisplayName(driver);
  const driverPhone = getPhone(driver);

  const customerName = getCustomerName(order);
  const customerPhone = getCustomerPhone(order);
  const customerEmail = getCustomerEmail(order);

  const addressLines = getAddressLines(deliveryAddress);

  const refreshAll = async () => {
    try {
      await Promise.all([refetchDelivery(), refetchHistory()]);

      toast.success("Delivery details refreshed.");
    } catch {
      toast.error("Unable to refresh delivery details.");
    }
  };

  if (deliveryLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-dark-100" />

          <div>
            <div className="h-3 w-28 animate-pulse rounded bg-dark-100" />
            <div className="mt-2 h-7 w-48 animate-pulse rounded bg-dark-100" />
          </div>
        </div>

        <div className="h-36 animate-pulse rounded-2xl bg-white" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
        </div>

        <div className="h-56 animate-pulse rounded-2xl bg-white" />

        <div className="h-72 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (deliveryError || !delivery) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <XCircle size={27} />
          </div>

          <h2 className="mt-4 font-heading text-lg font-bold text-dark-900">
            Unable to load delivery
          </h2>

          <p className="mt-2 text-sm leading-6 text-dark-500">
            {deliveryRequestError?.response?.data?.message ||
              "The delivery could not be found or loaded."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => refetchDelivery()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            <Link
              to="/staff/deliveries"
              className="inline-flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
            >
              Back to Deliveries
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3">
          <Link
            to="/staff/deliveries"
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-200 bg-white text-dark-600 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
            aria-label="Back to deliveries"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <p className="text-sm font-medium text-primary-600">
              Delivery Operations
            </p>

            <h1 className="mt-1 font-heading text-2xl font-bold text-dark-900 sm:text-3xl">
              {orderNumber}
            </h1>

            <p className="mt-1 text-sm text-dark-500">
              Delivery ID:{" "}
              <span className="font-medium text-dark-600">{deliveryId}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {orderId && (
            <Link
              to={`/staff/orders/${orderId}`}
              className="inline-flex items-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
            >
              <Package size={16} />
              View Order
              <ExternalLink size={14} />
            </Link>
          )}

          <button
            type="button"
            onClick={refreshAll}
            disabled={deliveryFetching || historyFetching}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                deliveryFetching || historyFetching ? "animate-spin" : ""
              }
            />

            {deliveryFetching || historyFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Current status */}
      <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-sm">
        <div className="border-b border-dark-100 bg-dark-50/70 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-dark-400">
            Current Delivery Status
          </p>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div
              className={[
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
                statusMeta.className,
              ].join(" ")}
            >
              <StatusIcon size={21} />
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-dark-900">
                {statusMeta.label}
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                Last updated{" "}
                {formatDateTime(delivery.updatedAt || delivery.lastUpdatedAt)}
              </p>
            </div>
          </div>

          <span
            className={[
              "inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold",
              statusMeta.className,
            ].join(" ")}
          >
            {formatStatus(currentStatus)}
          </span>
        </div>
      </section>

      {/* Main information */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer */}
        <InfoCard icon={User} title="Customer" description="Delivery recipient">
          <div className="space-y-5">
            <DetailItem label="Name">
              <p className="font-semibold text-dark-800">{customerName}</p>
            </DetailItem>

            {customerPhone && (
              <DetailItem label="Phone">
                <a
                  href={`tel:${customerPhone}`}
                  className="inline-flex items-center gap-2 font-semibold text-primary-600 transition hover:text-primary-700 hover:underline"
                >
                  <Phone size={15} />
                  {customerPhone}
                </a>
              </DetailItem>
            )}

            {customerEmail && (
              <DetailItem label="Email">
                <p className="break-all text-dark-700">{customerEmail}</p>
              </DetailItem>
            )}
          </div>
        </InfoCard>

        {/* Driver */}
        <InfoCard
          icon={Truck}
          title="Assigned Driver"
          description="Dispatch information"
        >
          {driver ? (
            <div className="space-y-5">
              <DetailItem label="Driver">
                <p className="font-semibold text-dark-800">{driverName}</p>
              </DetailItem>

              {driverPhone && (
                <DetailItem label="Phone">
                  <a
                    href={`tel:${driverPhone}`}
                    className="inline-flex items-center gap-2 font-semibold text-primary-600 transition hover:text-primary-700 hover:underline"
                  >
                    <Phone size={15} />
                    {driverPhone}
                  </a>
                </DetailItem>
              )}

              <DetailItem label="Assigned">
                <p>
                  {formatDateTime(delivery?.assignedAt || delivery?.acceptedAt)}
                </p>
              </DetailItem>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-dark-200 bg-dark-50 p-4">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-dark-400" />

                <p className="text-sm font-semibold text-dark-700">
                  No driver assigned
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-dark-500">
                A driver can be assigned from the Staff delivery queue.
              </p>

              <Link
                to="/staff/deliveries"
                className="mt-3 inline-flex text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                Go to delivery queue →
              </Link>
            </div>
          )}
        </InfoCard>

        {/* Address */}
        <InfoCard
          icon={MapPin}
          title="Drop-off"
          description="Customer delivery location"
        >
          {addressLines.length > 0 ? (
            <div className="rounded-xl bg-dark-50 p-4">
              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-primary-500"
                />

                <div className="space-y-1 text-sm leading-6 text-dark-700">
                  {addressLines.map((line, index) => (
                    <p key={`${line}-${index}`}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-dark-50 p-4">
              <p className="text-sm text-dark-500">
                No delivery address available.
              </p>
            </div>
          )}
        </InfoCard>
      </div>

      {/* Delivery timeline */}
      <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Clock3 size={19} />
            </div>

            <div>
              <h2 className="font-heading text-lg font-bold text-dark-900">
                Delivery Timeline
              </h2>

              <p className="mt-0.5 text-sm text-dark-500">
                Operational timestamps recorded by the backend.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Created", delivery.createdAt],
            ["Assigned", delivery.assignedAt || delivery.acceptedAt],
            ["Picked Up", delivery.pickedUpAt],
            ["Delivered", delivery.deliveredAt],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-dark-100 bg-dark-50/70 p-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className={[
                    "h-2 w-2 rounded-full",
                    value ? "bg-primary-500" : "bg-dark-300",
                  ].join(" ")}
                />

                <p className="text-xs font-medium text-dark-400">{label}</p>
              </div>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {formatDateTime(value)}
              </p>
            </div>
          ))}
        </div>

        {delivery.failedAt && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
                  Delivery Failed
                </p>

                <p className="mt-1 text-sm font-semibold text-red-800">
                  {formatDateTime(delivery.failedAt)}
                </p>

                {delivery.failureReason && (
                  <p className="mt-2 text-sm leading-6 text-red-700">
                    {delivery.failureReason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Related order */}
      {order && (
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Package size={19} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-900">
                  Related Order
                </h2>

                <p className="mt-0.5 text-sm text-dark-500">
                  Order associated with this delivery.
                </p>
              </div>
            </div>

            {orderId && (
              <Link
                to={`/staff/orders/${orderId}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-primary-700"
              >
                Open Order
                <ExternalLink size={15} />
              </Link>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-dark-50 p-4">
              <p className="text-xs font-medium text-dark-400">Order Number</p>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {order.orderNumber || "—"}
              </p>
            </div>

            <div className="rounded-xl bg-dark-50 p-4">
              <p className="text-xs font-medium text-dark-400">Order Status</p>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {formatStatus(order.status)}
              </p>
            </div>

            <div className="rounded-xl bg-dark-50 p-4">
              <p className="text-xs font-medium text-dark-400">Payment</p>

              <p className="mt-2 text-sm font-semibold text-dark-800">
                {formatStatus(order.paymentStatus)}
              </p>
            </div>

            <div className="rounded-xl bg-dark-50 p-4">
              <p className="text-xs font-medium text-dark-400">Total</p>

              <p className="mt-2 font-heading text-base font-bold text-dark-900">
                {formatNaira(
                  order.totalAmount ?? order.total ?? order.grandTotal,
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 sm:hidden">
            {orderId && (
              <Link
                to={`/staff/orders/${orderId}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
              >
                View Full Order
                <ExternalLink size={15} />
              </Link>
            )}
          </div>
        </section>
      )}

      {/* History */}
      <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Clock3 size={19} />
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-dark-900">
              Delivery History
            </h2>

            <p className="mt-0.5 text-sm text-dark-500">
              Recorded delivery events and status changes.
            </p>
          </div>
        </div>

        {historyLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-dark-50"
              />
            ))}
          </div>
        ) : historyError ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to load delivery history.
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {historyRequestError?.response?.data?.message ||
                    "Please try refreshing the page."}
                </p>

                <button
                  type="button"
                  onClick={() => refetchHistory()}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-50"
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-dark-200 bg-dark-50 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-dark-300 shadow-sm">
              <Clock3 size={21} />
            </div>

            <p className="mt-4 text-sm font-semibold text-dark-700">
              No delivery history yet
            </p>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-dark-500">
              Delivery events will appear here as the delivery progresses.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-4 left-5 top-4 w-px bg-dark-200" />

            <div className="space-y-5">
              {history.map((event, index) => {
                const status =
                  event?.status ||
                  event?.deliveryStatus ||
                  event?.event ||
                  event?.type ||
                  "UNKNOWN";

                const meta = STATUS_META[status];

                const Icon = meta?.icon || Clock3;

                const eventMessage =
                  event?.message ||
                  event?.description ||
                  `${formatStatus(status)} update`;

                const eventTime =
                  event?.timestamp ||
                  event?.createdAt ||
                  event?.updatedAt ||
                  event?.date;

                const changedBy =
                  event?.changedBy ||
                  event?.updatedBy ||
                  event?.performedBy ||
                  null;

                return (
                  <div
                    key={
                      event?._id ||
                      event?.id ||
                      `${status}-${eventTime}-${index}`
                    }
                    className="relative flex gap-4"
                  >
                    <div
                      className={[
                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm",
                        meta?.className ||
                          "bg-primary-50 text-primary-600 border-primary-100",
                      ].join(" ")}
                    >
                      <Icon size={15} />
                    </div>

                    <div className="min-w-0 flex-1 rounded-xl border border-dark-100 bg-dark-50/70 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-dark-800">
                              {meta?.label || formatStatus(status)}
                            </p>

                            <span className="hidden rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dark-400 sm:inline-flex">
                              {status}
                            </span>
                          </div>

                          <p className="mt-1 text-sm leading-6 text-dark-600">
                            {eventMessage}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-medium text-dark-400">
                          {formatDateTime(eventTime)}
                        </span>
                      </div>

                      {changedBy && (
                        <div className="mt-3 border-t border-dark-100 pt-3">
                          <p className="text-xs text-dark-400">
                            Updated by{" "}
                            <span className="font-medium text-dark-600">
                              {typeof changedBy === "string"
                                ? changedBy
                                : getDisplayName(changedBy)}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default StaffDeliveryDetails;
