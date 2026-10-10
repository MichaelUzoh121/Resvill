import React from "react";
import { LuCheck, LuCircle } from "react-icons/lu";

const STEPS = [
  {
    status: "OFFERED",
    label: "Offered",
  },
  {
    status: "ACCEPTED",
    label: "Accepted",
  },
  {
    status: "PICKED_UP",
    label: "Picked Up",
  },
  {
    status: "IN_TRANSIT",
    label: "In Transit",
  },
  {
    status: "DELIVERED",
    label: "Delivered",
  },
];

const getStepIndex = (status) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toUpperCase();

  return STEPS.findIndex((step) => step.status === normalizedStatus);
};

function formatTimestamp(timestamp) {
  if (!timestamp) return null;

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function findHistoryEvent(history, status) {
  if (!Array.isArray(history)) return null;

  const normalizedStatus = String(status || "")
    .trim()
    .toUpperCase();

  return history.find(
    (event) =>
      String(event?.status || "")
        .trim()
        .toUpperCase() === normalizedStatus,
  );
}

function DeliveryTimeline({ status, delivery }) {
  const normalizedStatus = String(status || delivery?.status || "")
    .trim()
    .toUpperCase();

  const currentIndex = getStepIndex(normalizedStatus);

  const isFailed = normalizedStatus === "FAILED";
  const isDeclined = normalizedStatus === "DECLINED";

  const history = delivery?.history || [];

  return (
    <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-dark-400">
          Delivery Journey
        </p>

        <h2 className="mt-1 font-heading text-base font-bold tracking-tight text-dark-900">
          Delivery Progress
        </h2>

        <p className="mt-1 text-sm leading-6 text-dark-500">
          Track the current stage of this delivery.
        </p>
      </div>

      <div>
        {STEPS.map((step, index) => {
          const completed =
            !isFailed && !isDeclined && currentIndex >= index;

          const current =
            !isFailed && !isDeclined && currentIndex === index;

          const historyEvent = findHistoryEvent(history, step.status);

          const timestamp = formatTimestamp(historyEvent?.changedAt);

          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.status} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
                    completed
                      ? "border-primary-500 bg-primary-500 text-white shadow-sm"
                      : "border-dark-200 bg-white text-dark-400",
                    current && "ring-4 ring-primary-50",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {completed ? (
                    <LuCheck className="h-4 w-4" />
                  ) : (
                    <LuCircle className="h-3.5 w-3.5" />
                  )}
                </div>

                {!isLast && (
                  <div
                    className={[
                      "min-h-11 w-0.5 transition-colors duration-200",
                      currentIndex > index
                        ? "bg-primary-400"
                        : "bg-dark-200",
                    ].join(" ")}
                  />
                )}
              </div>

              <div className={isLast ? "pb-1" : "pb-7"}>
                <p
                  className={[
                    "text-sm font-bold",
                    current
                      ? "text-primary-600"
                      : completed
                        ? "text-dark-900"
                        : "text-dark-400",
                  ].join(" ")}
                >
                  {step.label}
                </p>

                {timestamp && (
                  <p className="mt-1 text-xs font-medium text-dark-500">
                    {timestamp}
                  </p>
                )}

                {historyEvent?.note && (
                  <p className="mt-1.5 max-w-xl text-xs leading-5 text-dark-500">
                    {historyEvent.note}
                  </p>
                )}

                {current && !timestamp && (
                  <p className="mt-1 text-xs font-medium text-dark-500">
                    Current delivery stage
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isFailed && (
        <div className="mt-5 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3.5">
          <p className="text-sm font-bold text-danger">
            Delivery Failed
          </p>

          {delivery?.failureReason && (
            <p className="mt-1 text-xs leading-5 text-danger/80">
              {delivery.failureReason}
            </p>
          )}
        </div>
      )}

      {isDeclined && (
        <div className="mt-5 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3.5">
          <p className="text-sm font-bold text-danger">
            Delivery Declined
          </p>

          <p className="mt-1 text-xs leading-5 text-danger/80">
            This delivery is no longer progressing through the normal delivery
            flow.
          </p>
        </div>
      )}
    </section>
  );
}

export default DeliveryTimeline;