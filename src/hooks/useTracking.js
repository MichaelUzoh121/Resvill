import { useQuery } from "@tanstack/react-query";

import {
  getGuestOrderTracking,
  getOrderTracking,
} from "../services/trackingService";

const extractTracking = (data) => {
  return (
    data?.data?.order ||
    data?.data ||
    data?.order ||
    null
  );
};

export const useGuestOrderTracking = (
  orderNumber,
  trackingToken,
) => {
  const trackingQuery = useQuery({
    queryKey: [
      "guest-order-tracking",
      orderNumber,
      trackingToken,
    ],

    queryFn: () =>
      getGuestOrderTracking(
        orderNumber,
        trackingToken,
      ),

    enabled:
      Boolean(orderNumber) &&
      Boolean(trackingToken),

    staleTime: 1000 * 30,

    refetchInterval: 1000 * 30,
  });

  return {
    tracking: extractTracking(
      trackingQuery.data,
    ),

    isLoading: trackingQuery.isLoading,

    isFetching: trackingQuery.isFetching,

    isError: trackingQuery.isError,

    error: trackingQuery.error,

    refetchTracking:
      trackingQuery.refetch,
  };
};

export const useOrderTracking = (
  orderId,
) => {
  const trackingQuery = useQuery({
    queryKey: [
      "order-tracking",
      orderId,
    ],

    queryFn: () =>
      getOrderTracking(orderId),

    enabled: Boolean(orderId),

    staleTime: 1000 * 30,

    refetchInterval: 1000 * 30,
  });

  return {
    tracking: extractTracking(
      trackingQuery.data,
    ),

    isLoading: trackingQuery.isLoading,

    isFetching: trackingQuery.isFetching,

    isError: trackingQuery.isError,

    error: trackingQuery.error,

    refetchTracking:
      trackingQuery.refetch,
  };
};