import React, { useEffect, useState } from "react";
import AddressAutocomplete from "../../components/AddressAutocomplete";
import { normalizeLocation } from "../../utils/address";
import {
  LuArrowLeft,
  LuCheck,
  LuPlus,
  LuSearch,
  LuShoppingBag,
  LuTrash2,
  LuUserRound,
  LuX,
  LuMapPin,
} from "react-icons/lu";
import { Link } from "react-router-dom";
import { buildScheduledDateTime } from "../../utils/date";

import toast from "react-hot-toast";

import { useFoods } from "../../hooks/useFoods";
import {
  createStaffOrder,
  previewStaffOrderPrice,
} from "../services/staffService";

function StaffCreateOrder() {
  const [customer, setCustomer] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
  });

  const [createAccount, setCreateAccount] = useState(false);
  const [emailOrderDetails, setEmailOrderDetails] = useState(false);

  const [customerErrors, setCustomerErrors] = useState({});
  const [deliveryErrors, setDeliveryErrors] = useState({});

  const [foodSearch, setFoodSearch] = useState("");
  const [orderItems, setOrderItems] = useState([]);

  const [customizingFood, setCustomizingFood] = useState(null);

  const [customizationSelections, setCustomizationSelections] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [customizationQuantity, setCustomizationQuantity] = useState(1);
  const [customizationNotes, setCustomizationNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState("paid");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  const [orderTiming, setOrderTiming] = useState("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [pricePreview, setPricePreview] = useState(null);
  const [pricePreviewLoading, setPricePreviewLoading] = useState(false);
  const [pricePreviewError, setPricePreviewError] = useState("");

  const [createdOrder, setCreatedOrder] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const [tip, setTip] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const [delivery, setDelivery] = useState({
    location: normalizeLocation(""),
    fullName: "",
    phone: "",
    instructions: "",
  });

  const {
    data: foodsResponse,
    isLoading: foodsLoading,
    isError: foodsError,
  } = useFoods();

  const validateCustomer = () => {
    const errors = {};

    const firstname = customer.firstname.trim();
    const lastname = customer.lastname.trim();
    const phone = customer.phone.trim();
    const email = customer.email.trim();

    if (firstname.length < 2) {
      errors.firstname = "First name must be at least 2 characters.";
    }

    if (lastname.length < 2) {
      errors.lastname = "Last name must be at least 2 characters.";
    }

    if (!phone) {
      errors.phone = "Phone number is required.";
    } else if (phone.length < 7) {
      errors.phone = "Enter a valid phone number.";
    }

    const emailRequired = createAccount || emailOrderDetails;

    if (emailRequired && !email) {
      errors.email =
        "Email is required when account creation or email order details is enabled.";
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address.";
    }

    setCustomerErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const validateDelivery = () => {
    if (deliveryMethod === "pickup") {
      return true;
    }

    const errors = {};

    const location = delivery.location;

    if (!location?.addressText?.trim()) {
      errors.location = "Please select a delivery location.";
    }

    if (!location?.city?.trim()) {
      errors.city = "Delivery city is required.";
    }

    if (!location?.state?.trim()) {
      errors.state = "Delivery state is required.";
    }

    if (!delivery.fullName.trim()) {
      errors.fullName = "Recipient name is required.";
    }

    if (!delivery.phone.trim()) {
      errors.phone = "Recipient phone number is required.";
    } else if (delivery.phone.trim().length < 7) {
      errors.phone = "Enter a valid recipient phone number.";
    }

    setDeliveryErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const validateSchedule = () => {
    if (orderTiming === "now") {
      return true;
    }

    if (!scheduledDate || !scheduledTime) {
      return false;
    }

    const scheduledFor = buildScheduledDateTime(scheduledDate, scheduledTime);

    if (!scheduledFor) {
      return false;
    }

    return new Date(scheduledFor) > new Date();
  };

  // const fetchPricePreview = async () => {
  //   if (orderItems.length === 0) {
  //     setPricePreview(null);
  //     setPricePreviewError("");
  //     return;
  //   }

  //   if (!validateCustomer()) {
  //     setPricePreview(null);
  //     return;
  //   }

  //   if (!validateDelivery()) {
  //     setPricePreview(null);
  //     return;
  //   }

  //   const orderData = {
  //     customer: {
  //       firstname: customer.firstname.trim(),
  //       lastname: customer.lastname.trim(),
  //       phone: customer.phone.trim(),
  //       email: customer.email.trim() || undefined,
  //     },

  //     items: orderItems.map((item) => ({
  //       food: item.food,
  //       quantity: Number(item.quantity),
  //       customizations: item.customizations || [],
  //       addOns: item.addOns || [],
  //       notes: item.notes || "",
  //     })),

  //     deliveryMethod,
  //   };

  //   if (deliveryMethod === "delivery") {
  //     orderData.deliveryLocation = delivery.location.addressText.trim();

  //     orderData.deliveryAddress = buildDeliveryAddress(delivery);
  //   }

  //   try {
  //     setPricePreviewLoading(true);
  //     setPricePreviewError("");

  //     const response = await previewStaffOrderPrice(orderData);

  //     setPricePreview(response?.data ?? response);
  //   } catch (error) {
  //     console.error("Failed to preview staff order price:", error);

  //     setPricePreview(null);
  //     setPricePreviewError(
  //       error?.response?.data?.message ||
  //         "Unable to calculate the order price.",
  //     );
  //   } finally {
  //     setPricePreviewLoading(false);
  //   }
  // };

  const fetchPricePreview = async () => {
    if (orderItems.length === 0) {
      setPricePreview(null);
      setPricePreviewError("");
      return;
    }

    const orderData = {
      customer: {
        firstname: customer.firstname.trim(),
        lastname: customer.lastname.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim() || undefined,
      },

      items: orderItems.map((item) => ({
        food: item.food,
        quantity: Number(item.quantity),
        customizations: item.customizations || [],
        addOns: item.addOns || [],
        notes: item.notes || "",
      })),

      deliveryMethod,
      paymentMethod,
      paymentStatus,
      createAccount,
      emailOrderDetails,

      couponCode: couponCode.trim() || undefined,
      tip: Number(tip || 0),
      customerNotes: customerNotes.trim() || undefined,
    };

    if (deliveryMethod === "delivery") {
      if (!delivery.location?.addressText?.trim()) {
        setPricePreview(null);
        setPricePreviewError("");
        return;
      }

      orderData.deliveryLocation = delivery.location.addressText.trim();

      orderData.deliveryAddress = buildDeliveryAddress(delivery);
    }

    try {
      setPricePreviewLoading(true);
      setPricePreviewError("");

      const response = await previewStaffOrderPrice(orderData);

      setPricePreview(response?.data ?? response);
    } catch (error) {
      console.error("Failed to preview staff order price:", error);

      setPricePreview(null);

      setPricePreviewError(
        error?.response?.data?.message ||
          "Unable to calculate the order price.",
      );
    } finally {
      setPricePreviewLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchPricePreview();
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    orderItems,
    deliveryMethod,
    delivery.location,
    delivery.fullName,
    delivery.phone,
    delivery.instructions,
    couponCode,
    tip,
    customer.firstname,
    customer.lastname,
    customer.phone,
    customer.email,
  ]);

  const handleCreateOrder = async () => {
    if (isSubmitting) {
      return;
    }

    const customerValid = validateCustomer();

    if (!customerValid) {
      return;
    }

    if (orderItems.length === 0) {
      return;
    }

    const deliveryValid = validateDelivery();

    if (!deliveryValid) {
      return;
    }

    const scheduleValid = validateSchedule();

    if (!scheduleValid) {
      return;
    }

    const orderData = {
      customer: {
        firstname: customer.firstname.trim(),
        lastname: customer.lastname.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim() || undefined,
      },

      items: orderItems.map((item) => ({
        food: item.food,
        quantity: Number(item.quantity),
        customizations: item.customizations || [],
        addOns: item.addOns || [],
        notes: item.notes || "",
      })),

      deliveryMethod,

      paymentMethod,
      paymentStatus,

      createAccount,
      emailOrderDetails,

      couponCode: couponCode.trim() || undefined,
      tip: Number(tip || 0),
      customerNotes: customerNotes.trim() || undefined,
    };

    if (orderTiming === "scheduled") {
      const scheduledFor = buildScheduledDateTime(scheduledDate, scheduledTime);

      if (!scheduledFor) {
        return;
      }

      orderData.scheduledFor = scheduledFor;
    }

    if (deliveryMethod === "delivery") {
      orderData.deliveryLocation = delivery.location.addressText.trim();
      orderData.deliveryAddress = buildDeliveryAddress(delivery);
    }

    try {
      setIsSubmitting(true);

      const response = await createStaffOrder(orderData);

      setCreatedOrder(response?.data ?? response);
    } catch (error) {
      console.error("Failed to create staff order:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create the order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const foods = Array.isArray(foodsResponse)
    ? foodsResponse
    : Array.isArray(foodsResponse?.data)
      ? foodsResponse.data
      : Array.isArray(foodsResponse?.foods)
        ? foodsResponse.foods
        : Array.isArray(foodsResponse?.data?.foods)
          ? foodsResponse.data.foods
          : [];

  const filteredFoods = foods.filter((food) =>
    food.name?.toLowerCase().includes(foodSearch.trim().toLowerCase()),
  );

  const emailRequired = createAccount || emailOrderDetails;

  // const handleCustomerChange = (event) => {
  //   const { name, value } = event.target;

  //   setCustomer((current) => ({
  //     ...current,
  //     [name]: value,
  //   }));
  // };

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));

    setCustomerErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];

      return next;
    });
  };

  const handleDeliveryChange = (event) => {
    const { name, value } = event.target;

    setDelivery((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openFoodCustomizer = (food) => {
    setCustomizingFood(food);
    setCustomizationSelections({});
    setSelectedAddOns([]);
    setCustomizationQuantity(1);
    setCustomizationNotes("");
  };

  const closeFoodCustomizer = () => {
    setCustomizingFood(null);
    setCustomizationSelections({});
    setSelectedAddOns([]);
    setCustomizationQuantity(1);
    setCustomizationNotes("");
  };

  // const handleCustomizationChange = (group, option) => {

  //   setCustomizationSelections((current) => ({
  //     ...current,
  //     [group.name]: {
  //       name: group.name,
  //       option: option.name,
  //       price: Number(option.price || 0),
  //     },
  //   }));
  // };

  const buildDeliveryAddress = (delivery) => {
    const location = delivery.location;

    return {
      fullName: delivery.fullName.trim(),
      phone: delivery.phone.trim(),
      address: location.addressText?.trim() || "",
      city: location.city?.trim() || "",
      state: location.state?.trim() || "",
      landmark: location.landmark?.trim() || "",
      instructions: delivery.instructions.trim(),
      ...(location.latitude != null && location.longitude != null
        ? {
            coordinates: {
              latitude: Number(location.latitude),
              longitude: Number(location.longitude),
            },
          }
        : {}),
    };
  };

  const handleCustomizationChange = (group, option) => {
    setCustomizationSelections((current) => {
      const existingSelection = current[group.name];

      if (group.multiple) {
        const existingOptions = Array.isArray(existingSelection)
          ? existingSelection
          : existingSelection
            ? [existingSelection]
            : [];

        const alreadySelected = existingOptions.some(
          (item) => item.option === option.name,
        );

        const nextOptions = alreadySelected
          ? existingOptions.filter((item) => item.option !== option.name)
          : [
              ...existingOptions,
              {
                name: group.name,
                option: option.name,
                price: option.price,
              },
            ];

        return {
          ...current,
          [group.name]: nextOptions,
        };
      }

      return {
        ...current,
        [group.name]: {
          name: group.name,
          option: option.name,
          price: option.price,
        },
      };
    });
  };

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((current) => {
      const exists = current.some((item) => item.name === addOn.name);

      if (exists) {
        return current.filter((item) => item.name !== addOn.name);
      }

      return [
        ...current,
        {
          name: addOn.name,
          price: Number(addOn.price || 0),
        },
      ];
    });
  };

  const addCustomizedFood = () => {
    if (!customizingFood) {
      return;
    }

    const customizationOptions = Array.isArray(
      customizingFood.customizationOptions,
    )
      ? customizingFood.customizationOptions
      : [];

    const missingRequiredCustomization = customizationOptions.some((group) => {
      if (!group.required) {
        return false;
      }

      const selection = customizationSelections[group.name];

      if (group.multiple) {
        return !Array.isArray(selection) || selection.length === 0;
      }

      return !selection?.option;
    });

    if (missingRequiredCustomization) {
      return;
    }

    const newItem = {
      food: customizingFood._id,
      name: customizingFood.name,
      quantity: customizationQuantity,
      customizations: Object.values(customizationSelections).flat(),
      addOns: selectedAddOns,
      notes: customizationNotes.trim(),
    };

    setOrderItems((current) => [...current, newItem]);

    closeFoodCustomizer();
  };

  return (
    <div className="space-y-6">
      {createdOrder ? (
        <div className="mx-auto w-full max-w-2xl">
          <section className="rounded-2xl border border-green-200 bg-white p-6 text-center shadow-soft sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <LuCheck size={30} />
            </div>

            <h1 className="mt-5 font-heading text-2xl font-bold text-dark-950">
              Order Created Successfully
            </h1>

            <p className="mt-2 text-sm leading-6 text-dark-500">
              The staff order has been created and is now in the Resvill order
              system.
            </p>

            <div className="mt-6 rounded-2xl border border-dark-100 bg-dark-50 p-5 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-dark-500">Order number</span>
                <span className="font-semibold text-dark-950">
                  {createdOrder?.order?.orderNumber || "—"}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-dark-500">Tracking token</span>

                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        createdOrder?.order?.trackingToken || "",
                      )
                    }
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Copy
                  </button>
                </div>

                <div className="mt-2 break-all rounded-xl border border-dark-100 bg-white px-3 py-3 font-mono text-xs text-dark-700">
                  {createdOrder?.order?.trackingToken || "—"}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-dark-500">Status</span>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-600">
                  {createdOrder?.order?.status || "pending"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-dark-500">Customer</span>
                <span className="text-right text-sm font-semibold text-dark-900">
                  {createdOrder?.customer?.firstname || ""}{" "}
                  {createdOrder?.customer?.lastname || ""}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-dark-500">Customer type</span>
                <span className="text-sm font-semibold capitalize text-dark-900">
                  {createdOrder?.customer?.customerType || "guest"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-dark-500">Account created</span>
                <span className="text-sm font-semibold text-dark-900">
                  {createdOrder?.accountCreated ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/staff/orders"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
              >
                View Orders
              </Link>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-dark-200 bg-white px-5 py-3 text-sm font-bold text-dark-700 transition hover:bg-dark-50"
              >
                Create Another Order
              </button>
            </div>
          </section>
        </div>
      ) : (
        <>
          {/* Header */}
          <div>
            <Link
              to="/staff/orders"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition hover:text-primary-600"
            >
              <LuArrowLeft size={16} />
              Back to orders
            </Link>

            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-500" />

              <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
                Order Management
              </span>
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
              Create Custom Order
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-dark-500">
              Create an order on behalf of a customer who is ordering outside
              the Resvill platform.
            </p>
          </div>

          {/* Customer Information */}
          <section className="rounded-2xl border border-dark-100 bg-white shadow-soft">
            <div className="flex items-center gap-3 border-b border-dark-100 px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuUserRound size={19} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-900">
                  Customer Information
                </h2>

                <p className="mt-0.5 text-xs text-dark-500">
                  Enter the customer's contact details.
                </p>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* First name */}
                <div>
                  <label
                    htmlFor="firstname"
                    className="mb-1.5 block text-sm font-semibold text-dark-700"
                  >
                    First name
                  </label>

                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={customer.firstname}
                    onChange={handleCustomerChange}
                    placeholder="Enter first name"
                    className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />

                  {customerErrors.firstname && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {customerErrors.firstname}
                    </p>
                  )}
                </div>

                {/* Last name */}
                <div>
                  <label
                    htmlFor="lastname"
                    className="mb-1.5 block text-sm font-semibold text-dark-700"
                  >
                    Last name
                  </label>

                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={customer.lastname}
                    onChange={handleCustomerChange}
                    placeholder="Enter last name"
                    className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />

                  {customerErrors.lastname && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {customerErrors.lastname}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-semibold text-dark-700"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={customer.phone}
                    onChange={handleCustomerChange}
                    placeholder="Enter phone number"
                    className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />

                  {customerErrors.phone && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {customerErrors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 flex items-center justify-between text-sm font-semibold text-dark-700"
                  >
                    <span>Email address</span>

                    <span className="text-xs font-medium text-dark-400">
                      {emailRequired ? "Required" : "Optional"}
                    </span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    placeholder="customer@example.com"
                    required={emailRequired}
                    className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />

                  {customerErrors.email && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {customerErrors.email}
                    </p>
                  )}

                  {!emailRequired && (
                    <p className="mt-1.5 text-xs text-dark-400">
                      Leave blank if the customer does not want email
                      communication.
                    </p>
                  )}
                </div>
              </div>

              {/* Account & Email Options */}
              <div className="space-y-3 border-t border-dark-100 pt-5">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-dark-200 p-4 transition hover:border-primary-300 hover:bg-primary-50/30">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(event) => {
                      const checked = event.target.checked;

                      setCreateAccount(checked);

                      if (checked && !customer.email.trim()) {
                        setCustomerErrors((current) => ({
                          ...current,
                          email:
                            "Email is required when account creation or email order details is enabled.",
                        }));
                        return;
                      }

                      if (!checked && !emailOrderDetails) {
                        setCustomerErrors((current) => {
                          if (!current.email) return current;

                          const next = { ...current };
                          delete next.email;

                          return next;
                        });
                      }
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-dark-800">
                      Create a Resvill account
                    </span>

                    <span className="mt-0.5 block text-xs leading-5 text-dark-500">
                      Create an account for this customer and send their login
                      credentials by email.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-dark-200 p-4 transition hover:border-primary-300 hover:bg-primary-50/30">
                  <input
                    type="checkbox"
                    checked={emailOrderDetails}
                    onChange={(event) => {
                      const checked = event.target.checked;

                      setEmailOrderDetails(checked);

                      if (checked && !customer.email.trim()) {
                        setCustomerErrors((current) => ({
                          ...current,
                          email:
                            "Email is required when account creation or email order details is enabled.",
                        }));
                        return;
                      }

                      if (!checked && !createAccount) {
                        setCustomerErrors((current) => {
                          if (!current.email) return current;

                          const next = { ...current };
                          delete next.email;

                          return next;
                        });
                      }
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-dark-300 text-primary-500 focus:ring-primary-500"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-dark-800">
                      Email order details
                    </span>

                    <span className="mt-0.5 block text-xs leading-5 text-dark-500">
                      Send the customer their order confirmation and tracking
                      information by email.
                    </span>
                  </span>
                </label>

                {emailRequired && (
                  <div className="rounded-xl bg-primary-50 px-4 py-3 text-xs leading-5 text-primary-700">
                    An email address is required because{" "}
                    {createAccount && emailOrderDetails
                      ? "account creation and order details email are enabled."
                      : createAccount
                        ? "account creation is enabled."
                        : "order details email is enabled."}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Order Items */}
          <section className="rounded-2xl border border-dark-100 bg-white shadow-soft">
            <div className="flex items-center gap-3 border-b border-dark-100 px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuShoppingBag size={19} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-900">
                  Order Items
                </h2>

                <p className="mt-0.5 text-xs text-dark-500">
                  Add the foods the customer wants to order.
                </p>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Food Search */}
              <div>
                <label
                  htmlFor="food-search"
                  className="mb-1.5 block text-sm font-semibold text-dark-700"
                >
                  Search food
                </label>

                <div className="relative">
                  <LuSearch
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    id="food-search"
                    type="search"
                    value={foodSearch}
                    onChange={(event) => setFoodSearch(event.target.value)}
                    placeholder="Search for a food..."
                    className="h-11 w-full rounded-xl border border-dark-200 bg-white pl-10 pr-4 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              {/* Food Results */}
              <div className="space-y-3">
                {foodsLoading ? (
                  <div className="rounded-xl border border-dark-100 bg-dark-50/40 p-8 text-center">
                    <p className="text-sm font-medium text-dark-500">
                      Loading foods...
                    </p>
                  </div>
                ) : foodsError ? (
                  <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
                    <p className="text-sm font-semibold text-red-700">
                      Unable to load foods
                    </p>

                    <p className="mt-1 text-xs text-red-500">
                      Please refresh the page and try again.
                    </p>
                  </div>
                ) : filteredFoods.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-dark-200 bg-dark-50/40 p-8 text-center">
                    <LuSearch size={25} className="mx-auto text-dark-300" />

                    <p className="mt-3 text-sm font-semibold text-dark-700">
                      No foods found
                    </p>

                    <p className="mt-1 text-xs leading-5 text-dark-400">
                      Try searching with a different food name.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filteredFoods.map((food) => (
                      <button
                        key={food._id}
                        type="button"
                        onClick={() => openFoodCustomizer(food)}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-dark-200 bg-white p-4 text-left transition hover:border-primary-300 hover:bg-primary-50/30"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-dark-900">
                            {food.name}
                          </p>

                          <p className="mt-1 text-xs text-dark-500">
                            ₦{Number(food.price || 0).toLocaleString()}
                          </p>
                        </div>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                          <LuPlus size={17} />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Food Customization */}
              {customizingFood && (
                <div className="rounded-2xl border border-primary-200 bg-primary-50/30 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary-600">
                        Customize item
                      </p>

                      <h3 className="mt-1 font-heading text-lg font-bold text-dark-900">
                        {customizingFood.name}
                      </h3>

                      <p className="mt-1 text-xs text-dark-500">
                        Select the customer's preferred options before adding
                        the item.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeFoodCustomizer}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-dark-200 bg-white text-dark-400 transition hover:border-dark-300 hover:text-dark-700"
                      aria-label="Close customization"
                    >
                      <LuX size={17} />
                    </button>
                  </div>

                  {/* Customization Groups */}
                  {Array.isArray(customizingFood.customizationOptions) &&
                    customizingFood.customizationOptions.length > 0 && (
                      <div className="mt-6 space-y-5">
                        {customizingFood.customizationOptions.map((group) => (
                          <div
                            key={group._id || group.name}
                            className="rounded-xl border border-dark-200 bg-white p-4"
                          >
                            <div className="mb-3">
                              <div className="flex items-center justify-between gap-3">
                                <h4 className="text-sm font-bold text-dark-900">
                                  {group.name}
                                </h4>

                                <span className="text-[11px] font-semibold text-dark-400">
                                  {group.required ? "Required" : "Optional"}
                                </span>
                              </div>

                              {group.multiple && (
                                <p className="mt-1 text-xs text-dark-400">
                                  Select multiple options.
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              {Array.isArray(group.options) &&
                                group.options.map((option) => {
                                  const selection =
                                    customizationSelections[group.name];

                                  const selected = group.multiple
                                    ? Array.isArray(selection) &&
                                      selection.some(
                                        (item) => item.option === option.name,
                                      )
                                    : selection?.option === option.name;

                                  return (
                                    <button
                                      key={option._id || option.name}
                                      type="button"
                                      onClick={() =>
                                        handleCustomizationChange(group, option)
                                      }
                                      disabled={option.isAvailable === false}
                                      className={[
                                        "flex w-full items-center justify-between gap-4 rounded-xl border p-3 text-left transition",
                                        selected
                                          ? "border-primary-500 bg-primary-50"
                                          : "border-dark-200 bg-white hover:border-primary-300",
                                        option.isAvailable === false
                                          ? "cursor-not-allowed opacity-50"
                                          : "",
                                      ].join(" ")}
                                    >
                                      <div className="flex min-w-0 items-center gap-3">
                                        <span
                                          className={[
                                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                                            selected
                                              ? "border-primary-500 bg-primary-500 text-white"
                                              : "border-dark-300 bg-white",
                                          ].join(" ")}
                                        >
                                          {selected && <LuCheck size={13} />}
                                        </span>

                                        <span className="text-sm font-medium text-dark-800">
                                          {option.name}
                                        </span>
                                      </div>

                                      <span className="shrink-0 text-xs font-semibold text-dark-500">
                                        {Number(option.price || 0) > 0
                                          ? `+₦${Number(
                                              option.price || 0,
                                            ).toLocaleString()}`
                                          : "Included"}
                                      </span>
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Add-ons */}
                  {Array.isArray(customizingFood.addOns) &&
                    customizingFood.addOns.length > 0 && (
                      <div className="mt-5 rounded-xl border border-dark-200 bg-white p-4">
                        <div className="mb-3">
                          <h4 className="text-sm font-bold text-dark-900">
                            Add-ons
                          </h4>

                          <p className="mt-1 text-xs text-dark-400">
                            Add anything extra the customer requested.
                          </p>
                        </div>

                        <div className="space-y-2">
                          {customizingFood.addOns.map((addOn) => {
                            const selected = selectedAddOns.some(
                              (item) => item.name === addOn.name,
                            );

                            return (
                              <button
                                key={addOn._id || addOn.name}
                                type="button"
                                onClick={() => toggleAddOn(addOn)}
                                disabled={addOn.isAvailable === false}
                                className={[
                                  "flex w-full items-center justify-between gap-4 rounded-xl border p-3 text-left transition",
                                  selected
                                    ? "border-primary-500 bg-primary-50"
                                    : "border-dark-200 bg-white hover:border-primary-300",
                                  addOn.isAvailable === false
                                    ? "cursor-not-allowed opacity-50"
                                    : "",
                                ].join(" ")}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={[
                                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                                      selected
                                        ? "border-primary-500 bg-primary-500 text-white"
                                        : "border-dark-300 bg-white",
                                    ].join(" ")}
                                  >
                                    {selected && <LuCheck size={13} />}
                                  </span>

                                  <span className="text-sm font-medium text-dark-800">
                                    {addOn.name}
                                  </span>
                                </div>

                                <span className="text-xs font-semibold text-dark-500">
                                  +₦{Number(addOn.price || 0).toLocaleString()}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* Quantity & Notes */}
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="customization-quantity"
                        className="mb-1.5 block text-sm font-semibold text-dark-700"
                      >
                        Quantity
                      </label>

                      <input
                        id="customization-quantity"
                        type="number"
                        min="1"
                        value={customizationQuantity}
                        onChange={(event) =>
                          setCustomizationQuantity(
                            Math.max(1, Number(event.target.value) || 1),
                          )
                        }
                        className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="customization-notes"
                        className="mb-1.5 block text-sm font-semibold text-dark-700"
                      >
                        Item notes
                      </label>

                      <input
                        id="customization-notes"
                        type="text"
                        value={customizationNotes}
                        onChange={(event) =>
                          setCustomizationNotes(event.target.value)
                        }
                        placeholder="e.g. No onions"
                        className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeFoodCustomizer}
                      className="rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={addCustomizedFood}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600"
                    >
                      <LuPlus size={16} />
                      Add to order
                    </button>
                  </div>
                </div>
              )}

              {/* Selected Items */}

              {orderItems.length > 0 && (
                <div className="border-t border-dark-100 pt-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-dark-900">
                        Selected Items
                      </h3>

                      <p className="mt-0.5 text-xs text-dark-400">
                        Review each food and its customization before checkout.
                      </p>
                    </div>

                    <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-600">
                      {orderItems.length}{" "}
                      {orderItems.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {orderItems.map((item, index) => (
                      <div
                        key={`${item.food}-${index}`}
                        className="rounded-xl border border-dark-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-dark-900">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-dark-500">
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setOrderItems((current) =>
                                current.filter(
                                  (_, itemIndex) => itemIndex !== index,
                                ),
                              )
                            }
                            className="rounded-lg p-2 text-dark-400 transition hover:bg-red-50 hover:text-red-600"
                            aria-label={`Remove ${item.name}`}
                          >
                            <LuTrash2 size={16} />
                          </button>
                        </div>

                        {/* Customizations */}
                        {Array.isArray(item.customizations) &&
                          item.customizations.length > 0 && (
                            <div className="mt-4 border-t border-dark-100 pt-3">
                              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                                Customizations
                              </p>

                              <div className="space-y-1.5">
                                {item.customizations.map(
                                  (customization, customizationIndex) => (
                                    <div
                                      key={`${customization.name}-${customizationIndex}`}
                                      className="flex items-center justify-between gap-3 text-xs"
                                    >
                                      <span className="text-dark-600">
                                        {customization.name}:{" "}
                                        <span className="font-semibold text-dark-800">
                                          {customization.option}
                                        </span>
                                      </span>

                                      {Number(customization.price || 0) > 0 && (
                                        <span className="shrink-0 font-semibold text-dark-500">
                                          +₦
                                          {Number(
                                            customization.price || 0,
                                          ).toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Add-ons */}
                        {Array.isArray(item.addOns) &&
                          item.addOns.length > 0 && (
                            <div className="mt-4 border-t border-dark-100 pt-3">
                              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                                Add-ons
                              </p>

                              <div className="space-y-1.5">
                                {item.addOns.map((addOn, addOnIndex) => (
                                  <div
                                    key={`${addOn.name}-${addOnIndex}`}
                                    className="flex items-center justify-between gap-3 text-xs"
                                  >
                                    <span className="font-medium text-dark-600">
                                      {addOn.name}
                                    </span>

                                    <span className="shrink-0 font-semibold text-dark-500">
                                      +₦
                                      {Number(
                                        addOn.price || 0,
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Notes */}
                        {item.notes?.trim() && (
                          <div className="mt-4 rounded-lg bg-dark-50 px-3 py-2.5">
                            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                              Item note
                            </p>

                            <p className="mt-1 text-xs leading-5 text-dark-600">
                              {item.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Fulfillment */}
          <section className="rounded-2xl border border-dark-100 bg-white shadow-soft">
            <div className="flex items-center gap-3 border-b border-dark-100 px-5 py-4 sm:px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuMapPin size={19} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-900">
                  Fulfillment
                </h2>

                <p className="mt-0.5 text-xs text-dark-500">
                  Choose how the customer will receive this order.
                </p>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Fulfillment Method */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-dark-700">
                  Fulfillment method
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("delivery")}
                    className={[
                      "rounded-xl border p-4 text-left transition",
                      deliveryMethod === "delivery"
                        ? "border-primary-500 bg-primary-50"
                        : "border-dark-200 bg-white hover:border-primary-300",
                    ].join(" ")}
                  >
                    <p className="text-sm font-bold text-dark-900">Delivery</p>

                    <p className="mt-1 text-xs leading-5 text-dark-500">
                      The customer's order will be delivered to their address.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryMethod("pickup");

                      setDelivery((current) => ({
                        ...current,
                        location: normalizeLocation(""),
                        instructions: "",
                      }));
                    }}
                    className={[
                      "rounded-xl border p-4 text-left transition",
                      deliveryMethod === "pickup"
                        ? "border-primary-500 bg-primary-50"
                        : "border-dark-200 bg-white hover:border-primary-300",
                    ].join(" ")}
                  >
                    <p className="text-sm font-bold text-dark-900">Pickup</p>

                    <p className="mt-1 text-xs leading-5 text-dark-500">
                      The customer will collect the order from the restaurant.
                    </p>
                  </button>
                </div>
              </div>

              {/* Delivery Details */}
              {deliveryMethod === "delivery" && (
                <div className="space-y-5 border-t border-dark-100 pt-5">
                  <div>
                    <h3 className="text-sm font-bold text-dark-900">
                      Delivery Details
                    </h3>

                    <p className="mt-1 text-xs text-dark-500">
                      Enter the location where the customer's order should be
                      delivered.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Recipient Name */}
                    <div>
                      <label
                        htmlFor="delivery-fullName"
                        className="mb-1.5 block text-sm font-semibold text-dark-700"
                      >
                        Recipient name
                      </label>

                      <input
                        id="delivery-fullName"
                        name="fullName"
                        type="text"
                        value={delivery.fullName}
                        onChange={handleDeliveryChange}
                        placeholder="Customer's full name"
                        className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                      {deliveryErrors.fullName && (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          {deliveryErrors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Delivery Phone */}
                    <div>
                      <label
                        htmlFor="delivery-phone"
                        className="mb-1.5 block text-sm font-semibold text-dark-700"
                      >
                        Delivery phone
                      </label>

                      <input
                        id="delivery-phone"
                        name="phone"
                        type="tel"
                        value={delivery.phone}
                        onChange={handleDeliveryChange}
                        placeholder="Phone number"
                        className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                      {deliveryErrors.phone && (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          {deliveryErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div>
                    <AddressAutocomplete
                      label="Delivery location"
                      value={delivery.location}
                      onChange={(location) => {
                        const normalizedLocation = normalizeLocation(location);

                        setDelivery((current) => ({
                          ...current,
                          location: normalizedLocation,
                        }));
                      }}
                      showInstructions={false}
                      required
                      placeholder="Search for the customer's delivery location"
                    />
                    {deliveryErrors.location && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {deliveryErrors.location}
                      </p>
                    )}
                  </div>

                  {/* Instructions */}
                  <div>
                    <label
                      htmlFor="delivery-instructions"
                      className="mb-1.5 block text-sm font-semibold text-dark-700"
                    >
                      Delivery instructions
                      <span className="ml-1 text-xs font-medium text-dark-400">
                        Optional
                      </span>
                    </label>

                    <textarea
                      id="delivery-instructions"
                      name="instructions"
                      value={delivery.instructions}
                      onChange={handleDeliveryChange}
                      rows={3}
                      placeholder="Any special instructions for the driver?"
                      className="w-full resize-none rounded-xl border border-dark-200 bg-white px-3.5 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>
              )}
              <div className="border-t border-dark-100 pt-5">
                <div>
                  <h3 className="text-sm font-bold text-dark-900">
                    Order timing
                  </h3>

                  <p className="mt-1 text-xs text-dark-500">
                    Choose whether the order should be prepared now or at a
                    later time.
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderTiming("now");
                      setScheduledDate("");
                      setScheduledTime("");
                    }}
                    className={[
                      "rounded-xl border p-4 text-left transition",
                      orderTiming === "now"
                        ? "border-primary-500 bg-primary-50"
                        : "border-dark-200 bg-white hover:border-primary-300",
                    ].join(" ")}
                  >
                    <p className="text-sm font-bold text-dark-900">
                      Prepare now
                    </p>

                    <p className="mt-1 text-xs leading-5 text-dark-500">
                      The order can be processed immediately.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderTiming("scheduled")}
                    className={[
                      "rounded-xl border p-4 text-left transition",
                      orderTiming === "scheduled"
                        ? "border-primary-500 bg-primary-50"
                        : "border-dark-200 bg-white hover:border-primary-300",
                    ].join(" ")}
                  >
                    <p className="text-sm font-bold text-dark-900">
                      Schedule for later
                    </p>

                    <p className="mt-1 text-xs leading-5 text-dark-500">
                      The order will remain pending until the scheduled time.
                    </p>
                  </button>
                </div>

                {orderTiming === "scheduled" && (
                  <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50/40 p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="scheduled-date"
                          className="mb-1.5 block text-sm font-semibold text-dark-700"
                        >
                          Scheduled date
                        </label>

                        <input
                          id="scheduled-date"
                          type="date"
                          value={scheduledDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(event) =>
                            setScheduledDate(event.target.value)
                          }
                          className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="scheduled-time"
                          className="mb-1.5 block text-sm font-semibold text-dark-700"
                        >
                          Scheduled time
                        </label>

                        <input
                          id="scheduled-time"
                          type="time"
                          value={scheduledTime}
                          onChange={(event) =>
                            setScheduledTime(event.target.value)
                          }
                          className="h-11 w-full rounded-xl border border-dark-200 bg-white px-3.5 text-sm text-dark-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        />
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-primary-700">
                      Staff will see the scheduled order, but it cannot be
                      processed before the scheduled time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <LuShoppingBag size={20} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-950">
                  Order Summary
                </h2>
                <p className="text-sm text-dark-500">
                  Review the calculated price before creating the order.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-dark-900">
                  Coupon code
                </label>

                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Enter coupon code"
                  className="mt-2 w-full rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none transition focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-900">
                  Tip
                </label>

                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-dark-400">
                    ₦
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={tip}
                    onChange={(event) => setTip(event.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-dark-200 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-500">Subtotal</span>
                <span className="font-semibold text-dark-900">
                  ₦{Number(pricePreview?.subtotal || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-500">Delivery fee</span>
                <span className="font-semibold text-dark-900">
                  ₦{Number(pricePreview?.deliveryFee || 0).toLocaleString()}
                </span>
              </div>

              {Number(pricePreview?.discount || 0) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-500">Discount</span>
                  <span className="font-semibold text-green-600">
                    -₦{Number(pricePreview.discount).toLocaleString()}
                  </span>
                </div>
              )}

              {Number(pricePreview?.tip || 0) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-500">Tip</span>
                  <span className="font-semibold text-dark-900">
                    ₦{Number(pricePreview.tip).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="border-t border-dark-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-base font-bold text-dark-950">
                    Total
                  </span>

                  <span className="font-heading text-xl font-bold text-primary-600">
                    ₦{Number(pricePreview?.total || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {pricePreviewLoading && (
              <p className="mt-4 text-sm text-dark-500">
                Calculating latest order price...
              </p>
            )}

            {pricePreviewError && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {pricePreviewError}
              </p>
            )}

            <div className="mt-4">
              <label className="block text-sm font-semibold text-dark-900">
                Customer notes
              </label>

              <textarea
                value={customerNotes}
                onChange={(event) => setCustomerNotes(event.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Add any special instructions or notes..."
                className="mt-2 w-full resize-none rounded-xl border border-dark-200 px-4 py-3 text-sm outline-none transition focus:border-primary-500"
              />

              <p className="mt-1 text-xs text-dark-400">
                {customerNotes.length}/1000
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <LuShoppingBag size={20} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-950">
                  Payment
                </h2>

                <p className="text-sm text-dark-500">
                  Record how the customer is paying for this order.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-dark-900">
                Payment method
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { value: "cash", label: "Cash" },
                  { value: "pos", label: "POS" },
                  { value: "card", label: "Card" },
                  { value: "bank_transfer", label: "Bank transfer" },
                  { value: "ussd", label: "USSD" },
                  { value: "mobile_money", label: "Mobile money" },
                  { value: "qr", label: "QR" },
                ].map((method) => {
                  const selected = paymentMethod === method.value;

                  return (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        selected
                          ? "border-primary-500 bg-primary-50 text-primary-600"
                          : "border-dark-200 bg-white text-dark-700 hover:border-primary-300"
                      }`}
                    >
                      {method.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-dark-900">
                Payment status
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { value: "paid", label: "Paid" },
                  { value: "pending", label: "Pending" },
                ].map((status) => {
                  const selected = paymentStatus === status.value;

                  return (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setPaymentStatus(status.value)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        selected
                          ? "border-primary-500 bg-primary-50 text-primary-600"
                          : "border-dark-200 bg-white text-dark-700 hover:border-primary-300"
                      }`}
                    >
                      {status.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <LuCheck size={20} />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-950">
                  Review Order
                </h2>
                <p className="text-sm text-dark-500">
                  Confirm the customer, items, fulfillment, and payment details.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              {/* Customer */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-dark-400">
                  Customer
                </p>

                <div className="mt-2 rounded-xl bg-dark-50 p-4">
                  <p className="font-semibold text-dark-900">
                    {customer.firstname || "—"} {customer.lastname || ""}
                  </p>

                  <p className="mt-1 text-sm text-dark-500">
                    {customer.phone || "No phone number"}
                  </p>

                  {customer.email && (
                    <p className="mt-1 text-sm text-dark-500">
                      {customer.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-dark-400">
                  Items
                </p>

                <div className="mt-2 divide-y divide-dark-100 rounded-xl border border-dark-100">
                  {orderItems.map((item, index) => (
                    <div
                      key={`${item.food}-${index}`}
                      className="flex items-start justify-between gap-4 p-4"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-dark-900">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-dark-500">
                          Quantity: {item.quantity}
                        </p>

                        {item.customizations?.length > 0 && (
                          <p className="mt-1 text-xs text-dark-400">
                            {item.customizations
                              .map(
                                (customization) =>
                                  `${customization.name}: ${customization.option}`,
                              )
                              .join(", ")}
                          </p>
                        )}

                        {item.addOns?.length > 0 && (
                          <p className="mt-1 text-xs text-dark-400">
                            Add-ons:{" "}
                            {item.addOns.map((addOn) => addOn.name).join(", ")}
                          </p>
                        )}

                        {item.notes && (
                          <p className="mt-1 text-xs italic text-dark-400">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fulfillment */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-dark-400">
                  Fulfillment
                </p>

                <div className="mt-2 rounded-xl bg-dark-50 p-4">
                  <p className="font-semibold capitalize text-dark-900">
                    {deliveryMethod}
                  </p>

                  {deliveryMethod === "delivery" && (
                    <>
                      <p className="mt-1 text-sm text-dark-500">
                        {delivery.location?.addressText ||
                          "No address selected"}
                      </p>

                      {delivery.fullName && (
                        <p className="mt-1 text-sm text-dark-500">
                          Recipient: {delivery.fullName}
                        </p>
                      )}

                      {delivery.phone && (
                        <p className="mt-1 text-sm text-dark-500">
                          Phone: {delivery.phone}
                        </p>
                      )}
                    </>
                  )}

                  <p className="mt-2 text-sm font-medium text-dark-700">
                    {orderTiming === "later"
                      ? `Scheduled for ${scheduledDate} at ${scheduledTime}`
                      : "Prepare now"}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-dark-400">
                  Payment
                </p>

                <div className="mt-2 rounded-xl bg-dark-50 p-4">
                  <p className="font-semibold capitalize text-dark-900">
                    {paymentMethod.replace("_", " ")}
                  </p>

                  <p className="mt-1 text-sm text-dark-500">
                    Status:{" "}
                    <span className="font-semibold capitalize text-dark-700">
                      {paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-dark-900">
                    Order total
                  </span>

                  <span className="font-heading text-xl font-bold text-primary-600">
                    ₦{Number(pricePreview?.total || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-dark-950">
                  Ready to create this order?
                </h2>

                <p className="mt-1 text-sm text-dark-500">
                  The order will be created using the latest calculated price.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCreateOrder}
                disabled={
                  isSubmitting ||
                  pricePreviewLoading ||
                  orderItems.length === 0 ||
                  !pricePreview
                }
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating Order...
                  </>
                ) : pricePreviewLoading ? (
                  "Calculating Price..."
                ) : (
                  <>
                    <LuCheck size={18} />
                    Create Order
                  </>
                )}
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default StaffCreateOrder;
