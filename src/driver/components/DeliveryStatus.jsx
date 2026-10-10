import React from "react";
import {
  LuBell,
  LuCheck,
  LuCircleCheck,
  LuCircleX,
  LuClock3,
  LuPackageCheck,
  LuTruck,
  LuX,
} from "react-icons/lu";

const STATUS_CONFIG = {
  OFFERED: {
    label: "Delivery Offered",
    description: "A new delivery offer is waiting for your response.",
    icon: LuBell,
    className: "border-info/20 bg-info/5 text-info",
    iconClassName: "bg-info/10 text-info",
  },

  ASSIGNED: {
    label: "Assigned",
    description: "This delivery has been assigned to you.",
    icon: LuClock3,
    className: "border-warning/20 bg-warning/5 text-warning",
    iconClassName: "bg-warning/10 text-warning",
  },

  ACCEPTED: {
    label: "Accepted",
    description: "Delivery accepted. Confirm pickup when you have the order.",
    icon: LuCheck,
    className: "border-info/20 bg-info/5 text-info",
    iconClassName: "bg-info/10 text-info",
  },

  PICKED_UP: {
    label: "Picked Up",
    description: "The order has been picked up and is ready to be delivered.",
    icon: LuPackageCheck,
    className: "border-primary-100 bg-primary-50 text-primary-700",
    iconClassName: "bg-primary-100 text-primary-600",
  },

  IN_TRANSIT: {
    label: "In Transit",
    description: "You are currently on the way to the customer.",
    icon: LuTruck,
    className: "border-primary-100 bg-primary-50 text-primary-700",
    iconClassName: "bg-primary-100 text-primary-600",
  },

  DELIVERED: {
    label: "Delivered",
    description: "This delivery has been completed successfully.",
    icon: LuCircleCheck,
    className: "border-success/20 bg-success/5 text-success",
    iconClassName: "bg-success/10 text-success",
  },

  FAILED: {
    label: "Delivery Failed",
    description: "This delivery could not be completed.",
    icon: LuCircleX,
    className: "border-danger/20 bg-danger/5 text-danger",
    iconClassName: "bg-danger/10 text-danger",
  },

  DECLINED: {
    label: "Delivery Declined",
    description: "This delivery offer was declined.",
    icon: LuX,
    className: "border-danger/20 bg-danger/5 text-danger",
    iconClassName: "bg-danger/10 text-danger",
  },
};

function DeliveryStatus({ status }) {
  const normalizedStatus = String(status || "")
    .trim()
    .toUpperCase();

  const config = STATUS_CONFIG[normalizedStatus] || {
    label: status || "Unknown Status",
    description: "The current delivery status is unavailable.",
    icon: LuClock3,
    className: "border-dark-100 bg-dark-50 text-dark-600",
    iconClassName: "bg-dark-100 text-dark-500",
  };

  const Icon = config.icon;

  return (
    <section
      className={[
        "rounded-2xl border p-5 shadow-soft",
        config.className,
      ].join(" ")}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            config.iconClassName,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-60">
            Delivery Status
          </p>

          <h2 className="mt-1 font-heading text-base font-bold tracking-tight">
            {config.label}
          </h2>

          <p className="mt-1.5 text-sm leading-6 opacity-80">
            {config.description}
          </p>
        </div>
      </div>
    </section>
  );
}

export default DeliveryStatus;