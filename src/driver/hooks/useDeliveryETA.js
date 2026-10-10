// import { useQuery } from "@tanstack/react-query";
// import { getDeliveryETA } from "../services/driverService";

// function useDeliveryETA(deliveryId) {
//   return useQuery({
//     queryKey: ["driver", "delivery-eta", deliveryId],
//     queryFn: () => getDeliveryETA(deliveryId),
//     enabled: Boolean(deliveryId),
//     staleTime: 15 * 1000,
//   });
// }

// export default useDeliveryETA;

import { useQuery } from "@tanstack/react-query";
import { getDeliveryETA } from "../services/driverService";

function useDeliveryETA(deliveryId) {
  return useQuery({
    queryKey: ["driver", "delivery-eta", deliveryId],
    queryFn: () => getDeliveryETA(deliveryId),

    enabled: Boolean(deliveryId),

    staleTime: 15 * 1000,

    refetchInterval: 5 * 1000,

    retry: 2,
  });
}

export default useDeliveryETA;