import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuCircleAlert,
  LuCheck,
  LuChevronDown,
  LuLoaderCircle,
  LuMapPin,
  LuPackage,
  LuRefreshCw,
  LuTruck,
  LuUserRound,
} from "react-icons/lu";
import toast from "react-hot-toast";

import { useStaffOrders } from "../hooks/useStaffOrders";
import { useStaffOrderDelivery } from "../hooks/useStaffDeliveries";
import { useStaffDrivers } from "../hooks/useStaffDrivers";
import {
  useAssignStaffDelivery,
  useCreateStaffDelivery,
  useReassignStaffDelivery,
} from "../hooks/useStaffDeliveryMutations";

const DELIVERY_ORDER_STATUSES = ["READY", "OUT_FOR_DELIVERY"];

const DELIVERY_STATUS_STYLES = {
  UNASSIGNED: "bg-yellow-50 text-yellow-700",
  OFFERED: "bg-blue-50 text-blue-700",
  ASSIGNED: "bg-indigo-50 text-indigo-700",
  ACCEPTED: "bg-cyan-50 text-cyan-700",
  PICKED_UP: "bg-orange-50 text-orange-700",
  IN_TRANSIT: "bg-purple-50 text-purple-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  FAILED: "bg-red-50 text-red-700",
};

const DELIVERY_STATUS_LABELS = {
  UNASSIGNED: "Unassigned",
  OFFERED: "Driver offered",
  ASSIGNED: "Assigned",
  ACCEPTED: "Accepted",
  PICKED_UP: "Picked up",
  IN_TRANSIT: "In transit",
  DELIVERED: "Delivered",
  FAILED: "Failed",
};

const getOrdersArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.orders)) {
    return data.orders;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];
};

const getDriversArray = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.drivers)) {
    return data.drivers;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];
};

const getOrderId = (order) => {
  return order?._id || order?.id || null;
};

const getOrderReference = (order) => {
  if (order?.orderNumber) {
    const value = String(order.orderNumber);

    return value.startsWith("#") ? value : `#${value}`;
  }

  const id = getOrderId(order);

  if (!id) {
    return "—";
  }

  return `#${String(id).slice(-6).toUpperCase()}`;
};

const getCustomer = (order) => {
  return order?.user || order?.customer || null;
};

const getCustomerName = (order) => {
  const customer = getCustomer(order);

  if (!customer) {
    return "Guest customer";
  }

  const name = [
    customer.firstname,
    customer.lastname,
    customer.firstName,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || customer.name || customer.email || "Customer";
};

const getAddressText = (order) => {
  const address =
    order?.deliveryAddress || order?.address || order?.shippingAddress;

  if (!address) {
    return "Address unavailable";
  }

  if (typeof address === "string") {
    return address;
  }

  return (
    [address.address, address.street, address.area, address.city, address.state]
      .filter(Boolean)
      .join(", ") || "Address unavailable"
  );
};

const formatCurrency = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "₦0";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
};

const getOrderTotal = (order) => {
  return order?.totalAmount ?? order?.total ?? order?.grandTotal ?? 0;
};

const getDriver = (delivery) => {
  return delivery?.driver || delivery?.offeredDriver || null;
};

const getDriverName = (driver) => {
  if (!driver) {
    return null;
  }

  const name = [
    driver.firstname,
    driver.lastname,
    driver.firstName,
    driver.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || driver.name || driver.email || "Driver";
};

// const getDeliveryStatus = (delivery) => {
//   return delivery?.status || "UNASSIGNED";
// };

const getDeliveryStatus = (delivery) => {
  return String(delivery?.status || "UNASSIGNED").toUpperCase();
};

const formatDeliveryStatus = (status) => {
  return (
    DELIVERY_STATUS_LABELS[status] ||
    String(status || "Unknown")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
};

function DriverSelect({ delivery, drivers, onAssign, isPending }) {
  const [driverId, setDriverId] = useState("");

  const deliveryStatus = getDeliveryStatus(delivery);

  const canAssign = deliveryStatus === "UNASSIGNED";

  const canReassign =
    deliveryStatus === "ASSIGNED" || deliveryStatus === "OFFERED";

  const canSelectDriver = canAssign || canReassign;

  if (!canSelectDriver) {
    const driver = getDriver(delivery);

    return (
      <div className="flex items-center gap-2 text-sm text-dark-600">
        <LuUserRound size={16} className="text-dark-400" />

        <span>{getDriverName(driver) || "No driver"}</span>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!driverId) {
      toast.error("Select a driver first.");
      return;
    }

    await onAssign(driverId);
    setDriverId("");
  };

  return (
    <div className="flex w-full min-w-0 items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <select
          value={driverId}
          onChange={(event) => setDriverId(event.target.value)}
          disabled={isPending}
          className="h-10 w-full appearance-none rounded-xl border border-dark-200 bg-white px-3 pr-9 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">Select available driver</option>

          {drivers.map((driver) => (
            <option
              key={driver._id || driver.id}
              value={driver._id || driver.id}
            >
              {getDriverName(driver)}
              {driver.vehicleType ? ` — ${driver.vehicleType}` : ""}
            </option>
          ))}
        </select>

        <LuChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dark-400"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || !driverId}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-500 px-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <LuLoaderCircle size={16} className="animate-spin" />
        ) : (
          <LuTruck size={16} />
        )}

        <span>{canAssign ? "Assign" : "Reassign"}</span>
      </button>
    </div>
  );
}

function DeliveryRow({ order, drivers }) {
  const orderId = getOrderId(order);

  const { data, isLoading, isError, refetch } = useStaffOrderDelivery(orderId);

  const createDelivery = useCreateStaffDelivery();

  const assignDelivery = useAssignStaffDelivery();

  const reassignDelivery = useReassignStaffDelivery();

  const delivery = useMemo(() => {
    if (!data) {
      return null;
    }

    if (data?.delivery) {
      return data.delivery;
    }

    return data;
  }, [data]);

  const deliveryStatus = getDeliveryStatus(delivery);

  const driver = getDriver(delivery);

  const deliveryId = delivery?._id || delivery?.id || delivery?.deliveryId;

  const isCreating = createDelivery.isPending;

  const isAssigning = assignDelivery.isPending || reassignDelivery.isPending;

  const handleCreateDelivery = async () => {
    try {
      await createDelivery.mutateAsync({
        orderId,
      });

      toast.success("Delivery created successfully.");

      await refetch();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to create delivery.",
      );
    }
  };

  const handleAssignDriver = async (driverId) => {
    try {
      if (!delivery?._id) {
        return;
      }

      if (deliveryStatus === "UNASSIGNED") {
        await assignDelivery.mutateAsync({
          deliveryId: delivery._id,
          driverId,
        });

        toast.success("Driver assigned successfully.");
      } else {
        await reassignDelivery.mutateAsync({
          deliveryId: delivery._id,
          driverId,
        });

        toast.success("Driver reassigned successfully.");
      }

      await refetch();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to assign driver.",
      );
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
      {/* Header */}
      <div className="border-b border-dark-100 px-5 py-4">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <LuPackage size={20} />
            </div>

            <div className="min-w-0">
              <Link
                to={`/staff/orders/${orderId}`}
                className="font-heading text-base font-bold text-dark-900 transition hover:text-primary-600"
              >
                {getOrderReference(order)}
              </Link>

              <p className="mt-1 truncate text-sm text-dark-500">
                {getCustomerName(order)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-dark-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-dark-500">
              {order?.status || "Unknown"}
            </span>

            {delivery && (
              <span
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  DELIVERY_STATUS_STYLES[deliveryStatus] ||
                    "bg-dark-50 text-dark-600",
                ].join(" ")}
              >
                {formatDeliveryStatus(deliveryStatus)}
              </span>
            )}

            {deliveryId && (
              <Link
                to={`/staff/deliveries/${deliveryId}`}
                className="inline-flex items-center justify-center rounded-xl border border-dark-200 bg-white px-3 py-2 text-xs font-semibold text-dark-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
              >
                View details
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main information */}
      <div className="grid divide-y divide-dark-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {/* Address */}
        <div className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-dark-400">
            Delivery address
          </p>

          <div className="mt-3 flex items-start gap-2.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
              <LuMapPin size={15} />
            </div>

            <p className="text-sm leading-6 text-dark-600">
              {getAddressText(order)}
            </p>
          </div>
        </div>

        {/* Total */}
        <div className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-dark-400">
            Order total
          </p>

          <p className="mt-3 font-heading text-xl font-bold text-dark-900">
            {formatCurrency(getOrderTotal(order))}
          </p>

          <Link
            to={`/staff/orders/${orderId}`}
            className="mt-2 inline-flex text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            View order details
          </Link>
        </div>

        {/* Driver */}
        <div className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-dark-400">
            Driver assignment
          </p>

          <div className="mt-3">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <LuLoaderCircle size={16} className="animate-spin" />
                Loading delivery...
              </div>
            ) : isError ? (
              <div>
                <div className="flex items-center gap-2 text-sm text-dark-500">
                  <LuCircleAlert size={15} className="text-dark-400" />
                  No delivery record
                </div>

                <button
                  type="button"
                  onClick={handleCreateDelivery}
                  disabled={isCreating}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-600 transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? (
                    <LuLoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <LuPackage size={14} />
                  )}
                  Create delivery
                </button>
              </div>
            ) : !delivery ? (
              <div>
                <div className="flex items-center gap-2 text-sm text-dark-500">
                  <LuPackage size={15} className="text-dark-400" />
                  No delivery record
                </div>

                <button
                  type="button"
                  onClick={handleCreateDelivery}
                  disabled={isCreating}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-600 transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? (
                    <LuLoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <LuPackage size={14} />
                  )}
                  Create delivery
                </button>
              </div>
            ) : driver ? (
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dark-50 text-dark-500">
                    <LuUserRound size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-dark-700">
                      {getDriverName(driver)}
                    </p>

                    {driver?.phone && (
                      <p className="mt-0.5 text-xs text-dark-400">
                        {driver.phone}
                      </p>
                    )}
                  </div>
                </div>

                {(deliveryStatus === "ASSIGNED" ||
                  deliveryStatus === "OFFERED") && (
                  <div className="mt-3">
                    <DriverSelect
                      delivery={delivery}
                      drivers={drivers}
                      onAssign={handleAssignDriver}
                      isPending={isAssigning}
                    />
                  </div>
                )}
              </div>
            ) : (
              <DriverSelect
                delivery={delivery}
                drivers={drivers}
                onAssign={handleAssignDriver}
                isPending={isAssigning}
              />
            )}
          </div>
        </div>
      </div>

      {/* Status footer */}
      {delivery && (
        <div className="border-t border-dark-100 bg-dark-50/60 px-5 py-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary-500 shadow-sm">
                <LuTruck size={16} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-dark-400">
                  Delivery status
                </p>

                <p className="mt-0.5 text-sm font-semibold text-dark-800">
                  {formatDeliveryStatus(deliveryStatus)}
                </p>
              </div>
            </div>

            {deliveryStatus === "DELIVERED" && (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <LuCheck size={16} />
                Delivery completed
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function DeliverySkeleton() {
  return (
    <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-dark-100" />

        <div className="flex-1">
          <div className="h-4 w-24 animate-pulse rounded bg-dark-100" />
          <div className="mt-2 h-3 w-40 animate-pulse rounded bg-dark-100" />
        </div>

        <div className="hidden h-8 w-24 animate-pulse rounded-xl bg-dark-100 sm:block" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <div className="h-3 w-24 animate-pulse rounded bg-dark-100" />
            <div className="mt-3 h-12 animate-pulse rounded-xl bg-dark-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffDeliveries() {
  const [showReadyOnly, setShowReadyOnly] = useState(false);

  // const { data, isLoading, isFetching, isError, refetch } = useStaffOrders();

  const { data, isLoading, isFetching, isError, refetch } = useStaffOrders({
    status: showReadyOnly ? "READY" : undefined,
  });
  const {
    data: driversData,
    isLoading: driversLoading,
    isFetching: driversFetching,
  } = useStaffDrivers();

  const orders = useMemo(() => {
    const deliveryOrders = getOrdersArray(data).filter((order) =>
      DELIVERY_ORDER_STATUSES.includes(order?.status),
    );

    if (showReadyOnly) {
      return deliveryOrders.filter((order) => order?.status === "READY");
    }

    return deliveryOrders;
  }, [data, showReadyOnly]);

  const allDeliveryOrders = useMemo(() => {
    return getOrdersArray(data).filter((order) =>
      DELIVERY_ORDER_STATUSES.includes(order?.status),
    );
  }, [data]);

  const drivers = useMemo(() => getDriversArray(driversData), [driversData]);

  const readyCount = allDeliveryOrders.filter(
    (order) => order?.status === "READY",
  ).length;

  const outForDeliveryCount = allDeliveryOrders.filter(
    (order) => order?.status === "OUT_FOR_DELIVERY",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-600">Operations</p>

          <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
            Deliveries
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-dark-500">
            Prepare orders for dispatch, assign available drivers, and monitor
            delivery progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 shadow-sm transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LuRefreshCw size={17} className={isFetching ? "animate-spin" : ""} />

          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-dark-500">
                Delivery queue
              </p>

              <p className="mt-2 font-heading text-3xl font-bold text-dark-900">
                {allDeliveryOrders.length}
              </p>

              <p className="mt-1 text-xs text-dark-400">
                Ready or out for delivery
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <LuPackage size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-dark-500">
                Ready for dispatch
              </p>

              <p className="mt-2 font-heading text-3xl font-bold text-dark-900">
                {readyCount}
              </p>

              <p className="mt-1 text-xs text-dark-400">
                Waiting for driver assignment
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <LuTruck size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-dark-500">
                Available drivers
              </p>

              <p className="mt-2 font-heading text-3xl font-bold text-dark-900">
                {drivers.length}
              </p>

              <p className="mt-1 text-xs text-dark-400">
                Available for assignment
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <LuUserRound size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Operational notice */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <LuCircleAlert size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-blue-900">
              Driver availability
            </p>

            <p className="mt-1 text-xs leading-relaxed text-blue-700">
              Drivers shown in the assignment selector are supplied by the Staff
              driver API. Use assignment or reassignment only when the delivery
              status allows it.
            </p>
          </div>
        </div>
      </div>

      {/* Queue heading */}
      <div className="flex flex-col gap-3 border-b border-dark-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-dark-900">
            Delivery queue
          </h2>

          <p className="mt-1 text-sm text-dark-500">
            Orders currently ready for dispatch or already out for delivery.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-dark-600">
          <input
            type="checkbox"
            checked={showReadyOnly}
            onChange={(event) => setShowReadyOnly(event.target.checked)}
            className="h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
          />
          Show ready orders only
          {showReadyOnly && (
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-600">
              {readyCount}
            </span>
          )}
        </label>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <DeliverySkeleton key={item} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
              <LuCircleAlert size={19} />
            </div>

            <div>
              <h3 className="font-heading text-sm font-bold text-red-900">
                Unable to load deliveries
              </h3>

              <p className="mt-1 text-sm leading-relaxed text-red-700">
                The staff order queue could not be retrieved. Please try again.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50"
              >
                <LuRefreshCw size={16} />
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && orders.length === 0 && (
        <div className="rounded-2xl border border-dark-100 bg-white px-6 py-16 text-center shadow-soft">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
            <LuTruck size={25} />
          </div>

          <h3 className="mt-4 font-heading text-lg font-bold text-dark-900">
            {showReadyOnly
              ? "No orders waiting for assignment"
              : "No delivery orders right now"}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-dark-500">
            {showReadyOnly
              ? "There are currently no ready orders waiting to be assigned to a driver."
              : "Orders will appear here when they reach the ready or out-for-delivery stage."}
          </p>

          {showReadyOnly && (
            <button
              type="button"
              onClick={() => setShowReadyOnly(false)}
              className="mt-5 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Show all deliveries
            </button>
          )}
        </div>
      )}

      {/* Delivery list */}
      {!isLoading && !isError && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <DeliveryRow
              key={getOrderId(order)}
              order={order}
              drivers={drivers}
            />
          ))}
        </div>
      )}

      {/* Driver refresh indicator */}
      {(driversLoading || driversFetching) && (
        <div className="flex items-center justify-center gap-2 text-xs text-dark-400">
          <LuLoaderCircle size={14} className="animate-spin" />
          Refreshing driver availability...
        </div>
      )}

      {/* Active delivery count */}
      {!isLoading && !isError && outForDeliveryCount > 0 && (
        <div className="rounded-xl border border-purple-100 bg-purple-50/60 px-4 py-3 text-center">
          <p className="text-xs font-medium text-purple-700">
            {outForDeliveryCount}{" "}
            {outForDeliveryCount === 1 ? "order is" : "orders are"} currently
            out for delivery.
          </p>
        </div>
      )}
    </div>
  );
}

export default StaffDeliveries;
