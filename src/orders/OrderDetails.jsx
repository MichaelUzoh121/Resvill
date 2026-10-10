import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Package,
  Receipt,
  User,
  Truck,
  AlertCircle,
} from "lucide-react";

import { formatNaira } from "../context/CartContext";
import { useOrder } from "../hooks/useOrders";
import { useMyReviews } from "../hooks/useReviews";
import ReviewForm from "./ReviewForm";

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getItemName = (item) => {
  return item?.name || item?.food?.name || "Food item";
};

const getItemPrice = (item) => {
  return Number(item?.price) || Number(item?.food?.price) || 0;
};

function OrderDetails() {
  const { orderId } = useParams();

  const { order, isLoading, isError, refetchOrder } = useOrder(orderId);

  const { reviews: myReviews, isLoading: isLoadingMyReviews } = useMyReviews();

  if (isLoading) {
    return (
      <main className="bg-dark-50/50 py-10 sm:py-14">
        <div className="mx-auto flex min-h-[400px] max-w-5xl items-center justify-center px-4">
          <div className="flex items-center gap-3 text-dark-500">
            <Loader2 size={22} className="animate-spin text-primary-500" />
            <span className="font-medium">Loading order details...</span>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="bg-dark-50/50 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-2xl border border-red-100 bg-white px-6 py-16 text-center shadow-soft">
            <AlertCircle className="mx-auto text-red-500" size={48} />

            <h1 className="mt-5 font-heading text-2xl font-extrabold text-dark-950">
              Unable to load this order
            </h1>

            <p className="mx-auto mt-2 max-w-md text-dark-500">
              The order could not be found or we were unable to retrieve its
              details.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => refetchOrder()}
                className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-5 py-3 font-bold text-white transition hover:bg-primary-600"
              >
                Try Again
              </button>

              <Link
                to="/account/orders"
                className="inline-flex items-center justify-center rounded-xl border border-dark-200 bg-white px-5 py-3 font-bold text-dark-700 transition hover:bg-dark-50"
              >
                Back to Orders
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const itemCount =
    order.items?.reduce(
      (total, item) => total + (Number(item.quantity) || 0),
      0,
    ) || 0;

  return (
    <main className="bg-dark-50/50 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className=" flex flex-row justify-between">
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-dark-600 transition hover:text-primary-500"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>

          <Link
            to={`/track/${encodeURIComponent(order._id || order.id)}`}
            className="ml-4 inline-flex items-center gap-2 text-sm font-bold text-primary-500 transition hover:text-primary-600"
          >
            <Truck size={17} />
            Track Order
          </Link>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-500">
              Order Details
            </p>

            <h1 className="mt-2 font-heading text-3xl font-extrabold text-dark-950">
              #{order.orderNumber}
            </h1>

            <p className="mt-2 text-sm text-dark-500">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="rounded-xl bg-primary-50 px-5 py-4 sm:text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-600">
              Current status
            </p>

            <p className="mt-1 text-base font-extrabold text-primary-800">
              {formatStatus(order.status)}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary-50 p-2.5 text-primary-500">
                  <Package size={20} />
                </div>

                <div>
                  <h2 className="font-heading text-lg font-extrabold text-dark-950">
                    Items
                  </h2>

                  <p className="text-sm text-dark-500">
                    {itemCount} item
                    {itemCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="mt-5 divide-y divide-dark-100">
                {/* {order.items?.map((item, index) => {
                  const quantity = Number(item.quantity) || 1;

                  const price = getItemPrice(item);

                  return ( */}

                {order.items?.map((item, index) => {
                  const quantity = Number(item.quantity) || 1;
                  const price = getItemPrice(item);

                  // const foodId = item.food?._id || item.food?.id;

                  const foodId =
                    typeof item.food === "object"
                      ? item.food?._id || item.food?.id
                      : item.food;

                  const hasReviewed = myReviews.some(
                    (review) =>
                      (review.food?._id || review.food?.id || review.food) ===
                        foodId &&
                      (review.order?._id ||
                        review.order?.id ||
                        review.order) === (order.id || order._id),
                  );

                  return (
                    <div
                      key={
                        item._id ||
                        item.food?._id ||
                        `${getItemName(item)}-${index}`
                      }
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-dark-50 text-dark-400">
                        <Package size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row">
                          <h3 className="font-bold text-dark-900">
                            {getItemName(item)}
                          </h3>

                          <p className="font-bold text-dark-900">
                            {formatNaira(price * quantity)}
                          </p>
                        </div>

                        <p className="mt-1 text-sm text-dark-500">
                          {quantity} × {formatNaira(price)}
                        </p>

                        {item.customizations?.length > 0 && (
                          <div className="mt-2 text-xs text-dark-500">
                            {item.customizations
                              .map(
                                (customization) =>
                                  `${customization.name}: ${customization.option}`,
                              )
                              .join(", ")}
                          </div>
                        )}

                        {item.addOns?.length > 0 && (
                          <div className="mt-1 text-xs text-dark-500">
                            Add-ons:{" "}
                            {item.addOns.map((addOn) => addOn.name).join(", ")}
                          </div>
                        )}

                        {item.notes && (
                          <p className="mt-1 text-xs italic text-dark-400">
                            Note: {item.notes}
                          </p>
                        )}

                        {order.status === "DELIVERED" &&
                          foodId &&
                          !hasReviewed &&
                          !isLoadingMyReviews && (
                            <div className="mt-4">
                              <ReviewForm
                                foodId={foodId}
                                orderId={order.id || order._id}
                                onSuccess={() => refetchOrder()}
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {order.deliveryMethod === "delivery" && (
              <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary-50 p-2.5 text-primary-500">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <h2 className="font-heading text-lg font-extrabold text-dark-950">
                      Delivery Information
                    </h2>

                    <p className="text-sm text-dark-500">
                      Where your order is being delivered
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  {order.deliveryAddress && (
                    <>
                      {order.deliveryAddress.fullName && (
                        <p className="font-bold text-dark-800">
                          {order.deliveryAddress.fullName}
                        </p>
                      )}

                      {order.deliveryAddress.phone && (
                        <p className="text-dark-600">
                          {order.deliveryAddress.phone}
                        </p>
                      )}

                      {order.deliveryAddress.address && (
                        <p className="text-dark-600">
                          {order.deliveryAddress.address}
                        </p>
                      )}

                      {(order.deliveryAddress.city ||
                        order.deliveryAddress.state) && (
                        <p className="text-dark-600">
                          {[
                            order.deliveryAddress.city,
                            order.deliveryAddress.state,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}

                      {order.deliveryAddress.landmark && (
                        <p className="text-dark-500">
                          Landmark: {order.deliveryAddress.landmark}
                        </p>
                      )}

                      {order.deliveryAddress.instructions && (
                        <p className="text-dark-500">
                          Instructions: {order.deliveryAddress.instructions}
                        </p>
                      )}
                    </>
                  )}

                  {!order.deliveryAddress && order.deliveryLocation && (
                    <p className="text-dark-600">{order.deliveryLocation}</p>
                  )}
                </div>
              </section>
            )}

            {order.scheduledFor && (
              <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary-50 p-2.5 text-primary-500">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <h2 className="font-heading text-lg font-extrabold text-dark-950">
                      Scheduled Order
                    </h2>

                    <p className="text-sm text-dark-500">
                      Your requested delivery time
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-dark-800">
                  <Clock3 size={17} className="text-primary-500" />
                  {formatDate(order.scheduledFor)}
                </div>
              </section>
            )}

            {order.customerNotes && (
              <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
                <h2 className="font-heading text-lg font-extrabold text-dark-950">
                  Order Notes
                </h2>

                <p className="mt-3 text-sm leading-6 text-dark-600">
                  {order.customerNotes}
                </p>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center gap-3">
                <Receipt size={20} className="text-primary-500" />

                <h2 className="font-heading text-lg font-extrabold text-dark-950">
                  Payment Summary
                </h2>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-dark-500">Subtotal</span>

                  <span className="font-semibold text-dark-800">
                    {formatNaira(Number(order.subtotal) || 0)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-dark-500">Delivery fee</span>

                  <span className="font-semibold text-dark-800">
                    {formatNaira(Number(order.deliveryFee) || 0)}
                  </span>
                </div>

                {Number(order.discount) > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-dark-500">Discount</span>

                    <span className="font-semibold text-green-600">
                      -{formatNaira(Number(order.discount) || 0)}
                    </span>
                  </div>
                )}

                {Number(order.loyaltyDiscount) > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-dark-500">Loyalty discount</span>

                    <span className="font-semibold text-green-600">
                      -{formatNaira(Number(order.loyaltyDiscount) || 0)}
                    </span>
                  </div>
                )}

                {Number(order.tip) > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-dark-500">Tip</span>

                    <span className="font-semibold text-dark-800">
                      {formatNaira(Number(order.tip) || 0)}
                    </span>
                  </div>
                )}

                <div className="border-t border-dark-100 pt-4">
                  <div className="flex justify-between gap-4">
                    <span className="font-heading font-extrabold text-dark-950">
                      Total
                    </span>

                    <span className="font-heading text-lg font-extrabold text-dark-950">
                      {formatNaira(Number(order.total) || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
              <h2 className="font-heading text-lg font-extrabold text-dark-950">
                Order Information
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-primary-500"
                  />

                  <div>
                    <p className="font-semibold text-dark-800">Payment</p>

                    <p className="mt-1 capitalize text-dark-500">
                      {order.paymentStatus || "Pending"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Receipt
                    size={18}
                    className="mt-0.5 shrink-0 text-primary-500"
                  />

                  <div>
                    <p className="font-semibold text-dark-800">
                      Payment method
                    </p>

                    <p className="mt-1 capitalize text-dark-500">
                      {order.paymentMethod || "Card"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-primary-500"
                  />

                  <div>
                    <p className="font-semibold text-dark-800">
                      Delivery method
                    </p>

                    <p className="mt-1 capitalize text-dark-500">
                      {order.deliveryMethod || "Delivery"}
                    </p>
                  </div>
                </div>

                {order.customerType === "guest" && (
                  <div className="flex items-start gap-3">
                    <User
                      size={18}
                      className="mt-0.5 shrink-0 text-primary-500"
                    />

                    <div>
                      <p className="font-semibold text-dark-800">
                        Customer type
                      </p>

                      <p className="mt-1 text-dark-500">Guest order</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;
