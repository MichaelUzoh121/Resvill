import React, { useEffect, useState } from "react";
import {
  Check,
  CreditCard,
  Loader2,
  MapPin,
  ShoppingBag,
  Tag,
  Truck,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useGroupOrderContext } from "../../../context/GroupOrderContext";
import { useCheckoutGroupOrder } from "../../../hooks/useGroupOrder";

function formatNaira(value) {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}

function GroupCheckout() {
  const {
    groupOrder,
    participantId,
    participantToken,
    isHost,
  } = useGroupOrderContext();

  const checkoutMutation = useCheckoutGroupOrder();

  const [deliveryMethod, setDeliveryMethod] =
    useState("delivery");

  const [deliveryLocation, setDeliveryLocation] =
    useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");

  const [tip, setTip] = useState("0");
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (!groupOrder) return;

    if (
      groupOrder.deliveryMethod === "delivery" ||
      groupOrder.deliveryMethod === "pickup"
    ) {
      setDeliveryMethod(groupOrder.deliveryMethod);
    }

    setDeliveryLocation(
      groupOrder.deliveryLocation || "",
    );

    setAddress(
      groupOrder.deliveryAddress?.address || "",
    );

    setCity(
      groupOrder.deliveryAddress?.city || "",
    );

    setState(
      groupOrder.deliveryAddress?.state || "",
    );

    setPhone(
      groupOrder.deliveryAddress?.phone ||
        groupOrder.phone ||
        "",
    );

    setTip(String(Number(groupOrder.tip || 0)));

    setCouponCode(groupOrder.couponCode || "");
  }, [groupOrder]);

  if (!groupOrder || !isHost) {
    return null;
  }

  if (groupOrder.status !== "locked") {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedTip = Number(tip || 0);

    if (
      !Number.isFinite(normalizedTip) ||
      normalizedTip < 0
    ) {
      toast.error("Please enter a valid tip");
      return;
    }

    if (
      deliveryMethod !== "delivery" &&
      deliveryMethod !== "pickup"
    ) {
      toast.error("Please select a delivery method");
      return;
    }

    if (deliveryMethod === "delivery") {
      if (!deliveryLocation.trim()) {
        toast.error("Delivery location is required");
        return;
      }

      if (!address.trim()) {
        toast.error("Delivery address is required");
        return;
      }
    }

    try {
      await checkoutMutation.mutateAsync({
        groupOrderId: groupOrder._id,
        checkoutData: {
          participantId,
          participantToken,
          deliveryMethod,

          ...(deliveryMethod === "delivery"
            ? {
                deliveryLocation:
                  deliveryLocation.trim(),

                deliveryAddress: {
                  address: address.trim(),
                  ...(city.trim()
                    ? { city: city.trim() }
                    : {}),
                  ...(state.trim()
                    ? { state: state.trim() }
                    : {}),
                  ...(phone.trim()
                    ? { phone: phone.trim() }
                    : {}),
                },
              }
            : {
                deliveryLocation: null,
                deliveryAddress: null,
              }),

          tip: normalizedTip,
          couponCode: couponCode.trim(),
        },
      });

      toast.success(
        "Checkout details saved. Continue to payment.",
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to continue with checkout",
      );
    }
  };

  const isSubmitting = checkoutMutation.isPending;

  const inputClass =
    "w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-50 disabled:cursor-not-allowed disabled:bg-dark-50";

  const labelClass =
    "mb-2 block text-xs font-bold uppercase tracking-wide text-dark-600";

  return (
    <section className="overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-card">
      {/* Header */}
      <div className="border-b border-dark-100 bg-primary-50/50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white shadow-soft">
            <CreditCard size={20} />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-dark-900">
              Checkout
            </h2>

            <p className="mt-1 text-sm leading-6 text-dark-600">
              Complete the group order details before
              payment.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-7 p-5 sm:p-6"
      >
        {/* Order method */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="text-sm font-bold text-dark-900">
              Order method
            </label>

            <span className="text-xs font-medium text-dark-500">
              Choose how you want to receive it
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Delivery */}
            <button
              type="button"
              onClick={() =>
                setDeliveryMethod("delivery")
              }
              disabled={isSubmitting}
              className={`group relative rounded-2xl border p-4 text-left transition-all ${
                deliveryMethod === "delivery"
                  ? "border-primary-400 bg-primary-50 shadow-soft"
                  : "border-dark-200 bg-white hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    deliveryMethod === "delivery"
                      ? "bg-primary-500 text-white"
                      : "bg-dark-50 text-dark-600"
                  }`}
                >
                  <Truck size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-dark-900">
                    Delivery
                  </p>

                  <p className="mt-1 text-xs leading-5 text-dark-500">
                    Have the order delivered to your
                    location.
                  </p>
                </div>

                {deliveryMethod === "delivery" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                    <Check size={14} />
                  </div>
                )}
              </div>
            </button>

            {/* Pickup */}
            <button
              type="button"
              onClick={() =>
                setDeliveryMethod("pickup")
              }
              disabled={isSubmitting}
              className={`group relative rounded-2xl border p-4 text-left transition-all ${
                deliveryMethod === "pickup"
                  ? "border-primary-400 bg-primary-50 shadow-soft"
                  : "border-dark-200 bg-white hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    deliveryMethod === "pickup"
                      ? "bg-primary-500 text-white"
                      : "bg-dark-50 text-dark-600"
                  }`}
                >
                  <ShoppingBag size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-dark-900">
                    Pickup
                  </p>

                  <p className="mt-1 text-xs leading-5 text-dark-500">
                    Pick up the order yourself.
                  </p>
                </div>

                {deliveryMethod === "pickup" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                    <Check size={14} />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Delivery details */}
        {deliveryMethod === "delivery" && (
          <div className="rounded-2xl border border-dark-100 bg-dark-50/50 p-4 sm:p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                <MapPin size={18} />
              </div>

              <div>
                <h3 className="font-heading text-sm font-bold text-dark-900">
                  Delivery details
                </h3>

                <p className="mt-0.5 text-xs text-dark-500">
                  Tell us where the group order should be
                  delivered.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Location */}
              <div>
                <label
                  htmlFor="group-delivery-location"
                  className={labelClass}
                >
                  Delivery location
                </label>

                <input
                  id="group-delivery-location"
                  type="text"
                  value={deliveryLocation}
                  onChange={(event) =>
                    setDeliveryLocation(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Wuse 2"
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="group-delivery-address"
                  className={labelClass}
                >
                  Delivery address
                </label>

                <textarea
                  id="group-delivery-address"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  rows={3}
                  placeholder="Enter the full delivery address"
                  disabled={isSubmitting}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* City / State */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="group-delivery-city"
                    className={labelClass}
                  >
                    City
                  </label>

                  <input
                    id="group-delivery-city"
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(event.target.value)
                    }
                    disabled={isSubmitting}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="group-delivery-state"
                    className={labelClass}
                  >
                    State
                  </label>

                  <input
                    id="group-delivery-state"
                    type="text"
                    value={state}
                    onChange={(event) =>
                      setState(event.target.value)
                    }
                    disabled={isSubmitting}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="group-delivery-phone"
                  className={labelClass}
                >
                  Contact phone
                </label>

                <input
                  id="group-delivery-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Phone number for delivery"
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tip / Coupon */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="group-tip"
              className={labelClass}
            >
              Tip
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-500">
                ₦
              </span>

              <input
                id="group-tip"
                type="number"
                min="0"
                step="1"
                value={tip}
                onChange={(event) =>
                  setTip(event.target.value)
                }
                disabled={isSubmitting}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="group-coupon"
              className={labelClass}
            >
              Coupon code
            </label>

            <div className="relative">
              <Tag
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
              />

              <input
                id="group-coupon"
                type="text"
                value={couponCode}
                onChange={(event) =>
                  setCouponCode(event.target.value)
                }
                placeholder="Enter coupon code"
                disabled={isSubmitting}
                className={`${inputClass} pl-10 uppercase`}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-dark-100 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-soft"
          >
            {isSubmitting ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <CreditCard size={18} />
            )}

            {isSubmitting
              ? "Saving checkout..."
              : "Continue to payment"}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2">
            <CreditCard
              size={14}
              className="text-dark-400"
            />

            <p className="text-center text-xs font-medium text-dark-500">
              {formatNaira(groupOrder.total)} will be
              charged after the checkout details are
              accepted.
            </p>
          </div>
        </div>
      </form>
    </section>
  );
}

export default GroupCheckout;