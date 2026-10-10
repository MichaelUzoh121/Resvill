import api from "../../services/api";

export const getDriverNotifications = async (params = {}) => {
  const response = await api.get("/notifications", {
    params,
  });

  return response.data;
};

export const markDriverNotificationAsRead = async (notificationId) => {
  const response = await api.patch(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};

export const markAllDriverNotificationsAsRead = async () => {
  const response = await api.patch(
    "/notifications/read-all"
  );

  return response.data;
};

export const deleteDriverNotification = async (notificationId) => {
  const response = await api.delete(
    `/notifications/${notificationId}`
  );

  return response.data;
};