import React, { useState } from "react";
import {
  LuTriangleAlert,
  LuLoaderCircle,
  LuX,
} from "react-icons/lu";

function FailureModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [reason, setReason] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      return;
    }

    await onSubmit({
      failureReason: trimmedReason,
    });

    setReason("");
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setReason("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-dark-950/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="failure-modal-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-dark-100 px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/5 text-danger">
              <LuTriangleAlert className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2
                id="failure-modal-title"
                className="font-heading text-base font-bold tracking-tight text-dark-900 sm:text-lg"
              >
                Report Failed Delivery
              </h2>

              <p className="mt-1 text-sm leading-5 text-dark-500">
                Tell us why this delivery could not be completed.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-dark-400 transition-colors duration-200 hover:bg-dark-50 hover:text-dark-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <label
            htmlFor="failureReason"
            className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-dark-600"
          >
            Failure reason
          </label>

          <textarea
            id="failureReason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. Customer was unavailable at the delivery address"
            rows={5}
            disabled={loading}
            className="w-full resize-none rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm leading-6 text-dark-900 outline-none transition-all duration-200 placeholder:text-dark-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-50 disabled:cursor-not-allowed disabled:bg-dark-50"
          />

          <p className="mt-2 text-xs text-dark-400">
            Provide a clear reason so the delivery record can be updated accurately.
          </p>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl border border-dark-100 bg-white px-4 py-3 text-sm font-bold text-dark-700 shadow-sm transition-all duration-200 hover:bg-dark-50 hover:text-dark-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <LuLoaderCircle className="h-[18px] w-[18px] animate-spin" />
              )}

              <span>
                {loading
                  ? "Submitting..."
                  : "Report Failed Delivery"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FailureModal;