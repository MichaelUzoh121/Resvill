const ORDERS_KEY = "resvill_orders_v1";
const LAST_ORDER_KEY = "resvill_last_order_v1";

const readOrders = () => {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch { return []; }
};

const makeToken = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID().replaceAll("-", "");
  return `${Date.now()}${Math.random().toString(36).slice(2)}`;
};

export const DELIVERY_FLOW = ["assigned", "accepted", "picked_up", "out_for_delivery", "delivered"];
export const DELIVERY_LABELS = {
  assigned: "Assigned",
  accepted: "Accepted",
  picked_up: "Picked up",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

const emptyDelivery = () => ({
  driverId: null,
  driverName: null,
  status: "unassigned",
  timestamps: {},
});

export const createOrder = ({ customer, items, totals, deliveryMethod }) => {
  const orders = readOrders();
  const orderNumber = `RV-${String(20481 + orders.length).padStart(5, "0")}`;
  const now = new Date().toISOString();
  const order = {
    id: orderNumber,
    trackingToken: makeToken(),
    customer,
    deliveryMethod,
    items,
    totals,
    payment: { provider: "mock", status: "successful", reference: `MOCK-${Date.now()}` },
    status: "confirmed",
    delivery: deliveryMethod === "delivery" ? emptyDelivery() : null,
    statuses: [
      { key: "placed", label: "Order Placed", timestamp: now, description: "We received your order and payment." },
      { key: "confirmed", label: "Order Confirmed", timestamp: now, description: "Your order has been confirmed by Resvill." },
      { key: "preparing", label: "Preparing Your Food", timestamp: null, description: "Your food is currently being prepared by our kitchen team." },
      { key: "ready", label: "Ready for Pickup", timestamp: null, description: "Your order is ready for collection." },
      { key: "out_for_delivery", label: "Out for Delivery", timestamp: null, description: "Your order is on its way to you." },
      { key: "delivered", label: "Delivered", timestamp: null, description: "Enjoy your meal!" },
    ],
    createdAt: now,
  };
  localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders]));
  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  return order;
};

export const getOrderByCredentials = (id, token) => readOrders().find((order) => order.id === id && order.trackingToken === token);
export const getOrderById = (id) => readOrders().find((order) => order.id === id);
export const getLastOrder = () => {
  try { return JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || "null"); } catch { return null; }
};
export const getOrders = () => readOrders();

export const STATUS_FLOW = ["placed", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];
export const getNextStatus = (currentKey) => {
  const index = STATUS_FLOW.indexOf(currentKey);
  return index === -1 || index === STATUS_FLOW.length - 1 ? null : STATUS_FLOW[index + 1];
};

const saveUpdatedOrder = (updated) => {
  if (!updated) return null;
  const orders = readOrders().map((order) => order.id === updated.id ? updated : order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  if (getLastOrder()?.id === updated.id) localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(updated));
  return updated;
};

export const updateOrderStatus = (orderId, newStatusKey) => {
  const order = getOrderById(orderId);
  if (!order) return null;
  const now = new Date().toISOString();
  const newIndex = STATUS_FLOW.indexOf(newStatusKey);
  const statuses = order.statuses.map((status) => {
    const statusIndex = STATUS_FLOW.indexOf(status.key);
    return statusIndex !== -1 && statusIndex <= newIndex && !status.timestamp ? { ...status, timestamp: now } : status;
  });
  return saveUpdatedOrder({ ...order, status: newStatusKey, statuses });
};

export const assignDriver = (orderId, driver) => {
  const order = getOrderById(orderId);
  if (!order || order.deliveryMethod !== "delivery") return null;
  const now = new Date().toISOString();
  return saveUpdatedOrder({
    ...order,
    delivery: { ...(order.delivery || emptyDelivery()), driverId: driver.username, driverName: driver.name, status: "assigned", timestamps: { ...(order.delivery?.timestamps || {}), assigned: now } },
  });
};

export const updateDeliveryStatus = (orderId, newStatus) => {
  const order = getOrderById(orderId);
  if (!order?.delivery || !DELIVERY_FLOW.includes(newStatus)) return null;
  const currentIndex = DELIVERY_FLOW.indexOf(order.delivery.status);
  const nextIndex = DELIVERY_FLOW.indexOf(newStatus);
  if (nextIndex !== currentIndex + 1) return null;
  const now = new Date().toISOString();
  const delivery = { ...order.delivery, status: newStatus, timestamps: { ...(order.delivery.timestamps || {}), [newStatus]: now } };
  const customerStatus = newStatus === "out_for_delivery" ? "out_for_delivery" : newStatus === "delivered" ? "delivered" : order.status;
  const customerStatuses = order.statuses.map((status) => {
    if (status.key === customerStatus && !status.timestamp) return { ...status, timestamp: now };
    return status;
  });
  return saveUpdatedOrder({ ...order, delivery, status: customerStatus, statuses: customerStatuses });
};

export const getDriverOrders = (driverId) => getOrders().filter((order) => order.delivery?.driverId === driverId && order.delivery.status !== "delivered");

export const getDeliveryNextStatus = (currentStatus) => {
  const index = DELIVERY_FLOW.indexOf(currentStatus);
  return index === -1 || index === DELIVERY_FLOW.length - 1 ? null : DELIVERY_FLOW[index + 1];
};
