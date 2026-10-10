import api from "../../services/api";

/**
 * Driver Dashboard
 */
export const getDriverDashboard = async () => {
  const response = await api.get("/deliveries/driver/dashboard");
  return response.data;
};

/**
 * Driver Delivery Offers
 */
export const getDriverOffers = async () => {
  const response = await api.get("/deliveries/driver/offers");
  return response.data;
};

/**
 * Driver Active Deliveries
 */
export const getDriverActiveDeliveries = async () => {
  const response = await api.get("/deliveries/driver/active");
  return response.data;
};

/**
 * Driver Delivery History
 */
export const getDriverDeliveryHistory = async (params = {}) => {
  const response = await api.get("/deliveries/driver/history", {
    params,
  });

  return response.data;
};

/**
 * Driver Current Delivery
 */
export const getDriverCurrentDelivery = async () => {
  const response = await api.get("/deliveries/driver/current");
  return response.data;
};

/**
 * Driver Tracking
 */
export const getDriverTracking = async () => {
  const response = await api.get("/deliveries/driver/tracking");
  return response.data;
};

/**
 * Accept Delivery
 */
export const acceptDelivery = async (deliveryId) => {
  const response = await api.patch(`/deliveries/${deliveryId}/accept`);

  return response.data;
};

/**
 * Decline Delivery
 */
export const declineDelivery = async (deliveryId) => {
  const response = await api.patch(`/deliveries/${deliveryId}/decline`);

  return response.data;
};

/**
 * Confirm Pickup
 */
export const pickupDelivery = async (deliveryId) => {
  const response = await api.patch(`/deliveries/${deliveryId}/pickup`);

  return response.data;
};

/**
 * Start Delivery
 */
export const startDelivery = async (deliveryId) => {
  const response = await api.patch(`/deliveries/${deliveryId}/start`);

  return response.data;
};

/**
 * Complete Delivery
 */
export const completeDelivery = async (deliveryId) => {
  const response = await api.patch(`/deliveries/${deliveryId}/complete`);

  return response.data;
};

/**
 * Fail Delivery
 */
export const failDelivery = async (deliveryId, data) => {
  const response = await api.patch(`/deliveries/${deliveryId}/fail`, data);

  return response.data;
};

/**
 * Update Driver Location
 */
export const updateDriverLocation = async (deliveryId, location) => {
  const response = await api.patch(
    `/deliveries/${deliveryId}/location`,
    location,
  );

  return response.data;
};

export const getDriverAvailability = async () => {
  const response = await api.get("/deliveries/availability");
  return response.data;
};

export const setDriverOnline = async () => {
  const response = await api.patch("/deliveries/online");
  return response.data;
};

export const setDriverOffline = async () => {
  const response = await api.patch("/deliveries/offline");
  return response.data;
};

export const setDriverAvailability = async (isAvailable) => {
  const response = await api.patch("/deliveries/availability", {
    isAvailable,
  });

  return response.data;
};

export const getDeliveryETA = async (deliveryId) => {
  const response = await api.get(`/deliveries/${deliveryId}/eta`);
  return response.data;
};
