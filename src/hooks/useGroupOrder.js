import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import {
  createGroupOrder,
  joinGroupOrder,
  getGroupOrder,
  accessGroupOrder,
  getGroupOrderSummary,
  addGroupOrderItem,
  updateGroupOrderItem,
  removeGroupOrderItem,
  lockGroupOrder,
  checkoutGroupOrder,
  cancelGroupOrder,
  updateGroupOrderName,
  leaveGroupOrder,
  transferGroupOrderHost,
} from "../services/groupOrderService";

export const useGroupOrder = (groupCode) => {
  const groupQuery = useQuery({
    queryKey: ["group-order", groupCode],
    queryFn: () => getGroupOrder(groupCode),
    enabled: Boolean(groupCode),
    staleTime: 1000 * 30,
  });

  const groupOrder =
    groupQuery.data?.data || groupQuery.data?.groupOrder || null;

  return {
    groupOrder,
    isLoading: groupQuery.isLoading,
    isError: groupQuery.isError,
    error: groupQuery.error,
    refetchGroupOrder: groupQuery.refetch,
  };
};

export const useCreateGroupOrder = () => {
  return useMutation({
    mutationFn: createGroupOrder,
  });
};

export const useJoinGroupOrder = () => {
  return useMutation({
    mutationFn: joinGroupOrder,
  });
};

export const useAccessGroupOrder = () => {
  return useMutation({
    mutationFn: ({ groupOrderId, participantData }) =>
      accessGroupOrder(groupOrderId, participantData),
  });
};

export const useGroupOrderSummary = () => {
  return useMutation({
    mutationFn: ({ groupOrderId, participantData }) =>
      getGroupOrderSummary(groupOrderId, participantData),
  });
};

export const useAddGroupOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupOrderId, itemData }) =>
      addGroupOrderItem(groupOrderId, itemData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["group-order"],
      });
    },
  });
};

export const useUpdateGroupOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupOrderId, itemId, itemData }) =>
      updateGroupOrderItem(groupOrderId, itemId, itemData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-order"],
      });
    },
  });
};

export const useRemoveGroupOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupOrderId, itemId, participantData }) =>
      removeGroupOrderItem(groupOrderId, itemId, participantData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-order"],
      });
    },
  });
};

export const useLockGroupOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupOrderId, participantData }) =>
      lockGroupOrder(groupOrderId, participantData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-order"],
      });
    },
  });
};

export const useCheckoutGroupOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupOrderId, checkoutData }) =>
      checkoutGroupOrder(groupOrderId, checkoutData),

    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["group-order"],
    //   });
    // },

    onSuccess: (response) => {
      const checkoutData = response?.data;

      if (checkoutData?.groupOrder) {
        queryClient.setQueryData(
          ["group-order", checkoutData.groupOrder.groupCode],
          (currentData) => {
            if (!currentData) {
              return currentData;
            }

            return {
              ...currentData,
              data: {
                ...currentData.data,
                ...checkoutData.groupOrder,
                order: checkoutData.order,
                trackingToken: checkoutData.trackingToken,
              },
            };
          },
        );
      }
    },
  });
};

export const useCancelGroupOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupOrderId, participantData }) =>
      cancelGroupOrder(groupOrderId, participantData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-order"],
      });
    },
  });
};

export const useUpdateGroupOrderName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupOrderId, groupCode, nameData }) =>
      updateGroupOrderName(groupOrderId, nameData),

    onSuccess: (response, variables) => {
      const updatedGroupOrder = response?.data?.groupOrder;

      if (updatedGroupOrder && variables.groupCode) {
        queryClient.setQueryData(
          ["group-order", variables.groupCode],
          (currentData) => {
            if (!currentData) {
              return currentData;
            }

            return {
              ...currentData,
              data: updatedGroupOrder,
            };
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["group-order"],
      });

      toast.success("Group name updated successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Unable to update group name.",
      );
    },
  });
};

export const useLeaveGroupOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupOrderId, participantData }) =>
      leaveGroupOrder(groupOrderId, participantData),

    // onSuccess: (response, variables) => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["group-order"],
    //   });

    // toast.success("You left the group order.");
    // },

    onSuccess: (response, variables) => {
      const checkoutData = response?.data;

      if (checkoutData?.groupOrder && variables?.groupCode) {
        queryClient.setQueryData(
          ["group-order", variables.groupCode],
          (currentData) => {
            if (!currentData) {
              return currentData;
            }

            return {
              ...currentData,
              data: {
                ...checkoutData.groupOrder,
                order: checkoutData.order,
                trackingToken: checkoutData.trackingToken,
              },
            };
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["group-order"],
      });

      toast.success("You left the group order.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Unable to leave the group order.",
      );
    },
  });
};

export const useTransferGroupOrderHost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupOrderId, groupCode, hostData }) =>
      transferGroupOrderHost(groupOrderId, hostData),

    onSuccess: (response, variables) => {
      const updatedGroupOrder = response?.data?.groupOrder;

      if (updatedGroupOrder && variables.groupCode) {
        queryClient.setQueryData(
          ["group-order", variables.groupCode],
          (currentData) => {
            if (!currentData) {
              return currentData;
            }

            return {
              ...currentData,
              data: updatedGroupOrder,
            };
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["group-order"],
      });

      toast.success("Group host transferred successfully.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Unable to transfer group host.",
      );
    },
  });
};
