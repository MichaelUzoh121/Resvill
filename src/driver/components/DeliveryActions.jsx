import React from "react";
import {
  LuCheck,
  LuX,
  LuPackageCheck,
  LuTruck,
  LuCircleCheck,
  LuCircleX,
  LuLoaderCircle,
} from "react-icons/lu";

function ActionButton({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
}) {
  const variants = {
    primary:
      "bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow-hover",
    secondary:
      "border border-dark-100 bg-white text-dark-700 shadow-sm hover:bg-dark-50 hover:text-dark-900",
    danger:
      "bg-danger text-white shadow-sm hover:opacity-90",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3",
        "text-sm font-bold transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant] || variants.primary,
      ].join(" ")}
    >
      {loading ? (
        <LuLoaderCircle className="h-[18px] w-[18px] animate-spin" />
      ) : (
        Icon && <Icon className="h-[18px] w-[18px]" />
      )}

      <span>{loading ? "Processing..." : label}</span>
    </button>
  );
}

function DeliveryActions({
  status,
  onAccept,
  onDecline,
  onPickup,
  onStart,
  onComplete,
  onFail,
  loadingAction = null,
}) {
  const normalizedStatus = String(status || "").toUpperCase();

  if (normalizedStatus === "OFFERED") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <ActionButton
          label="Accept Delivery"
          icon={LuCheck}
          onClick={onAccept}
          loading={loadingAction === "accept"}
        />

        <ActionButton
          label="Decline"
          icon={LuX}
          onClick={onDecline}
          variant="secondary"
          loading={loadingAction === "decline"}
        />
      </div>
    );
  }

  if (normalizedStatus === "ACCEPTED") {
    return (
      <div className="flex flex-col gap-3">
        <ActionButton
          label="Confirm Pickup"
          icon={LuPackageCheck}
          onClick={onPickup}
          loading={loadingAction === "pickup"}
        />
      </div>
    );
  }

  if (normalizedStatus === "PICKED_UP") {
    return (
      <div className="flex flex-col gap-3">
        <ActionButton
          label="Start Delivery"
          icon={LuTruck}
          onClick={onStart}
          loading={loadingAction === "start"}
        />
      </div>
    );
  }

  if (normalizedStatus === "IN_TRANSIT") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <ActionButton
          label="Complete Delivery"
          icon={LuCircleCheck}
          onClick={onComplete}
          loading={loadingAction === "complete"}
        />

        <ActionButton
          label="Report Failed Delivery"
          icon={LuCircleX}
          onClick={onFail}
          variant="danger"
          loading={loadingAction === "fail"}
        />
      </div>
    );
  }

  return null;
}

export default DeliveryActions;