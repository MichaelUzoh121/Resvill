const ORDERS_KEY = "resvill_orders_v1";
const LAST_ORDER_KEY = "resvill_last_order_v1";

const readOrders = () => {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); } catch { return []; }
};

const makeToken = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID().replaceAll("-", "");
  return `${Date.now()}${Math.random().toString(36).slice(2)}`;
};

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
  try {
    return JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || "null");
  } catch {
    return null;
  }
};
export const getOrders = () => readOrders();
