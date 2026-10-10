import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminCoupons,
  getAdminCouponDetails,
  createAdminCoupon,
  updateAdminCoupon,
  updateAdminCouponStatus,
  deleteAdminCoupon,
  getAdminCouponUsage,
} from "../services/adminService";

export const useAdminCoupons = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin-coupons", params],
    queryFn: () => getAdminCoupons(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useAdminCoupon = (couponId, options = {}) => {
  return useQuery({
    queryKey: ["admin-coupon", couponId],
    queryFn: () => getAdminCouponDetails(couponId),
    enabled: Boolean(couponId),
    ...options,
  });
};

export const useCreateAdminCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponData) =>
      createAdminCoupon(couponData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons"],
      });
    },
  });
};

export const useUpdateAdminCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ couponId, couponData }) =>
      updateAdminCoupon(couponId, couponData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-coupon", variables.couponId],
      });
    },
  });
};

export const useUpdateAdminCouponStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ couponId, isActive }) =>
      updateAdminCouponStatus(couponId, isActive),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-coupon", variables.couponId],
      });
    },
  });
};

export const useDeleteAdminCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponId) =>
      deleteAdminCoupon(couponId),

    onSuccess: (_, couponId) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons"],
      });

      queryClient.removeQueries({
        queryKey: ["admin-coupon", couponId],
      });
    },
  });
};

export const useAdminCouponUsage = (
  couponId,
  options = {}
) => {
  return useQuery({
    queryKey: ["admin-coupon-usage", couponId],
    queryFn: () => getAdminCouponUsage(couponId),
    enabled: Boolean(couponId),
    ...options,
  });
};