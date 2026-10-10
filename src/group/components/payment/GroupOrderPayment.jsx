import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useGroupOrderContext } from "../../../context/GroupOrderContext";

import { initializePayment } from "../../../services/paymentService";

function formatNaira(value) {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}

function getPaymentData(response) {
  return response?.data || response?.payment || response || null;
}

function GroupOrderPayment() {
  const { groupOrder, currentParticipant, isHost } = useGroupOrderContext();

  const [paymentState, setPaymentState] = useState("idle");

  const [paymentData, setPaymentData] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!groupOrder) return;

    if (groupOrder.status === "converted") {
      setPaymentState("success");
    }
  }, [groupOrder]);

  if (!groupOrder || !isHost) {
    return null;
  }

  if (
    groupOrder.status !== "payment_pending" &&
    groupOrder.status !== "converted"
  ) {
    return null;
  }

  const handlePayment = async () => {
    if (!currentParticipant) {
      toast.error("Unable to identify the group host");
      return;
    }

    setPaymentState("processing");
    setErrorMessage("");

    try {
      // const response = await initializePayment({
      //   amount: Number(groupOrder.total || 0),
      //   email:
      //     currentParticipant.email ||
      //     groupOrder.email ||
      //     "",
      //   // orderId:
      //   //   groupOrder.order?._id ||
      //   //   groupOrder.orderId ||
      //   //   groupOrder._id,
      //   // orderId: checkoutResult?.order?._id

      //   orderId: groupOrder.order?._id || groupOrder.order,
      // });

      const response = await initializePayment({
        amount: Number(groupOrder.total || 0),
        email: currentParticipant.email || groupOrder.email || "",
        orderId: groupOrder.order?._id || groupOrder.order,
        orderNumber: groupOrder.order?.orderNumber,
        trackingToken: groupOrder.trackingToken,
      });

      const data = getPaymentData(response);

      setPaymentData(data);

      const authorizationUrl =
        data?.authorization_url || data?.authorizationUrl || data?.url;

      if (!authorizationUrl) {
        throw new Error("Payment authorization URL was not returned.");
      }

      window.location.href = authorizationUrl;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to initialize payment";

      setErrorMessage(message);
      setPaymentState("error");

      toast.error(message);
    }
  };

  const isProcessing = paymentState === "processing";

  if (groupOrder.status === "converted") {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6 lg:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-success/10 blur-3xl" />

        <div className="relative rounded-3xl border border-success/20 bg-success/5 px-5 py-10 text-center sm:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success">
            <CheckCircle2 size={32} strokeWidth={2.2} />
          </div>

          <span className="mt-5 inline-flex rounded-full bg-success/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-success">
            Payment complete
          </span>

          <h2 className="mt-3 font-heading text-xl font-bold text-dark-900 sm:text-2xl">
            Payment completed
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-dark-600">
            This group order has been converted into a regular order
            successfully.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-100/60 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
              <CreditCard size={22} strokeWidth={2.2} />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">
                Secure checkout
              </span>

              <h2 className="mt-1 font-heading text-xl font-bold text-dark-900 sm:text-2xl">
                Payment
              </h2>

              <p className="mt-1 text-sm text-dark-600">
                Complete payment for the group order.
              </p>
            </div>
          </div>

          <div className="w-fit rounded-full bg-accent-400/10 px-3 py-1.5 text-xs font-bold text-dark-700">
            Host payment
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-dark-100 bg-dark-50/40">
          <div className="border-b border-dark-100 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-dark-400">
                  Amount to pay
                </p>

                <p className="mt-1 font-heading text-2xl font-extrabold text-dark-900 sm:text-3xl">
                  {formatNaira(groupOrder.total)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                <CreditCard size={21} />
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex items-start gap-3 rounded-2xl border border-primary-100 bg-primary-50/70 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-500 shadow-soft">
                <ShieldCheck size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-dark-800">
                  Secure payment
                </p>

                <p className="mt-1 text-xs leading-5 text-dark-600">
                  You'll be redirected to the secure Paystack checkout to
                  complete your payment.
                </p>
              </div>
            </div>

            {paymentState === "error" && (
              <div className="flex items-start gap-3 rounded-2xl border border-danger/20 bg-danger/5 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                  <XCircle size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-dark-800">
                    Payment could not be started
                  </p>

                  <p className="mt-1 text-sm leading-5 text-danger">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Redirecting to payment...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Pay {formatNaira(groupOrder.total)}
                </>
              )}
            </button>

            <p className="text-center text-xs leading-5 text-dark-400">
              Your payment will be securely processed through Paystack.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GroupOrderPayment;
