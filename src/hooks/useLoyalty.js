// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import {
//   getLoyalty,
//   getLoyaltyTransactions,
//   redeemPoints,
// } from "../services/loyaltyService";

// import { toast } from "react-hot-toast";

// export const useLoyalty = () => {
//   const queryClient = useQueryClient();

//   const loyaltyQuery = useQuery({
//     queryKey: ["loyalty"],

//     queryFn: getLoyalty,

//     staleTime: 1000 * 60 * 5,
//   });

//   const transactionsQuery = useQuery({
//     queryKey: ["loyalty-transactions"],

//     queryFn: getLoyaltyTransactions,

//     staleTime: 1000 * 60 * 5,
//   });

//   const redeemMutation = useMutation({
//     mutationFn: redeemPoints,

//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["loyalty"],
//       });

//       queryClient.invalidateQueries({
//         queryKey: ["loyalty-transactions"],
//       });

//       toast.success(data?.message || "Points redeemed successfully");
//     },

//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Unable to redeem points");
//     },
//   });

//   return {
//     loyalty: loyaltyQuery.data?.data || {},

//     transactions: transactionsQuery.data?.data || [],

//     loading: loyaltyQuery.isLoading || transactionsQuery.isLoading,

//     redeem: redeemMutation.mutateAsync,

//     redeeming: redeemMutation.isPending,
//   };
// };

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getLoyalty, getLoyaltyTransactions } from "../services/loyaltyService";

export const useLoyalty = ({ page = 1, limit = 20, enabled = true } = {}) => {
  
  const queryClient = useQueryClient();

  const loyaltyQuery = useQuery({
    queryKey: ["loyalty"],
    queryFn: getLoyalty,
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const transactionsQuery = useQuery({
    queryKey: ["loyalty-transactions", page, limit],
    queryFn: () =>
      getLoyaltyTransactions({
        page,
        limit,
      }),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const loyaltyData = loyaltyQuery.data?.data || {};

  const transactionData = transactionsQuery.data?.data || [];

  const pagination = transactionsQuery.data?.pagination || {
    page,
    limit,
    total: 0,
    pages: 0,
  };

  const pointValue = Number(
    transactionsQuery.data?.pointValue ?? loyaltyData?.pointValue ?? 1,
  );

  return {
    // Loyalty account
    loyalty: loyaltyData,

    pointsBalance: Number(loyaltyData?.pointsBalance || 0),
    lifetimePointsEarned: Number(loyaltyData?.lifetimePointsEarned || 0),
    lifetimePointsRedeemed: Number(loyaltyData?.lifetimePointsRedeemed || 0),

    // Current value of one point
    pointValue,

    // Transactions
    transactions: transactionData,
    pagination,

    // Loading/error states
    loading: loyaltyQuery.isLoading || transactionsQuery.isLoading,

    loyaltyLoading: loyaltyQuery.isLoading,
    transactionsLoading: transactionsQuery.isLoading,

    error: loyaltyQuery.error || transactionsQuery.error || null,

    loyaltyError: loyaltyQuery.error,
    transactionsError: transactionsQuery.error,

    // Refetch
    refetchLoyalty: loyaltyQuery.refetch,
    refetchTransactions: transactionsQuery.refetch,

    // Useful for mutations later
    invalidateLoyalty: () => {
      queryClient.invalidateQueries({
        queryKey: ["loyalty"],
      });

      queryClient.invalidateQueries({
        queryKey: ["loyalty-transactions"],
      });
    },
  };
};
