import { Coins, Loader2, Sparkles } from "lucide-react";

function LoyaltyPointsSection({
  pointsBalance,
  pointValue,
  loyaltyPoints,
  setLoyaltyPoints,
  loading = false,
  error = null,
  disabled = false,
}) {
  const availablePoints = Math.max(
    0,
    Math.floor(Number(pointsBalance) || 0),
  );

  const valuePerPoint = Number(pointValue) || 0;

  const selectedPoints = Math.min(
    Math.max(0, Number(loyaltyPoints) || 0),
    availablePoints,
  );

  const discountValue = selectedPoints * valuePerPoint;

  const handleChange = (event) => {
    const value = Math.floor(Number(event.target.value) || 0);

    setLoyaltyPoints(
      Math.min(Math.max(value, 0), availablePoints),
    );
  };

  const handleUseAll = () => {
    setLoyaltyPoints(availablePoints);
  };

  const handleClear = () => {
    setLoyaltyPoints(0);
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
            <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-dark-950">
              Loyalty Points
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              Loading your available points...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dark-100">
            <Coins className="h-5 w-5 text-dark-500" />
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-dark-950">
              Loyalty Points
            </h2>

            <p className="mt-1 text-sm leading-6 text-dark-500">
              Your loyalty balance is temporarily unavailable. You can
              continue checkout without using loyalty points.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (availablePoints <= 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/15">
            <Coins className="h-5 w-5 text-accent-600" />
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-dark-950">
              Use Loyalty Points
            </h2>

            <p className="mt-1 text-sm text-dark-500">
              You have{" "}
              <span className="font-semibold text-dark-900">
                {availablePoints.toLocaleString()}
              </span>{" "}
              points available.
            </p>
          </div>
        </div>

        <Sparkles className="h-5 w-5 shrink-0 text-accent-500" />
      </div>

      <div className="mt-5 rounded-xl bg-dark-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="loyaltyPoints"
            className="text-sm font-semibold text-dark-900"
          >
            Points to use
          </label>

          <span className="text-xs font-medium text-dark-500">
            1 point = ₦{valuePerPoint.toLocaleString()}
          </span>
        </div>

        <div className="mt-3 flex gap-3">
          <input
            id="loyaltyPoints"
            name="loyaltyPoints"
            type="number"
            min="0"
            max={availablePoints}
            step="1"
            value={selectedPoints}
            onChange={handleChange}
            disabled={disabled}
            className="min-w-0 flex-1 rounded-lg border border-dark-300 bg-white px-3 py-2.5 text-sm font-semibold text-dark-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-100"
          />

          <button
            type="button"
            onClick={handleUseAll}
            disabled={disabled || selectedPoints === availablePoints}
            className="rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Use All
          </button>
        </div>

        {selectedPoints > 0 && (
          <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-success/20 bg-success/5 px-3 py-2.5">
            <div>
              <p className="text-xs font-medium text-dark-500">
                Loyalty discount
              </p>

              <p className="mt-0.5 text-sm font-bold text-success">
                ₦{discountValue.toLocaleString()}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="text-xs font-semibold text-dark-500 transition hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}

        <p className="mt-3 text-xs leading-5 text-dark-500">
          Your selected points will be validated by Resvill when the order is
          created. The final discount and order total are calculated by the
          backend.
        </p>
      </div>
    </section>
  );
}

export default LoyaltyPointsSection;