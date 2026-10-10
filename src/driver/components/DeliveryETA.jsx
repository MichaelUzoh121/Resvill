import React from "react";
import { LuClock3 } from "react-icons/lu";

// function DeliveryETA({ eta }) {
//   const data = eta?.data || eta || {};

//   const estimatedMinutes = Number(data?.estimatedMinutes);
//   const estimatedArrivalAt = data?.estimatedArrivalAt;

function DeliveryETA({ eta }) {
  const data = eta?.data || eta || {};

  const estimatedMinutes = Number(
    data?.estimatedMinutes ?? data?.delivery?.estimatedMinutes,
  );

  const estimatedArrivalAt =
    data?.estimatedArrivalAt ?? data?.delivery?.estimatedArrivalAt;

  const distanceKm = Number(data?.distanceKm);

  const hasMinutes = Number.isFinite(estimatedMinutes);

  const formattedArrival = estimatedArrivalAt
    ? new Date(estimatedArrivalAt).toLocaleTimeString("en-NG", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  if (!hasMinutes && !formattedArrival) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <LuClock3 className="h-5 w-5" />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
            Delivery Timing
          </p>

          <h2 className="mt-1 font-heading text-base font-bold text-dark-900">
            Estimated Arrival
          </h2>

          <p className="mt-0.5 text-sm text-dark-500">
            Based on your current location
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-primary-100 bg-primary-50 p-4">
        {hasMinutes && (
          <p className="font-heading text-xl font-bold text-dark-900">
            {estimatedMinutes} {estimatedMinutes === 1 ? "minute" : "minutes"}
          </p>
        )}

        {Number.isFinite(distanceKm) && (
          <p className="mb-2 text-sm font-medium text-dark-500">
            {distanceKm.toFixed(1)} km away
          </p>
        )}

        {formattedArrival && (
          <p className="mt-1 text-sm font-medium text-dark-600">
            Estimated arrival around {formattedArrival}
          </p>
        )}
      </div>
    </section>
  );
}

export default DeliveryETA;
