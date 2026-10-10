import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

function PaymentSection({
  checkoutUnavailable,
  restaurantLoading,
  isSubmitting,
  paymentLoading,
  disabled,
}) {
  return (
    <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <ShieldCheck size={21} />
        </div>

        <div>
          <h2 className="font-heading text-xl font-bold text-dark-950">
            Secure payment
          </h2>

          <p className="text-sm text-dark-500">
            Your order will be created securely before you are redirected to
            Paystack.
          </p>
        </div>
      </div>

      {checkoutUnavailable && (
        <div className="mt-5 rounded-xl bg-dark-50 p-4 text-sm text-dark-600">
          {restaurantLoading
            ? "Checking Resvill availability..."
            : "Resvill is currently unavailable. Please try again later."}
        </div>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 font-bold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting || paymentLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />

            {paymentLoading ? "Connecting to Paystack..." : "Creating order..."}
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            Continue to payment
          </>
        )}
      </button>
    </section>
  );
}

export default PaymentSection;
