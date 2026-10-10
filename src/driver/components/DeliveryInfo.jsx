import React from "react";
import {
  LuPackage,
  LuUserRound,
  LuPhone,
  LuHash,
} from "react-icons/lu";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-dark-50 text-dark-500">
        <Icon className="h-[17px] w-[17px]" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold leading-5 text-dark-900">
          {value || "Unavailable"}
        </p>
      </div>
    </div>
  );
}

function DeliveryInfo({
  orderNumber,
  customerName,
  customerPhone,
}) {
  return (
    <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />

          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
            Delivery Details
          </p>
        </div>

        <h2 className="mt-1.5 font-heading text-base font-bold text-dark-900">
          Delivery Information
        </h2>

        <p className="mt-1 text-sm leading-6 text-dark-500">
          Order and customer details for this delivery.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <InfoRow
          icon={LuHash}
          label="Order"
          value={orderNumber}
        />

        <InfoRow
          icon={LuUserRound}
          label="Customer"
          value={customerName}
        />

        <InfoRow
          icon={LuPhone}
          label="Phone"
          value={customerPhone}
        />
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-dark-100 bg-dark-50 px-4 py-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm">
          <LuPackage className="h-[18px] w-[18px]" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
            Delivery
          </p>

          <p className="mt-1 text-sm font-semibold leading-5 text-dark-800">
            Handle the order carefully and confirm completion after delivery.
          </p>
        </div>
      </div>
    </section>
  );
}

export default DeliveryInfo;