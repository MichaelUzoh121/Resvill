import React from "react";
import {
  LuCalendarDays,
  LuMapPin,
  LuPackage,
} from "react-icons/lu";

import DeliveryStatus from "./DeliveryStatus";

function DeliveryHistoryCard({ delivery }) {
  const order = delivery?.order || {};

  const orderNumber =
    order?.orderNumber || "Order unavailable";

  const address =
    order?.deliveryAddress?.address ||
    order?.deliveryAddress?.formattedAddress ||
    order?.deliveryAddress?.street ||
    "Delivery address unavailable";

  const itemCount = Array.isArray(order?.items)
    ? order.items.length
    : Number(order?.itemCount) || 0;

  const status = delivery?.status;

  const dateValue =
    delivery?.deliveredAt ||
    delivery?.failedAt ||
    delivery?.updatedAt ||
    delivery?.createdAt;

  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Date unavailable";

  return (
    <article className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition-shadow duration-200 hover:shadow-card sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
            Delivery Record
          </p>

          <h2 className="mt-1 truncate font-heading text-base font-bold text-dark-900">
            {orderNumber}
          </h2>
        </div>

        <div className="shrink-0">
          <DeliveryStatus status={status} />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-dark-100 bg-dark-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-dark-500 shadow-sm">
            <LuMapPin className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
              Delivery Address
            </p>

            <p className="mt-1.5 text-sm font-semibold leading-6 text-dark-800">
              {address}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-dark-100 bg-white p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-dark-50 text-dark-500">
            <LuPackage className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
              Items
            </p>

            <p className="mt-1 text-sm font-bold text-dark-900">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-dark-100 bg-white p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-dark-50 text-dark-500">
            <LuCalendarDays className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
              Date
            </p>

            <p className="mt-1 truncate text-sm font-bold text-dark-900">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default DeliveryHistoryCard;