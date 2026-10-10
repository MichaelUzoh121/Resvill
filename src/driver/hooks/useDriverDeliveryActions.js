import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  useAcceptDelivery,
  useDeclineDelivery,
  usePickupDelivery,
  useStartDelivery,
  useCompleteDelivery,
  useFailDelivery,
} from "./useDriverDeliveryMutations";

function useDriverDeliveryActions() {
  const queryClient = useQueryClient();
  const [loadingAction, setLoadingAction] = useState(null);

  const acceptMutation = useAcceptDelivery();
  const declineMutation = useDeclineDelivery();
  const pickupMutation = usePickupDelivery();
  const startMutation = useStartDelivery();
  const completeMutation = useCompleteDelivery();
  const failMutation = useFailDelivery();

  const refreshDriverDeliveryData = () => {
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

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";

  const runAction = async (
    action,
    mutation,
    deliveryId,
    data,
    successMessage
  ) => {
    try {
      setLoadingAction(action);

      await mutation.mutateAsync(
        data === undefined
          ? deliveryId
          : { deliveryId, data }
      );

      refreshDriverDeliveryData();

      toast.success(successMessage);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setLoadingAction(null);
    }
  };

  const accept = (deliveryId) =>
    runAction(
      "accept",
      acceptMutation,
      deliveryId,
      undefined,
      "Delivery accepted successfully."
    );

  const decline = (deliveryId) =>
    runAction(
      "decline",
      declineMutation,
      deliveryId,
      undefined,
      "Delivery declined."
    );

  const pickup = (deliveryId) =>
    runAction(
      "pickup",
      pickupMutation,
      deliveryId,
      undefined,
      "Pickup confirmed successfully."
    );

  const start = (deliveryId) =>
    runAction(
      "start",
      startMutation,
      deliveryId,
      undefined,
      "Delivery started."
    );

  const complete = (deliveryId) =>
    runAction(
      "complete",
      completeMutation,
      deliveryId,
      undefined,
      "Delivery completed successfully."
    );

  const fail = (deliveryId, data) =>
    runAction(
      "fail",
      failMutation,
      deliveryId,
      data,
      "Delivery marked as failed."
    );

  return {
    accept,
    decline,
    pickup,
    start,
    complete,
    fail,
    loadingAction,
  };
}

export default useDriverDeliveryActions;