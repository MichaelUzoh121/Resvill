import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminAccountSettings,
  updateAdminAccountSettings,
  changeAdminPassword,
  changeAdminEmail,
  getAdminSecuritySettings,
} from "../services/adminService";

// ==========================================
// ACCOUNT SETTINGS
// ==========================================

export const useAdminAccountSettings = (options = {}) => {
  return useQuery({
    queryKey: ["admin-settings", "account"],
    queryFn: getAdminAccountSettings,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// ==========================================
// UPDATE ACCOUNT
// ==========================================

export const useUpdateAdminAccountSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminAccountSettings,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-settings", "account"],
      });
    },
  });
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const useChangeAdminPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeAdminPassword,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-settings", "security"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-settings", "account"],
      });
    },
  });
};

// ==========================================
// CHANGE EMAIL
// ==========================================

export const useChangeAdminEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeAdminEmail,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-settings", "account"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-settings", "security"],
      });
    },
  });
};

// ==========================================
// SECURITY SETTINGS
// ==========================================

export const useAdminSecuritySettings = (options = {}) => {
  return useQuery({
    queryKey: ["admin-settings", "security"],
    queryFn: getAdminSecuritySettings,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};