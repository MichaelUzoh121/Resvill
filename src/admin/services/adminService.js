import api from "../../services/api";

export const getAdminDashboard = async (params = {}) => {
  const response = await api.get("/admin/dashboard", {
    params,
  });

  return response.data.data;
};

export const getAdminCustomers = async (params = {}) => {
  const response = await api.get("/admin/customers", {
    params,
  });

  return response.data.data;
};

export const getAdminCustomerDetails = async (customerId) => {
  const response = await api.get(`/admin/customers/${customerId}`);

  return response.data.data;
};

export const updateAdminCustomerStatus = async (customerId, isActive) => {
  const response = await api.patch(`/admin/customers/${customerId}/status`, {
    isActive,
  });

  return response.data.data;
};

export const getAdminFoods = async (params = {}) => {
  const response = await api.get("/admin/foods", {
    params,
  });

  return response.data.data;
};
export const getAdminCategories = async () => {
  const response = await api.get("/admin/categories");

  return response.data.data;
};

export const getAdminCategoryDetails = async (categoryId) => {
  const response = await api.get(`/categories/${categoryId}`);

  return response.data.data;
};

export const createAdminCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);

  return response.data.data;
};

export const updateAdminCategory = async (categoryId, categoryData) => {
  const response = await api.patch(`/categories/${categoryId}`, categoryData);

  return response.data.data;
};

export const deleteAdminCategory = async (categoryId) => {
  const response = await api.delete(`/categories/${categoryId}`);

  return response.data.data;
};

export const createAdminFood = async (foodData) => {
  const response = await api.post("/foods", foodData);

  return response.data.data;
};

export const getAdminFoodDetails = async (foodId) => {
  const response = await api.get(`/foods/${foodId}`);

  return response.data.data;
};

export const updateAdminFood = async (foodId, foodData) => {
  const response = await api.patch(`/foods/${foodId}`, foodData);

  return response.data.data;
};

export const deleteAdminFood = async (foodId) => {
  const response = await api.delete(`/foods/${foodId}`);

  return response.data.data;
};

export const updateAdminFoodAvailability = async (foodId, available) => {
  const response = await api.patch(`/foods/${foodId}/availability`, {
    available,
  });

  return response.data.data;
};

export const updateAdminFoodFeatured = async (foodId, featured) => {
  const response = await api.patch(`/foods/${foodId}/featured`, { featured });

  return response.data.data;
};

export const updateAdminFoodPopular = async (foodId, popular) => {
  const response = await api.patch(`/foods/${foodId}/popular`, { popular });

  return response.data.data;
};

export const getAdminOrders = async (params = {}) => {
  const response = await api.get("/admin/orders", {
    params,
  });

  return response.data.data;
};

export const getAdminOrderDetails = async (orderId) => {
  const response = await api.get(`/admin/orders/${orderId}`);

  return response.data.data;
};

export const updateAdminOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, {
    status,
  });

  return response.data.data;
};

export const assignAdminOrderDriver = async (deliveryId, driverId) => {
  const response = await api.patch(`/deliveries/${deliveryId}/assign`, {
    driverId,
  });

  return response.data.data;
};

export const getAdminPayments = async (params = {}) => {
  const response = await api.get("/admin/payments", {
    params,
  });

  return response.data.data;
};

export const getAdminReviews = async (params = {}) => {
  const response = await api.get("/admin/reviews", {
    params,
  });

  return response.data.data;
};

export const getAdminReviewDetails = async (reviewId) => {
  const response = await api.get(`/admin/reviews/${reviewId}`);

  return response.data.data;
};

export const updateAdminReviewModeration = async (reviewId, moderationData) => {
  const response = await api.patch(
    `/admin/reviews/${reviewId}/moderation`,
    moderationData,
  );

  return response.data.data;
};

export const getAdminCoupons = async (params = {}) => {
  const response = await api.get("/admin/coupons", {
    params,
  });

  return response.data.data;
};

export const getAdminCouponDetails = async (couponId) => {
  const response = await api.get(`/admin/coupons/${couponId}`);

  return response.data.data;
};

export const createAdminCoupon = async (couponData) => {
  const response = await api.post("/admin/coupons", couponData);

  return response.data.data;
};

export const updateAdminCoupon = async (couponId, couponData) => {
  const response = await api.patch(`/admin/coupons/${couponId}`, couponData);

  return response.data.data;
};

export const updateAdminCouponStatus = async (couponId, isActive) => {
  const response = await api.patch(`/admin/coupons/${couponId}/status`, {
    isActive,
  });

  return response.data.data;
};

export const deleteAdminCoupon = async (couponId) => {
  const response = await api.delete(`/admin/coupons/${couponId}`);

  return response.data.data;
};

export const getAdminCouponUsage = async (couponId) => {
  const response = await api.get(`/admin/coupons/${couponId}/usage`);

  return response.data.data;
};

// ======================================================
// ADMIN DELIVERY MANAGEMENT
// ======================================================

export const getAdminDeliveryOverview = async () => {
  const response = await api.get("/admin/delivery/overview");

  return response.data.data;
};

export const getAdminDrivers = async (params = {}) => {
  const response = await api.get("/admin/delivery/drivers", {
    params,
  });

  return response.data.data;
};

export const getAdminDriverDetails = async (driverId) => {
  const response = await api.get(`/admin/delivery/drivers/${driverId}`);

  return response.data.data;
};

export const getAdminDeliveries = async (params = {}) => {
  const response = await api.get("/admin/delivery", {
    params,
  });

  return response.data.data;
};

export const getAdminDeliveryDetails = async (deliveryId) => {
  const response = await api.get(`/admin/delivery/${deliveryId}`);

  return response.data.data;
};

export const getAdminDeliveryHistory = async (deliveryId) => {
  const response = await api.get(`/admin/delivery/${deliveryId}/history`);

  return response.data.data;
};

export const getAdminDriverLocation = async (deliveryId) => {
  const response = await api.get(`/admin/delivery/${deliveryId}/location`);

  return response.data.data;
};

export const getAdminDeliveryETA = async (deliveryId) => {
  const response = await api.get(`/admin/delivery/${deliveryId}/eta`);

  return response.data.data;
};

export const assignAdminDelivery = async (deliveryId, driverId) => {
  const response = await api.patch(`/admin/delivery/${deliveryId}/assign`, {
    driverId,
  });

  return response.data.data;
};

export const reassignAdminDelivery = async (deliveryId, driverId) => {
  const response = await api.patch(`/admin/delivery/${deliveryId}/reassign`, {
    driverId,
  });

  return response.data.data;
};

// ======================================================
// ADMIN ANALYTICS
// ======================================================

export const getAdminAnalytics = async (params = {}) => {
  const response = await api.get("/admin/analytics", {
    params,
  });

  return response.data.data;
};

// ======================================================
// ADMIN DELIVERY BY ORDER
// ======================================================

export const getAdminDeliveryByOrder = async (orderId) => {
  const response = await api.get(`/deliveries/order/${orderId}`);

  return response.data.data;
};

export const getAdminDeliveryLocations = async () => {
  const response = await api.get("/admin/delivery-locations");
  return response.data.data;
};

export const getAdminDeliveryLocation = async (locationId) => {
  const response = await api.get(`/admin/delivery-locations/${locationId}`);

  return response.data.data;
};

export const createAdminDeliveryLocation = async (locationData) => {
  const response = await api.post("/admin/delivery-locations", locationData);

  return response.data.data;
};

export const updateAdminDeliveryLocation = async (locationId, locationData) => {
  const response = await api.patch(
    `/admin/delivery-locations/${locationId}`,
    locationData,
  );

  return response.data.data;
};

export const updateAdminDeliveryLocationStatus = async (
  locationId,
  isActive,
) => {
  const response = await api.patch(
    `/admin/delivery-locations/${locationId}/status`,
    {
      isActive,
    },
  );

  return response.data.data;
};

export const deleteAdminDeliveryLocation = async (locationId) => {
  const response = await api.delete(`/admin/delivery-locations/${locationId}`);

  return response.data;
};

export const createAdminUser = async (accountData) => {
  const response = await api.post("/admin/users", accountData);

  return response.data.data;
};

export const getAdminAccounts = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([key, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "all",
    ),
  );

  const response = await api.get("/admin/accounts", {
    params: cleanParams,
  });

  return response.data.data;
};

export const getAdminAccountDetails = async (accountId) => {
  const response = await api.get(`/admin/accounts/${accountId}`);

  return response.data.data;
};

export const updateAdminAccountStatus = async (accountId, isActive) => {
  const response = await api.patch(`/admin/accounts/${accountId}/status`, {
    isActive,
  });

  return response.data.data;
};


export const deleteAdminAccount = async (accountId) => {
  const response = await api.delete(
    `/admin/accounts/${accountId}`
  );

  return response.data.data;
};

// ==========================================
// ADMIN SETTINGS
// ==========================================

export const getAdminAccountSettings = async () => {
  const response = await api.get(
    "/admin/settings/account"
  );

  return response.data.data;
};

export const updateAdminAccountSettings = async (
  accountData
) => {
  const response = await api.patch(
    "/admin/settings/account",
    accountData
  );

  return response.data.data;
};

export const changeAdminPassword = async (
  passwordData
) => {
  const response = await api.patch(
    "/admin/settings/account/password",
    passwordData
  );

  return response.data.data;
};

export const changeAdminEmail = async (
  emailData
) => {
  const response = await api.patch(
    "/admin/settings/account/email",
    emailData
  );

  return response.data.data;
};

export const getAdminSecuritySettings = async () => {
  const response = await api.get(
    "/admin/settings/account/security"
  );

  return response.data.data;
};