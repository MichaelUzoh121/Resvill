import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Truck,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { ORDER_STATUSES } from "../../constants/orderStatuses";

import {
  useAdminOrder,
  useUpdateAdminOrderStatus,
} from "../hooks/useAdminOrders";

import {
  useAdminDeliveryByOrder,
  useAdminDrivers,
  useAssignAdminDelivery,
  useReassignAdminDelivery,
} from "../hooks/useAdminDelivery";

const ORDER_STATUS_LIST = Object.values(ORDER_STATUSES);

const ORDER_STATUS_TRANSITIONS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  FAILED: [],
  REFUNDED: [],
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatStatus = (value) => {
  if (!value) return "—";

  return value
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStatusClasses = (status) => {
  switch (status) {
    case "PENDING":
      return "border-warning/20 bg-warning/10 text-amber-700";

    case "CONFIRMED":
      return "border-info/20 bg-info/10 text-blue-700";

    case "PREPARING":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "READY":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "OUT_FOR_DELIVERY":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";

    case "DELIVERED":
      return "border-success/20 bg-success/10 text-green-700";

    default:
      return "border-dark-200 bg-dark-50 text-dark-600";
  }
};

const getPaymentStatusClasses = (status) => {
  switch (status) {
    case "paid":
      return "border-success/20 bg-success/10 text-green-700";

    case "pending":
      return "border-warning/20 bg-warning/10 text-amber-700";

    case "failed":
      return "border-danger/20 bg-danger/10 text-red-700";

    case "refunded":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "partially_refunded":
      return "border-orange-200 bg-orange-50 text-orange-700";

    default:
      return "border-dark-200 bg-dark-50 text-dark-600";
  }
};

const getCustomer = (order) => {
  return order?.customer || order?.user || null;
};

const getCustomerName = (order) => {
  const customer = getCustomer(order);

  if (customer?.name) return customer.name;

  const firstName = customer?.firstname || customer?.firstName || "";

  const lastName = customer?.lastname || customer?.lastName || "";

  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) return fullName;

  return order?.guestDetails?.name || order?.guestName || "Guest customer";
};

const getCustomerEmail = (order) => {
  const customer = getCustomer(order);

  return (
    customer?.email || order?.guestDetails?.email || order?.guestEmail || "—"
  );
};

const getCustomerPhone = (order) => {
  const customer = getCustomer(order);

  return (
    customer?.phone || order?.guestDetails?.phone || order?.guestPhone || "—"
  );
};

const getOrderNumber = (order) => {
  return (
    order?.orderNumber ||
    order?.orderId ||
    order?._id?.slice(-8)?.toUpperCase() ||
    "—"
  );
};

const getOrderItems = (order) => {
  return order?.items || order?.orderItems || [];
};

const getItemName = (item) => {
  return item?.food?.name || item?.foodName || item?.name || "Food item";
};

const getItemPrice = (item) => {
  return item?.price ?? item?.unitPrice ?? item?.food?.price ?? 0;
};

const getItemQuantity = (item) => {
  return Number(item?.quantity) || 1;
};

const getItemTotal = (item) => {
  return (
    item?.subtotal ?? item?.total ?? getItemPrice(item) * getItemQuantity(item)
  );
};

const getItemCustomizations = (item) => {
  return item?.customizations || item?.customizationOptions || [];
};

const getOrderSubtotal = (order) => {
  return order?.subtotal ?? order?.pricing?.subtotal ?? 0;
};

const getDeliveryFee = (order) => {
  return order?.deliveryFee ?? order?.pricing?.deliveryFee ?? 0;
};

const getDiscount = (order) => {
  return (
    order?.discount ?? order?.discountAmount ?? order?.pricing?.discount ?? 0
  );
};

const getOrderTotal = (order) => {
  return order?.total ?? order?.totalAmount ?? order?.pricing?.total ?? 0;
};

const getPaymentStatus = (order) => {
  return (
    order?.paymentStatus ||
    order?.payment?.status ||
    "pending"
  ).toLowerCase();
};

const getDeliveryAddress = (order) => {
  return (
    order?.deliveryAddress || order?.address || order?.shippingAddress || null
  );
};

const getAddressText = (address) => {
  if (!address) return "No delivery address provided.";

  if (typeof address === "string") return address;

  return [
    address.addressLine1,
    address.addressLine2,
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
        <Icon size={18} className="text-primary-500" />
      </div>

      <div>
        <h2 className="font-heading text-sm font-bold text-dark-900 sm:text-base">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-xs text-dark-400">{description}</p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, children }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
        {label}
      </p>

      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminOrder(id);

  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [showDriverSelector, setShowDriverSelector] = useState(false);

  const updateStatusMutation = useUpdateAdminOrderStatus();
  //   const assignDriverMutation = useAssignAdminOrderDriver();

  const {
    data: deliveryData,
    isLoading: deliveryLoading,
    isError: deliveryError,
    refetch: refetchDelivery,
  } = useAdminDeliveryByOrder(id);

  const { data: driversData, isLoading: driversLoading } = useAdminDrivers(
    {
      status: "available",
      page: 1,
      limit: 100,
    },
    {
      enabled: Boolean(deliveryData),
    },
  );

  const assignDeliveryMutation = useAssignAdminDelivery();
  const reassignDeliveryMutation = useReassignAdminDelivery();

  //   const availableDrivers = useMemo(() => {
  //     if (!driversData) return [];

  //     if (Array.isArray(driversData)) {
  //       return driversData;
  //     }

  //     return (
  //       driversData.drivers || driversData.items || driversData.results || []
  //     );
  //   }, [driversData]);

  //   const delivery = useMemo(() => {
  //     if (!deliveryData) return null;

  //     return deliveryData.delivery || deliveryData.data || deliveryData;
  //   }, [deliveryData]);

  //   const currentDriver = delivery?.driver || null;

  //   const currentDriverId =
  //     currentDriver?._id ||
  //     currentDriver?.id ||
  //     (typeof currentDriver === "string" ? currentDriver : "");

  //   const hasAssignedDriver = Boolean(currentDriverId);

  //   const order = useMemo(() => {
  //     if (!data) return null;

  //     return data?.order || data;
  //   }, [data]);

  //   const items = useMemo(() => getOrderItems(order), [order]);

  //   const customer = useMemo(() => getCustomer(order), [order]);

  //   const address = useMemo(() => getDeliveryAddress(order), [order]);

  //   const driver = useMemo(() => getDriver(order), [order]);

  const order = useMemo(() => {
    if (!data) return null;

    return data?.order || data;
  }, [data]);

  const items = useMemo(() => getOrderItems(order), [order]);

  const customer = useMemo(() => getCustomer(order), [order]);

  const address = useMemo(() => getDeliveryAddress(order), [order]);

  const delivery = useMemo(() => {
    if (!deliveryData) return null;

    return deliveryData.delivery || deliveryData.data || deliveryData;
  }, [deliveryData]);

  const availableDrivers = useMemo(() => {
    if (!driversData) return [];

    if (Array.isArray(driversData)) {
      return driversData;
    }

    return (
      driversData.drivers || driversData.items || driversData.results || []
    );
  }, [driversData]);

  const currentDriver = delivery?.driver || null;

  const currentDriverId =
    currentDriver?._id ||
    currentDriver?.id ||
    (typeof currentDriver === "string" ? currentDriver : "");

  const hasAssignedDriver = Boolean(currentDriverId);

  const currentStatus = order?.status || "PENDING";

  // const currentStatusIndex = ORDER_STATUS_LIST.indexOf(currentStatus);

  const currentStatusIndex = [
    ORDER_STATUSES.PENDING,
    ORDER_STATUSES.CONFIRMED,
    ORDER_STATUSES.PREPARING,
    ORDER_STATUSES.READY,
    ORDER_STATUSES.OUT_FOR_DELIVERY,
    ORDER_STATUSES.DELIVERED,
  ].indexOf(currentStatus);

  const availableStatuses = [
    currentStatus,
    ...(ORDER_STATUS_TRANSITIONS[currentStatus] || []),
  ];

  const handleStatusChange = async (event) => {
    const status = event.target.value;

    if (!status || status === currentStatus) return;

    try {
      await updateStatusMutation.mutateAsync({
        orderId: id,
        status,
      });

      toast.success(`Order status updated to ${formatStatus(status)}`);
    } catch (mutationError) {
      toast.error(
        mutationError?.response?.data?.message ||
          mutationError?.message ||
          "Unable to update order status.",
      );
    }
  };

  const handleAssignDriver = async () => {
    if (!delivery?._id) {
      toast.error("No delivery record was found for this order.");
      return;
    }

    if (!selectedDriverId) {
      toast.error("Please select a driver.");
      return;
    }

    try {
      if (hasAssignedDriver) {
        await reassignDeliveryMutation.mutateAsync({
          deliveryId: delivery._id,
          driverId: selectedDriverId,
        });

        toast.success("Driver reassigned successfully.");
      } else {
        await assignDeliveryMutation.mutateAsync({
          deliveryId: delivery._id,
          driverId: selectedDriverId,
        });

        toast.success("Driver assigned successfully.");
      }

      setSelectedDriverId("");
      setShowDriverSelector(false);

      await Promise.all([refetchDelivery(), refetch()]);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update driver assignment.",
      );
    }
  };

  const isDriverMutationPending =
    assignDeliveryMutation.isPending || reassignDeliveryMutation.isPending;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 animate-pulse rounded bg-dark-100" />

        <div className="rounded-3xl border border-dark-100 bg-white p-6 shadow-soft">
          <div className="animate-pulse space-y-4">
            <div className="h-7 w-64 rounded bg-dark-100" />
            <div className="h-4 w-48 rounded bg-dark-100" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="h-80 animate-pulse rounded-2xl bg-white shadow-soft" />
            <div className="h-64 animate-pulse rounded-2xl bg-white shadow-soft" />
          </div>

          <div className="space-y-6">
            <div className="h-64 animate-pulse rounded-2xl bg-white shadow-soft" />
            <div className="h-56 animate-pulse rounded-2xl bg-white shadow-soft" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-dark-500">
          <Loader2 size={17} className="animate-spin text-primary-500" />
          Loading order...
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="inline-flex items-center gap-2 text-sm font-bold text-dark-500 transition hover:text-primary-600"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </button>

        <div className="rounded-3xl border border-danger/20 bg-red-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <AlertCircle size={21} className="text-danger" />
            </div>

            <div>
              <h2 className="font-heading font-bold text-red-700">
                Unable to load order
              </h2>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-red-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "The requested order could not be loaded."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-red-700 shadow-sm transition hover:bg-red-100"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paymentStatus = getPaymentStatus(order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white p-6 shadow-soft sm:p-7">
        <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary-50 blur-3xl" />

        <div className="relative">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-dark-500 transition hover:text-primary-600"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-600">
                <Package size={14} />
                Order Details
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
                  #{getOrderNumber(order)}
                </h1>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                    currentStatus,
                  )}`}
                >
                  {formatStatus(currentStatus)}
                </span>
              </div>

              <p className="mt-2 text-sm text-dark-500">
                Created{" "}
                <span className="font-medium text-dark-700">
                  {formatDate(
                    order.createdAt || order.orderDate || order.created,
                  )}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm font-bold text-dark-700 transition hover:border-dark-300 hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={17}
                  className={isFetching ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <div className="relative">
                <select
                  value={currentStatus}
                  onChange={handleStatusChange}
                  disabled={updateStatusMutation.isPending}
                  className="w-full appearance-none rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 pr-10 text-sm font-bold text-primary-700 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-50 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[190px]"
                >
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>

                {updateStatusMutation.isPending && (
                  <Loader2
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary-500"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-dark-400">
                Order Total
              </p>

              <p className="mt-2 font-heading text-xl font-bold text-dark-900">
                {formatCurrency(getOrderTotal(order))}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
              <CreditCard size={18} className="text-primary-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-dark-400">
                Items
              </p>

              <p className="mt-2 font-heading text-xl font-bold text-dark-900">
                {items.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
              <Package size={18} className="text-primary-500" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-dark-400">
                Payment
              </p>

              <p className="mt-2 font-heading text-xl font-bold capitalize text-dark-900">
                {formatStatus(paymentStatus)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50">
              <CheckCircle2 size={18} className="text-primary-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 xl:col-span-2">
          {/* Order Items */}
          <section className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-soft">
            <div className="border-b border-dark-100 px-5 py-5 sm:px-6">
              <SectionHeader
                icon={Package}
                title="Order Items"
                description={`${items.length} item${
                  items.length === 1 ? "" : "s"
                } in this order`}
              />
            </div>

            {items.length === 0 ? (
              <div className="p-10 text-center text-sm text-dark-500">
                No order items were returned.
              </div>
            ) : (
              <div className="divide-y divide-dark-100">
                {items.map((item, index) => {
                  const customizations = getItemCustomizations(item);

                  return (
                    <div
                      key={
                        item?._id || item?.id || `${getItemName(item)}-${index}`
                      }
                      className="p-5 transition hover:bg-dark-50/40 sm:p-6"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50">
                          <Package size={21} className="text-primary-500" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-semibold text-dark-900">
                                {getItemName(item)}
                              </h3>

                              <p className="mt-1 text-sm text-dark-400">
                                {formatCurrency(getItemPrice(item))} ×{" "}
                                {getItemQuantity(item)}
                              </p>
                            </div>

                            <p className="font-heading text-sm font-bold text-dark-900">
                              {formatCurrency(getItemTotal(item))}
                            </p>
                          </div>

                          {customizations.length > 0 && (
                            <div className="mt-4 rounded-xl border border-dark-100 bg-dark-50 p-3.5">
                              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                                Customizations
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {customizations.map(
                                  (customization, customizationIndex) => (
                                    <span
                                      key={
                                        customization?._id ||
                                        customization?.id ||
                                        customizationIndex
                                      }
                                      className="rounded-lg border border-dark-200 bg-white px-2.5 py-1.5 text-xs font-medium text-dark-600"
                                    >
                                      {typeof customization === "string"
                                        ? customization
                                        : customization?.name ||
                                          customization?.label ||
                                          customization?.value ||
                                          "Customization"}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {item?.specialInstructions && (
                            <div className="mt-4 rounded-xl border border-warning/20 bg-warning/10 p-3.5">
                              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-amber-700">
                                Special Instructions
                              </p>

                              <p className="mt-1 text-sm leading-6 text-amber-800">
                                {item.specialInstructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Payment Summary */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <SectionHeader
              icon={CreditCard}
              title="Payment Summary"
              description="Order financial details"
            />

            <div className="rounded-2xl bg-dark-50 p-4 sm:p-5">
              <div className="space-y-4">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-dark-500">Subtotal</span>

                  <span className="font-semibold text-dark-800">
                    {formatCurrency(getOrderSubtotal(order))}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-dark-500">Delivery fee</span>

                  <span className="font-semibold text-dark-800">
                    {formatCurrency(getDeliveryFee(order))}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-dark-500">Discount</span>

                  <span className="font-semibold text-success">
                    -{formatCurrency(getDiscount(order))}
                  </span>
                </div>

                <div className="border-t border-dark-200 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-dark-800">Total</span>

                    <span className="font-heading text-xl font-bold text-dark-900">
                      {formatCurrency(getOrderTotal(order))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-dark-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-dark-500">
                Payment status
              </span>

              <span
                className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${getPaymentStatusClasses(
                  paymentStatus,
                )}`}
              >
                {formatStatus(paymentStatus)}
              </span>
            </div>

            {order?.payment?.reference && (
              <div className="mt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                  Payment Reference
                </p>

                <div className="mt-2 rounded-xl border border-dark-100 bg-dark-50 p-3">
                  <p className="break-all font-mono text-xs text-dark-600">
                    {order.payment.reference}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Customer */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <SectionHeader
              icon={User}
              title="Customer"
              description="Customer information"
            />

            <div className="space-y-5">
              <InfoRow label="Name">
                <p className="font-semibold text-dark-800">
                  {getCustomerName(order)}
                </p>
              </InfoRow>

              <InfoRow label="Email">
                <p className="break-all text-sm text-dark-600">
                  {getCustomerEmail(order)}
                </p>
              </InfoRow>

              <InfoRow label="Phone">
                <div className="flex items-center gap-2 text-sm text-dark-600">
                  <Phone size={15} className="text-dark-400" />
                  {getCustomerPhone(order)}
                </div>
              </InfoRow>

              <InfoRow label="Customer Type">
                <span className="inline-flex rounded-full border border-dark-200 bg-dark-50 px-2.5 py-1 text-xs font-bold capitalize text-dark-600">
                  {order?.customerType || "registered"}
                </span>
              </InfoRow>
            </div>
          </section>

          {/* Delivery */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <SectionHeader
              icon={MapPin}
              title="Delivery"
              description="Delivery information"
            />

            <div className="rounded-2xl border border-dark-100 bg-dark-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                Delivery Address
              </p>

              <p className="mt-2 text-sm leading-6 text-dark-700">
                {getAddressText(address)}
              </p>
            </div>

            {order?.deliveryInstructions && (
              <div className="mt-4 rounded-xl border border-dark-100 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-dark-400">
                  Delivery Instructions
                </p>

                <p className="mt-1.5 text-sm leading-6 text-dark-600">
                  {order.deliveryInstructions}
                </p>
              </div>
            )}
          </section>

          {/* Driver */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <SectionHeader
              icon={Truck}
              title="Driver"
              description="Delivery assignment"
            />

            {deliveryLoading ? (
              <div className="rounded-2xl border border-dark-100 bg-dark-50 p-5">
                <div className="flex items-center justify-center gap-2 text-sm text-dark-500">
                  <Loader2
                    size={17}
                    className="animate-spin text-primary-500"
                  />
                  Loading delivery...
                </div>
              </div>
            ) : deliveryError ? (
              <div className="rounded-2xl border border-danger/20 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-danger"
                  />

                  <div>
                    <p className="text-sm font-bold text-red-700">
                      Unable to load delivery
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600">
                      The delivery record for this order could not be loaded.
                    </p>
                  </div>
                </div>
              </div>
            ) : !delivery ? (
              <div className="rounded-2xl border border-dashed border-dark-200 p-5 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-dark-50">
                  <Truck size={21} className="text-dark-400" />
                </div>

                <p className="mt-3 text-sm font-bold text-dark-700">
                  No delivery record
                </p>

                <p className="mt-1 text-xs leading-5 text-dark-400">
                  A delivery record has not been created for this order yet.
                </p>
              </div>
            ) : currentDriver ? (
              <div className="rounded-2xl border border-dark-100 bg-dark-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                    {(
                      currentDriver?.name ||
                      `${currentDriver?.firstName || currentDriver?.firstname || ""} ${
                        currentDriver?.lastName || currentDriver?.lastname || ""
                      }`.trim() ||
                      "D"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-dark-800">
                      {currentDriver?.name ||
                        `${currentDriver?.firstName || currentDriver?.firstname || ""} ${
                          currentDriver?.lastName ||
                          currentDriver?.lastname ||
                          ""
                        }`.trim() ||
                        "Assigned driver"}
                    </p>

                    {currentDriver?.phone && (
                      <p className="mt-0.5 text-sm text-dark-500">
                        {currentDriver.phone}
                      </p>
                    )}

                    {currentDriver?.vehicleNumber && (
                      <p className="mt-0.5 text-xs text-dark-400">
                        {currentDriver.vehicleType
                          ? `${currentDriver.vehicleType} • `
                          : ""}
                        {currentDriver.vehicleNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-dark-200 p-5 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-dark-50">
                  <Clock3 size={21} className="text-dark-400" />
                </div>

                <p className="mt-3 text-sm font-bold text-dark-700">
                  No driver assigned
                </p>

                <p className="mt-1 text-xs leading-5 text-dark-400">
                  Assign an available delivery driver to this order.
                </p>
              </div>
            )}

            {delivery && (
              <div className="mt-4 space-y-3">
                {showDriverSelector && (
                  <div className="rounded-xl border border-dark-100 bg-dark-50 p-4">
                    <label className="mb-2 block text-sm font-bold text-dark-700">
                      {hasAssignedDriver
                        ? "Select New Driver"
                        : "Select Driver"}
                    </label>

                    {driversLoading ? (
                      <div className="flex items-center gap-2 text-sm text-dark-500">
                        <Loader2
                          size={16}
                          className="animate-spin text-primary-500"
                        />
                        Loading available drivers...
                      </div>
                    ) : availableDrivers.length === 0 ? (
                      <div className="rounded-xl border border-warning/20 bg-warning/10 p-3 text-sm text-amber-700">
                        No available drivers found.
                      </div>
                    ) : (
                      <>
                        <select
                          value={selectedDriverId}
                          onChange={(event) =>
                            setSelectedDriverId(event.target.value)
                          }
                          disabled={isDriverMutationPending}
                          className="w-full rounded-xl border border-dark-200 bg-white px-3 py-3 text-sm text-dark-700 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="">Select an available driver</option>

                          {availableDrivers.map((availableDriver) => {
                            const driverId =
                              availableDriver?._id || availableDriver?.id;

                            const firstName =
                              availableDriver?.firstName ||
                              availableDriver?.firstname ||
                              "";

                            const lastName =
                              availableDriver?.lastName ||
                              availableDriver?.lastname ||
                              "";

                            const driverName =
                              `${firstName} ${lastName}`.trim() ||
                              availableDriver?.name ||
                              availableDriver?.email ||
                              "Unnamed driver";

                            return (
                              <option key={driverId} value={driverId}>
                                {driverName}
                                {availableDriver?.vehicleNumber
                                  ? ` — ${availableDriver.vehicleNumber}`
                                  : ""}
                              </option>
                            );
                          })}
                        </select>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={handleAssignDriver}
                            disabled={
                              !selectedDriverId || isDriverMutationPending
                            }
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isDriverMutationPending ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                {hasAssignedDriver
                                  ? "Reassigning..."
                                  : "Assigning..."}
                              </>
                            ) : (
                              <>
                                <Truck size={16} />
                                {hasAssignedDriver
                                  ? "Reassign Driver"
                                  : "Assign Driver"}
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDriverId("");
                              setShowDriverSelector(false);
                            }}
                            disabled={isDriverMutationPending}
                            className="rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm font-bold text-dark-600 transition hover:bg-dark-50 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!showDriverSelector && (
                  <button
                    type="button"
                    onClick={() => setShowDriverSelector(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-bold text-primary-600 transition hover:bg-primary-100"
                  >
                    <Truck size={16} />
                    {hasAssignedDriver ? "Change Driver" : "Assign Driver"}
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Progress */}
          <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <SectionHeader
              icon={CheckCircle2}
              title="Order Progress"
              description="Current order lifecycle"
            />

            {currentStatus === ORDER_STATUSES.CANCELLED && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                This order has been cancelled.
              </div>
            )}

            <div className="relative">
              <div className="absolute bottom-5 left-[15px] top-5 w-px bg-dark-200" />

              <div className="relative space-y-5">
                {[
                  ORDER_STATUSES.PENDING,
                  ORDER_STATUSES.CONFIRMED,
                  ORDER_STATUSES.PREPARING,
                  ORDER_STATUSES.READY,
                  ORDER_STATUSES.OUT_FOR_DELIVERY,
                  ORDER_STATUSES.DELIVERED,
                ].map((status, index) => {
                  const completed = currentStatusIndex >= index;
                  const isCurrent = status === currentStatus;

                  return (
                    <div
                      key={status}
                      className="relative flex items-start gap-3"
                    >
                      <div
                        className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                          completed
                            ? "border-primary-500 bg-primary-500 text-white"
                            : "border-dark-200 bg-white text-dark-400"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 size={15} />
                        ) : (
                          <span className="text-[11px] font-bold">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 pt-1">
                        <p
                          className={`text-sm font-semibold ${
                            completed ? "text-dark-800" : "text-dark-400"
                          }`}
                        >
                          {formatStatus(status)}
                        </p>

                        {isCurrent && (
                          <span className="mt-1 inline-flex rounded-full bg-primary-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-600">
                            Current status
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetails;
