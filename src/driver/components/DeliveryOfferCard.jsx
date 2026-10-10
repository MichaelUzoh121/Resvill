import React from "react";
import {
  LuArrowRight,
  LuClock3,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuWallet,
  LuX,
  LuCheck,
} from "react-icons/lu";

function DeliveryOfferCard({
  offer,
  onAccept,
  onDecline,
  loadingAction,
}) {
  const order = offer?.order || {};
  const deliveryId = offer?._id || offer?.id;

  const orderNumber =
    order?.orderNumber || "Order unavailable";

  const deliveryAddress =
    order?.deliveryAddress?.address ||
    order?.deliveryAddress?.formattedAddress ||
    order?.deliveryAddress?.street ||
    "Delivery address unavailable";

  // const totalAmount = Number(order?.totalAmount) || 0;
  const totalAmount = Number(order?.total) || 0;

  const itemCount = Array.isArray(order?.items)
    ? order.items.length
    : Number(order?.itemCount) || 0;

  const isAccepting = loadingAction === "accept";
  const isDeclining = loadingAction === "decline";
  const isLoading = Boolean(loadingAction);

  const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <article className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft transition-shadow duration-200 hover:shadow-card">
      <div className="border-b border-dark-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
              Delivery Offer
            </p>

            <h2 className="mt-1 font-heading text-lg font-bold tracking-tight text-dark-900">
              {orderNumber}
            </h2>
          </div>

          <div className="flex w-fit items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-600">
            <LuClock3 className="h-3.5 w-3.5" />
            New offer
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="rounded-xl border border-dark-100 bg-dark-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
              <LuMapPin className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
                Drop-off Location
              </p>

              <p className="mt-1.5 text-sm font-semibold leading-6 text-dark-800">
                {deliveryAddress}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dark-100 bg-white p-4">
            <div className="flex items-center gap-2 text-dark-400">
              <LuPackage className="h-4 w-4" />

              <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                Items
              </span>
            </div>

            <p className="mt-2 font-heading text-lg font-bold text-dark-900">
              {itemCount}
            </p>
          </div>

          <div className="rounded-xl border border-dark-100 bg-white p-4">
            <div className="flex items-center gap-2 text-dark-400">
              <LuWallet className="h-4 w-4" />

              <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                Order Total
              </span>
            </div>

            <p className="mt-2 font-heading text-lg font-bold text-dark-900">
              {formatNaira(totalAmount)}
            </p>
          </div>
        </div>

        {order?.customer?.phone && (
          <div className="flex items-center gap-3 rounded-xl border border-dark-100 bg-white px-4 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-dark-50 text-dark-500">
              <LuPhone className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
                Customer Phone
              </p>

              <p className="mt-1 truncate text-sm font-bold text-dark-900">
                {order.customer.phone}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-dark-100 bg-dark-50 px-5 py-4 sm:px-6">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onDecline(deliveryId)}
          className="flex items-center justify-center gap-2 rounded-xl border border-dark-100 bg-white px-4 py-3 text-sm font-bold text-dark-700 shadow-sm transition-all duration-200 hover:border-danger/20 hover:bg-danger/5 hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LuX className="h-4 w-4" />

          {isDeclining ? "Declining..." : "Decline"}
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => onAccept(deliveryId)}
          className="group flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LuCheck className="h-4 w-4" />

          {isAccepting ? "Accepting..." : "Accept"}

          {!isAccepting && (
            <LuArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
        </button>
      </div>
    </article>
  );
}

export default DeliveryOfferCard;