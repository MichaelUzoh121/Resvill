import React, { useEffect } from "react";
import {
  CheckCircle2,
  MapPin,
  PackageCheck,
  Truck,
  CalendarClock,
  Loader2,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { useOrder } from "../hooks/useOrders";
import { useGuestOrderTracking } from "../hooks/useTracking";
import { useCart } from "../context/CartContext";
import { formatNaira } from "../utils/formatNaira";

function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();

  const { user } = useAuth();
  const { clearCart } = useCart();

  const query = new URLSearchParams(location.search);

  const token = query.get("token");

  /*
   * Authenticated orders use the normal order endpoint.
   * Guest orders are retrieved through the tracking
   * endpoint because guests do not have authenticated
   * access to GET /orders/:id.
   */
  //   const authenticatedOrder = useOrder(
  //     user ? id : null,
  //   );

  //   const guestTracking = useGuestOrderTracking(
  //     user ? null : id,
  //     user ? null : token,
  //   );

  //   const order = user
  //     ? authenticatedOrder.order
  //     : guestTracking.tracking;

  //   const isLoading = user
  //     ? authenticatedOrder.isLoading
  //     : guestTracking.isLoading;

  //   const isError = user
  //     ? authenticatedOrder.isError
  //     : guestTracking.isError;

  const isGuestOrder = Boolean(token);

  const authenticatedOrder = useOrder(!isGuestOrder && user ? id : null);

  const guestTracking = useGuestOrderTracking(
    isGuestOrder ? id : null,
    isGuestOrder ? token : null,
  );

  const order = isGuestOrder
    ? guestTracking.tracking
    : authenticatedOrder.order;

  const isLoading = isGuestOrder
    ? guestTracking.isLoading
    : authenticatedOrder.isLoading;

  const isError = isGuestOrder
    ? guestTracking.isError
    : authenticatedOrder.isError;

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (isError) {
      toast.error("Unable to load your order confirmation.");
    }
  }, [isError]);

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-dark-500">
          <Loader2 size={22} className="animate-spin text-primary-500" />

          <span className="font-medium">Loading your order...</span>
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <PackageCheck size={48} className="mx-auto text-dark-300" />

        <h1 className="mt-5 font-heading text-2xl font-bold text-dark-950">
          Order confirmation unavailable
        </h1>

        <p className="mt-3 text-dark-500">
          We could not load the order associated with this confirmation link.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-xl bg-primary-500 px-5 py-3 font-bold text-white transition hover:bg-primary-600"
          >
            Back to Home
          </Link>

          <Link to="/track" className="font-bold text-primary-500">
            Track an Order
          </Link>
        </div>
      </main>
    );
  }

  const orderNumber = order.orderNumber || id;

  const total = Number(order.total) || Number(order.totals?.total) || 0;

  const customerEmail = order.guestDetails?.email || user?.email || "";

  // const trackingToken = token || order.trackingToken;

  // const trackingPath = trackingToken
  //   ? `/track/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(
  //       trackingToken,
  //     )}`
  //   : `/track/${encodeURIComponent(order._id || id)}`;

  const trackingPath = isGuestOrder
    ? `/track/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(
        token,
      )}`
    : `/track/${encodeURIComponent(order._id || id)}`;

  const isScheduled = Boolean(order.scheduledFor);

  return (
    <main className="bg-dark-50/50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={34} className="text-green-600" />
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-widest text-green-600">
              Order confirmed
            </p>

            <h1 className="mt-2 font-heading text-3xl font-extrabold text-dark-950">
              Thank you for your order!
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-dark-500">
              Your order has been received successfully. We will keep you
              updated as it moves through the preparation and delivery process.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-dark-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-dark-400">
                Order number
              </p>

              <p className="mt-1 font-heading text-lg font-bold text-dark-950">
                #{orderNumber}
              </p>
            </div>

            <div className="rounded-2xl bg-dark-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-dark-400">
                Total
              </p>

              <p className="mt-1 font-heading text-lg font-bold text-dark-950">
                {formatNaira(total)}
              </p>
            </div>
          </div>

          {customerEmail && (
            <div className="mt-4 rounded-2xl border border-dark-100 p-4">
              <p className="text-sm text-dark-500">
                Confirmation details will be sent to
              </p>

              <p className="mt-1 font-semibold text-dark-900">
                {customerEmail}
              </p>
            </div>
          )}

          {isScheduled && (
            <div className="mt-4 flex gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-4">
              <CalendarClock
                size={22}
                className="mt-0.5 shrink-0 text-primary-500"
              />

              <div>
                <p className="font-bold text-primary-900">Scheduled order</p>

                <p className="mt-1 text-sm text-primary-700">
                  Scheduled for{" "}
                  {new Date(order.scheduledFor).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          )}

          {order.deliveryMethod === "delivery" && (
            <div className="mt-4 flex gap-3 rounded-2xl border border-dark-100 p-4">
              <MapPin size={22} className="mt-0.5 shrink-0 text-primary-500" />

              <div>
                <p className="font-bold text-dark-950">Delivery</p>

                {order.deliveryAddress ? (
                  <p className="mt-1 text-sm leading-6 text-dark-500">
                    {[
                      order.deliveryAddress.address,
                      order.deliveryAddress.city,
                      order.deliveryAddress.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-dark-500">
                    Your order will be delivered to the address provided at
                    checkout.
                  </p>
                )}
              </div>
            </div>
          )}

          {order.deliveryMethod === "pickup" && (
            <div className="mt-4 flex gap-3 rounded-2xl border border-dark-100 p-4">
              <PackageCheck
                size={22}
                className="mt-0.5 shrink-0 text-primary-500"
              />

              <div>
                <p className="font-bold text-dark-950">Pickup order</p>

                <p className="mt-1 text-sm text-dark-500">
                  Your order will be prepared for collection.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={trackingPath}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 font-bold text-white transition hover:bg-primary-600"
            >
              <Truck size={19} />
              Track Order
            </a>

            {user && (
              <a
                href={`/account/orders/${order._id}`}
                className="flex flex-1 items-center justify-center rounded-xl border border-dark-200 px-5 py-3.5 font-bold text-dark-800 transition hover:bg-dark-50"
              >
                View Order Details
              </a>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/menu"
              className="text-sm font-bold text-primary-500 hover:text-primary-600"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default OrderConfirmation;
