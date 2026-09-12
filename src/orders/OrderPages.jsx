import React, { useEffect } from "react";
import {
  Check,
  PackageCheck,
  Truck,
} from "lucide-react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import { formatNaira, useCart } from "../context/CartContext";
import { getLastOrder, getOrderByCredentials } from "../utils/orders";
import { getMapsDirectionsLink } from "../utils/googleMaps";

const prettyDate = (value) => {
  return value
    ? new Date(value).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Awaiting update";
};

export function OrderConfirmation() {
  const { id } = useParams();
  const query = new URLSearchParams(
    useLocation().search,
  );

  const token = query.get("token");
  const matchedOrder = getOrderByCredentials(
    id,
    token,
  );
  const lastOrder = getLastOrder();
  const order = matchedOrder || (lastOrder?.id === id ? lastOrder : null);
  const { clearCart } = useCart();

  useEffect(() => {
    if (order) clearCart();
  }, [order?.id]);

  if (!order) {
    return <InvalidOrder />;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-white">
        <Check size={34} />
      </div>

      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-success">
        Payment successful
      </p>

      <h1 className="mt-2 font-heading text-3xl font-extrabold text-dark-950">
        Your order has been confirmed.
      </h1>

      <p className="mt-3 text-dark-500">
        Order{" "}
        <strong className="text-dark-900">
          #{order.id}
        </strong>{" "}
        is being prepared.
      </p>

      <div className="mt-8 rounded-2xl border border-dark-100 bg-white p-6 text-left shadow-soft">
        <div className="flex items-center justify-between border-b border-dark-100 pb-4">
          <span className="font-bold text-dark-950">
            Total paid
          </span>

          <strong className="font-heading text-xl text-primary-500">
            {formatNaira(order.totals.total)}
          </strong>
        </div>

        <p className="mt-4 text-sm text-dark-500">
          We sent a confirmation to {order.customer.email}. Keep the private
          tracking details below safe.
        </p>

        <div className="mt-5 rounded-xl border border-primary-100 bg-primary-50 p-4 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-700">
            Private tracking token
          </p>
          <p className="mt-2 break-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-dark-800">
            {order.trackingToken}
          </p>
          <p className="mt-2 text-xs leading-5 text-primary-800">
            You need this token together with order #{order.id} if you use the
            Track Order form later.
          </p>
        </div>

        <Link
          to={`/track/${order.id}?token=${order.trackingToken}`}
          className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 font-bold text-white hover:bg-primary-600"
        >
          Track your order
          <Truck size={18} />
        </Link>
      </div>

      <Link
        to="/menu"
        className="mt-6 inline-block text-sm font-bold text-primary-500"
      >
        Continue browsing the menu
      </Link>
    </main>
  );
}

export function OrderTracker() {
  const { id } = useParams();

  const query = new URLSearchParams(
    useLocation().search,
  );

  const order = getOrderByCredentials(
    id,
    query.get("token"),
  );

  if (!order) {
    return <InvalidOrder />;
  }

  const activeIndex = order.statuses.findIndex(
    (status) => status.key === order.status,
  );

  return (
    <main className="bg-dark-50/50 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-primary-500">
          Private order tracker
        </p>

        <h1 className="mt-2 font-heading text-3xl font-extrabold text-dark-950">
          Order #{order.id}
        </h1>

        <p className="mt-2 text-dark-500">
          {order.deliveryMethod === "pickup"
            ? "Pickup order"
            : "Delivery order"}{" "}
          · Placed {prettyDate(order.createdAt)}
        </p>

        <section className="mt-8 rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-8">
          {order.statuses.map((status, index) => {
            const complete = index < activeIndex;
            const current = index === activeIndex;

            return (
              <div
                key={status.key}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                <div className="relative flex w-8 shrink-0 justify-center">
                  {index < order.statuses.length - 1 && (
                    <span
                      className={`absolute top-8 h-full w-px ${
                        index < activeIndex
                          ? "bg-primary-500"
                          : "bg-dark-200"
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
                      {status.label}
                    </h2>

                    <span className="text-xs text-dark-400">
                      {prettyDate(status.timestamp)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-dark-500">
                    {status.description}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-4 text-sm text-primary-800">
          <PackageCheck
            size={20}
            className="shrink-0"
          />

          <span>
            This tracking link is protected by a secure token.
            Do not share it publicly.
          </span>
        </div>
      </div>
    </main>
  );
}

function InvalidOrder() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold text-dark-950">
        Order not found
      </h1>

      <p className="mt-3 text-dark-500">
        This tracking link is invalid or missing its secure token.
      </p>

      <Link
        to="/menu"
        className="mt-6 inline-block font-bold text-primary-500"
      >
        Back to Menu
      </Link>
    </main>
  );
}