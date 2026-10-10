import React, { useEffect } from "react";
import { Loader2, Receipt } from "lucide-react";
import { toast } from "react-hot-toast";

import { useGroupOrderSummary } from "../../hooks/useGroupOrder";
import { useGroupOrderContext } from "../../context/GroupOrderContext";

function GroupOrderSummary() {
  const { groupOrderId, participantId, participantToken, groupOrder } =
    useGroupOrderContext();

  const summaryMutation = useGroupOrderSummary();

  useEffect(() => {
    if (!groupOrderId || !participantId || !participantToken) {
      return;
    }

    if (
      groupOrder?.deliveryMethod === "delivery" &&
      !groupOrder?.deliveryLocation
    ) {
      return;
    }

    summaryMutation.mutate({
      groupOrderId,
      participantData: {
        participantId,
        participantToken,
      },
    });
  }, [
    groupOrderId,
    participantId,
    participantToken,
    groupOrder?.deliveryMethod,
    groupOrder?.deliveryLocation,
  ]);

  useEffect(() => {
    if (summaryMutation.isError) {
      toast.error(
        summaryMutation.error?.response?.data?.message ||
          summaryMutation.error?.message ||
          "Unable to calculate group summary.",
      );
    }
  }, [summaryMutation.isError, summaryMutation.error]);

  const summary =
    summaryMutation.data?.data?.summary ||
    summaryMutation.data?.summary ||
    null;

  if (!summary && !summaryMutation.isPending) {
    return null;
  }

  return (
    <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
          <Receipt size={19} className="text-primary-600" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-dark-950">
            Group Summary
          </h2>

          <p className="mt-1 text-sm text-dark-500">
            Calculated from the current group order.
          </p>
        </div>
      </div>

      {summaryMutation.isPending ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={22} className="animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-500">Subtotal</span>

            <span className="font-bold text-dark-950">
              ₦{Number(summary?.subtotal || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-500">Discount</span>

            <span className="font-bold text-dark-950">
              ₦{Number(summary?.discount || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-500">Delivery Fee</span>

            <span className="font-bold text-dark-950">
              ₦{Number(summary?.deliveryFee || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-500">Tax</span>

            <span className="font-bold text-dark-950">
              ₦{Number(summary?.tax || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-500">Tip</span>

            <span className="font-bold text-dark-950">
              ₦{Number(summary?.tip || 0).toLocaleString()}
            </span>
          </div>

          <div className="border-t border-dark-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-dark-950">
                Total
              </span>

              <span className="text-xl font-extrabold text-primary-600">
                ₦{Number(summary?.total || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupOrderSummary;
