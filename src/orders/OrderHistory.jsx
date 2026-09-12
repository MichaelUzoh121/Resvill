import React from "react";
import { ArrowRight, ClipboardList, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatNaira } from "../context/CartContext";
import { getOrders } from "../utils/orders";

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

function OrderHistory() {
  const orders = getOrders();

  return (
    <main className="bg-dark-50/50 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-widest text-primary-500">
          Your account
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-dark-950">
          Order History
        </h1>
        <p className="mt-2 text-dark-500">
          View your previous orders and track an order directly.
        </p>

        {!orders.length ? (
          <section className="mt-8 rounded-2xl border border-dark-100 bg-white px-6 py-16 text-center shadow-soft">
            <ClipboardList className="mx-auto text-primary-500" size={48} />
            <h2 className="mt-5 font-heading text-2xl font-extrabold text-dark-950">
              No orders yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-dark-500">
              Your completed orders will appear here after you place your first order.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 font-bold text-white hover:bg-primary-600"
            >
              Browse Menu
              <ArrowRight size={17} />
            </Link>
          </section>
        ) : (
          <section className="mt-8 space-y-4">
            {orders.map((order) => {
              const currentStatus =
                order.statuses?.find((status) => status.key === order.status) ||
                order.statuses?.[0];

              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary-500">
                        Order
                      </p>
                      <h2 className="mt-1 font-heading text-xl font-extrabold text-dark-950">
                        #{order.id}
                      </h2>
                      <p className="mt-1 text-sm text-dark-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-primary-50 px-4 py-3 sm:text-right">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary-600">
                        Current status
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-primary-800">
                        {currentStatus?.label || order.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-dark-100 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold text-dark-400">Items</p>
                      <p className="mt-1 text-sm font-bold text-dark-800">
                        {order.items?.reduce((total, item) => total + item.quantity, 0) || 0} item(s)
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-dark-400">Total</p>
                      <p className="mt-1 text-sm font-bold text-dark-800">
                        {formatNaira(order.totals?.total || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-dark-400">Delivery method</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-bold capitalize text-dark-800">
                        <MapPin size={15} className="text-primary-500" />
                        {order.deliveryMethod || "Delivery"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-dark-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-dark-500">
                      {order.items?.map((item) => `${item.quantity} × ${item.name}`).join(", ")}
                    </p>
                    <Link
                      to={`/track/${order.id}?token=${encodeURIComponent(order.trackingToken)}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-bold text-white hover:bg-primary-600"
                    >
                      Track Order
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

export default OrderHistory;
