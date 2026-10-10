import api from "../../services/api";

/**
 * Get authenticated staff notifications
 */
export const getStaffNotifications = async (
  params = {}
) => {
  const response = await api.get("/notifications", {
    params,
  });

  return response.data;
};

/**
 * Mark a staff notification as read
 */
export const markStaffNotificationAsRead = async (
  notificationId
) => {
  const response = await api.patch(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};

/**
 * Mark all staff notifications as read
 */
export const markAllStaffNotificationsAsRead = async () => {
  const response = await api.patch(
    "/notifications/read-all"
  );

  return response.data;
};

/**
 * Delete a staff notification
 */
export const deleteStaffNotification = async (
  notificationId
) => {
  const response = await api.delete(
    `/notifications/${notificationId}`
  );

  return response.data;
};