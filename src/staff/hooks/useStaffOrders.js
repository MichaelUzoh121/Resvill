// import { useQuery } from "@tanstack/react-query";
// import { getStaffOrders } from "../services/staffService";
// import { useMutation, useQueryClient } from "@tanstack/react-query";


import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";


import { getStaffOrders, createStaffOrder, } from "../services/staffService";

export const staffOrdersQueryKey = (params = {}) => [
  "staff",
  "orders",
  params,
];

export const useStaffOrders = (params = {}) => {
  return useQuery({
    queryKey: staffOrdersQueryKey(params),
    queryFn: () => getStaffOrders(params),
    staleTime: 30 * 1000,
  });
};
export const useCreateStaffOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData) => createStaffOrder(orderData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "orders"],
      });
    },
  });
};