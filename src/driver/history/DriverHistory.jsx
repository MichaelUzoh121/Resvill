import React from "react";
import {
  LuCircleCheck,
  LuHistory,
  LuRefreshCw,
} from "react-icons/lu";

import DeliveryHistoryCard from "../components/DeliveryHistoryCard";
import useDriverHistory from "../hooks/useDriverHistory";

function DriverHistory() {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDriverHistory();

  const deliveries = Array.isArray(response?.data?.deliveries)
    ? response.data.deliveries
    : [];

  if (isLoading) {
    return (
      <div className="p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="animate-pulse space-y-3">
            <div className="h-3 w-36 rounded bg-dark-200" />
            <div className="h-8 w-48 rounded-lg bg-dark-200" />
            <div className="h-4 w-80 rounded bg-dark-100" />
          </div>

          <div className="h-28 animate-pulse rounded-2xl border border-dark-100 bg-white" />

          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-dark-100 bg-white"
              />
            ))}
          </div>
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
                <LuHistory className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="font-heading text-sm font-bold text-danger">
                  Unable to load delivery history
                </h1>

                <p className="mt-1 text-sm leading-6 text-dark-600">
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong while loading delivery history."}
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
                Delivery History
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-dark-500">
                Review your completed and failed deliveries.
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

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-[auto_1fr]">
          <div className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
              <LuCircleCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="font-heading text-xl font-bold text-dark-900">
                {deliveries.length}
              </p>

              <p className="text-xs font-semibold text-dark-500">
                {deliveries.length === 1
                  ? "Recorded delivery"
                  : "Recorded deliveries"}
              </p>
            </div>
          </div>

          <div className="flex items-center rounded-2xl border border-dark-100 bg-white px-5 py-4 shadow-soft">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-dark-400">
                Delivery records
              </p>

              <p className="mt-1 text-sm leading-6 text-dark-600">
                Your completed and failed delivery records are kept here for
                easy reference.
              </p>
            </div>
          </div>
        </section>

        {/* History */}
        {deliveries.length > 0 ? (
          <section>
            <div className="mb-4">
              <h2 className="font-heading text-base font-bold text-dark-900">
                Delivery Records
              </h2>

              <p className="mt-0.5 text-xs text-dark-500">
                Your previous delivery activity.
              </p>
            </div>

            <div className="space-y-4">
              {deliveries.map((delivery, index) => (
                <DeliveryHistoryCard
                  key={
                    delivery?._id ||
                    delivery?.id ||
                    delivery?.deliveryId ||
                    index
                  }
                  delivery={delivery}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-dark-200 bg-white px-5 py-14 text-center shadow-soft">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <LuHistory className="h-6 w-6" />
            </div>

            <h2 className="mt-4 font-heading text-base font-bold text-dark-900">
              No delivery history
            </h2>

            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-dark-500">
              Completed and failed deliveries will appear here once you have
              delivery activity.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-dark-100 bg-white px-4 py-2.5 text-xs font-bold text-dark-600 shadow-sm transition hover:bg-dark-50 hover:text-dark-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LuRefreshCw
                className={[
                  "h-3.5 w-3.5",
                  isFetching ? "animate-spin" : "",
                ].join(" ")}
              />
              Check again
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default DriverHistory;