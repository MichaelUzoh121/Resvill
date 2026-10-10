import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationService";

import { toast } from "react-hot-toast";


export const useNotifications = () => {

  const queryClient = useQueryClient();



  const notificationsQuery = useQuery({

    queryKey:[
      "notifications"
    ],

    queryFn:
      getNotifications,

    staleTime:
      1000 * 60 * 2,

  });



  const markReadMutation = useMutation({

    mutationFn:
      markNotificationAsRead,


    onSuccess:()=>{

      queryClient.invalidateQueries({
        queryKey:[
          "notifications"
        ],
      });

    },

    onError:()=>{

      toast.error(
        "Unable to update notification"
      );

    },

  });



  const markAllReadMutation = useMutation({

    mutationFn:
      markAllNotificationsAsRead,


    onSuccess:()=>{

      queryClient.invalidateQueries({
        queryKey:[
          "notifications"
        ],
      });

      toast.success(
        "Notifications marked as read"
      );

    },

  });



  const deleteMutation = useMutation({

    mutationFn:
      deleteNotification,


    onSuccess:()=>{

      queryClient.invalidateQueries({
        queryKey:[
          "notifications"
        ],
      });

    },

  });



  return {

    notifications:
      notificationsQuery.data?.data || [],


    loading:
      notificationsQuery.isLoading,


    error:
      notificationsQuery.isError,


    markRead:
      markReadMutation.mutateAsync,


    markAllRead:
      markAllReadMutation.mutateAsync,


    removeNotification:
      deleteMutation.mutateAsync,

  };

};