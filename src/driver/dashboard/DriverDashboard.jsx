import React from "react";
import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuCircleCheck,
  LuCircleX,
  LuClock3,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuTruck,
} from "react-icons/lu";

import useDriverDashboard from "../hooks/useDriverDashboard";
import DriverStatCard from "../components/DriverStatCard";
import DriverStatusToggle from "../components/DriverStatusToggle";

import {
  useDriverAvailability,
  useDriverOnline,
  useDriverOffline,
} from "../hooks/useDriverAvailability";

function formatNaira(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₦0";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getId(value) {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value._id || value.id || "";
}

function getCustomerName(order = {}) {
  const customer = order.user || order.customer || order.customerId;

  if (typeof customer === "string") {
    return customer;
  }

  return (
    customer?.name ||
    `${customer?.firstname || customer?.firstName || ""} ${
      customer?.lastname || customer?.lastName || ""
    }`.trim() ||
    "Customer"
  );
}

function getOrderReference(order = {}) {
  const reference =
    order.orderNumber || order.orderCode || order.reference || order.orderId;

  if (reference) {
    return String(reference);
  }

  const id = getId(order);

  return id ? `#${id.slice(-6).toUpperCase()}` : "Order";
}

function getDeliveryStatus(delivery = {}) {
  return (
    delivery.status ||
    delivery.deliveryStatus ||
    delivery.currentStatus ||
    "ASSIGNED"
  );
}

function getDeliveryAddress(delivery = {}) {
  const order = delivery.order || delivery.orderId || {};
  const address =
    delivery.address ||
    delivery.deliveryAddress ||
    order.deliveryAddress ||
    order.address;

  if (!address) {
    return "Delivery address unavailable";
  }

  if (typeof address === "string") {
    return address;
  }

  return (
    address.fullAddress ||
    address.address ||
    address.street ||
    [
      address.houseNumber,
      address.street,
      address.area,
      address.city,
      address.state,
    ]
      .filter(Boolean)
      .join(", ") ||
    "Delivery address unavailable"
  );
}

function getCustomerPhone(delivery = {}) {
  const order = delivery.order || delivery.orderId || {};
  const customer =
    delivery.customer || order.user || order.customer || order.customerId;

  if (typeof customer === "string") {
    return order?.deliveryAddress?.phone || "";
  }

  return (
    delivery.phone ||
    delivery.customerPhone ||
    order?.deliveryAddress?.phone ||
    customer?.phone ||
    customer?.phoneNumber ||
    ""
  );
}

function getDeliveryTotal(delivery = {}) {
  const order = delivery.order || delivery.orderId || {};

  return (
    delivery.total ??
    delivery.totalAmount ??
    delivery.grandTotal ??
    order.total ??
    order.totalAmount ??
    order.grandTotal ??
    0
  );
}

function formatStatus(status) {
  return String(status || "ASSIGNED")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusStyles(status) {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "DELIVERED") {
    return "bg-success/10 text-success";
  }

  if (normalized === "FAILED" || normalized === "CANCELLED") {
    return "bg-danger/10 text-danger";
  }

  if (
    normalized === "PICKED_UP" ||
    normalized === "IN_TRANSIT" ||
    normalized === "OUT_FOR_DELIVERY"
  ) {
    return "bg-primary-50 text-primary-600";
  }

  return "bg-accent-400/10 text-accent-600";
}

function DriverDashboard() {
  const { data: response, isLoading, isError, error } = useDriverDashboard();

  const { data: availabilityResponse, isLoading: availabilityLoading } =
    useDriverAvailability();

  const onlineMutation = useDriverOnline();
  const offlineMutation = useDriverOffline();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="animate-pulse space-y-3">
            <div className="h-3 w-32 rounded bg-dark-200" />
            <div className="h-8 w-64 rounded-lg bg-dark-200" />
            <div className="h-4 w-80 rounded bg-dark-100" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-dark-100 bg-white"
              />
            ))}
          </div>

          <div className="h-72 animate-pulse rounded-2xl border border-dark-100 bg-white" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                <LuCircleX className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-heading text-sm font-bold text-danger">
                  Unable to load dashboard
                </h2>

                <p className="mt-1 text-sm text-dark-600">
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong while loading your dashboard."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dashboard = response?.data || {};

  const offersCount = Number(dashboard.offersCount) || 0;
  const activeCount = Number(dashboard.activeCount) || 0;
  const deliveredCount = Number(dashboard.deliveredCount) || 0;
  const failedCount = Number(dashboard.failedCount) || 0;

  const currentDelivery = dashboard.currentDelivery;

  const availability = availabilityResponse?.data || {};
  const isOnline = Boolean(availability.isOnline);

  const delivery =
    currentDelivery?.delivery || currentDelivery?.data || currentDelivery || {};

  const relatedOrder =
    delivery?.order || delivery?.orderId || currentDelivery?.order || {};

  const deliveryStatus = getDeliveryStatus(delivery);
  const orderId = getId(relatedOrder);
  const customerName = getCustomerName(relatedOrder);
  const customerPhone = getCustomerPhone(delivery);
  const address = getDeliveryAddress(delivery);
  const total = getDeliveryTotal(delivery);
  const orderReference = getOrderReference(relatedOrder);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dark-400">
                  Driver Dashboard
                </p>
              </div>

              <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
                Your delivery workspace
              </h1>

              <p className="mt-1.5 max-w-2xl text-sm text-dark-500">
                Manage your availability, assignments, and delivery activity
                from one place.
              </p>
            </div>

            <div
              className={[
                "inline-flex w-fit items-center gap-2 rounded-xl border px-3 py-2",
                isOnline
                  ? "border-success/20 bg-success/5 text-success"
                  : "border-dark-100 bg-white text-dark-500",
              ].join(" ")}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  isOnline ? "bg-success" : "bg-dark-300",
                ].join(" ")}
              />

              <span className="text-xs font-bold">
                {isOnline ? "Available for deliveries" : "Currently offline"}
              </span>
            </div>
          </div>
        </section>

        {/* Availability */}
        <DriverStatusToggle
          isOnline={isOnline}
          disabled={
            availabilityLoading ||
            onlineMutation.isPending ||
            offlineMutation.isPending
          }
          onToggle={() => {
            if (
              availabilityLoading ||
              onlineMutation.isPending ||
              offlineMutation.isPending
            ) {
              return;
            }

            if (isOnline) {
              offlineMutation.mutate();
            } else {
              onlineMutation.mutate();
            }
          }}
        />

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DriverStatCard
            label="Delivery Offers"
            value={offersCount}
            icon={LuPackage}
          />

          <DriverStatCard
            label="Active Deliveries"
            value={activeCount}
            icon={LuTruck}
          />

          <DriverStatCard
            label="Delivered"
            value={deliveredCount}
            icon={LuCircleCheck}
          />

          <DriverStatCard label="Failed" value={failedCount} icon={LuCircleX} />
        </div>

        {/* Current Delivery */}
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="flex flex-col justify-between gap-3 border-b border-dark-100 p-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <LuTruck className="h-[18px] w-[18px]" />
                </div>

                <div>
                  <h2 className="font-heading text-base font-bold text-dark-900">
                    Current Delivery
                  </h2>

                  <p className="text-xs text-dark-500">
                    Your active delivery assignment
                  </p>
                </div>
              </div>
            </div>

            {currentDelivery && (
              <span
                className={[
                  "w-fit rounded-full px-3 py-1.5 text-[11px] font-bold",
                  getStatusStyles(deliveryStatus),
                ].join(" ")}
              >
                {formatStatus(deliveryStatus)}
              </span>
            )}
          </div>

          {currentDelivery ? (
            <div className="p-5 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                {/* Delivery information */}
                <div className="rounded-2xl border border-dark-100 bg-dark-50/70 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
                        Order
                      </p>

                      <h3 className="mt-1 font-heading text-xl font-bold text-dark-900">
                        {orderReference}
                      </h3>

                      <p className="mt-1 text-sm text-dark-500">
                        {customerName}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-400">
                        Order total
                      </p>

                      <p className="mt-1 font-heading text-base font-bold text-dark-900">
                        {formatNaira(total)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-dark-100 bg-white p-4">
                      <div className="flex items-center gap-2 text-dark-400">
                        <LuMapPin className="h-4 w-4" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                          Drop-off
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-medium leading-6 text-dark-700">
                        {address}
                      </p>
                    </div>

                    <div className="rounded-xl border border-dark-100 bg-white p-4">
                      <div className="flex items-center gap-2 text-dark-400">
                        <LuClock3 className="h-4 w-4" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
                          Delivery status
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-dark-800">
                        {formatStatus(deliveryStatus)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="rounded-2xl border border-dark-100 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
                    Quick Actions
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {orderId && (
                      <Link
                        to={`/driver/current`}
                        className="flex items-center justify-between rounded-xl bg-primary-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
                      >
                        <span>View delivery</span>
                        <LuArrowRight className="h-4 w-4" />
                      </Link>
                    )}

                    {customerPhone ? (
                      <a
                        href={`tel:${customerPhone}`}
                        className="flex items-center justify-between rounded-xl border border-dark-100 bg-white px-4 py-3 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
                      >
                        <span>Call customer</span>
                        <LuPhone className="h-4 w-4 text-dark-400" />
                      </a>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl border border-dark-100 bg-dark-50 px-4 py-3 text-sm font-medium text-dark-400">
                        <span>Customer phone unavailable</span>
                        <LuPhone className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6">
              <div className="rounded-2xl border border-dashed border-dark-200 bg-dark-50/60 px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm">
                  <LuTruck className="h-6 w-6" />
                </div>

                <h3 className="mt-4 font-heading text-sm font-bold text-dark-900">
                  No active delivery
                </h3>

                <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-dark-500">
                  Your current delivery will appear here when an assignment is
                  available.
                </p>

                <Link
                  to="/driver/offers"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-primary-600"
                >
                  View delivery offers
                  <LuArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DriverDashboard;
