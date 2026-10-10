import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getSocket,
  subscribeToSocketEvents,
} from "../../services/socketService";

function useDriverDeliveryOffersSocket() {
  const navigate = useNavigate();

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      return undefined;
    }

    const handleDeliveryOffer = (data) => {
      const orderNumber = data?.delivery?.order?.orderNumber;

      toast.success(
        orderNumber
          ? `New delivery offer: ${orderNumber}`
          : "New delivery offer received.",
        {
          duration: 5000,
        },
      );

      navigate("/driver/offers");
    };

    return subscribeToSocketEvents({
      "delivery:offer": handleDeliveryOffer,
    });
  }, []);
}

export default useDriverDeliveryOffersSocket;
