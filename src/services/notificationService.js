import api from "./api";


/**
 * Get authenticated user's notifications
 */
export const getNotifications = async () => {

  const response = await api.get(
    "/notifications"
  );

  return response.data;

};



/**
 * Mark single notification as read
 */
export const markNotificationAsRead = async (
  notificationId
) => {

  const response = await api.patch(
    `/notifications/${notificationId}/read`
  );

  return response.data;

};



/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {

  const response = await api.patch(
    "/notifications/read-all"
  );

  return response.data;

};



/**
 * Delete notification
 */
export const deleteNotification = async (
  notificationId
) => {

  const response = await api.delete(
    `/notifications/${notificationId}`
  );

  return response.data;

};