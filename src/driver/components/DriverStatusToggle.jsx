import React from "react";
import { LuLoaderCircle, LuPower } from "react-icons/lu";

function DriverStatusToggle({
  isOnline = false,
  onToggle,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={isOnline}
      className={[
        "group flex w-full items-center justify-between gap-4 rounded-2xl border bg-white px-4 py-4 text-left shadow-soft transition-all duration-200 sm:px-5 sm:py-5",
        disabled
          ? "cursor-not-allowed opacity-70"
          : "hover:border-primary-100 hover:shadow-card",
        isOnline
          ? "border-success/20"
          : "border-dark-100",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <span className="relative flex h-3 w-3 shrink-0">
          {isOnline && !disabled && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-40" />
          )}

          <span
            className={[
              "relative h-3 w-3 rounded-full",
              isOnline ? "bg-success" : "bg-dark-400",
            ].join(" ")}
          />
        </span>

        <div className="min-w-0">
          <p className="text-sm font-bold text-dark-900">
            {disabled
              ? "Updating availability..."
              : isOnline
                ? "Available for deliveries"
                : "Currently offline"}
          </p>

          <p className="mt-1 text-xs leading-5 text-dark-500">
            {isOnline
              ? "You can receive new delivery offers."
              : "You are not receiving new delivery offers."}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        {disabled && (
          <LuLoaderCircle className="h-4 w-4 animate-spin text-dark-400" />
        )}

        {!disabled && (
          <LuPower
            className={[
              "hidden h-4 w-4 transition-colors duration-200 sm:block",
              isOnline
                ? "text-success"
                : "text-dark-400 group-hover:text-primary-600",
            ].join(" ")}
          />
        )}

        <span
          className={[
            "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
            isOnline ? "bg-success" : "bg-dark-200",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200",
              isOnline ? "left-6" : "left-1",
            ].join(" ")}
          />
        </span>
      </div>
    </button>
  );
}

export default DriverStatusToggle;