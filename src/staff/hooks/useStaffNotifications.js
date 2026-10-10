import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getStaffNotifications,
  markStaffNotificationAsRead,
  markAllStaffNotificationsAsRead,
  deleteStaffNotification,
} from "../services/staffNotificationService";

/**
 * Get authenticated staff notifications
 */
export const useStaffNotifications = (params = {}) => {
  return useQuery({
    queryKey: ["staff", "notifications", params],
    queryFn: () => getStaffNotifications(params),
    staleTime: 15 * 1000,
    keepPreviousData: true,
  });
};

/**
 * Mark a single notification as read
 */
export const useMarkStaffNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markStaffNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "notifications"],
      });
    },
  });
};

/**
 * Mark all staff notifications as read
 */
export const useMarkAllStaffNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllStaffNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "notifications"],
      });
    },
  });
};

/**
 * Delete a staff notification
 */
export const useDeleteStaffNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStaffNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "notifications"],
      });
    },
  });
};