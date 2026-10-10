import React from "react";
import {
  LuMapPin,
  LuNavigation,
} from "react-icons/lu";

function DeliveryLocation({
  title,
  address,
  type = "destination",
}) {
  const isPickup = type === "pickup";

  return (
    <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition-shadow duration-200 hover:shadow-card sm:p-6">
      <div className="flex items-start gap-3">
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            isPickup
              ? "bg-info/10 text-info"
              : "bg-primary-50 text-primary-600",
          ].join(" ")}
        >
          {isPickup ? (
            <LuNavigation className="h-5 w-5" />
          ) : (
            <LuMapPin className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
            {title || (isPickup ? "Pickup location" : "Delivery destination")}
          </p>

          <p className="mt-2 text-sm font-semibold leading-6 text-dark-900">
            {address || "Address unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DeliveryLocation;