import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressService";

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    staleTime: 1000 * 60 * 5,
  });

  const addresses = addressesQuery.data?.data || [];

  const createMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ addressId, payload }) => updateAddress(addressId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });

  const defaultMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });

  return {
    addresses,

    isLoading: addressesQuery.isLoading,
    isError: addressesQuery.isError,

    refetchAddresses: addressesQuery.refetch,

    createAddress: createMutation.mutateAsync,
    creatingAddress: createMutation.isPending,

    updateAddress: updateMutation.mutateAsync,
    updatingAddress: updateMutation.isPending,

    deleteAddress: deleteMutation.mutateAsync,
    deletingAddress: deleteMutation.isPending,

    setDefaultAddress: defaultMutation.mutateAsync,
    settingDefaultAddress: defaultMutation.isPending,
  };
};
