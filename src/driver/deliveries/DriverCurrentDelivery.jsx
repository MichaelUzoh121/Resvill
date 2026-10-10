import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuTruck, LuRefreshCw, LuMapPin, LuPackage } from "react-icons/lu";

import FailureModal from "../components/FailureModal";
import DeliveryActions from "../components/DeliveryActions";
import DeliveryETA from "../components/DeliveryETA";
import DeliveryInfo from "../components/DeliveryInfo";
import DeliveryLocation from "../components/DeliveryLocation";
import DeliveryStatus from "../components/DeliveryStatus";
import DeliveryTimeline from "../components/DeliveryTimeline";

import useDeliveryETA from "../hooks/useDeliveryETA";
import useDriverCurrentDelivery from "../hooks/useDriverCurrentDelivery";
import useDriverDeliveryActions from "../hooks/useDriverDeliveryActions";
import useDriverLocation from "../hooks/useDriverLocation";

function DriverCurrentDelivery() {
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDriverCurrentDelivery();

  const { accept, decline, pickup, start, complete, fail, loadingAction } =
    useDriverDeliveryActions();

  const [failureModalOpen, setFailureModalOpen] = useState(false);

  const delivery = response?.data?.delivery ?? null;

  const deliveryId =
    delivery?._id || delivery?.id || delivery?.deliveryId || null;

  const status = delivery?.status || delivery?.deliveryStatus || "";

  const order = delivery?.order || {};

  const orderNumber = order?.orderNumber || "Order unavailable";

  const customerName =
    order?.customer?.name ||
    [order?.customer?.firstname, order?.customer?.lastname]
      .filter(Boolean)
      .join(" ") ||
    order?.deliveryAddress?.fullName ||
    "Customer unavailable";

  const customerPhone =
    order?.customer?.phone ||
    order?.deliveryAddress?.phone ||
    order?.phone ||
    null;

  const address =
    order?.deliveryAddress?.address ||
    order?.deliveryAddress?.formattedAddress ||
    order?.deliveryAddress?.street ||
    "Delivery address unavailable";

  const itemCount = Array.isArray(order?.items)
    ? order.items.length
    : Number(order?.itemCount) || 0;

  // const { data: etaResponse } = useDeliveryETA(delivery ? deliveryId : null);

  const normalizedStatus = String(status || "")
    .trim()
    .toUpperCase();

  const { data: etaResponse } = useDeliveryETA(
    delivery && normalizedStatus === "IN_TRANSIT" ? deliveryId : null,
  );

  useDriverLocation(deliveryId, normalizedStatus === "IN_TRANSIT");

  const handleFail = () => {
    setFailureModalOpen(true);
  };

  const handleFailureSubmit = async (data) => {
    try {
      await fail(deliveryId, data);
      setFailureModalOpen(false);
      navigate("/driver/history");
    } catch {
      // Error feedback is handled by useDriverDeliveryActions.
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="animate-pulse space-y-3">
            <div className="h-3 w-36 rounded bg-dark-200" />
            <div className="h-8 w-56 rounded-lg bg-dark-200" />
            <div className="h-4 w-80 rounded bg-dark-100" />
          </div>

          <div className="h-36 animate-pulse rounded-2xl border border-dark-100 bg-white" />

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="h-40 animate-pulse rounded-2xl border border-dark-100 bg-white" />
            <div className="h-40 animate-pulse rounded-2xl border border-dark-100 bg-white" />
          </div>

          <div className="h-32 animate-pulse rounded-2xl border border-dark-100 bg-white" />
          <div className="h-44 animate-pulse rounded-2xl border border-dark-100 bg-white" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                <LuTruck className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="font-heading text-sm font-bold text-danger">
                  Unable to load current delivery
                </h1>

                <p className="mt-1 text-sm leading-6 text-dark-600">
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong while loading your current delivery."}
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LuRefreshCw
                    className={[
                      "h-3.5 w-3.5",
                      isFetching ? "animate-spin" : "",
                    ].join(" ")}
                  />
                  {isFetching ? "Retrying..." : "Try again"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Page Header */}
        <section>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dark-400">
                  Delivery Operations
                </p>
              </div>

              <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
                Current Delivery
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-dark-500">
                Manage the delivery you are currently handling and update each
                stage as you progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-dark-100 bg-white px-4 py-2.5 text-xs font-bold text-dark-600 shadow-sm transition hover:bg-dark-50 hover:text-dark-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LuRefreshCw
                className={[
                  "h-3.5 w-3.5",
                  isFetching ? "animate-spin" : "",
                ].join(" ")}
              />
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </section>

        {delivery ? (
          <>
            {/* Delivery Overview */}
            <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
              <div className="border-b border-dark-100 p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <LuTruck className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
                        Active Delivery
                      </p>

                      <h2 className="mt-1 truncate font-heading text-lg font-bold text-dark-900">
                        {orderNumber}
                      </h2>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <DeliveryStatus status={normalizedStatus} />
                  </div>
                </div>
              </div>

              <div className="grid divide-y divide-dark-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="flex items-center gap-3 p-4 sm:p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-dark-50 text-dark-500">
                    <LuPackage className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
                      Items
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-dark-900">
                      {itemCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 sm:p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-dark-50 text-dark-500">
                    <LuMapPin className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
                      Destination
                    </p>
                    <p className="mt-0.5 truncate text-sm font-bold text-dark-900">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 sm:p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-dark-50 text-dark-500">
                    <LuTruck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
                      Status
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-dark-900">
                      {normalizedStatus
                        ? normalizedStatus.replace(/_/g, " ")
                        : "Unavailable"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer + Location */}
            <section className="grid gap-5 lg:grid-cols-2">
              <DeliveryInfo
                orderNumber={orderNumber}
                customerName={customerName}
                customerPhone={customerPhone}
              />

              {/* <DeliveryLocation
                title="Delivery destination"
                address={address}
              /> */}
              <DeliveryLocation delivery={delivery} />
            </section>

            {/* Delivery Summary + ETA */}
            <section className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
                      Delivery Summary
                    </p>
                  </div>

                  <h2 className="mt-1.5 font-heading text-base font-bold text-dark-900">
                    Order information
                  </h2>

                  <p className="mt-1 text-sm text-dark-500">
                    Important information about this delivery.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-dark-100 bg-dark-50 p-4">
                    <p className="text-xs font-semibold text-dark-500">Items</p>

                    <p className="mt-1 font-heading text-xl font-bold text-dark-900">
                      {itemCount}
                    </p>
                  </div>

                  <div className="rounded-xl border border-dark-100 bg-dark-50 p-4">
                    <p className="text-xs font-semibold text-dark-500">
                      Customer Phone
                    </p>

                    <p className="mt-1 break-words text-sm font-bold text-dark-900">
                      {customerPhone || "Unavailable"}
                    </p>
                  </div>
                </div>
              </div>

              <DeliveryETA eta={etaResponse} />
            </section>

            {/* Timeline */}
            <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
                    Delivery Progress
                  </p>
                </div>

                <h2 className="mt-1.5 font-heading text-base font-bold text-dark-900">
                  Delivery Timeline
                </h2>

                <p className="mt-1 text-sm text-dark-500">
                  Track the progress of the current delivery.
                </p>
              </div>

              <DeliveryTimeline status={normalizedStatus} delivery={delivery} />
            </section>

            {/* Actions */}
            <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
                    Delivery Workflow
                  </p>
                </div>

                <h2 className="mt-1.5 font-heading text-base font-bold text-dark-900">
                  Delivery Actions
                </h2>

                <p className="mt-1 text-sm leading-6 text-dark-500">
                  Update the delivery as you complete each stage.
                </p>
              </div>

              <DeliveryActions
                status={status}
                onAccept={() => accept(deliveryId)}
                onDecline={() => decline(deliveryId)}
                onPickup={() => pickup(deliveryId)}
                onStart={() => start(deliveryId)}
                onComplete={() => complete(deliveryId)}
                onFail={handleFail}
                loadingAction={loadingAction}
              />
            </section>
          </>
        ) : (
          <section className="rounded-2xl border border-dashed border-dark-200 bg-white px-5 py-14 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <LuTruck className="h-6 w-6" />
            </div>

            <h2 className="mt-4 font-heading text-base font-bold text-dark-900">
              No current delivery
            </h2>

            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-dark-500">
              Your current delivery will appear here when you have one.
            </p>

            <button
              type="button"
              onClick={() => navigate("/driver/offers")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-primary-600"
            >
              View delivery offers
            </button>
          </section>
        )}
      </div>

      <FailureModal
        isOpen={failureModalOpen}
        onClose={() => setFailureModalOpen(false)}
        onSubmit={handleFailureSubmit}
        loading={loadingAction === "fail"}
      />
    </div>
  );
}

export default DriverCurrentDelivery;
