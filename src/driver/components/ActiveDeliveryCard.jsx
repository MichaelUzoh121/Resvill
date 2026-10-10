import React from "react";
import {
  LuArrowRight,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuTruck,
} from "react-icons/lu";

import DeliveryStatus from "./DeliveryStatus";

function ActiveDeliveryCard({ delivery, onView }) {
  const order = delivery?.order || {};

  const deliveryId =
    delivery?._id ||
    delivery?.id ||
    delivery?.deliveryId;

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

  const customerPhone =
    order?.customer?.phone ||
    order?.deliveryAddress?.phone ||
    order?.phone;

  const status = delivery?.status;

  return (
    <article className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft transition-shadow duration-200 hover:shadow-card">
      <div className="flex flex-col gap-4 border-b border-dark-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
            Active Delivery
          </p>

          <h2 className="mt-1 font-heading text-lg font-bold tracking-tight text-dark-900">
            {orderNumber}
          </h2>
        </div>

        <div className="shrink-0">
          <DeliveryStatus status={status} />
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start gap-3 rounded-xl border border-dark-100 bg-dark-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
            <LuMapPin className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
              Delivery Address
            </p>

            <p className="mt-1.5 text-sm font-semibold leading-6 text-dark-800">
              {address}
            </p>
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

          {customerPhone && (
            <div className="rounded-xl border border-dark-100 bg-white p-4">
              <div className="flex items-center gap-2 text-dark-400">
                <LuPhone className="h-4 w-4" />

                <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                  Customer Phone
                </span>
              </div>

              <p className="mt-2 truncate text-sm font-bold text-dark-900">
                {customerPhone}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-dark-100 bg-dark-50 px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => onView?.(deliveryId)}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-primary-600 hover:shadow-hover"
        >
          <LuTruck className="h-4 w-4" />

          <span>Manage Delivery</span>

          <LuArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}

export default ActiveDeliveryCard;