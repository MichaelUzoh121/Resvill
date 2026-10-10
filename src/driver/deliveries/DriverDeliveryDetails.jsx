import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuRefreshCw,
  LuTruck,
} from "react-icons/lu";

import useDeliveryETA from "../hooks/useDeliveryETA";
import DeliveryETA from "../components/DeliveryETA";
import useDriverActiveDeliveries from "../hooks/useDriverActiveDeliveries";
import useDriverDeliveryActions from "../hooks/useDriverDeliveryActions";

import DeliveryActions from "../components/DeliveryActions";
import DeliveryStatus from "../components/DeliveryStatus";
import DeliveryTimeline from "../components/DeliveryTimeline";
import FailureModal from "../components/FailureModal";
import DeliveryLocation from "../components/DeliveryLocation";
import DeliveryInfo from "../components/DeliveryInfo";

import useDriverLocation from "../hooks/useDriverLocation";

function DriverDeliveryDetails() {
  const { deliveryId } = useParams();
  const navigate = useNavigate();

  const [showFailureModal, setShowFailureModal] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDriverActiveDeliveries();

  const { pickup, start, complete, fail, loadingAction } =
    useDriverDeliveryActions();

  const deliveries = Array.isArray(response?.data?.deliveries)
    ? response.data.deliveries
    : [];

  const delivery = deliveries.find((item) => {
    const itemId = item?._id || item?.id || item?.deliveryId;

    return String(itemId) === String(deliveryId);
  });

  const { data: etaResponse } = useDeliveryETA(
    delivery ? deliveryId : null
  );

  const status = delivery?.status || "";

  const normalizedStatus = String(status)
    .trim()
    .toUpperCase();

  useDriverLocation(
    deliveryId,
    normalizedStatus === "IN_TRANSIT"
  );

  const handleFailure = async (data) => {
    try {
      await fail(deliveryId, data);
      setShowFailureModal(false);
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
            <div className="h-4 w-44 rounded bg-dark-200" />
            <div className="h-8 w-56 rounded-lg bg-dark-200" />
            <div className="h-4 w-80 rounded bg-dark-100" />
          </div>

          <div className="h-36 animate-pulse rounded-2xl border border-dark-100 bg-white" />

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="h-40 animate-pulse rounded-2xl border border-dark-100 bg-white" />
            <div className="h-40 animate-pulse rounded-2xl border border-dark-100 bg-white" />
          </div>

          <div className="h-40 animate-pulse rounded-2xl border border-dark-100 bg-white" />
          <div className="h-52 animate-pulse rounded-2xl border border-dark-100 bg-white" />
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
                  Unable to load delivery
                </h1>

                <p className="mt-1 text-sm leading-6 text-dark-600">
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong while loading this delivery."}
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

  if (!delivery) {
    return (
      <div className="p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate("/driver/active")}
            className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-dark-500 transition hover:text-primary-600"
          >
            <LuArrowLeft className="h-4 w-4" />
            Back to active deliveries
          </button>

          <section className="rounded-2xl border border-dashed border-dark-200 bg-white px-5 py-14 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <LuTruck className="h-6 w-6" />
            </div>

            <h1 className="mt-4 font-heading text-lg font-bold text-dark-900">
              Delivery not found
            </h1>

            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-dark-500">
              This delivery may no longer be active or may have been
              completed.
            </p>

            <button
              type="button"
              onClick={() => navigate("/driver/active")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-primary-600"
            >
              View active deliveries
            </button>
          </section>
        </div>
      </div>
    );
  }

  const order = delivery?.order || {};

  const orderNumber = order?.orderNumber || "Order unavailable";

  const address =
    order?.deliveryAddress?.address ||
    order?.deliveryAddress?.formattedAddress ||
    order?.deliveryAddress?.street ||
    "Delivery address unavailable";

  const itemCount = Array.isArray(order?.items)
    ? order.items.length
    : Number(order?.itemCount) || 0;

  const customerPhone =
    order?.customer?.phone ||
    order?.deliveryAddress?.phone ||
    order?.phone ||
    null;

  const customerName =
    order?.customer?.name ||
    [order?.customer?.firstname, order?.customer?.lastname]
      .filter(Boolean)
      .join(" ") ||
    order?.deliveryAddress?.name ||
    "Customer unavailable";

  return (
    <div className="p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Back + Header */}
        <section>
          <button
            type="button"
            onClick={() => navigate("/driver/active")}
            className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-dark-500 transition hover:text-primary-600"
          >
            <LuArrowLeft className="h-4 w-4" />
            Back to active deliveries
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-dark-400">
                  Delivery Details
                </p>
              </div>

              <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
                {orderNumber}
              </h1>

              <p className="mt-1.5 text-sm text-dark-500">
                Review the delivery details and continue the delivery workflow.
              </p>
            </div>

            <div className="shrink-0">
              <DeliveryStatus status={normalizedStatus} />
            </div>
          </div>
        </section>

        {/* Delivery Overview */}
        <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuTruck className="h-6 w-6" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
                  Current Assignment
                </p>

                <h2 className="mt-1 font-heading text-base font-bold text-dark-900">
                  Delivery in progress
                </h2>
              </div>
            </div>
          </div>

          <div className="grid divide-y divide-dark-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-3 p-4 sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dark-50 text-dark-500">
                <LuPackage className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dark-400">
                  Items
                </p>

                <p className="mt-0.5 font-heading text-lg font-bold text-dark-900">
                  {itemCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dark-50 text-dark-500">
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
          </div>
        </section>

        {/* Customer + Destination */}
        <section className="grid gap-5 lg:grid-cols-2">
          <DeliveryInfo
            orderNumber={orderNumber}
            customerName={customerName}
            customerPhone={customerPhone}
          />

          <DeliveryLocation
            title="Delivery destination"
            address={address}
          />
        </section>

        {/* ETA */}
        <DeliveryETA eta={etaResponse} />

        {/* Customer Phone */}
        {customerPhone && (
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuPhone className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-400">
                  Customer Phone
                </p>

                <a
                  href={`tel:${customerPhone}`}
                  className="mt-1 block truncate text-sm font-bold text-dark-900 transition hover:text-primary-600"
                >
                  {customerPhone}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Timeline */}
        <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <LuTruck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-400">
                Delivery Progress
              </p>

              <h2 className="mt-1 font-heading text-base font-bold text-dark-900">
                Delivery timeline
              </h2>

              <p className="mt-0.5 text-sm text-dark-500">
                Current delivery lifecycle.
              </p>
            </div>
          </div>

          <DeliveryTimeline
            status={normalizedStatus}
            delivery={delivery}
          />
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
              Delivery actions
            </h2>

            <p className="mt-1 text-sm leading-6 text-dark-500">
              Update the delivery as you complete each stage.
            </p>
          </div>

          <DeliveryActions
            status={normalizedStatus}
            onPickup={() => pickup(deliveryId)}
            onStart={() => start(deliveryId)}
            onComplete={() => complete(deliveryId)}
            onFail={() => setShowFailureModal(true)}
            loadingAction={loadingAction}
          />
        </section>
      </div>

      <FailureModal
        isOpen={showFailureModal}
        onClose={() => setShowFailureModal(false)}
        onSubmit={handleFailure}
        loading={loadingAction === "fail"}
      />
    </div>
  );
}

export default DriverDeliveryDetails;