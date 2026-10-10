import React from "react";
import {
  LuExternalLink,
  LuMapPin,
  LuNavigation,
} from "react-icons/lu";

function DeliveryLocation({ delivery }) {
  const location = delivery?.currentLocation;

  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);

  const hasLocation =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const mapsUrl = hasLocation
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : null;

  return (
    <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <LuMapPin className="h-5 w-5" />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
            GPS Tracking
          </p>

          <h2 className="mt-1 font-heading text-base font-bold text-dark-900">
            Current Location
          </h2>

          <p className="mt-0.5 text-sm text-dark-500">
            Your latest GPS position
          </p>
        </div>
      </div>

      {hasLocation ? (
        <div className="mt-5">
          <div className="rounded-xl border border-dark-100 bg-dark-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm">
                <LuNavigation className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
                  Coordinates
                </p>

                <p className="mt-1.5 break-all text-sm font-semibold leading-5 text-dark-800">
                  {latitude}, {longitude}
                </p>
              </div>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-dark-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-dark-800"
          >
            <LuExternalLink className="h-4 w-4" />
            Open in Google Maps
          </a>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-dark-200 bg-dark-50 px-4 py-9 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-dark-300 shadow-sm">
            <LuMapPin className="h-5 w-5" />
          </div>

          <p className="mt-3 text-sm font-bold text-dark-800">
            Location unavailable
          </p>

          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-dark-500">
            Your current GPS location will appear here once it is available.
          </p>
        </div>
      )}
    </section>
  );
}

export default DeliveryLocation;