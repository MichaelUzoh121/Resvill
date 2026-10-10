import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { useVerifyPayment } from "../hooks/usePayments";
import { ROUTES } from "../constants/routes";

function PaymentCallback() {
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");

  const navigate = useNavigate();

  const pendingPayment = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("resvill_pending_payment_v1") || "null",
      );
    } catch {
      return null;
    }
  })();

  const verifyPayment = useVerifyPayment();

  const hasVerified = useRef(false);

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Please wait while we confirm your payment.",
  );

  useEffect(() => {
    if (!reference || hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verify = async () => {
      try {
        // const response = await verifyPayment.mutateAsync({
        //   reference,
        // });

        const response = await verifyPayment.mutateAsync({
          reference,

          ...(pendingPayment?.orderNumber
            ? {
                orderNumber: pendingPayment.orderNumber,
              }
            : {}),

          ...(pendingPayment?.trackingToken
            ? {
                trackingToken: pendingPayment.trackingToken,
              }
            : {}),
        });

        const payment = response?.data?.payment || response?.payment;

        const paymentStatus =
          payment?.status || response?.data?.status || response?.status;

        // if (paymentStatus === "success" || paymentStatus === "paid") {
        //   setStatus("success");

        //   setMessage(
        //     "Your payment was successful and your order has been confirmed.",
        //   );

        //   return;
        // }

        if (paymentStatus === "success" || paymentStatus === "paid") {
          sessionStorage.removeItem("resvill_pending_payment_v1");

          const isGuest = pendingPayment?.customerType === "guest";

          if (
            isGuest &&
            pendingPayment?.orderNumber &&
            pendingPayment?.trackingToken
          ) {
            navigate(
              `/account/order-confirmation/${encodeURIComponent(
                pendingPayment.orderNumber,
              )}?token=${encodeURIComponent(pendingPayment.trackingToken)}`,
              {
                replace: true,
              },
            );

            return;
          }

          if (pendingPayment?.orderId) {
            navigate(
              `/account/order-confirmation/${encodeURIComponent(
                pendingPayment.orderId,
              )}`,
              {
                replace: true,
              },
            );

            return;
          }

          setStatus("success");

          setMessage(
            "Your payment was successful and your order has been confirmed.",
          );

          return;
        }

        if (paymentStatus === "failed") {
          setStatus("failed");

          setMessage("Your payment was not successful. Please try again.");

          return;
        }

        setStatus("pending");

        setMessage(
          "Your payment is still being confirmed. Please check your order shortly.",
        );
      } catch (error) {
        console.error("Payment verification failed:", error);

        setStatus("failed");

        setMessage(
          error?.response?.data?.message ||
            error?.message ||
            "We could not confirm your payment.",
        );
      }
    };

    verify();
}, [reference, verifyPayment, navigate]);

  if (!reference) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <XCircle className="mx-auto mb-5 h-16 w-16 text-red-500" />

          <h1 className="text-2xl font-semibold">Invalid Payment</h1>

          <p className="mt-3 text-gray-500">
            We could not find a payment reference for this transaction.
          </p>

          <Link
            to={ROUTES.MENU}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white"
          >
            Back to Menu
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Loader2 className="mx-auto mb-5 animate-spin" size={64} />

          <h1 className="text-2xl font-semibold">Confirming Payment</h1>

          <p className="mt-3 text-gray-500">{message}</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle2 className="mx-auto mb-5 text-green-500" size={72} />

          <h1 className="text-3xl font-bold">Payment Successful</h1>

          <p className="mt-3 text-gray-500">{message}</p>

          <p className="mt-4 text-sm text-gray-400 break-all">
            Reference: {reference}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to={ROUTES.ORDERS}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-white"
            >
              View My Orders
              <ArrowRight size={18} />
            </Link>

            <Link
              to={ROUTES.MENU}
              className="inline-flex items-center justify-center rounded-lg border px-5 py-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Loader2 className="mx-auto mb-5" size={64} />

          <h1 className="text-2xl font-semibold">Payment Processing</h1>

          <p className="mt-3 text-gray-500">{message}</p>

          <p className="mt-4 text-sm text-gray-400 break-all">
            Reference: {reference}
          </p>

          <Link
            to={ROUTES.ORDERS}
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white"
          >
            View My Orders
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <XCircle className="mx-auto mb-5 text-red-500" size={72} />

        <h1 className="text-3xl font-bold">Payment Failed</h1>

        <p className="mt-3 text-gray-500">{message}</p>

        <p className="mt-4 text-sm text-gray-400 break-all">
          Reference: {reference}
        </p>

        <Link
          to={ROUTES.MENU}
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white"
        >
          Back to Menu
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default PaymentCallback;
