import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminDeliveryLocations,
  getAdminDeliveryLocation,
  createAdminDeliveryLocation,
  updateAdminDeliveryLocation,
  updateAdminDeliveryLocationStatus,
  deleteAdminDeliveryLocation,
} from "../services/adminService";

export const useAdminDeliveryLocations = (options = {}) => {
  return useQuery({
    queryKey: ["admin-delivery-locations"],
    queryFn: getAdminDeliveryLocations,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useAdminDeliveryLocation = (
  locationId,
  options = {}
) => {
  return useQuery({
    queryKey: ["admin-delivery-location", locationId],
    queryFn: () => getAdminDeliveryLocation(locationId),
    enabled: Boolean(locationId),
    ...options,
  });
};

export const useCreateAdminDeliveryLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminDeliveryLocation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-delivery-locations"],
      });
    },
  });
};

export const useUpdateAdminDeliveryLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ locationId, locationData }) =>
      updateAdminDeliveryLocation(locationId, locationData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-delivery-locations"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin-delivery-location",
          variables.locationId,
        ],
      });
    },
  });
};

export const useUpdateAdminDeliveryLocationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ locationId, isActive }) =>
      updateAdminDeliveryLocationStatus(locationId, isActive),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-delivery-locations"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin-delivery-location",
          variables.locationId,
        ],
      });
    },
  });
};

export const useDeleteAdminDeliveryLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminDeliveryLocation,

    onSuccess: (_, locationId) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-delivery-locations"],
      });

      queryClient.removeQueries({
        queryKey: [
          "admin-delivery-location",
          locationId,
        ],
      });
    },
  });
};