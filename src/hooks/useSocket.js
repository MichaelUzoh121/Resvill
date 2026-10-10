import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "../services/socketService";

export const useSocket = ({
  enabled = true,
  orderNumber = null,
  trackingToken = null,
  orderId = null,
  role = null,
} = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);

      return;
    }

    const currentSocket = connectSocket({
      orderNumber,
      trackingToken,
    });

    setSocket(currentSocket);
    setIsConnected(currentSocket.connected);

    const handleDeliveryJoined = (response) => {
      if (!response?.success) {
        console.error(
          "Failed to join delivery socket room:",
          response?.message,
        );
      }
    };

    if (role === "admin" || role === "staff" || role === "delivery") {
      currentSocket.emit("delivery:join", {}, handleDeliveryJoined);
    }

    const handleDeliveryOrderJoined = (response) => {
      if (!response?.success) {
        console.error(
          "Failed to join delivery order socket room:",
          response?.message,
        );
      }
    };

    if (
      orderId &&
      (role === "admin" || role === "staff" || role === "delivery")
    ) {
      currentSocket.emit(
        "delivery:order:join",
        {
          orderId,
        },
        handleDeliveryOrderJoined,
      );
    }

    const handleAdminJoined = (response) => {
      if (!response?.success) {
        console.error(
          "Failed to join admin delivery socket room:",
          response?.message,
        );
      }
    };

    if (role === "admin") {
      currentSocket.emit("delivery:admin:join", {}, handleAdminJoined);
    }

    const handleStaffJoined = (response) => {
      if (!response?.success) {
        console.error(
          "Failed to join staff delivery socket room:",
          response?.message,
        );
      }
    };

    if (role === "staff") {
      currentSocket.emit("delivery:staff:join", {}, handleStaffJoined);
    }

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    currentSocket.on("connect", handleConnect);

    currentSocket.on("disconnect", handleDisconnect);

    const handleDeliveryAssigned = (data) => {
      if (!data?.deliveryId || !data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };

    currentSocket.on("delivery:assigned", handleDeliveryAssigned);

    const handleDeliveryAccepted = (data) => {
      if (!data?.deliveryId || !data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };
    currentSocket.on("delivery:accepted", handleDeliveryAccepted);

    const handleDeliveryDeclined = (data) => {
      if (!data?.deliveryId || !data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };

    currentSocket.on("delivery:declined", handleDeliveryDeclined);

    const handleDeliveryPickedUp = (data) => {
      if (!data?.deliveryId || !data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };

    currentSocket.on("delivery:picked_up", handleDeliveryPickedUp);

    const handleDeliveryInTransit = (data) => {
      if (!data?.deliveryId || !data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };

    currentSocket.on("delivery:in_transit", handleDeliveryInTransit);

    const handleDeliveryLocationUpdated = (data) => {
      if (!data?.deliveryId || !data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });
    };

    currentSocket.on(
      "delivery:location_updated",
      handleDeliveryLocationUpdated,
    );

    const handleDeliveryEtaUpdated = (data) => {
      if (!data?.deliveryId || !data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });
    };

    currentSocket.on("delivery:eta_updated", handleDeliveryEtaUpdated);

    const handleDeliveryDelivered = (data) => {
      if (!data?.deliveryId || !data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };
    currentSocket.on("delivery:delivered", handleDeliveryDelivered);

    const handleDeliveryFailed = (data) => {
      if (!data?.deliveryId || !data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };
    currentSocket.on("delivery:failed", handleDeliveryFailed);

    const handleOrderStatusUpdated = (data) => {
      if (!data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };

    const handleOrderCreated = (data) => {
      if (!data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };

    const handleOrderCancelled = (data) => {
      if (!data?.orderId) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["order", data.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    };

    currentSocket.on("order:status_updated", handleOrderStatusUpdated);

    currentSocket.on("order:created", handleOrderCreated);

    currentSocket.on("order:cancelled", handleOrderCancelled);

    return () => {
      currentSocket.off("connect", handleConnect);
      currentSocket.off("disconnect", handleDisconnect);
      currentSocket.off("delivery:assigned", handleDeliveryAssigned);
      currentSocket.off("delivery:accepted", handleDeliveryAccepted);
      currentSocket.off("delivery:declined", handleDeliveryDeclined);
      currentSocket.off("delivery:picked_up", handleDeliveryPickedUp);
      currentSocket.off("delivery:in_transit", handleDeliveryInTransit);
      currentSocket.off(
        "delivery:location_updated",
        handleDeliveryLocationUpdated,
      );
      currentSocket.off("delivery:eta_updated", handleDeliveryEtaUpdated);

      currentSocket.off("delivery:delivered", handleDeliveryDelivered);

      currentSocket.off("delivery:failed", handleDeliveryFailed);

      currentSocket.off("order:status_updated", handleOrderStatusUpdated);

      currentSocket.off("order:created", handleOrderCreated);

      currentSocket.off("order:cancelled", handleOrderCancelled);

      if (role === "admin" || role === "staff" || role === "delivery") {
        currentSocket.emit("delivery:leave");
      }

      if (role === "admin") {
        currentSocket.emit("delivery:admin:leave");
      }

      if (role === "staff") {
        currentSocket.emit("delivery:staff:leave");
      }

      if (
        orderId &&
        (role === "admin" || role === "staff" || role === "delivery")
      ) {
        currentSocket.emit("delivery:order:leave", {
          orderId,
        });
      }
    };
  }, [enabled, orderNumber, trackingToken, orderId, role, queryClient]);

  return {
    socket: socket || getSocket(),
    isConnected,
  };
};
