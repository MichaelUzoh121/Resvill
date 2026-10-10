import api from "../../services/api";

/**
 * STAFF SERVICE
 *
 * Handles staff operational actions:
 * - Order queue
 * - Order details
 * - Order status updates
 * - Delivery management
 * - Driver assignment
 *
 * Authentication is handled by the existing Axios client
 * and HTTP-only authentication cookie.
 */

/* ============================================================
   ORDERS
============================================================ */

/**
 * Get operational orders available to staff.
 *
 * Supported filters can be passed through params:
 * {
 *   search,
 *   paymentStatus,
 *   status
 * }
 */
export const getStaffOrders = async (params = {}) => {
  const response = await api.get("/orders/admin", {
    params,
  });

  return response.data.data;
};

/**
 * Get a single order.
 */

export const getStaffOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);

  return response.data.data;
};

/**
 * Update order status.
 *
 * Expected statuses:
 * PENDING
 * CONFIRMED
 * PREPARING
 * READY
 * OUT_FOR_DELIVERY
 * DELIVERED
 */
export const updateStaffOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, {
    status,
  });

  return response.data.data;
};

/* ============================================================
   DELIVERIES
============================================================ */

/**
 * Get drivers currently available for assignment.
 */
export const getAvailableDrivers = async (params = {}) => {
  const response = await api.get("/deliveries/available-drivers", {
    params,
  });

  return response.data.data;
};

/**
 * Get delivery associated with an order.
 */
export const getOrderDelivery = async (orderId) => {
  const response = await api.get(`/deliveries/order/${orderId}`);

  return response.data.data;
};

/**
 * Create a delivery for an order.
 */
export const createDelivery = async (deliveryData) => {
  const response = await api.post("/deliveries", deliveryData);

  return response.data.data;
};

/**
 * Get delivery details.
 */
export const getDeliveryById = async (deliveryId) => {
  const response = await api.get(`/deliveries/${deliveryId}`);

  return response.data.data;
};

/**
 * Get delivery assignment/history.
 */
export const getDeliveryHistory = async (deliveryId) => {
  const response = await api.get(`/deliveries/${deliveryId}/history`);

  return response.data.data;
};

/**
 * Assign a driver to a delivery.
 *
 * Expected payload:
 * {
 *   driverId: string
 * }
 */
export const assignDelivery = async (deliveryId, data) => {
  const response = await api.patch(`/deliveries/${deliveryId}/assign`, data);

  return response.data.data;
};

/**
 * Reassign an existing delivery to another driver.
 *
 * Expected payload:
 * {
 *   driverId: string
 * }
 */
export const reassignDelivery = async (deliveryId, data) => {
  const response = await api.patch(`/deliveries/${deliveryId}/reassign`, data);

  return response.data.data;
};

export const updateStaffProfile = async (profileData) => {
  const response = await api.put("/user/profile", profileData);

  return response.data;
};

/**
 * Change authenticated staff password
 */
export const changeStaffPassword = async (passwordData) => {
  const response = await api.put("/user/password", passwordData);

  return response.data;
};

export const createStaffOrder = async (orderData) => {
  const response = await api.post("/orders/staff", orderData);

  return response.data;
};

export const previewStaffOrderPrice = async (orderData) => {
  const response = await api.post(
    "/orders/staff/preview-price",
    orderData,
  );

  return response.data;
};