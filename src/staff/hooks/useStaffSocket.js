import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  connectSocket,
  disconnectSocket,
  getSocket,
  subscribeToSocketEvents,
} from "../../services/socketService";

export const useStaffSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = connectSocket();

    if (!socket) {
      return undefined;
    }

    const joinStaffRoom = () => {
      socket.emit("delivery:staff:join");
    };

    const handleNewOrder = () => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff", "notifications"],
      });
    };

    const handleOrderStatusUpdated = (data) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff", "notifications"],
      });

      if (data?.orderId) {
        queryClient.invalidateQueries({
          queryKey: ["staff", "orders", data.orderId],
        });

        queryClient.invalidateQueries({
          queryKey: ["staff", "deliveries", "order", data.orderId],
        });
      }
    };

    const handleOrderCancelled = (data) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff", "notifications"],
      });

      if (data?.orderId) {
        queryClient.invalidateQueries({
          queryKey: ["staff", "orders", data.orderId],
        });

        queryClient.invalidateQueries({
          queryKey: ["staff", "deliveries", "order", data.orderId],
        });
      }
    };

    const handleDeliveryUpdate = (data) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "deliveries"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff", "drivers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff", "notifications"],
      });

      if (data?.orderId) {
        queryClient.invalidateQueries({
          queryKey: ["staff", "deliveries", "order", data.orderId],
        });

        queryClient.invalidateQueries({
          queryKey: ["staff", "orders", data.orderId],
        });
      }
    };

    socket.on("connect", joinStaffRoom);

    if (socket.connected) {
      joinStaffRoom();
    }

    const unsubscribe = subscribeToSocketEvents({
      "order:created": handleNewOrder,
      "order:status_updated": handleOrderStatusUpdated,
      "order:cancelled": handleOrderCancelled,

      "delivery:assigned": handleDeliveryUpdate,
      "delivery:accepted": handleDeliveryUpdate,
      "delivery:declined": handleDeliveryUpdate,
      "delivery:picked_up": handleDeliveryUpdate,
      "delivery:in_transit": handleDeliveryUpdate,
      "delivery:delivered": handleDeliveryUpdate,
      "delivery:failed": handleDeliveryUpdate,
    });

    return () => {
      socket.off("connect", joinStaffRoom);

      unsubscribe();

      const currentSocket = getSocket();

      if (currentSocket) {
        currentSocket.emit("delivery:staff:leave");
      }

      disconnectSocket();
    };
  }, [queryClient]);
};

export default useStaffSocket;
