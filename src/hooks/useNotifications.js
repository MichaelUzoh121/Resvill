import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationService";

import { toast } from "react-hot-toast";

const normalizeNotifications = (response) => {
  const candidates = [
    response,
    response?.data,
    response?.notifications,
    response?.data?.notifications,
    response?.data?.data,
    response?.data?.data?.notifications,
  ];

  return candidates.find(Array.isArray) || [];
};

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],

    queryFn: getNotifications,

    select: normalizeNotifications,

    staleTime: 1000 * 60 * 2,

    refetchInterval: 1000 * 30,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },

    onError: () => {
      toast.error("Unable to update notification");
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      toast.success("Notifications marked as read");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  return {
    // `select` above already unwraps the backend response to an array.
    notifications: notificationsQuery.data || [],

    loading: notificationsQuery.isLoading,
    error: notificationsQuery.isError,

    markRead: markReadMutation.mutateAsync,
    markAll: markAllReadMutation.mutateAsync,
    removeNotification: deleteMutation.mutateAsync,
  };
};
