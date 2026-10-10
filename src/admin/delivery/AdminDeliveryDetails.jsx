import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuBike,
  LuCalendarDays,
  LuCheck,
  LuClock3,
  LuExternalLink,
  LuLoaderCircle,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuRefreshCw,
  LuTruck,
  LuUser,
  LuX,
} from "react-icons/lu";
import toast from "react-hot-toast";

import {
  useAdminDelivery,
  useAdminDeliveryETA,
  useAdminDeliveryHistory,
  useAdminDriverLocation,
  useAdminDrivers,
  useAssignAdminDelivery,
  useReassignAdminDelivery,
} from "../hooks/useAdminDelivery";

const DELIVERY_STATUS_LABELS = {
  unassigned: "Unassigned",
  offered: "Offered",
  assigned: "Assigned",
  accepted: "Accepted",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  delivered: "Delivered",
  failed: "Failed",
};

const STATUS_STYLES = {
  unassigned: "bg-dark-100 text-dark-600",
  offered: "bg-warning/10 text-warning",
  assigned: "bg-info/10 text-info",
  accepted: "bg-primary-50 text-primary-600",
  picked_up: "bg-purple-50 text-purple-700",
  in_transit: "bg-orange-50 text-orange-700",
  delivered: "bg-success/10 text-success",
  failed: "bg-danger/10 text-danger",
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return (
    DELIVERY_STATUS_LABELS[status] ||
    status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getDriverName = (driver) => {
  if (!driver) return "Unassigned";

  return (
    `${driver.firstname || ""} ${driver.lastname || ""}`.trim() ||
    driver.name ||
    "Unknown driver"
  );
};

const getCustomerName = (customer) => {
  if (!customer) return "Guest customer";

  return (
    `${customer.firstname || ""} ${customer.lastname || ""}`.trim() ||
    customer.name ||
    customer.fullName ||
    "Customer"
  );
};

const getOrderId = (order) => {
  if (!order) return "—";

  return order.orderNumber || order._id || order.id || "—";
};

function StatusBadge({ status }) {
  const normalizedStatus = String(status || "").toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
        STATUS_STYLES[normalizedStatus] ||
        "bg-dark-100 text-dark-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          normalizedStatus === "delivered"
            ? "bg-success"
            : normalizedStatus === "failed"
              ? "bg-danger"
              : normalizedStatus === "in_transit"
                ? "bg-orange-500"
                : normalizedStatus === "unassigned"
                  ? "bg-dark-400"
                  : "bg-primary-500"
        }`}
      />
      {formatStatus(normalizedStatus)}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-dark-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value,
  description,
  iconClassName = "bg-primary-50 text-primary-600",
}) {
  return (
    <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={20} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-dark-400">
            {label}
          </p>

          <p className="mt-1 truncate font-heading text-base font-bold text-dark-900">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-[11px] text-dark-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DriverCard({ driver }) {
  if (!driver) {
    return (
      <div className="rounded-2xl border border-dashed border-dark-200 bg-dark-50 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dark-100 text-dark-400">
          <LuUser size={23} />
        </div>

        <p className="mt-4 text-sm font-bold text-dark-700">
          No driver assigned
        </p>

        <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-dark-400">
          Assign an available driver to this delivery to begin
          delivery handling.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dark-100 bg-dark-50 p-4">
      <div className="flex items-start gap-3">
        {driver.profileImage ? (
          <img
            src={driver.profileImage}
            alt={getDriverName(driver)}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <LuUser size={21} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-dark-800">
            {getDriverName(driver)}
          </p>

          <p className="mt-0.5 truncate text-xs text-dark-400">
            {driver.email || "No email"}
          </p>

          {driver.phone && (
            <a
              href={`tel:${driver.phone}`}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 transition hover:text-primary-700"
            >
              <LuPhone size={13} />
              {driver.phone}
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-dark-100 bg-white p-3">
          <p className="text-[11px] font-medium text-dark-400">
            Vehicle
          </p>

          <p className="mt-1 truncate text-xs font-bold text-dark-700">
            {driver.vehicleType || "—"}
          </p>
        </div>

        <div className="rounded-xl border border-dark-100 bg-white p-3">
          <p className="text-[11px] font-medium text-dark-400">
            Vehicle No.
          </p>

          <p className="mt-1 truncate text-xs font-bold text-dark-700">
            {driver.vehicleNumber || "—"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            driver.isOnline
              ? "bg-success/10 text-success"
              : "bg-dark-100 text-dark-500"
          }`}
        >
          {driver.isOnline ? "Online" : "Offline"}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            driver.isAvailable
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }`}
        >
          {driver.isAvailable ? "Available" : "Busy"}
        </span>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
          <LuLoaderCircle
            size={22}
            className="animate-spin"
          />
        </div>

        <p className="text-sm font-semibold text-dark-500">
          Loading delivery details...
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-danger/20 bg-white p-8 text-center shadow-soft">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <LuX size={24} />
      </div>

      <h3 className="mt-4 font-heading text-base font-bold text-dark-900">
        Unable to load delivery
      </h3>

      <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-dark-500">
        {message || "Something went wrong while loading this delivery."}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600"
      >
        <LuRefreshCw size={15} />
        Try Again
      </button>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="rounded-2xl border border-dashed border-dark-200 bg-dark-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-dark-100 text-dark-400">
        <LuClock3 size={21} />
      </div>

      <p className="mt-3 text-sm font-bold text-dark-600">
        No delivery history yet
      </p>

      <p className="mt-1 text-xs text-dark-400">
        Delivery status events will appear here as they occur.
      </p>
    </div>
  );
}

function DriverSelector({
  drivers,
  selectedDriver,
  setSelectedDriver,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm text-dark-500">
        <LuLoaderCircle
          size={17}
          className="animate-spin"
        />
        Loading available drivers...
      </div>
    );
  }

  if (!drivers.length) {
    return (
      <div className="rounded-xl border border-warning/20 bg-warning/10 p-4 text-sm font-medium text-warning">
        No eligible drivers are currently available.
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor="driver"
        className="mb-2 block text-xs font-bold text-dark-600"
      >
        Available Driver
      </label>

      <select
        id="driver"
        value={selectedDriver}
        onChange={(event) =>
          setSelectedDriver(event.target.value)
        }
        className="w-full rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm font-medium text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
      >
        <option value="">Select a driver</option>

        {drivers.map((driver) => (
          <option
            key={driver._id}
            value={driver._id}
          >
            {getDriverName(driver)}
            {driver.vehicleNumber
              ? ` — ${driver.vehicleNumber}`
              : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function AdminDeliveryDetails() {
  const { deliveryId } = useParams();
  const navigate = useNavigate();

  const [showDriverPanel, setShowDriverPanel] =
    useState(false);

  const [selectedDriver, setSelectedDriver] =
    useState("");

  const {
    data: deliveryData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminDelivery(deliveryId);

  const {
    data: historyData,
    isLoading: historyLoading,
  } = useAdminDeliveryHistory(deliveryId);

  const {
    data: locationData,
    isLoading: locationLoading,
  } = useAdminDriverLocation(deliveryId);

  const {
    data: etaData,
    isLoading: etaLoading,
  } = useAdminDeliveryETA(deliveryId);

  const {
    data: driversData,
    isLoading: driversLoading,
  } = useAdminDrivers({
    status: "available",
    page: 1,
    limit: 100,
  });

  const assignMutation =
    useAssignAdminDelivery();

  const reassignMutation =
    useReassignAdminDelivery();

  const delivery = useMemo(() => {
    if (!deliveryData) return null;

    return (
      deliveryData.delivery ||
      deliveryData.data ||
      deliveryData
    );
  }, [deliveryData]);

  const order = useMemo(() => {
    if (!delivery) return null;

    return delivery.order || delivery.orderId || null;
  }, [delivery]);

  const driver = useMemo(() => {
    if (!delivery) return null;

    return (
      delivery.driver ||
      delivery.assignedDriver ||
      null
    );
  }, [delivery]);

  const customer = useMemo(() => {
    if (!order) return null;

    return (
      order.customer ||
      order.user ||
      order.guestCustomer ||
      null
    );
  }, [order]);

  const history = useMemo(() => {
    if (!historyData) return [];

    if (Array.isArray(historyData)) {
      return historyData;
    }

    return (
      historyData.history ||
      historyData.items ||
      historyData.results ||
      []
    );
  }, [historyData]);

  const drivers = useMemo(() => {
    if (!driversData) return [];

    if (Array.isArray(driversData)) {
      return driversData;
    }

    return (
      driversData.drivers ||
      driversData.items ||
      driversData.results ||
      []
    );
  }, [driversData]);

  const currentLocation = useMemo(() => {
    if (!locationData) return null;

    return (
      locationData.location ||
      locationData.currentLocation ||
      locationData.data ||
      locationData
    );
  }, [locationData]);

  const eta = useMemo(() => {
    if (!etaData) return null;

    return etaData.eta || etaData.data || etaData;
  }, [etaData]);

  const status = String(
    delivery?.status || ""
  ).toLowerCase();

  const canAssign =
    !driver ||
    status === "unassigned" ||
    status === "offered";

  const canReassign =
    Boolean(driver) &&
    ["assigned", "offered"].includes(status);

  const handleOpenDriverPanel = () => {
    setSelectedDriver("");
    setShowDriverPanel(true);
  };

  const handleCloseDriverPanel = () => {
    if (
      assignMutation.isPending ||
      reassignMutation.isPending
    ) {
      return;
    }

    setShowDriverPanel(false);
    setSelectedDriver("");
  };

  const handleAssign = async () => {
    if (!selectedDriver) {
      toast.error("Please select a driver.");
      return;
    }

    try {
      if (canReassign) {
        await reassignMutation.mutateAsync({
          deliveryId,
          driverId: selectedDriver,
        });

        toast.success(
          "Driver reassigned successfully."
        );
      } else {
        await assignMutation.mutateAsync({
          deliveryId,
          driverId: selectedDriver,
        });

        toast.success(
          "Driver assigned successfully."
        );
      }

      setShowDriverPanel(false);
      setSelectedDriver("");
    } catch (mutationError) {
      toast.error(
        mutationError?.response?.data?.message ||
          mutationError?.message ||
          "Unable to update driver assignment."
      );
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !delivery) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <ErrorState
          message={
            error?.response?.data?.message ||
            error?.message
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  const deliveryAddress =
    order?.deliveryAddress ||
    order?.address ||
    delivery?.deliveryAddress ||
    null;

  const locationText =
    currentLocation?.address ||
    currentLocation?.formattedAddress ||
    null;

  const estimatedMinutes =
    eta?.estimatedMinutes ??
    delivery?.estimatedMinutes;

  const estimatedArrival =
    eta?.estimatedArrivalAt ||
    delivery?.estimatedArrivalAt;

  const isAssignmentMutationPending =
    assignMutation.isPending ||
    reassignMutation.isPending;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/delivery")}
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-100 bg-white text-dark-500 shadow-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
            aria-label="Back to deliveries"
          >
            <LuArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-xl font-bold text-dark-900 sm:text-2xl">
                Delivery Details
              </h1>

              <StatusBadge status={status} />
            </div>

            <p className="mt-1 truncate text-sm text-dark-400">
              Delivery #{delivery._id || deliveryId}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl border border-dark-100 bg-white px-4 py-2.5 text-sm font-bold text-dark-600 shadow-sm transition hover:border-primary-200 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LuRefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>

          {(canAssign || canReassign) && (
            <button
              type="button"
              onClick={handleOpenDriverPanel}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-600"
            >
              <LuTruck size={16} />
              {canReassign
                ? "Reassign Driver"
                : "Assign Driver"}
            </button>
          )}
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          icon={LuTruck}
          label="Delivery Status"
          value={formatStatus(status)}
          description="Current delivery state"
        />

        <OverviewCard
          icon={LuPackage}
          label="Order"
          value={getOrderId(order)}
          description="Connected order"
          iconClassName="bg-info/10 text-info"
        />

        <OverviewCard
          icon={LuClock3}
          label="Estimated Arrival"
          value={
            etaLoading
              ? "Updating..."
              : estimatedMinutes != null
                ? `${estimatedMinutes} min`
                : estimatedArrival
                  ? formatDateTime(estimatedArrival)
                  : "—"
          }
          description="Latest available ETA"
          iconClassName="bg-warning/10 text-warning"
        />

        <OverviewCard
          icon={LuMapPin}
          label="Tracking"
          value={
            currentLocation
              ? "Location available"
              : locationLoading
                ? "Updating..."
                : "No location"
          }
          description="Driver location status"
          iconClassName="bg-success/10 text-success"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          {/* ORDER INFORMATION */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-base font-bold text-dark-900">
                  Order Information
                </h2>

                <p className="mt-1 text-xs text-dark-400">
                  Information connected to this delivery.
                </p>
              </div>

              {order?._id && (
                <Link
                  to={`/admin/orders/${order._id}`}
                  className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-2 text-xs font-bold text-primary-600 transition hover:bg-primary-100"
                >
                  View Order
                  <LuExternalLink size={13} />
                </Link>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoRow
                icon={LuPackage}
                label="Order"
                value={getOrderId(order)}
              />

              <InfoRow
                icon={LuUser}
                label="Customer"
                value={getCustomerName(customer)}
              />

              <InfoRow
                icon={LuCalendarDays}
                label="Order Date"
                value={formatDateTime(order?.createdAt)}
              />

              <InfoRow
                icon={LuTruck}
                label="Delivery Created"
                value={formatDateTime(delivery?.createdAt)}
              />
            </div>

            {deliveryAddress && (
              <div className="mt-6 rounded-2xl border border-dark-100 bg-dark-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <LuMapPin size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-400">
                      Delivery Address
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-6 text-dark-700">
                      {typeof deliveryAddress === "string"
                        ? deliveryAddress
                        : [
                            deliveryAddress.address,
                            deliveryAddress.street,
                            deliveryAddress.city,
                            deliveryAddress.state,
                          ]
                            .filter(Boolean)
                            .join(", ") ||
                          "Address unavailable"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* CURRENT LOCATION */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-base font-bold text-dark-900">
                  Current Location
                </h2>

                <p className="mt-1 text-xs text-dark-400">
                  Latest location reported for this delivery.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-[11px] font-bold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Auto-updates
              </span>
            </div>

            {locationLoading ? (
              <div className="flex items-center justify-center rounded-2xl bg-dark-50 p-10 text-sm font-medium text-dark-400">
                <LuLoaderCircle
                  size={18}
                  className="mr-2 animate-spin"
                />
                Updating location...
              </div>
            ) : currentLocation ? (
              <div className="rounded-2xl border border-dark-100 bg-dark-50 p-4">
                {locationText && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <LuMapPin size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-400">
                        Address
                      </p>

                      <p className="mt-1 text-sm font-semibold leading-6 text-dark-700">
                        {locationText}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-dark-100 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-400">
                      Latitude
                    </p>

                    <p className="mt-1 text-sm font-bold text-dark-700">
                      {currentLocation.latitude ??
                        currentLocation.lat ??
                        "—"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-dark-100 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-400">
                      Longitude
                    </p>

                    <p className="mt-1 text-sm font-bold text-dark-700">
                      {currentLocation.longitude ??
                        currentLocation.lng ??
                        currentLocation.lon ??
                        "—"}
                    </p>
                  </div>
                </div>

                {currentLocation.updatedAt && (
                  <p className="mt-4 text-xs text-dark-400">
                    Last updated:{" "}
                    <span className="font-semibold text-dark-600">
                      {formatDateTime(
                        currentLocation.updatedAt
                      )}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-dark-200 bg-dark-50 p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-dark-100 text-dark-400">
                  <LuMapPin size={23} />
                </div>

                <p className="mt-3 text-sm font-bold text-dark-600">
                  No location available
                </p>

                <p className="mt-1 text-xs text-dark-400">
                  The driver has not reported a location yet.
                </p>
              </div>
            )}
          </section>

          {/* DELIVERY HISTORY */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-6">
              <h2 className="font-heading text-base font-bold text-dark-900">
                Delivery History
              </h2>

              <p className="mt-1 text-xs text-dark-400">
                Status changes and delivery events.
              </p>
            </div>

            {historyLoading ? (
              <div className="flex items-center justify-center py-10 text-sm font-medium text-dark-400">
                <LuLoaderCircle
                  size={18}
                  className="mr-2 animate-spin"
                />
                Loading history...
              </div>
            ) : history.length === 0 ? (
              <EmptyHistory />
            ) : (
              <div className="relative space-y-5">
                {history.map((item, index) => {
                  const itemStatus = String(
                    item.status ||
                      item.deliveryStatus ||
                      item.event ||
                      ""
                  ).toLowerCase();

                  const isLast =
                    index === history.length - 1;

                  return (
                    <div
                      key={
                        item._id ||
                        item.id ||
                        `${itemStatus}-${index}`
                      }
                      className="relative flex gap-3"
                    >
                      {!isLast && (
                        <div className="absolute left-4 top-9 h-[calc(100%+0.75rem)] w-px bg-dark-200" />
                      )}

                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white bg-primary-50 text-primary-600 shadow-sm">
                        <LuCheck size={14} />
                      </div>

                      <div className="min-w-0 flex-1 rounded-2xl border border-dark-100 bg-dark-50 p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-dark-700">
                              {formatStatus(itemStatus)}
                            </p>

                            <StatusBadge
                              status={itemStatus}
                            />
                          </div>

                          <span className="text-[11px] font-medium text-dark-400">
                            {formatDateTime(
                              item.createdAt ||
                                item.timestamp ||
                                item.updatedAt
                            )}
                          </span>
                        </div>

                        {(item.note || item.message) && (
                          <p className="mt-3 text-xs leading-5 text-dark-500">
                            {item.note || item.message}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          {/* DRIVER */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-base font-bold text-dark-900">
                  Assigned Driver
                </h2>

                <p className="mt-1 text-xs text-dark-400">
                  Current driver handling this delivery.
                </p>
              </div>

              {driver && (
                <span className="shrink-0 rounded-full bg-primary-50 px-3 py-1.5 text-[11px] font-bold text-primary-600">
                  Assigned
                </span>
              )}
            </div>

            <DriverCard driver={driver} />

            {(canAssign || canReassign) && (
              <button
                type="button"
                onClick={handleOpenDriverPanel}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-bold text-primary-600 transition hover:bg-primary-100"
              >
                <LuTruck size={16} />
                {canReassign
                  ? "Reassign Driver"
                  : "Assign Driver"}
              </button>
            )}
          </section>

          {/* ETA */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-5">
              <h2 className="font-heading text-base font-bold text-dark-900">
                Estimated Arrival
              </h2>

              <p className="mt-1 text-xs text-dark-400">
                Latest ETA from the delivery service.
              </p>
            </div>

            {etaLoading ? (
              <div className="flex items-center rounded-xl bg-dark-50 p-4 text-sm font-medium text-dark-400">
                <LuLoaderCircle
                  size={17}
                  className="mr-2 animate-spin"
                />
                Calculating ETA...
              </div>
            ) : (
              <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
                    <LuClock3 size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-warning">
                      Estimated time
                    </p>

                    <p className="mt-1 font-heading text-xl font-bold text-dark-900">
                      {estimatedMinutes != null
                        ? `${estimatedMinutes} min`
                        : "—"}
                    </p>
                  </div>
                </div>

                {estimatedArrival && (
                  <div className="mt-4 border-t border-warning/20 pt-3">
                    <p className="text-[11px] font-medium text-dark-500">
                      Expected arrival
                    </p>

                    <p className="mt-1 text-xs font-bold text-dark-700">
                      {formatDateTime(estimatedArrival)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* DELIVERY SUMMARY */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-5">
              <h2 className="font-heading text-base font-bold text-dark-900">
                Delivery Summary
              </h2>

              <p className="mt-1 text-xs text-dark-400">
                Key delivery metadata.
              </p>
            </div>

            <div className="space-y-5">
              <InfoRow
                icon={LuCalendarDays}
                label="Created"
                value={formatDateTime(
                  delivery.createdAt
                )}
              />

              <InfoRow
                icon={LuClock3}
                label="Last Updated"
                value={formatDateTime(
                  delivery.updatedAt
                )}
              />

              <InfoRow
                icon={LuBike}
                label="Vehicle"
                value={
                  driver?.vehicleType || "Not assigned"
                }
              />
            </div>
          </section>
        </div>
      </div>

      {/* DRIVER ASSIGNMENT PANEL */}
      {showDriverPanel && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-dark-950/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isAssignmentMutationPending
            ) {
              handleCloseDriverPanel();
            }
          }}
        >
          <div className="w-full max-w-lg rounded-t-3xl border border-dark-100 bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex items-start justify-between border-b border-dark-100 px-5 py-5 sm:px-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <LuTruck size={19} />
                  </div>

                  <div>
                    <h2 className="font-heading text-base font-bold text-dark-900">
                      {canReassign
                        ? "Reassign Driver"
                        : "Assign Driver"}
                    </h2>

                    <p className="mt-0.5 text-xs text-dark-400">
                      Select an eligible available driver.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDriverPanel}
                disabled={isAssignmentMutationPending}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-dark-400 transition hover:bg-dark-50 hover:text-dark-700 disabled:opacity-50"
                aria-label="Close driver assignment"
              >
                <LuX size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {driver && (
                <div className="mb-5 rounded-2xl border border-dark-100 bg-dark-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-dark-400">
                    Current driver
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <LuUser size={16} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-dark-700">
                        {getDriverName(driver)}
                      </p>

                      {driver.vehicleNumber && (
                        <p className="mt-0.5 text-xs text-dark-400">
                          {driver.vehicleNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <DriverSelector
                drivers={drivers}
                selectedDriver={selectedDriver}
                setSelectedDriver={setSelectedDriver}
                isLoading={driversLoading}
              />

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseDriverPanel}
                  disabled={isAssignmentMutationPending}
                  className="rounded-xl border border-dark-200 px-4 py-2.5 text-sm font-bold text-dark-600 transition hover:bg-dark-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAssign}
                  disabled={
                    !selectedDriver ||
                    driversLoading ||
                    isAssignmentMutationPending
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAssignmentMutationPending ? (
                    <>
                      <LuLoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <LuCheck size={16} />
                      {canReassign
                        ? "Reassign Driver"
                        : "Assign Driver"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}