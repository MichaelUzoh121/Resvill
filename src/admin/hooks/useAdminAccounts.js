import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAdminUser,
  getAdminAccounts,
  getAdminAccountDetails,
  updateAdminAccountStatus,
  deleteAdminAccount,
} from "../services/adminService";

export const useAdminAccounts = (
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["admin-accounts", params],
    queryFn: () => getAdminAccounts(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useAdminAccount = (
  accountId,
  options = {}
) => {
  return useQuery({
    queryKey: ["admin-account", accountId],
    queryFn: () =>
      getAdminAccountDetails(accountId),
    enabled: Boolean(accountId),
    ...options,
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-accounts"],
      });
    },
  });
};

export const useUpdateAdminAccountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, isActive }) =>
      updateAdminAccountStatus(
        accountId,
        isActive
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-accounts"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin-account",
          variables.accountId,
        ],
      });
    },
  });
};

export const useDeleteAdminAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminAccount,

    onSuccess: (_, accountId) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-accounts"],
      });

      queryClient.removeQueries({
        queryKey: ["admin-account", accountId],
      });
    },
  });
};