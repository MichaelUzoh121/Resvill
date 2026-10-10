import React, { useEffect, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useGroupOrderContext,
} from "../../../context/GroupOrderContext";

import { useGroupOrderSummary } from "../../../hooks/useGroupOrder";

function formatNaira(value) {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}

function getSummaryData(response) {
  return (
    response?.data?.summary ||
    response?.summary ||
    response?.data ||
    null
  );
}

function GroupOrderSummary() {
  const {
    groupOrder,
    participantId,
    participantToken,
  } = useGroupOrderContext();

  const summaryMutation = useGroupOrderSummary();

  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!groupOrder) {
      setSummary(null);
      return;
    }

    if (groupOrder.summary) {
      setSummary(groupOrder.summary);
    }
  }, [groupOrder]);

  if (!groupOrder) {
    return null;
  }

  const canCalculate =
    groupOrder.status === "open" ||
    groupOrder.status === "locked";

  const handleRefreshSummary = async () => {
    try {
      const response =
        await summaryMutation.mutateAsync({
          groupOrderId: groupOrder._id,
          participantData: {
            participantId,
            participantToken,
          },
        });

      const nextSummary = getSummaryData(response);

      if (nextSummary) {
        setSummary(nextSummary);
      }

      toast.success("Order summary updated");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to calculate order summary",
      );
    }
  };

  const activeSummary =
    summary ||
    groupOrder.summary ||
    null;

  const subtotal = Number(
    activeSummary?.subtotal ??
      groupOrder.subtotal ??
      0,
  );

  const discount = Number(
    activeSummary?.discount ??
      groupOrder.discount ??
      0,
  );

  const deliveryFee = Number(
    activeSummary?.deliveryFee ??
      groupOrder.deliveryFee ??
      0,
  );

  const tax = Number(
    activeSummary?.tax ??
      groupOrder.tax ??
      0,
  );

  const tip = Number(
    activeSummary?.tip ??
      groupOrder.tip ??
      0,
  );

  const total = Number(
    activeSummary?.total ??
      groupOrder.total ??
      0,
  );

  const hasSummary =
    Boolean(activeSummary) ||
    subtotal > 0 ||
    total > 0;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-100/60 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
              <Calculator
                size={22}
                strokeWidth={2.2}
              />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">
                Breakdown
              </span>

              <h2 className="mt-1 font-heading text-xl font-bold text-dark-900 sm:text-2xl">
                Order summary
              </h2>

              <p className="mt-1 text-sm text-dark-600">
                Totals calculated from the group order.
              </p>
            </div>
          </div>

          {canCalculate && (
            <button
              type="button"
              onClick={handleRefreshSummary}
              disabled={summaryMutation.isPending}
              className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl border border-dark-200 bg-white px-4 text-sm font-bold text-dark-600 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {summaryMutation.isPending ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw size={16} />
              )}

              <span>Refresh</span>
            </button>
          )}
        </div>

        {!hasSummary ? (
          <div className="mt-6 rounded-2xl border border-dashed border-dark-200 bg-dark-50/50 px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-400">
              <Calculator size={25} />
            </div>

            <h3 className="mt-4 font-heading text-base font-bold text-dark-800">
              No totals yet
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-dark-500">
              Add items to the group order, then refresh
              the summary to calculate the current totals.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-dark-100 bg-dark-50/40">
            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-dark-500">
                  Subtotal
                </span>

                <span className="font-semibold text-dark-800">
                  {formatNaira(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-dark-500">
                    Discount
                  </span>

                  <span className="font-semibold text-success">
                    -{formatNaira(discount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-dark-500">
                  Delivery fee
                </span>

                <span className="font-semibold text-dark-800">
                  {formatNaira(deliveryFee)}
                </span>
              </div>

              {tax > 0 && (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-dark-500">
                    Tax
                  </span>

                  <span className="font-semibold text-dark-800">
                    {formatNaira(tax)}
                  </span>
                </div>
              )}

              {tip > 0 && (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-dark-500">
                    Tip
                  </span>

                  <span className="font-semibold text-dark-800">
                    {formatNaira(tip)}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-dark-100 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-dark-400">
                    Total
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-success"
                    />

                    <span className="text-xs font-medium text-dark-500">
                      Current group total
                    </span>
                  </div>
                </div>

                <span className="font-heading text-2xl font-extrabold text-primary-500 sm:text-3xl">
                  {formatNaira(total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default GroupOrderSummary;