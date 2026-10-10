import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getDriverNotifications,
  markDriverNotificationAsRead,
  markAllDriverNotificationsAsRead,
  deleteDriverNotification,
} from "../services/driverNotificationService";

const DRIVER_NOTIFICATIONS_KEY = ["driver", "notifications"];

export const useDriverNotifications = (params = {}) => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: [...DRIVER_NOTIFICATIONS_KEY, params],
    queryFn: () => getDriverNotifications(params),
    staleTime: 15 * 1000,
  });

  const markReadMutation = useMutation({
    mutationFn: markDriverNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DRIVER_NOTIFICATIONS_KEY,
      });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllDriverNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DRIVER_NOTIFICATIONS_KEY,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDriverNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DRIVER_NOTIFICATIONS_KEY,
      });
    },
  });

  return {
    // notifications: notificationsQuery.data?.data || [],
    notifications: notificationsQuery.data?.data?.notifications || [],
    loading: notificationsQuery.isLoading,
    error: notificationsQuery.isError,

    markRead: markReadMutation.mutateAsync,
    markingRead: markReadMutation.isPending,

    markAllRead: markAllReadMutation.mutateAsync,
    markingAllRead: markAllReadMutation.isPending,

    removeNotification: deleteMutation.mutateAsync,
    deleting: deleteMutation.isPending,

    refetch: notificationsQuery.refetch,
  };
};

export default useDriverNotifications;
