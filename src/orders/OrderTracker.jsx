import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  PackageCheck,
  Truck,
  Loader2,
  AlertCircle,
  Phone,
  Clock3,
  CircleCheck,
  XCircle,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useGuestOrderTracking, useOrderTracking } from "../hooks/useTracking";
import { ORDER_STATUSES } from "../constants/orderStatuses";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";

const prettyDate = (value) => {
  if (!value) return "Awaiting update";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Awaiting update";
  }

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const STATUS_ORDER = [
  ORDER_STATUSES.PENDING,
  ORDER_STATUSES.CONFIRMED,
  ORDER_STATUSES.PREPARING,
  ORDER_STATUSES.READY,
  ORDER_STATUSES.OUT_FOR_DELIVERY,
  ORDER_STATUSES.DELIVERED,
];

const getStatusIndex = (status) => {
  const index = STATUS_ORDER.indexOf(status);

  return index === -1 ? 0 : index;
};

function OrderTracker() {
  const { id } = useParams();

  const query = new URLSearchParams(useLocation().search);

  const token = query.get("token");

  const { user } = useAuth();

  const queryClient = useQueryClient();

  //   const { socket, isConnected } = useSocket({
  //     enabled: Boolean(user),
  //   });

  const { socket, isConnected } = useSocket({
    enabled: Boolean(user) || Boolean(id && token),

    orderNumber: !user ? id : null,

    trackingToken: !user ? token : null,
  });

  const guestTracking = useGuestOrderTracking(id, token);

  const authenticatedTracking = useOrderTracking(user ? id : null);

  const tracking = user
    ? authenticatedTracking.tracking
    : guestTracking.tracking;

  const isLoading = user
    ? authenticatedTracking.isLoading
    : guestTracking.isLoading;

  const isError = user ? authenticatedTracking.isError : guestTracking.isError;

  const refetchTracking = user
    ? authenticatedTracking.refetchTracking
    : guestTracking.refetchTracking;

  //   React.useEffect(() => {
  //     if (!user || !socket || !isConnected || !id) {
  //       return;
  //     }

  React.useEffect(() => {
    if (!socket || !isConnected || !id) {
      return;
    }

    const handleJoined = (response) => {
      if (!response?.success) {
        console.error("Failed to join order tracking room:", response?.message);
      }
    };

    // const handleStatusUpdate = (data) => {
    //   if (data?.orderId && data.orderId.toString() !== id.toString()) {
    //     return;
    //   }

    //   refetchTracking();
    // };

    const handleStatusUpdate = (data) => {
      if (data?.orderId && data.orderId.toString() !== id.toString()) {
        return;
      }

      if (user) {
        queryClient.invalidateQueries({
          queryKey: ["order-tracking", id],
        });

        return;
      }

      if (token) {
        queryClient.invalidateQueries({
          queryKey: ["guest-order-tracking", id, token],
        });
      }
    };

    // socket.emit(
    //   "order:join",
    //   {
    //     orderId: id,
    //   },
    //   handleJoined,
    // );

    if (user) {
      socket.emit(
        "order:join",
        {
          orderId: id,
        },
        handleJoined,
      );
    } else if (token) {
      socket.emit(
        "guest-order:join",
        {
          orderNumber: id,
          trackingToken: token,
        },
        handleJoined,
      );
    }

    socket.on("order:status_updated", handleStatusUpdate);

    return () => {
      socket.off("order:status_updated", handleStatusUpdate);

      socket.emit("order:leave", {
        orderId: id,
      });
    };
    //   }, [user, socket, isConnected, id, refetchTracking]);
  }, [user, socket, isConnected, id, queryClient]);

  if (isLoading) {
    return (
      <main className="bg-dark-50/50 py-10 sm:py-14">
        <div className="mx-auto flex min-h-[400px] max-w-3xl items-center justify-center px-4 sm:px-6">
          <div className="flex items-center gap-3 text-dark-500">
            <Loader2 size={22} className="animate-spin text-primary-500" />

            <span className="font-medium">Loading your order tracking...</span>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !tracking) {
    return <InvalidOrder onRetry={refetchTracking} />;
  }

  const currentStatus = tracking.status;

  if (
    currentStatus === ORDER_STATUSES.CANCELLED ||
    currentStatus === ORDER_STATUSES.FAILED ||
    currentStatus === ORDER_STATUSES.REFUNDED
  ) {
    return (
      <TerminalOrderState
        status={currentStatus}
        tracking={tracking}
        onRetry={refetchTracking}
      />
    );
  }

  //   const currentStatus = tracking.status || "placed";

  //   const currentStatus = tracking.status;

  const activeIndex = getStatusIndex(currentStatus);

  const statusHistory = tracking.statusHistory || [];

  return (
    <main className="bg-dark-50/50 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-primary-500">
          Private order tracker
        </p>

        <h1 className="mt-2 font-heading text-3xl font-extrabold text-dark-950">
          Order #{tracking.orderNumber}
        </h1>

        <p className="mt-2 text-dark-500">
          {tracking.deliveryMethod === "pickup"
            ? "Pickup order"
            : "Delivery order"}{" "}
          · Placed {prettyDate(tracking.createdAt)}
        </p>

        <section className="mt-8 rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-8">
          {STATUS_ORDER.map((statusKey, index) => {
            const historyEntry = statusHistory.find(
              (entry) => entry.status === statusKey,
            );

            const complete = index < activeIndex;

            const current = index === activeIndex;

            return (
              <div
                key={statusKey}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                <div className="relative flex w-8 shrink-0 justify-center">
                  {index < STATUS_ORDER.length - 1 && (
                    <span
                      className={`absolute top-8 h-full w-px ${
                        index < activeIndex ? "bg-primary-500" : "bg-dark-200"
                      }`}
                    />
                  )}

                  <span
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      complete
                        ? "border-primary-500 bg-primary-500 text-white"
                        : current
                          ? "border-primary-500 bg-primary-500 text-white"
                          : "border-dark-200 bg-white text-dark-300"
                    }`}
                  >
                    {complete ? (
                      <Check size={16} />
                    ) : current ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full border-2 border-dark-300" />
                    )}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2
                      className={`font-heading font-bold ${
                        current
                          ? "text-primary-600"
                          : complete
                            ? "text-dark-900"
                            : "text-dark-400"
                      }`}
                    >
                      {formatStatus(statusKey)}
                    </h2>

                    <span className="text-xs text-dark-400">
                      {prettyDate(historyEntry?.timestamp)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-dark-500">
                    {historyEntry?.message || "Awaiting update."}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* {tracking.delivery && (
          <section className="mt-5 rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <Truck size={21} className="mt-0.5 shrink-0 text-primary-500" />

              <div>
                <h2 className="font-heading font-bold text-dark-950">
                  Delivery
                </h2>

                <p className="mt-1 text-sm text-dark-500">
                  {formatStatus(tracking.delivery.status)}
                </p>

                {tracking.delivery.estimatedMinutes != null && (
                  <p className="mt-2 text-sm font-semibold text-primary-600">
                    Estimated arrival: {tracking.delivery.estimatedMinutes}{" "}
                    minutes
                  </p>
                )}
              </div>
            </div>
          </section>
        )} */}

        {tracking.delivery && (
          <section className="mt-5 rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <Truck size={21} className="mt-0.5 shrink-0 text-primary-500" />

              <div className="min-w-0 flex-1">
                <h2 className="font-heading font-bold text-dark-950">
                  Delivery
                </h2>

                <p className="mt-1 text-sm font-medium text-dark-500">
                  {formatStatus(tracking.delivery.status)}
                </p>

                {/* Driver */}
                {tracking.delivery.driver && (
                  <div className="mt-5 rounded-xl border border-dark-100 bg-dark-50/50 p-4">
                    <div className="flex items-center gap-3">
                      {tracking.delivery.driver.profileImage ? (
                        <img
                          src={tracking.delivery.driver.profileImage}
                          alt={`${tracking.delivery.driver.firstname || ""} ${
                            tracking.delivery.driver.lastname || ""
                          }`}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                          {tracking.delivery.driver.firstname?.charAt(0) || "D"}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-dark-400">
                          Your driver
                        </p>

                        <p className="truncate font-bold text-dark-950">
                          {[
                            tracking.delivery.driver.firstname,
                            tracking.delivery.driver.lastname,
                          ]
                            .filter(Boolean)
                            .join(" ") || "Driver"}
                        </p>

                        {tracking.delivery.driver.phone && (
                          <a
                            href={`tel:${tracking.delivery.driver.phone}`}
                            className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600"
                          >
                            <Phone size={14} />
                            {tracking.delivery.driver.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Accepted */}
                {tracking.delivery.acceptedAt && (
                  <div className="mt-4 flex items-start gap-3">
                    <CircleCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />

                    <div>
                      <p className="text-sm font-semibold text-dark-900">
                        Driver accepted your order
                      </p>

                      <p className="mt-1 text-xs text-dark-400">
                        {prettyDate(tracking.delivery.acceptedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Picked up */}
                {tracking.delivery.pickedUpAt && (
                  <div className="mt-4 flex items-start gap-3">
                    <PackageCheck
                      size={18}
                      className="mt-0.5 shrink-0 text-primary-500"
                    />

                    <div>
                      <p className="text-sm font-semibold text-dark-900">
                        Your order has been picked up
                      </p>

                      <p className="mt-1 text-xs text-dark-400">
                        {prettyDate(tracking.delivery.pickedUpAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* ETA */}
                {tracking.delivery.estimatedMinutes != null &&
                  tracking.delivery.status !== "DELIVERED" &&
                  tracking.delivery.status !== "FAILED" && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl bg-primary-50 p-4">
                      <Clock3
                        size={19}
                        className="mt-0.5 shrink-0 text-primary-500"
                      />

                      <div>
                        <p className="text-sm font-bold text-primary-700">
                          Estimated arrival
                        </p>

                        <p className="mt-1 text-sm text-primary-600">
                          Approximately{" "}
                          <span className="font-bold">
                            {tracking.delivery.estimatedMinutes} minutes
                          </span>
                        </p>

                        {tracking.delivery.estimatedArrivalAt && (
                          <p className="mt-1 text-xs text-primary-500">
                            Around{" "}
                            {prettyDate(tracking.delivery.estimatedArrivalAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                {/* Delivered */}
                {tracking.delivery.deliveredAt && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
                    <CircleCheck
                      size={19}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-bold text-emerald-700">
                        Order delivered
                      </p>

                      <p className="mt-1 text-xs text-emerald-600">
                        Delivered on {prettyDate(tracking.delivery.deliveredAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Failed */}
                {tracking.delivery.failedAt && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl bg-red-50 p-4">
                    <XCircle
                      size={19}
                      className="mt-0.5 shrink-0 text-red-500"
                    />

                    <div>
                      <p className="text-sm font-bold text-red-700">
                        Delivery failed
                      </p>

                      {tracking.delivery.failureReason && (
                        <p className="mt-1 text-sm text-red-600">
                          {tracking.delivery.failureReason}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-red-500">
                        Updated on {prettyDate(tracking.delivery.failedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-4 text-sm text-primary-800">
          <PackageCheck size={20} className="shrink-0" />

          <span>
            This tracking link is protected by a secure token. Do not share it
            publicly.
          </span>
        </div>
      </div>
    </main>
  );
}

function InvalidOrder({ onRetry }) {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <AlertCircle className="mx-auto text-red-500" size={48} />

      <h1 className="mt-5 font-heading text-2xl font-bold text-dark-950">
        Order not found
      </h1>

      <p className="mt-3 text-dark-500">
        This tracking link is invalid or missing its secure token.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-primary-500 px-5 py-3 font-bold text-white hover:bg-primary-600"
          >
            Try Again
          </button>
        )}

        <Link to="/track" className="font-bold text-primary-500">
          Track Another Order
        </Link>
      </div>
    </main>
  );
}

function TerminalOrderState({ status, tracking, onRetry }) {
  const config = {
    [ORDER_STATUSES.CANCELLED]: {
      title: "Order Cancelled",
      message:
        "This order has been cancelled and will not continue through the delivery process.",
    },

    [ORDER_STATUSES.FAILED]: {
      title: "Order Failed",
      message:
        "This order could not be completed. Please contact support if you need assistance.",
    },

    [ORDER_STATUSES.REFUNDED]: {
      title: "Order Refunded",
      message:
        "This order has been refunded. If you have questions about the refund, please contact support.",
    },
  };

  const current = config[status] || {
    title: "Order Update",
    message: "This order is no longer active.",
  };

  return (
    <main className="bg-dark-50/50 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <section className="rounded-2xl border border-dark-100 bg-white p-6 text-center shadow-soft sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dark-100 text-dark-600">
            <AlertCircle size={30} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-primary-500">
            Order #{tracking.orderNumber}
          </p>

          <h1 className="mt-2 font-heading text-3xl font-extrabold text-dark-950">
            {current.title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-dark-500">
            {current.message}
          </p>

          {tracking.updatedAt && (
            <p className="mt-4 text-xs text-dark-400">
              Last updated {prettyDate(tracking.updatedAt)}
            </p>
          )}

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white hover:bg-primary-600"
            >
              Check again
            </button>

            <Link
              to="/menu"
              className="rounded-xl border border-dark-200 bg-white px-5 py-3 text-sm font-bold text-dark-700 hover:border-primary-500 hover:text-primary-600"
            >
              Browse Menu
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default OrderTracker;
