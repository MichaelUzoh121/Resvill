import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { useUpdateDriverLocation } from "./useDriverDeliveryMutations";

function useDriverLocation(deliveryId, enabled = false) {
  const updateLocationMutation = useUpdateDriverLocation();
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!enabled || !deliveryId) {
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Location services are not supported on this device.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        updateLocationMutation.mutate({
          deliveryId,
          location: {
            latitude,
            longitude,
          },
        });
      },
      () => {
        toast.error(
          "Unable to access your location. Please enable location services."
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [deliveryId, enabled]);

  return {
    isUpdating: updateLocationMutation.isPending,
  };
}

export default useDriverLocation;