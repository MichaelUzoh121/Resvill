import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  connectSocket,
  subscribeToSocketEvents,
} from "../../services/socketService";

function useDriverSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = connectSocket();

    if (!socket) {
      return undefined;
    }

    const refreshDriverData = () => {
      queryClient.invalidateQueries({
        queryKey: ["driver", "dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "offers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "active-deliveries"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "current-delivery"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "tracking"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "history"],
      });
    };

    const unsubscribeDeliveryEvents = subscribeToSocketEvents({
      "delivery:offer": refreshDriverData,
      "delivery:assigned": refreshDriverData,
      "delivery:accepted": refreshDriverData,
      "delivery:declined": refreshDriverData,
      "delivery:picked_up": refreshDriverData,
      "delivery:in_transit": refreshDriverData,
      "delivery:location_updated": refreshDriverData,
      "delivery:eta_updated": refreshDriverData,
      "delivery:delivered": refreshDriverData,
      "delivery:failed": refreshDriverData,
    });

    const handleConnect = () => {
      queryClient.invalidateQueries({
        queryKey: ["driver", "dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "offers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "active-deliveries"],
      });
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      unsubscribeDeliveryEvents();
    };
  }, [queryClient]);
}

export default useDriverSocket;