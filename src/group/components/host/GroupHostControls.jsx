import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  CreditCard,
  Crown,
  Loader2,
  Lock,
  Unlock,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useGroupOrderContext } from "../../../context/GroupOrderContext";

import {
  useCancelGroupOrder,
  useCheckoutGroupOrder,
  useLockGroupOrder,
} from "../../../hooks/useGroupOrder";

function GroupHostControls() {
  const {
    groupOrder,
    participantId,
    participantToken,
    isHost,
    canManageGroup,
    canCheckout,
    transferHost,
    isTransferringHost,
  } = useGroupOrderContext();

  const lockMutation = useLockGroupOrder();
  const cancelMutation = useCancelGroupOrder();
  const checkoutMutation = useCheckoutGroupOrder();

  const [selectedParticipantId, setSelectedParticipantId] = useState("");

  if (!groupOrder || !isHost) {
    return null;
  }

  const status = groupOrder.status;

  const handleLock = async () => {
    try {
      await lockMutation.mutateAsync({
        groupOrderId: groupOrder._id,
        participantData: {
          participantId,
          participantToken,
        },
      });

      toast.success("Group order locked");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to lock the group order",
      );
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this group order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelMutation.mutateAsync({
        groupOrderId: groupOrder._id,
        participantData: {
          participantId,
          participantToken,
        },
      });

      toast.success("Group order cancelled");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to cancel the group order",
      );
    }
  };

  const handleCheckout = async () => {
    toast("Complete the checkout details below.", {
      icon: "🛒",
    });
  };

  const isLocking = lockMutation.isPending;
  const isCancelling = cancelMutation.isPending;
  const isCheckingOut = checkoutMutation.isPending;

  const isBusy = isLocking || isCancelling || isCheckingOut;

  return (
    <section className="rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            status === "locked"
              ? "bg-accent-400/15 text-accent-600"
              : "bg-primary-50 text-primary-500"
          }`}
        >
          {status === "locked" ? <Lock size={20} /> : <Unlock size={20} />}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-dark-900">Host controls</h2>

            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-600">
              Host
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 text-dark-600">
            Manage the group order and control when it moves to checkout.
          </p>
        </div>
      </div>


      <div className="rounded-2xl border border-dark-100 bg-white p-5 mt-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Crown size={18} />
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold text-dark-900">
              Transfer host
            </h3>

            <p className="mt-1 text-sm leading-6 text-dark-500">
              Give another participant control of this group order.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="new-group-host"
            className="mb-2 block text-sm font-semibold text-dark-700"
          >
            New host
          </label>

          <select
            id="new-group-host"
            value={selectedParticipantId}
            onChange={(event) => setSelectedParticipantId(event.target.value)}
            disabled={isTransferringHost}
            className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3 text-sm text-dark-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select a participant</option>

            {groupOrder?.participants
              ?.filter((participant) => !participant.isHost)
              .map((participant) => (
                <option key={participant._id} value={participant._id}>
                  {participant.name}
                </option>
              ))}
          </select>
        </div>

        <button
          type="button"
          disabled={!selectedParticipantId || isTransferringHost}
          onClick={async () => {
            if (!selectedParticipantId) {
              toast.error("Select a participant first.");
              return;
            }

            try {
              await transferHost(selectedParticipantId);
              setSelectedParticipantId("");
            } catch {
              // Mutation handles the API error toast.
            }
          }}
          className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowRightLeft size={16} />

          {isTransferringHost ? "Transferring..." : "Transfer host"}
        </button>
      </div>

      {/* Open */}
      {status === "open" && (
        <div className="mt-5 rounded-2xl border border-accent-400/25 bg-accent-400/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-400/15 text-accent-600">
              <AlertTriangle size={18} />
            </div>

            <div>
              <h3 className="font-heading text-sm font-bold text-dark-900">
                Ready to lock?
              </h3>

              <p className="mt-1 text-sm leading-6 text-dark-600">
                Locking prevents participants from adding or changing items.
                Make sure everyone has finished selecting their food first.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleLock}
              disabled={!canManageGroup || isBusy}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-soft"
            >
              {isLocking ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Lock size={17} />
              )}
              Lock group order
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isBusy}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-danger/20 bg-white px-5 text-sm font-bold text-danger transition-all hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCancelling ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <XCircle size={17} />
              )}
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Locked */}
      {status === "locked" && (
        <div className="mt-5 rounded-2xl border border-success/20 bg-success/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <h3 className="font-heading text-sm font-bold text-dark-900">
                Group order locked
              </h3>

              <p className="mt-1 text-sm leading-6 text-dark-600">
                Everyone's items are now locked. Continue below to provide the
                delivery or pickup details and proceed to payment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={!canCheckout || isBusy}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-soft"
          >
            {isCheckingOut ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <CreditCard size={17} />
            )}
            Continue to checkout
          </button>

          <p className="mt-3 text-center text-xs font-medium text-dark-500">
            Checkout details are handled in the checkout section below.
          </p>
        </div>
      )}

      {/* Payment Pending */}
      {status === "payment_pending" && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-info/20 bg-info/5 p-4">
          <CreditCard size={18} className="mt-0.5 shrink-0 text-info" />

          <p className="text-sm leading-6 text-dark-600">
            Checkout has been submitted. Complete the payment step below.
          </p>
        </div>
      )}

      {/* Final states */}
      {(status === "cancelled" ||
        status === "expired" ||
        status === "converted") && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-dark-200 bg-dark-50 p-4">
          <Lock size={18} className="mt-0.5 shrink-0 text-dark-500" />

          <p className="text-sm leading-6 text-dark-600">
            No further host actions are available for this group order.
          </p>
        </div>
      )}
    </section>
  );
}

export default GroupHostControls;
