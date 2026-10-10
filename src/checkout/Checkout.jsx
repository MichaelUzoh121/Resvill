import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

import { useCart } from "../context/CartContext";
import { normalizeLocation } from "../utils/address";
import { useCurrentRestaurant } from "../hooks/useRestaurant";
import { createOrder, previewOrderPrice } from "../services/orderService";
import { useInitializePayment } from "../hooks/usePayments";
import ScheduleOrderSelector from "./ScheduleOrderSelector";
import { buildScheduledDateTime } from "../utils/date";
import { checkoutSchema } from "../validators/checkout";
import { useLoyalty } from "../hooks/useLoyalty";

import CustomerInformation from "./CustomerInformation";
import DeliveryAddressSection from "./DeliveryAddressSection";
import PaymentSection from "./PaymentSection";
import OrderSummary from "./OrderSummary";
import LoyaltyPointsSection from "./LoyaltyPointsSection";

const savedProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("resvill_profile_v1") || "{}");
  } catch {
    return {};
  }
};

const getGuestDetails = (fullName, email, phone) => {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

  const firstname = nameParts.shift() || "";
  const lastname = nameParts.join(" ") || firstname;

  return {
    firstname,
    lastname,
    email: email.trim(),
    phone: phone.trim(),
  };
};

function Checkout() {
  const { items } = useCart();

  const { user } = useAuth();

  const { pointsBalance, pointValue, loyaltyLoading, loyaltyError } =
    useLoyalty({
      page: 1,
      limit: 1,
      enabled: Boolean(user),
    });

  const profile = useMemo(() => savedProfile(), []);

  const {
    data: restaurantResponse,
    isLoading: restaurantLoading,
    isError: restaurantError,
  } = useCurrentRestaurant();

  const restaurant = restaurantResponse;

  const initializePayment = useInitializePayment();

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  const [orderTiming, setOrderTiming] = useState("now");

  const [scheduledDate, setScheduledDate] = useState("");

  const [scheduledTime, setScheduledTime] = useState("");

  const [form, setForm] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    deliveryLocation: normalizeLocation(
      profile.deliveryAddress || profile.address,
    ),
    instructions: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  const [couponCode, setCouponCode] = useState("");
  const [tip, setTip] = useState(0);

  const [pricePreview, setPricePreview] = useState(null);
  const [pricePreviewLoading, setPricePreviewLoading] = useState(false);
  const [pricePreviewError, setPricePreviewError] = useState("");

  const maxLoyaltyPoints = Math.max(0, Math.floor(Number(pointsBalance) || 0));

  // if (!items.length) {
  //   return <Navigate to="/cart" replace />;
  // }

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const loadPricePreview = async () => {
    if (!restaurant?._id || !items.length) {
      return;
    }

    if (
      deliveryMethod === "delivery" &&
      !form.deliveryLocation?.addressText?.trim()
    ) {
      setPricePreview(null);
      return;
    }

    const orderItems = items.map((item) => ({
      food: item.foodId,
      quantity: Number(item.quantity) || 1,

      customizations: Array.isArray(item.customizations)
        ? item.customizations.map((customization) => ({
            name: customization.name,
            option: customization.option,
            price: Number(customization.price || 0),
          }))
        : [],

      addOns: Array.isArray(item.addOns)
        ? item.addOns.map((addOn) => ({
            name: addOn.name,
            price: Number(addOn.price || 0),
          }))
        : [],

      notes: item.notes || "",
    }));

    const selectedLoyaltyPoints = user
      ? Math.floor(Number(loyaltyPoints) || 0)
      : 0;

    const previewData = {
      restaurant: restaurant._id,
      items: orderItems,
      deliveryMethod,
      couponCode: couponCode.trim(),
      loyaltyPoints: selectedLoyaltyPoints,
      tip: Number(tip) || 0,
    };

    if (deliveryMethod === "delivery") {
      previewData.deliveryLocation = form.deliveryLocation.addressText;

      if (user && form.deliveryAddressId) {
        previewData.addressId = form.deliveryAddressId;
      } else {
        previewData.deliveryAddress = {
          fullName: form.name.trim(),
          phone: form.phone.trim(),
          address: form.deliveryLocation.addressText.trim(),
          city: form.deliveryLocation.city || "",
          state: form.deliveryLocation.state || "",
          landmark: form.deliveryLocation.landmark || "",
          instructions: form.instructions.trim() || "",
          coordinates: form.deliveryLocation.coordinates
            ? {
                latitude: Number(form.deliveryLocation.coordinates.latitude),
                longitude: Number(form.deliveryLocation.coordinates.longitude),
              }
            : undefined,
        };
      }
    }

    try {
      setPricePreviewLoading(true);
      setPricePreviewError("");

      const response = await previewOrderPrice(previewData);

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to calculate order total.",
        );
      }

      setPricePreview(response.data);
    } catch (error) {
      setPricePreview(null);
      setPricePreviewError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to calculate order total.",
      );
    } finally {
      setPricePreviewLoading(false);
    }
  };

  useEffect(() => {
    if (!restaurant?._id || !items.length) {
      return;
    }

    if (
      deliveryMethod === "delivery" &&
      !form.deliveryLocation?.addressText?.trim()
    ) {
      setPricePreview(null);
      return;
    }

    const timer = setTimeout(() => {
      loadPricePreview();
    }, 400);

    return () => clearTimeout(timer);
  }, [
    restaurant?._id,
    items,
    deliveryMethod,
    form.deliveryLocation?.addressText,
    form.deliveryLocation?.city,
    form.deliveryLocation?.state,
    form.deliveryLocation?.landmark,
    form.deliveryLocation?.coordinates?.latitude,
    form.deliveryLocation?.coordinates?.longitude,
    form.deliveryAddressId,
    couponCode,
    loyaltyPoints,
    tip,
  ]);

  if (!items.length) {
    return <Navigate to="/cart" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!restaurant?._id) {
      toast.error("Resvill is currently unavailable. Please try again.");
      return;
    }

    const validationResult = checkoutSchema.safeParse({
      ...form,
      deliveryMethod,
    });

    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0].message);

      return;
    }

    if (
      deliveryMethod === "delivery" &&
      !form.deliveryLocation?.addressText?.trim()
    ) {
      toast.error("Please enter your delivery address.");
      return;
    }

    const scheduledForDate =
      orderTiming === "scheduled"
        ? buildScheduledDateTime(scheduledDate, scheduledTime)
        : null;

    if (orderTiming === "scheduled" && !scheduledForDate) {
      toast.error("Please select a valid scheduled date and time.");

      return;
    }

    const selectedLoyaltyPoints = Math.floor(Number(loyaltyPoints) || 0);

    if (selectedLoyaltyPoints < 0 || selectedLoyaltyPoints > maxLoyaltyPoints) {
      toast.error("Please enter a valid number of loyalty points.");

      return;
    }

    if (scheduledForDate && scheduledForDate <= new Date()) {
      toast.error("Your scheduled order time must be in the future.");

      return;
    }

    const scheduledFor = scheduledForDate?.toISOString() || null;

    if (orderTiming === "scheduled" && !scheduledFor) {
      return;
    }

    const orderItems = items.map((item) => ({
      food: item.foodId,

      quantity: Number(item.quantity) || 1,

      customizations: Array.isArray(item.customizations)
        ? item.customizations.map((customization) => ({
            name: customization.name,
            option: customization.option,
            price: Number(customization.price || 0),
          }))
        : [],

      addOns: Array.isArray(item.addOns)
        ? item.addOns.map((addOn) => ({
            name: addOn.name,
            price: Number(addOn.price || 0),
          }))
        : [],

      notes: item.notes || "",
    }));

    // const orderData = {
    //   restaurant: restaurant._id,
    //   items: orderItems,
    //   deliveryMethod,
    //   paymentMethod: "card",
    //   loyaltyPoints: user ? selectedLoyaltyPoints : 0,
    //   customerNotes: form.instructions.trim() || undefined,

    //   ...(user && deliveryMethod === "delivery" && form.deliveryAddressId
    //     ? { addressId: form.deliveryAddressId }
    //     : {}),
    // };

    const orderData = {
      restaurant: restaurant._id,
      items: orderItems,
      deliveryMethod,
      paymentMethod: "card",
      loyaltyPoints: user ? selectedLoyaltyPoints : 0,
      couponCode: couponCode.trim() || undefined,
      tip: Number(tip) || 0,
      customerNotes: form.instructions.trim() || undefined,

      ...(user && deliveryMethod === "delivery" && form.deliveryAddressId
        ? { addressId: form.deliveryAddressId }
        : {}),
    };

    /*
    |--------------------------------------------------------------------------
    | Guest checkout
    |--------------------------------------------------------------------------
    |
    | The backend determines whether the request
    | belongs to a registered customer from the
    | HTTP-only authentication cookie.
    |
    | If there is no authenticated customer,
    | guestDetails are used.
    |
    */

    // orderData.guestDetails = getGuestDetails(form.name, form.email, form.phone);

    if (!user) {
      orderData.guestDetails = getGuestDetails(
        form.name,
        form.email,
        form.phone,
      );
    }

    if (deliveryMethod === "delivery") {
      orderData.deliveryLocation = form.deliveryLocation.addressText;

      orderData.deliveryAddress = {
        fullName: form.name.trim(),
        phone: form.phone.trim(),
        address: form.deliveryLocation.addressText.trim(),
        city: form.deliveryLocation.city || "",
        state: form.deliveryLocation.state || "",
        landmark: form.deliveryLocation.landmark || "",
        instructions: form.instructions.trim() || "",

        coordinates: form.deliveryLocation.coordinates
          ? {
              latitude: Number(form.deliveryLocation.coordinates.latitude),
              longitude: Number(form.deliveryLocation.coordinates.longitude),
            }
          : undefined,
      };
    }

    if (scheduledFor) {
      orderData.scheduledFor = scheduledFor;
    }

    try {
      setIsSubmitting(true);

      /*
      |--------------------------------------------------------------------------
      | 1. CREATE ORDER
      |--------------------------------------------------------------------------
      */

      const orderResponse = await createOrder(orderData);

      if (!orderResponse?.success) {
        throw new Error(
          orderResponse?.message || "Unable to create your order.",
        );
      }

      const order = orderResponse.data;

      if (!order) {
        throw new Error(
          "Order was created but no order details were returned.",
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Save customer information locally
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "resvill_profile_v1",
        JSON.stringify({
          ...profile,

          name: form.name,

          email: form.email,

          phone: form.phone,

          deliveryAddress: form.deliveryLocation,

          address: form.deliveryLocation?.addressText || "",
        }),
      );

      /*
      |--------------------------------------------------------------------------
      | 2. INITIALIZE PAYSTACK
      |--------------------------------------------------------------------------
      |
      | Registered customers:
      |   orderId
      |
      | Guest customers:
      |   orderNumber + trackingToken
      |
      */

      const paymentResponse = await initializePayment.mutateAsync(
        order.customerType === "guest"
          ? {
              orderNumber: order.orderNumber,

              trackingToken: order.trackingToken,
            }
          : {
              orderId: order._id,
            },
      );

      if (!paymentResponse?.success) {
        throw new Error(
          paymentResponse?.message || "Unable to initialize payment.",
        );
      }

      const payment = paymentResponse.data;

      if (!payment?.authorizationUrl) {
        throw new Error("Paystack authorization URL was not returned.");
      }

      /*
      |--------------------------------------------------------------------------
      | 3. Redirect to Paystack
      |--------------------------------------------------------------------------
      */

      toast.success("Order created. Redirecting to payment...");

      sessionStorage.setItem(
        "resvill_pending_payment_v1",
        JSON.stringify({
          orderId: order._id,
          orderNumber: order.orderNumber,
          trackingToken: order.trackingToken,
          customerType: order.customerType,
        }),
      );

      window.location.href = payment.authorizationUrl;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to continue to payment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkoutUnavailable = restaurantLoading || restaurantError;

  return (
    <main className="bg-dark-50/50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-widest text-primary-500">
          Secure checkout
        </p>

        <h1 className="mt-2 font-heading text-3xl font-extrabold text-dark-950">
          Complete your order
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <form onSubmit={submit} className="space-y-6">
            <CustomerInformation
              form={form}
              update={update}
              deliveryMethod={deliveryMethod}
              setDeliveryMethod={setDeliveryMethod}
              disabled={isSubmitting}
            />

            <DeliveryAddressSection
              deliveryMethod={deliveryMethod}
              form={form}
              setForm={setForm}
              update={update}
              disabled={isSubmitting}
            />

            <ScheduleOrderSelector
              orderTiming={orderTiming}
              setOrderTiming={setOrderTiming}
              scheduledDate={scheduledDate}
              setScheduledDate={setScheduledDate}
              scheduledTime={scheduledTime}
              setScheduledTime={setScheduledTime}
              disabled={isSubmitting}
            />

            {user && (
              <LoyaltyPointsSection
                pointsBalance={pointsBalance}
                pointValue={pointValue}
                loyaltyPoints={loyaltyPoints}
                setLoyaltyPoints={setLoyaltyPoints}
                loading={loyaltyLoading}
                error={loyaltyError}
                disabled={isSubmitting}
              />
            )}

            <PaymentSection
              checkoutUnavailable={checkoutUnavailable}
              restaurantLoading={restaurantLoading}
              isSubmitting={isSubmitting}
              paymentLoading={initializePayment.isPending}
              disabled={
                isSubmitting ||
                restaurantLoading ||
                restaurantError ||
                !restaurant?._id ||
                initializePayment.isPending
              }
            />
          </form>

          <OrderSummary
            items={items}
            orderTiming={orderTiming}
            scheduledDate={scheduledDate}
            scheduledTime={scheduledTime}
            deliveryMethod={deliveryMethod}
            pricePreview={pricePreview}
            pricePreviewLoading={pricePreviewLoading}
            pricePreviewError={pricePreviewError}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            tip={tip}
            setTip={setTip}
          />
        </div>
      </div>
    </main>
  );
}

export default Checkout;
